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
    model_number?: string | null;
    brand_name?: string | null;
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

/* ═══════════════════════════════════════════════
 *  UTILITIES
 * ═══════════════════════════════════════════════ */

/** Escape HTML special characters */
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function getAdminEmail(env: Env): string {
  return env.ADMIN_NOTIFICATION_EMAIL || "doremonkuntp132003@gmail.com";
}

function getSiteUrl(env: Env): string {
  if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, "");
  if (env.CORS_ORIGIN) {
    const firstOrigin = env.CORS_ORIGIN.split(",")[0].trim();
    if (firstOrigin && firstOrigin !== "*") return firstOrigin;
  }
  return "https://sltech.vn";
}

async function sendResendEmail(env: Env, payload: Record<string, unknown>): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Song Linh Technologies <onboarding@resend.dev>",
      ...payload,
    }),
  });
}

/* ═══════════════════════════════════════════════
 *  BRANDED HTML BUILDERS (Inline CSS Only)
 * ═══════════════════════════════════════════════ */

/** Brand header: Text logo (left) + Title (right) + 3px blue hairline */
function buildEmailHeader(title: string, subtitle?: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:24px 28px;vertical-align:middle;" width="200">
          <span style="font-size:20px;font-weight:800;color:#3C5DAA;letter-spacing:-0.5px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">SLTECH</span>
          <br/>
          <span style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Song Linh Technologies</span>
        </td>
        <td style="padding:24px 28px;text-align:right;vertical-align:middle;">
          <span style="font-size:16px;font-weight:700;color:#0f172a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${title}</span>
          ${subtitle ? `<br/><span style="font-size:12px;color:#64748b;font-family:Arial,sans-serif;">${subtitle}</span>` : ""}
        </td>
      </tr>
    </table>
    <div style="height:3px;background:#3C5DAA;"></div>`;
}

/** Labeled info row: uppercase tiny label + medium value */
function buildInfoRow(label: string, value: string, isLink?: boolean): string {
  const valueHtml = isLink
    ? `<a href="${value.startsWith("mailto:") ? value : `mailto:${value}`}" style="color:#3C5DAA;text-decoration:none;font-size:14px;font-weight:500;">${escapeHtml(value.replace("mailto:", ""))}</a>`
    : `<span style="font-size:14px;font-weight:500;color:#0f172a;">${escapeHtml(value)}</span>`;

  return `
    <tr>
      <td style="padding:6px 0;vertical-align:top;width:120px;">
        <span style="font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:0.5px;font-family:Arial,sans-serif;">${label}</span>
      </td>
      <td style="padding:6px 0;vertical-align:top;">
        ${valueHtml}
      </td>
    </tr>`;
}

/** CTA buttons: Primary admin button + optional Zalo & Email secondary text links */
function buildActionButtons(env: Env, adminPath: string, phone?: string | null, email?: string | null): string {
  const baseUrl = getSiteUrl(env);
  const adminUrl = `${baseUrl}${adminPath}`;

  let secondary = "";
  const links: string[] = [];
  if (phone) {
    links.push(`<a href="https://zalo.me/${escapeHtml(phone)}" style="color:#3C5DAA;text-decoration:none;font-size:13px;font-weight:500;" target="_blank">💬 Chat Zalo</a>`);
  }
  if (email) {
    links.push(`<a href="mailto:${escapeHtml(email)}" style="color:#3C5DAA;text-decoration:none;font-size:13px;font-weight:500;">✉️ Soạn Mail</a>`);
  }
  if (links.length > 0) {
    secondary = `<div style="margin-top:12px;text-align:center;">${links.join(`<span style="color:#cbd5e1;margin:0 10px;">•</span>`)}</div>`;
  }

  return `
    <div style="text-align:center;margin-top:28px;">
      <a href="${adminUrl}" style="display:inline-block;background-color:#3C5DAA;color:#ffffff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;font-family:Arial,sans-serif;">
        Xem chi tiết trong Admin
      </a>
      ${secondary}
    </div>`;
}

/** Branded footer with company info */
function buildEmailFooter(): string {
  return `
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:0;">
            <span style="font-size:13px;font-weight:700;color:#3C5DAA;font-family:Arial,sans-serif;">Song Linh Technologies</span>
            <br/>
            <span style="font-size:12px;color:#64748b;line-height:1.8;font-family:Arial,sans-serif;">
              0968.811.911 &nbsp;•&nbsp; songlinh@sltech.vn<br/>
              19 Linh Đông, Khu phố 7, P. Hiệp Bình, TP.HCM
            </span>
            <br/>
            <a href="https://sltech.vn" style="font-size:12px;color:#3C5DAA;text-decoration:none;font-family:Arial,sans-serif;">www.sltech.vn</a>
          </td>
        </tr>
      </table>
    </div>`;
}

/** Info card with white background + border */
function buildInfoCard(content: string): string {
  return `
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;margin:16px 0;">
      ${content}
    </div>`;
}

/** Wrap entire email in outer container */
function wrapEmailLayout(content: string): string {
  return `
  <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;">
    ${content}
  </div>`;
}

/* ═══════════════════════════════════════════════
 *  TEMPLATE 1: ADMIN NOTIFICATION — QUOTATION
 * ═══════════════════════════════════════════════ */
export async function sendQuotationAdminEmail(
  env: Env,
  data: QuotationEmailData,
  xlsxBuffer?: ArrayBuffer,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const totalQty = data.items.reduce((sum, i) => sum + i.quantity, 0);

  // Info card: customer details
  let infoRows = "";
  infoRows += buildInfoRow("Khách hàng", data.customer_name);
  if (data.company_name) infoRows += buildInfoRow("Công ty", data.company_name);
  infoRows += buildInfoRow("Điện thoại", data.phone);
  if (data.email) infoRows += buildInfoRow("Email", data.email, true);

  const infoCardHtml = buildInfoCard(`
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${infoRows}
    </table>
  `);

  // Product table (striped rows, compact)
  const itemsHtml = data.items
    .map(
      (item, i) => {
        const meta: string[] = [];
        if (item.model_number) meta.push(escapeHtml(item.model_number));
        if (item.brand_name) meta.push(escapeHtml(item.brand_name));
        const metaLine = meta.length > 0
          ? `<br/><span style="font-size:11px;color:#64748b;font-weight:400;">${meta.join(" · ")}</span>`
          : "";
        return `
      <tr style="${i % 2 === 0 ? "background:#f8fafc;" : "background:#ffffff;"}">
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;text-align:center;font-family:'Courier New',monospace;">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:500;color:#1e293b;font-size:13px;">${escapeHtml(item.product_name)}${metaLine}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;color:#0f172a;font-size:13px;font-family:'Courier New',monospace;">${item.quantity}</td>
      </tr>`;
      },
    )
    .join("");

  const tableHtml = `
    <div style="margin:16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-collapse:collapse;border-radius:8px;overflow:hidden;">
        <tr style="background:#1e293b;">
          <th style="padding:10px 12px;color:#f1f5f9;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;width:40px;">STT</th>
          <th style="padding:10px 12px;color:#f1f5f9;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">Sản phẩm</th>
          <th style="padding:10px 12px;color:#f1f5f9;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;text-align:center;width:60px;">SL</th>
        </tr>
        ${itemsHtml}
        <tr style="background:#e2e8f0;">
          <td colspan="2" style="padding:10px 12px;font-weight:700;font-size:13px;color:#0f172a;">Tổng cộng</td>
          <td style="padding:10px 12px;text-align:center;font-weight:700;font-size:13px;color:#0f172a;font-family:'Courier New',monospace;">${totalQty}</td>
        </tr>
      </table>
    </div>`;

  // Note callout
  const noteHtml = data.note
    ? `<div style="background:#fffbeb;padding:14px 16px;border-left:4px solid #f59e0b;border-radius:0 6px 6px 0;margin:16px 0;">
         <span style="font-size:11px;text-transform:uppercase;color:#92400e;letter-spacing:0.5px;font-weight:600;">Ghi chú</span>
         <p style="margin:6px 0 0;font-size:13px;color:#451a03;line-height:1.5;">${escapeHtml(data.note)}</p>
       </div>`
    : "";

  const html = wrapEmailLayout(`
    ${buildEmailHeader(
      `RFQ #${data.id}`,
      escapeHtml(data.project_name || "Yêu cầu báo giá mới"),
    )}
    <div style="padding:24px 28px;">
      ${infoCardHtml}
      ${tableHtml}
      ${noteHtml}
      ${buildActionButtons(env, `/admin/quotations/${data.id}`, data.phone, data.email)}
      ${buildEmailFooter()}
    </div>
  `);

  const emailPayload: Record<string, unknown> = {
    to: [getAdminEmail(env)],
    subject: `[RFQ #${data.id}] Phê duyệt báo giá — ${data.customer_name}`,
    html,
  };

  if (xlsxBuffer) {
    const dateStr = data.created_at
      ? new Date(data.created_at).toISOString().slice(0, 10).replace(/-/g, "")
      : "now";
    emailPayload.attachments = [
      {
        content: uint8ToBase64(new Uint8Array(xlsxBuffer)),
        filename: `SLTECH_RFQ_${data.id}_${dateStr}.xlsx`,
      },
    ];
  }

  await sendResendEmail(env, emailPayload);
}

/* ═══════════════════════════════════════════════
 *  TEMPLATE 2: ADMIN NOTIFICATION — CONTACT
 * ═══════════════════════════════════════════════ */
export async function sendContactAdminEmail(
  env: Env,
  data: ContactEmailData,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  // Info card: contact details
  let infoRows = "";
  infoRows += buildInfoRow("Công ty", data.company_name);
  if (data.contact_person) infoRows += buildInfoRow("Người liên hệ", data.contact_person);
  infoRows += buildInfoRow("Điện thoại", data.phone);
  infoRows += buildInfoRow("Email", data.email, true);
  if (data.address) infoRows += buildInfoRow("Địa chỉ", data.address);

  const infoCardHtml = buildInfoCard(`
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${infoRows}
    </table>
  `);

  // Message callout
  const messageHtml = `
    <div style="background:#fffbeb;padding:14px 16px;border-left:4px solid #f59e0b;border-radius:0 6px 6px 0;margin:16px 0;">
      <span style="font-size:11px;text-transform:uppercase;color:#92400e;letter-spacing:0.5px;font-weight:600;">Nội dung tin nhắn</span>
      <p style="margin:6px 0 0;font-size:13px;color:#451a03;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
    </div>`;

  const html = wrapEmailLayout(`
    ${buildEmailHeader("Liên hệ mới", escapeHtml(data.company_name))}
    <div style="padding:24px 28px;">
      ${infoCardHtml}
      ${messageHtml}
      ${buildActionButtons(env, "/admin/contacts", data.phone, data.email)}
      ${buildEmailFooter()}
    </div>
  `);

  await sendResendEmail(env, {
    to: [getAdminEmail(env)],
    subject: `[Liên hệ] Khách hàng: ${data.company_name}`,
    html,
  });
}

/* ═══════════════════════════════════════════════
 *  TEMPLATE 3: CUSTOMER CONFIRMATION
 * ═══════════════════════════════════════════════ */
export async function sendQuotationCustomerEmail(
  env: Env,
  data: QuotationEmailData,
): Promise<void> {
  if (!env.RESEND_API_KEY || !data.email) return;

  const html = wrapEmailLayout(`
    ${buildEmailHeader(
      "Xác nhận yêu cầu",
      escapeHtml(data.project_name || `Báo giá #${data.id}`),
    )}
    <div style="padding:24px 28px;">
      <p style="font-size:14px;color:#1e293b;line-height:1.7;margin:0 0 16px;">
        Kính gửi <strong>${escapeHtml(data.customer_name)}</strong>,
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.7;margin:0 0 12px;">
        Cảm ơn quý khách đã tin tưởng và gửi yêu cầu đến <strong style="color:#3C5DAA;">Song Linh Technologies</strong>.
        Chúng tôi đã nhận được yêu cầu <strong>${escapeHtml(data.project_name || `Báo giá #${data.id}`)}</strong> của quý khách.
      </p>
      <p style="font-size:14px;color:#334155;line-height:1.7;margin:0 0 24px;">
        Đội ngũ chuyên gia của chúng tôi đang trong quá trình xét duyệt các yêu cầu vật tư
        và sẽ trực tiếp liên hệ để tư vấn chi tiết trong vòng <strong>24 – 48 giờ làm việc</strong>.
      </p>

      <div style="border-top:1px solid #e2e8f0;padding-top:20px;margin-top:8px;">
        <p style="font-size:14px;color:#334155;margin:0 0 4px;">Trân trọng,</p>
        <p style="font-size:14px;font-weight:700;color:#3C5DAA;margin:0 0 2px;">Đội ngũ Song Linh Technologies</p>
      </div>

      ${buildEmailFooter()}
    </div>
  `);

  await sendResendEmail(env, {
    to: [data.email],
    subject: "Song Linh Technologies — Xác nhận yêu cầu báo giá của quý khách",
    html,
  });
}
