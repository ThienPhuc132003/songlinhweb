import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

/**
 * Simple rate limiter using KV.
 * Limits by IP address with a sliding window.
 */
export function rateLimit(maxRequests: number, windowSeconds: number) {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    // Skip rate limiting if KV (CACHE) is not configured
    if (!c.env.CACHE) {
      await next();
      return;
    }

    const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
    const key = `rate:${ip}:${c.req.path}`;

    const current = await c.env.CACHE.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= maxRequests) {
      return c.json(
        { success: false, error: "Too many requests. Please try again later." },
        429,
      );
    }

    // Increment counter
    await c.env.CACHE.put(key, String(count + 1), {
      expirationTtl: windowSeconds,
    });

    await next();
  });
}
