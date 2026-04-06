import type { Env } from "../types";

interface QuotationEmailData {
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

/**
 * Send admin notification email for a new quotation request.
 * Includes a professional HTML table with all items.
 * Optionally attaches the generated XLSX file.
 */
export async function sendQuotationAdminEmail(
  env: Env,
  data: QuotationEmailData,
  xlsxBuffer?: ArrayBuffer,
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping admin email");
    return;
  }

  const totalQty = data.items.reduce((sum, i) => sum + i.quantity, 0);

  const itemsHtml = data.items
    .map(
      (item, i) => `
      <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;">${i + 1}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:500;color:#1e293b;">${escapeHtml(item.product_name)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;">${escapeHtml(item.category_name ?? "—")}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;color:#0f172a;">${item.quantity}</td>
      </tr>`,
    )
    .join("");

  const html = `
  <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:28px 32px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600;">📋 Yêu cầu báo giá mới</h1>
      <p style="margin:6px 0 0;color:#93c5fd;font-size:14px;">Mã: SLTECH_RFQ_${data.id} — ${formatDate(data.created_at)}</p>
    </div>

    <div style="padding:28px 32px;">
      <!-- Customer Info -->
      <div style="background:#f1f5f9;border-radius:10px;padding:20px;margin-bottom:24px;">
        <h2 style="margin:0 0 14px;font-size:16px;color:#334155;font-weight:600;">👤 Thông tin khách hàng</h2>
        <table style="width:100%;">
          <tr><td style="padding:4px 0;color:#64748b;width:130px;">Họ tên:</td><td style="padding:4px 0;font-weight:600;color:#0f172a;">${escapeHtml(data.customer_name)}</td></tr>
          ${data.company_name ? `<tr><td style="padding:4px 0;color:#64748b;">Công ty:</td><td style="padding:4px 0;font-weight:600;color:#0f172a;">${escapeHtml(data.company_name)}</td></tr>` : ""}
          <tr><td style="padding:4px 0;color:#64748b;">SĐT:</td><td style="padding:4px 0;"><a href="tel:${data.phone}" style="color:#2563eb;font-weight:600;text-decoration:none;">${escapeHtml(data.phone)}</a></td></tr>
          ${data.email ? `<tr><td style="padding:4px 0;color:#64748b;">Email:</td><td style="padding:4px 0;"><a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${escapeHtml(data.email)}</a></td></tr>` : ""}
          ${data.project_name ? `<tr><td style="padding:4px 0;color:#64748b;">Dự án:</td><td style="padding:4px 0;font-weight:600;color:#1e40af;">${escapeHtml(data.project_name)}</td></tr>` : ""}
        </table>
      </div>

      ${data.note ? `
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:#92400e;"><strong>📝 Ghi chú:</strong> ${escapeHtml(data.note)}</p>
      </div>` : ""}

      <!-- Products Table -->
      <h2 style="margin:0 0 14px;font-size:16px;color:#334155;font-weight:600;">📦 Sản phẩm yêu cầu (${data.items.length} mục)</h2>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr style="background:#1e3a5f;">
          <th style="padding:12px 14px;text-align:left;color:#fff;font-size:13px;font-weight:600;width:40px;">STT</th>
          <th style="padding:12px 14px;text-align:left;color:#fff;font-size:13px;font-weight:600;">Sản phẩm</th>
          <th style="padding:12px 14px;text-align:left;color:#fff;font-size:13px;font-weight:600;">Danh mục</th>
          <th style="padding:12px 14px;text-align:center;color:#fff;font-size:13px;font-weight:600;width:60px;">SL</th>
        </tr>
        ${itemsHtml}
        <tr style="background:#e2e8f0;">
          <td colspan="3" style="padding:12px 14px;font-weight:700;color:#1e293b;">Tổng cộng</td>
          <td style="padding:12px 14px;text-align:center;font-weight:700;color:#1e293b;">${totalQty}</td>
        </tr>
      </table>

      <!-- CTA -->
      <div style="margin-top:28px;text-align:center;">
        ${getAdminDeeplink(env, data.id)}
        <p style="color:#64748b;font-size:14px;margin:12px 0 0;">Vui lòng liên hệ khách hàng để tư vấn và báo giá.</p>
        ${xlsxBuffer ? '<p style="color:#64748b;font-size:13px;margin:8px 0 0;">📎 File Excel báo giá đã được đính kèm email này.</p>' : ''}
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;">
      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
        Email tự động từ <strong>sltech.vn</strong> — Vui lòng không reply email này.
      </p>
    </div>
  </div>`;

  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || "phuc.trinh@sltech.vn";

  const emailPayload: Record<string, unknown> = {
    from: "SLTECH Website <onboarding@resend.dev>",
    to: [adminEmail],
    subject: `[RFQ #${data.id}] ${data.customer_name}${data.company_name ? ` — ${data.company_name}` : ""}${data.project_name ? ` | ${data.project_name}` : ""} (${data.items.length} SP)`,
    html,
  };

  // Attach XLSX if available
  if (xlsxBuffer) {
    const dateStr = data.created_at
      ? new Date(data.created_at).toISOString().slice(0, 10).replace(/-/g, "")
      : new Date().toISOString().slice(0, 10).replace(/-/g, "");
    emailPayload.attachments = [{
      content: uint8ToBase64(new Uint8Array(xlsxBuffer)),
      filename: `SLTECH_RFQ_${data.id}_${dateStr}.xlsx`,
    }];
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} — ${error}`);
  }
}

/**
 * Send "Thank You" confirmation email to the customer.
 */
export async function sendQuotationCustomerEmail(
  env: Env,
  data: QuotationEmailData,
): Promise<void> {
  if (!env.RESEND_API_KEY || !data.email) {
    return;
  }

  const html = `
  <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">SONG LINH TECHNOLOGY</h1>
      <p style="margin:6px 0 0;color:#93c5fd;font-size:14px;">Hệ thống tích hợp ELV & ICT</p>
    </div>

    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:20px;color:#1e3a5f;font-weight:600;">Xin chào ${escapeHtml(data.customer_name)},</h2>
      <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Cảm ơn bạn đã gửi yêu cầu báo giá. Chúng tôi đã nhận được thông tin và sẽ phản hồi trong thời gian sớm nhất.
      </p>

      <!-- RFQ Summary -->
      <div style="background:#f1f5f9;border-radius:10px;padding:20px;margin-bottom:24px;">
        <h3 style="margin:0 0 12px;font-size:15px;color:#334155;font-weight:600;">📋 Thông tin yêu cầu</h3>
        <table style="width:100%;">
          <tr><td style="padding:4px 0;color:#64748b;width:140px;">Mã yêu cầu:</td><td style="padding:4px 0;font-weight:600;color:#1e40af;">SLTECH_RFQ_${data.id}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Ngày gửi:</td><td style="padding:4px 0;color:#0f172a;">${formatDate(data.created_at)}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Số sản phẩm:</td><td style="padding:4px 0;font-weight:600;color:#0f172a;">${data.items.length} sản phẩm</td></tr>
          ${data.project_name ? `<tr><td style="padding:4px 0;color:#64748b;">Dự án:</td><td style="padding:4px 0;font-weight:600;color:#1e40af;">${escapeHtml(data.project_name)}</td></tr>` : ""}
        </table>
      </div>

      <!-- Timeline -->
      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 10px 10px 0;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:#166534;"><strong>⏱️ Thời gian phản hồi dự kiến:</strong> 24 — 48 giờ làm việc</p>
      </div>

      <!-- Contact info -->
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 6px;">
        Nếu cần hỗ trợ gấp, vui lòng liên hệ:
      </p>
      <p style="margin:0 0 4px;font-size:14px;">
        📧 <a href="mailto:songlinh@sltech.vn" style="color:#2563eb;text-decoration:none;">songlinh@sltech.vn</a>
      </p>
      <p style="margin:0 0 20px;font-size:14px;">
        📞 <a href="tel:+84901234567" style="color:#2563eb;text-decoration:none;">Hotline SLTECH</a>
      </p>

      <p style="color:#64748b;font-size:14px;margin:0;">Trân trọng,<br><strong style="color:#1e3a5f;">Đội ngũ SLTECH</strong></p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">
        <strong>Song Linh Technology Co., Ltd</strong>
      </p>
      <p style="margin:0;font-size:12px;color:#94a3b8;">
        <a href="https://sltech.vn" style="color:#2563eb;text-decoration:none;">sltech.vn</a>
      </p>
    </div>
  </div>`;

  const emailPayload = {
    from: "SLTECH <onboarding@resend.dev>",
    to: [data.email],
    subject: `SLTECH — Xác nhận yêu cầu báo giá #${data.id}`,
    html,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[Customer Email Error] ${response.status}: ${error}`);
    // Don't throw — customer email is best-effort
  }
}

/** Escape HTML special characters */
function escapeHtml(str: string): string {
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

/**
 * Convert Uint8Array to base64 string.
 * Workers-safe: uses btoa() with chunk approach to avoid call stack overflow.
 */
function uint8ToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

/**
 * Generate admin dashboard deeplink CTA button.
 * Extracts base URL from CORS_ORIGIN (first origin) or SITE_URL.
 */
function getAdminDeeplink(env: Env, quoteId: number): string {
  let baseUrl = "https://sltech.vn";
  if (env.SITE_URL) {
    baseUrl = env.SITE_URL.replace(/\/$/, "");
  } else if (env.CORS_ORIGIN) {
    const firstOrigin = env.CORS_ORIGIN.split(",")[0].trim();
    if (firstOrigin && firstOrigin !== "*") {
      baseUrl = firstOrigin;
    }
  }
  const url = `${baseUrl}/admin/quotations/${quoteId}`;
  return `
    <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      📊 Xem chi tiết trong Admin Panel
    </a>`;
}
