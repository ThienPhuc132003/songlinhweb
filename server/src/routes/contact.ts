import { Hono } from "hono";
import type { Env, ContactRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { rateLimit } from "../middleware/rate-limit";

const contact = new Hono<{ Bindings: Env }>();

/** POST /api/contact — submit contact form (rate-limited) */
contact.post("/", rateLimit(5, 3600), async (c) => {
  const body = await c.req.json<{
    company_name: string;
    contact_person?: string;
    email: string;
    phone: string;
    address?: string;
    message: string;
  }>();

  // Validation
  if (!body.company_name?.trim()) return err("Tên công ty là bắt buộc");
  if (!body.email?.trim()) return err("Email là bắt buộc");
  if (!body.phone?.trim()) return err("Số điện thoại là bắt buộc");
  if (!body.message?.trim()) return err("Nội dung là bắt buộc");

  // Simple email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return err("Email không hợp lệ");
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO contacts (company_name, contact_person, email, phone, address, message, status)
     VALUES (?, ?, ?, ?, ?, ?, 'new')`,
  )
    .bind(
      body.company_name.trim(),
      body.contact_person?.trim() ?? null,
      body.email.trim(),
      body.phone.trim(),
      body.address?.trim() ?? null,
      body.message.trim(),
    )
    .run();

  // Send email notification if Resend API key is configured
  if (c.env.RESEND_API_KEY) {
    try {
      await sendEmailNotification(c.env, body);
    } catch (e) {
      console.error("[Email Error]", e);
      // Don't fail the request if email fails
    }
  }

  return ok({
    id: result.meta.last_row_id,
    message:
      "Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
  });
});

/** GET /api/admin/contacts — list contacts (admin) */
contact.get("/", requireAuth, async (c) => {
  const url = new URL(c.req.url);
  const status = url.searchParams.get("status");

  let query = "SELECT * FROM contacts";
  const params: unknown[] = [];

  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }

  query += " ORDER BY created_at DESC";

  const rows = await c.env.DB.prepare(query)
    .bind(...params)
    .all<ContactRow>();

  return ok(rows.results);
});

/** PUT /api/admin/contacts/:id/status — update contact status (admin) */
contact.put("/:id/status", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<{ status: string }>();

  if (!["new", "read", "replied", "archived"].includes(body.status)) {
    return err("Invalid status. Use: new, read, replied, archived");
  }

  await c.env.DB.prepare("UPDATE contacts SET status = ? WHERE id = ?")
    .bind(body.status, id)
    .run();

  return ok({ id, status: body.status });
});

/** DELETE /api/admin/contacts/:id */
contact.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

/** Send email notification via Resend */
async function sendEmailNotification(
  env: Env,
  data: { company_name: string; email: string; phone: string; message: string },
) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "SLTECH Website <noreply@sltech.vn>",
      to: ["songlinh@sltech.vn"],
      subject: `[Website] Liên hệ mới từ ${data.company_name}`,
      html: `
        <h2>Yêu cầu liên hệ mới</h2>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;">Công ty:</td><td style="padding:8px;">${data.company_name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${data.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">SĐT:</td><td style="padding:8px;">${data.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Nội dung:</td><td style="padding:8px;">${data.message}</td></tr>
        </table>
      `,
    }),
  });
}

export default contact;
