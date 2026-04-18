/**
 * Cloudflare Turnstile server-side token verification.
 *
 * Calls Cloudflare's siteverify API to validate a Turnstile response token.
 * Returns `true` if the token is valid, `false` otherwise.
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip?: string,
): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    if (ip) body.set("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );

    if (!res.ok) {
      console.error("[Turnstile] Verification API returned", res.status);
      return false;
    }

    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch (e) {
    console.error("[Turnstile] Verification failed:", e);
    return false;
  }
}
