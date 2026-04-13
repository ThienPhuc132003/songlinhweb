import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type { Env } from "../types";

/**
 * Constant-time string comparison to prevent timing attacks.
 * Uses crypto.subtle.timingSafeEqual available in Cloudflare Workers runtime.
 * Falls back to a manual constant-time compare if not available.
 */
export async function safeCompare(a: string, b: string): Promise<boolean> {
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
 * Validate HMAC-signed session token from cookie.
 * Token format: "timestamp.signatureHex"
 */
async function validateSessionToken(token: string, adminKey: string): Promise<boolean> {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return false;

  const timestamp = token.substring(0, dotIndex);
  const sigHex = token.substring(dotIndex + 1);

  // Check token age (24h max)
  const age = Date.now() - parseInt(timestamp, 10);
  if (isNaN(age) || age < 0 || age > 86400_000) return false;

  // Verify HMAC signature
  const encoder = new TextEncoder();
  const keyData = encoder.encode(adminKey);
  try {
    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    const expectedSig = await crypto.subtle.sign(
      "HMAC", cryptoKey, encoder.encode(`session:${timestamp}`),
    );
    const expectedHex = Array.from(new Uint8Array(expectedSig))
      .map((b) => b.toString(16).padStart(2, "0")).join("");
    return await safeCompare(sigHex, expectedHex);
  } catch {
    return false;
  }
}

/**
 * Admin authentication middleware.
 * Validates auth via:
 *   1. HttpOnly session cookie (sltech_session) — preferred
 *   2. X-API-Key header — backward compat for CLI/curl
 */
export const requireAuth = createMiddleware<{ Bindings: Env }>(
  async (c, next) => {
    // 1. Try HttpOnly cookie first
    const sessionToken = getCookie(c, "sltech_session");
    if (sessionToken) {
      const isValid = await validateSessionToken(sessionToken, c.env.ADMIN_API_KEY);
      if (isValid) {
        await next();
        return;
      }
    }

    // 2. Fall back to X-API-Key header (backward compat)
    const apiKey = c.req.header("X-API-Key");
    if (apiKey && (await safeCompare(apiKey, c.env.ADMIN_API_KEY))) {
      await next();
      return;
    }

    return c.json({ success: false, error: "Unauthorized" }, 401);
  },
);

