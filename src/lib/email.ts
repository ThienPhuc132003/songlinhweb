/**
 * Anti-spam utilities for public forms (Quote/Contact).
 * Emails are now handled exclusively by the secure backend via Resend API.
 */

// ─── Anti-spam: Rate Limiter ─────────────────────────────
const RATE_LIMIT_KEY = "sltech-email-rate";
const RATE_LIMIT_MAX = 3; // max submissions per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitEntry {
  timestamps: number[];
}

export function isRateLimited(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return false;
    const entry: RateLimitEntry = JSON.parse(raw);
    const now = Date.now();
    const recent = entry.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS,
    );
    return recent.length >= RATE_LIMIT_MAX;
  } catch {
    return false;
  }
}

export function recordSubmission(): void {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const entry: RateLimitEntry = raw
      ? JSON.parse(raw)
      : { timestamps: [] };
    const now = Date.now();
    entry.timestamps = [
      ...entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS),
      now,
    ];
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(entry));
  } catch {
    // ignore storage errors
  }
}

// ─── Anti-spam: Honeypot Validator ───────────────────────
/**
 * Check if honeypot field is filled (bot detection).
 * Add a hidden field named "website" to forms — real users won't fill it.
 */
export function isHoneypotTriggered(honeypotValue: string): boolean {
  return honeypotValue.length > 0;
}

export class EmailRateLimitError extends Error {
  constructor() {
    super("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ.");
    this.name = "EmailRateLimitError";
  }
}
