import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

/**
 * Constant-time string comparison to prevent timing attacks.
 * Uses crypto.subtle.timingSafeEqual available in Cloudflare Workers runtime.
 * Falls back to a manual constant-time compare if not available.
 */
async function safeCompare(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);

  if (bufA.byteLength !== bufB.byteLength) {
    // Still do a dummy compare to burn constant time
    const dummy = encoder.encode(a);
    try {
      // @ts-expect-error — timingSafeEqual exists in CF Workers runtime but not in standard TS types
      crypto.subtle.timingSafeEqual(dummy, dummy);
    } catch { /* ignore */ }
    return false;
  }

  try {
    // @ts-expect-error — timingSafeEqual exists in CF Workers runtime but not in standard TS types
    return crypto.subtle.timingSafeEqual(bufA, bufB);
  } catch {
    // Fallback: manual constant-time comparison
    let mismatch = 0;
    for (let i = 0; i < bufA.byteLength; i++) {
      mismatch |= bufA[i] ^ bufB[i];
    }
    return mismatch === 0;
  }
}

/**
 * Admin authentication middleware.
 * Validates the API key from the `X-API-Key` header using constant-time comparison.
 */
export const requireAuth = createMiddleware<{ Bindings: Env }>(
  async (c, next) => {
    const apiKey = c.req.header("X-API-Key");

    if (!apiKey || !(await safeCompare(apiKey, c.env.ADMIN_API_KEY))) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    await next();
  },
);
