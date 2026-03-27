import { Hono } from "hono";
import type { Env } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { rateLimit } from "../middleware/rate-limit";
import { sendQuoteNotification } from "../services/email";
import { generateQuoteCSV } from "../utils/csv-export";

const quotes = new Hono<{ Bindings: Env }>();

/** POST /api/quotes — submit a quote request (rate-limited, public) */
quotes.post("/", rateLimit(5, 3600), async (c) => {
  const body = await c.req.json<{
    customer_name: string;
    email?: string;
    phone: string;
    company?: string;
    items: { product_id: number; product_name: string; qty: number }[];
    note?: string;
  }>();

  // Validation
  if (!body.customer_name?.trim()) return err("Họ tên là bắt buộc");
  if (!body.phone?.trim()) return err("Số điện thoại là bắt buộc");
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return err("Giỏ hàng không được trống");
  }

  // Validate each item
  for (const item of body.items) {
    if (!item.product_name?.trim() || !item.qty || item.qty < 1) {
      return err("Thông tin sản phẩm không hợp lệ");
    }
  }

  // Optional email format check
  if (body.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return err("Email không hợp lệ");
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO quote_requests (customer_name, email, phone, company, items, note, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
  )
    .bind(
      body.customer_name.trim(),
      body.email?.trim() ?? null,
      body.phone.trim(),
      body.company?.trim() ?? null,
      JSON.stringify(body.items),
      body.note?.trim() ?? null,
    )
    .run();

  const quoteId = result.meta.last_row_id;
  const createdAt = new Date().toISOString();

  // Generate CSV and send email notification
  try {
    const csvContent = generateQuoteCSV({
      id: quoteId as number,
      customer_name: body.customer_name.trim(),
      email: body.email?.trim(),
      phone: body.phone.trim(),
      company: body.company?.trim(),
      items: body.items,
      note: body.note?.trim(),
      created_at: createdAt,
    });

    await sendQuoteNotification(
      c.env,
      {
        id: quoteId as number,
        customer_name: body.customer_name.trim(),
        email: body.email?.trim(),
        phone: body.phone.trim(),
        company: body.company?.trim(),
        items: body.items,
        note: body.note?.trim(),
        created_at: createdAt,
      },
      csvContent,
    );
  } catch (e) {
    console.error("[Quote Email Error]", e);
    // Don't fail the request if email fails
  }

  return ok({
    id: quoteId,
    message:
      "Yêu cầu báo giá đã được gửi thành công. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
  });
});

/** GET /api/admin/quotes — list quote requests (admin, paginated) */
quotes.get("/", requireAuth, async (c) => {
  const url = new URL(c.req.url);
  const status = url.searchParams.get("status");
  const { page, limit } = parsePagination(url);
  const offset = (page - 1) * limit;

  let where = "";
  const params: unknown[] = [];

  if (status) {
    where = "WHERE status = ?";
    params.push(status);
  }

  const countRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM quote_requests ${where}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const total = countRow?.total ?? 0;

  const rows = await c.env.DB.prepare(
    `SELECT * FROM quote_requests ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all();

  return paginated(rows.results, total, { page, limit });
});

/** GET /api/admin/quotes/:id — single quote detail (admin) */
quotes.get("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const row = await c.env.DB.prepare(
    "SELECT * FROM quote_requests WHERE id = ?",
  )
    .bind(id)
    .first();

  if (!row) return err("Quote request not found", 404);
  return ok(row);
});

/** GET /api/admin/quotes/:id/export — export quote as CSV (admin) */
quotes.get("/:id/export", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const row = await c.env.DB.prepare(
    "SELECT * FROM quote_requests WHERE id = ?",
  )
    .bind(id)
    .first<{
      id: number;
      customer_name: string;
      email: string | null;
      phone: string;
      company: string | null;
      items: string;
      note: string | null;
      created_at: string;
    }>();

  if (!row) return err("Quote request not found", 404);

  const csvContent = generateQuoteCSV({
    id: row.id,
    customer_name: row.customer_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    items: JSON.parse(row.items),
    note: row.note,
    created_at: row.created_at,
  });

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="SLTECH_BaoGia_${id}.csv"`,
    },
  });
});

/** PUT /api/admin/quotes/:id/status — update status (admin) */
quotes.put("/:id/status", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<{ status: string }>();

  if (
    !["pending", "contacted", "quoted", "completed", "cancelled"].includes(
      body.status,
    )
  ) {
    return err(
      "Invalid status. Use: pending, contacted, quoted, completed, cancelled",
    );
  }

  await c.env.DB.prepare("UPDATE quote_requests SET status = ? WHERE id = ?")
    .bind(body.status, id)
    .run();

  return ok({ id, status: body.status });
});

/** DELETE /api/admin/quotes/:id */
quotes.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM quote_requests WHERE id = ?")
    .bind(id)
    .run();
  return ok({ deleted: true });
});

export default quotes;
