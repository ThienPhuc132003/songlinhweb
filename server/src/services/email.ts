import type { Env } from "../types";

export interface QuotationEmailData {
  id: number;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string;
  project_name: string | null;
  note: string | null;
  items: Array<{
    product_id?: number;
    product_name: string;
    product_image?: string | null;
    category_name?: string | null;
    quantity: number;
    notes?: string | null;
  }>;
  created_at: string;
}

export interface ContactEmailData {
  company_name: string;
  contact_person?: string | null;
  email: string;
  phone: string;
  address?: string | null;
  message: string;
}

/** Escape HTML special characters */
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Format ISO date to Vietnamese format */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

function uint8ToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function getAdminDeeplink(env: Env, path: string): string {
  let baseUrl = "https://sltech.vn";
  if (env.SITE_URL) {
    baseUrl = env.SITE_URL.replace(/\/$/, "");
  } else if (env.CORS_ORIGIN) {
    const firstOrigin = env.CORS_ORIGIN.split(",")[0].trim();
    if (firstOrigin && firstOrigin !== "*") {
      baseUrl = firstOrigin;
    }
  }
  const url = `${baseUrl}${path}`;
  return `
    <a href="${url}" style="display:inline-block;background-color:#3C5DAA;color:#fff;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:600;font-size:14px;margin-top:20px;">
      Xem chi tiết trong Admin
    </a>`;
}

/** ──────────────────────────────────────────────────────────── 
 *  TEMPLATE 1: ADMIN NOTIFICATION (QUOTATION)
 *  ──────────────────────────────────────────────────────────── */
export async function sendQuotationAdminEmail(
  env: Env,
  data: QuotationEmailData,
  xlsxBuffer?: ArrayBuffer,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const totalQty = data.items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsHtml = data.items
    .map(
      (item, i) => `
      <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;">${i + 1}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:500;color:#1e293b;">${escapeHtml(item.product_name)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;color:#0f172a;">${item.quantity}</td>
      </tr>`,
    ).join("");

  const html = `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <div style="background-color: #3C5DAA; padding: 20px; color: white;">
      <h2 style="margin:0;">Yêu cầu báo giá mới: ${escapeHtml(data.project_name || `#${data.id}`)}</h2>
    </div>
    <div style="padding: 20px; background: #f8fafc;">
      <h3>Thông tin khách hàng</h3>
      <p>Tên: <strong>${escapeHtml(data.customer_name)}</strong></p>
      <p>Điện thoại: <strong>${escapeHtml(data.phone)}</strong></p>
      ${data.email ? `<p>Email: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>` : ""}
      
      <h3>Sản phẩm yêu cầu</h3>
      <table style="width: 100%; border: 1px solid #e2e8f0; border-collapse: collapse;">
        <tr style="background:#1e293b; color:#fff;">
          <th style="padding:10px;">STT</th>
          <th style="padding:10px;text-align:left;">Sản phẩm</th>
          <th style="padding:10px;text-align:center;">SL</th>
        </tr>
        ${itemsHtml}
        <tr style="background:#e2e8f0;">
          <td colspan="2" style="padding:10px;font-weight:700;">Tổng cộng</td>
          <td style="padding:10px;text-align:center;font-weight:700;">${totalQty}</td>
        </tr>
      </table>
      
      ${data.note ? `<div style="background:#fffbeb; padding:12px; border-left:4px solid #f59e0b; margin-top:20px;"><p style="margin:0;"><strong>Ghi chú:</strong> ${escapeHtml(data.note)}</p></div>` : ""}

      ${getAdminDeeplink(env, `/admin/quotations/${data.id}`)}
    </div>
  </div>`;

  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || "doremonkuntp132003@gmail.com";
  const emailPayload: Record<string, unknown> = {
    from: "Song Linh Technologies <onboarding@resend.dev>",
    to: [adminEmail],
    subject: `[RFQ #${data.id}] Phê duyệt báo giá — ${data.customer_name}`,
    html,
  };

  if (xlsxBuffer) {
    const dateStr = data.created_at ? new Date(data.created_at).toISOString().slice(0, 10).replace(/-/g, "") : "now";
    emailPayload.attachments = [{
      content: uint8ToBase64(new Uint8Array(xlsxBuffer)),
      filename: `SLTECH_RFQ_${data.id}_${dateStr}.xlsx`,
    }];
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(emailPayload),
  });
}

/** ──────────────────────────────────────────────────────────── 
 *  TEMPLATE 1: ADMIN NOTIFICATION (CONTACT)
 *  ──────────────────────────────────────────────────────────── */
export async function sendContactAdminEmail(
  env: Env,
  data: ContactEmailData,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const html = `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <div style="background-color: #3C5DAA; padding: 20px; color: white;">
      <h2 style="margin:0;">Liên hệ mới: ${escapeHtml(data.company_name)}</h2>
    </div>
    <div style="padding: 20px; background: #f8fafc;">
      <h3>Thông tin khách hàng</h3>
      <p>Công ty: <strong>${escapeHtml(data.company_name)}</strong></p>
      <p>SĐT: <strong>${escapeHtml(data.phone)}</strong></p>
      <p>Email: <strong><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></strong></p>
      
      <div style="background:#fffbeb; padding:12px; border-left:4px solid #f59e0b; margin-top:20px;">
        <p style="margin:0; white-space: pre-wrap;"><strong>Nội dung:</strong><br/>${escapeHtml(data.message)}</p>
      </div>

      ${getAdminDeeplink(env, `/admin/contacts`)}
    </div>
  </div>`;

  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || "doremonkuntp132003@gmail.com";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Song Linh Technologies <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `[Liên hệ] Khách hàng: ${data.company_name}`,
      html,
    }),
  });
}

/** ──────────────────────────────────────────────────────────── 
 *  TEMPLATE 2: CUSTOMER CONFIRMATION
 *  ──────────────────────────────────────────────────────────── */
export async function sendQuotationCustomerEmail(
  env: Env,
  data: QuotationEmailData,
): Promise<void> {
  if (!env.RESEND_API_KEY || !data.email) return;

  const html = `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <p>Kính gửi ${escapeHtml(data.customer_name)},</p>
    <p>Cảm ơn quý khách đã tin tưởng và gửi yêu cầu đến Song Linh Technologies (SLTECH). Chúng tôi đã nhận được yêu cầu <strong>${escapeHtml(data.project_name || `Báo giá #${data.id}`)}</strong> của quý khách.</p>
    <p>Đội ngũ chuyên gia của chúng tôi đang trong quá trình xét duyệt các yêu cầu vật tư và sẽ trực tiếp liên hệ để tư vấn chi tiết trong vòng 24 - 48 giờ làm việc.</p>
    <br/>
    <p>Trân trọng,</p>
    <p style="color: #3C5DAA; font-weight: bold; margin-bottom: 2px;">Đội ngũ SLTECH</p>
    <a href="https://sltech.vn" style="color: #3C5DAA; text-decoration: none;">www.sltech.vn</a>
  </div>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Song Linh Technologies <onboarding@resend.dev>",
      to: [data.email],
      subject: "SLTECH — Xác nhận yêu cầu báo giá của quý khách",
      html,
    }),
  });
}
