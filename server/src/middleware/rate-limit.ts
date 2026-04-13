import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

/**
 * In-memory rate limiter using a sliding window.
 * Falls back to in-memory Map when KV (CACHE) is not provisioned.
 *
 * Note: In-memory state is per-isolate. In production (Cloudflare Workers),
 * isolates may be recycled, so this provides "best-effort" rate limiting.
 * For strict limiting, provision a KV namespace in wrangler.toml.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

const memoryStore = new Map<string, RateLimitEntry>();

// Periodic cleanup every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt <= now) {
      memoryStore.delete(key);
    }
  }
}

export function rateLimit(maxRequests: number, windowSeconds: number) {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
    const key = `rate:${ip}:${c.req.path}`;

    // Try KV first if available
    if (c.env.CACHE) {
      const current = await c.env.CACHE.get(key);
      const count = current ? parseInt(current, 10) : 0;

      if (count >= maxRequests) {
        return c.json(
          { success: false, error: "Too many requests. Please try again later." },
          429,
        );
      }

      await c.env.CACHE.put(key, String(count + 1), {
        expirationTtl: windowSeconds,
      });

      await next();
      return;
    }

    // Fallback: in-memory rate limiting
    cleanupExpired();
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    const entry = memoryStore.get(key);

    if (entry) {
      if (entry.resetAt <= now) {
        // Window expired, reset
        memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      } else if (entry.count >= maxRequests) {
        // Rate limited
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return c.json(
          { success: false, error: "Too many requests. Please try again later." },
          429,
          { "Retry-After": String(retryAfter) },
        );
      } else {
        // Increment
        entry.count++;
      }
    } else {
      // First request in window
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    }

    await next();
  });
}
