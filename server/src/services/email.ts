import type { Env } from "../types";

interface QuoteEmailData {
  id: number;
  customer_name: string;
  email?: string | null;
  phone: string;
  company?: string | null;
  items: { product_id: number; product_name: string; qty: number }[];
  note?: string | null;
  created_at: string;
}

/**
 * Send quote notification email via Resend API.
 * Includes HTML formatted email with product table.
 * CSV attachment is sent as base64.
 */
export async function sendQuoteNotification(
  env: Env,
  data: QuoteEmailData,
  csvContent?: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return;
  }

  const itemsHtml = data.items
    .map(
      (item, i) => `
      <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;">${i + 1}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:500;color:#1e293b;">${escapeHtml(item.product_name)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;color:#0f172a;">${item.qty}</td>
      </tr>`,
    )
    .join("");

  const totalQty = data.items.reduce((sum, i) => sum + i.qty, 0);

  const html = `
  <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:28px 32px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600;">📋 Yêu cầu báo giá mới</h1>
      <p style="margin:6px 0 0;color:#93c5fd;font-size:14px;">Mã: #${data.id} — ${formatDate(data.created_at)}</p>
    </div>

    <div style="padding:28px 32px;">
      <!-- Customer Info -->
      <div style="background:#f1f5f9;border-radius:10px;padding:20px;margin-bottom:24px;">
        <h2 style="margin:0 0 14px;font-size:16px;color:#334155;font-weight:600;">👤 Thông tin khách hàng</h2>
        <table style="width:100%;">
          <tr><td style="padding:4px 0;color:#64748b;width:120px;">Họ tên:</td><td style="padding:4px 0;font-weight:600;color:#0f172a;">${escapeHtml(data.customer_name)}</td></tr>
          ${data.company ? `<tr><td style="padding:4px 0;color:#64748b;">Công ty:</td><td style="padding:4px 0;font-weight:600;color:#0f172a;">${escapeHtml(data.company)}</td></tr>` : ""}
          <tr><td style="padding:4px 0;color:#64748b;">SĐT:</td><td style="padding:4px 0;"><a href="tel:${data.phone}" style="color:#2563eb;font-weight:600;text-decoration:none;">${escapeHtml(data.phone)}</a></td></tr>
          ${data.email ? `<tr><td style="padding:4px 0;color:#64748b;">Email:</td><td style="padding:4px 0;"><a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${escapeHtml(data.email)}</a></td></tr>` : ""}
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
          <th style="padding:12px 14px;text-align:center;color:#fff;font-size:13px;font-weight:600;width:60px;">SL</th>
        </tr>
        ${itemsHtml}
        <tr style="background:#e2e8f0;">
          <td colspan="2" style="padding:12px 14px;font-weight:700;color:#1e293b;">Tổng cộng</td>
          <td style="padding:12px 14px;text-align:center;font-weight:700;color:#1e293b;">${totalQty}</td>
        </tr>
      </table>

      <!-- CTA -->
      <div style="margin-top:28px;text-align:center;">
        <p style="color:#64748b;font-size:14px;margin:0 0 8px;">Vui lòng liên hệ khách hàng để tư vấn giá.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;">
      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
        Email tự động từ <strong>Song Linh Technologies</strong> — Vui lòng không reply email này.
      </p>
    </div>
  </div>`;

  const emailPayload: Record<string, unknown> = {
    from: "Song Linh Technologies <noreply@sltech.vn>",
    to: ["songlinh@sltech.vn"],
    subject: `[Báo giá #${data.id}] ${data.customer_name}${data.company ? ` — ${data.company}` : ""} (${data.items.length} sản phẩm)`,
    html,
  };

  // Attach CSV if provided
  if (csvContent) {
    emailPayload.attachments = [
      {
        filename: `SongLinh_BaoGia_${data.id}.csv`,
        content: btoa(unescape(encodeURIComponent(csvContent))),
      },
    ];
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
