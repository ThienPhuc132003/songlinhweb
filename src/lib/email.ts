/**
 * EmailJS service for sending contact form emails from the frontend.
 * Free tier: 200 emails/month — sufficient for B2B contact volume.
 *
 * NOTE: Quote/RFQ emails are handled by the backend (Resend API).
 * This module is only used for the Contact page form.
 *
 * Setup instructions:
 * 1. Create account at https://www.emailjs.com/
 * 2. Add email service (Gmail/Outlook/etc)
 * 3. Create template for "contact"
 * 4. Set env vars: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_PUBLIC_KEY,
 *    VITE_EMAILJS_CONTACT_TEMPLATE_ID
 */
import emailjs from "@emailjs/browser";

// ─── Config ──────────────────────────────────────────────
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";
const CONTACT_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID ?? "";

// ─── Anti-spam: Rate Limiter ─────────────────────────────
const RATE_LIMIT_KEY = "sltech-email-rate";
const RATE_LIMIT_MAX = 3; // max submissions per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitEntry {
  timestamps: number[];
}

function isRateLimited(): boolean {
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

function recordSubmission(): void {
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

// ─── Email Sending ───────────────────────────────────────

export interface SendContactEmailParams {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
}

export class EmailRateLimitError extends Error {
  constructor() {
    super("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ.");
    this.name = "EmailRateLimitError";
  }
}

export class EmailConfigError extends Error {
  constructor() {
    super("Email service chưa được cấu hình. Vui lòng liên hệ admin.");
    this.name = "EmailConfigError";
  }
}

function ensureConfigured(): void {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    throw new EmailConfigError();
  }
}

/**
 * Send a contact form email via EmailJS.
 */
export async function sendContactEmail(
  params: SendContactEmailParams,
): Promise<void> {
  ensureConfigured();

  if (isRateLimited()) {
    throw new EmailRateLimitError();
  }

  await emailjs.send(
    SERVICE_ID,
    CONTACT_TEMPLATE_ID,
    {
      company_name: params.company_name,
      contact_person: params.contact_person,
      from_email: params.email,
      phone: params.phone,
      address: params.address ?? "",
      message: params.message,
    },
    PUBLIC_KEY,
  );

  recordSubmission();
}
