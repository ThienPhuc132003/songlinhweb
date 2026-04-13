import { Hono } from "hono";
import type { Env, QuotationRequestRow, QuotationItemRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { rateLimit } from "../middleware/rate-limit";
import {
  generateQuotationXlsx,
  getXlsxFileName,
  type XlsxQuotationData,
} from "../utils/xlsx-generator";
import {
  sendQuotationAdminEmail,
  sendQuotationCustomerEmail,
} from "../services/quotation-email";

const quotations = new Hono<{ Bindings: Env }>();

// ═══════════════════════════════════════════════
// PUBLIC: Submit a quotation request
// ═══════════════════════════════════════════════

/** POST /api/quotations — submit RFQ (rate-limited, public) */
quotations.post("/", rateLimit(5, 3600), async (c) => {
  const body = await c.req.json<{
    customer_name: string;
    company_name?: string;
    email?: string;
    phone: string;
    project_name?: string;
    note?: string;
    items: Array<{
      product_id: number;
      product_name: string;
      product_image?: string | null;
      category_name?: string | null;
      quantity: number;
      notes?: string | null;
    }>;
  }>();

  // ── Validation ──
  if (!body.customer_name?.trim()) return err("Họ tên là bắt buộc");
  if (!body.phone?.trim()) return err("Số điện thoại là bắt buộc");
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return err("Danh sách sản phẩm không được trống");
  }

  for (const item of body.items) {
    if (!item.product_name?.trim() || !item.quantity || item.quantity < 1) {
      return err("Thông tin sản phẩm không hợp lệ");
    }
  }

  if (body.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return err("Email không hợp lệ");
  }

  // ── 1. Insert quotation_requests ──
  const result = await c.env.DB.prepare(
    `INSERT INTO quotation_requests
       (customer_name, company_name, email, phone, project_name, note, status)
     VALUES (?, ?, ?, ?, ?, ?, 'new')`,
  )
    .bind(
      body.customer_name.trim(),
      body.company_name?.trim() ?? null,
      body.email?.trim() ?? null,
      body.phone.trim(),
      body.project_name?.trim() ?? null,
      body.note?.trim() ?? null,
    )
    .run();

  const quoteId = result.meta.last_row_id as number;

  // ── 2. Insert quotation_items (batch) ──
  // Validate product_ids: set to null if product doesn't exist (avoids FK error)
  const productIds = body.items
    .map((i) => i.product_id)
    .filter((id): id is number => id != null);

  let validProductIds = new Set<number>();
  if (productIds.length > 0) {
    const placeholders = productIds.map(() => "?").join(",");
    const { results } = await c.env.DB.prepare(
      `SELECT id FROM products WHERE id IN (${placeholders})`,
    )
      .bind(...productIds)
      .all<{ id: number }>();
    validProductIds = new Set(results.map((r) => r.id));
  }

  const stmts = body.items.map((item) =>
    c.env.DB.prepare(
      `INSERT INTO quotation_items
         (quote_id, product_id, product_name, product_image, category_name, quantity, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      quoteId,
      item.product_id && validProductIds.has(item.product_id)
        ? item.product_id
        : null,
      item.product_name.trim(),
      item.product_image ?? null,
      item.category_name ?? null,
      item.quantity,
      item.notes?.trim() ?? null,
    ),
  );

  await c.env.DB.batch(stmts);

  // ── 3. Generate XLSX & upload to R2 (best-effort) ──
  let excelUrl: string | null = null;
  let xlsxBuffer: ArrayBuffer | undefined;
  const createdAt = new Date().toISOString();

  try {
    const xlsxData: XlsxQuotationData = {
      id: quoteId,
      customer_name: body.customer_name.trim(),
      company_name: body.company_name?.trim() ?? null,
      email: body.email?.trim() ?? null,
      phone: body.phone.trim(),
      project_name: body.project_name?.trim() ?? null,
      note: body.note?.trim() ?? null,
      items: body.items,
      created_at: createdAt,
    };

    xlsxBuffer = await generateQuotationXlsx(xlsxData);
    const fileName = getXlsxFileName(quoteId, createdAt);
    const r2Key = `rfq/${fileName}`;

    // Upload to R2
    await c.env.IMAGES.put(r2Key, xlsxBuffer, {
      httpMetadata: {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        contentDisposition: `attachment; filename="${fileName}"`,
      },
    });

    excelUrl = r2Key;

    // Update excel_url in DB
    await c.env.DB.prepare(
      "UPDATE quotation_requests SET excel_url = ? WHERE id = ?",
    )
      .bind(excelUrl, quoteId)
      .run();
  } catch (e) {
    console.error("[XLSX Generation Error]", e);
    // Don't fail the request if XLSX generation fails
  }

  // ── 4. Send emails (best-effort) ──
  try {
    const quotationData = {
      id: quoteId,
      customer_name: body.customer_name.trim(),
      company_name: body.company_name?.trim() ?? null,
      email: body.email?.trim() ?? null,
      phone: body.phone.trim(),
      project_name: body.project_name?.trim() ?? null,
      note: body.note?.trim() ?? null,
      items: body.items,
      created_at: createdAt,
    };

    // Send admin notification (with XLSX attachment if available)
    await sendQuotationAdminEmail(c.env, quotationData, xlsxBuffer);

    // Send customer confirmation (if email provided)
    if (body.email?.trim()) {
      await sendQuotationCustomerEmail(c.env, quotationData);
    }
  } catch (e) {
    console.error("[Quotation Email Error]", e);
    // Don't fail the request if emails fail
  }

  return ok({
    id: quoteId,
    message:
      "Yêu cầu báo giá đã được gửi thành công. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
  });
});

// ═══════════════════════════════════════════════
// ADMIN: Quotation CRUD
// ═══════════════════════════════════════════════

/** GET /api/admin/quotations — list (paginated, filterable by status) */
quotations.get("/", requireAuth, async (c) => {
  const url = new URL(c.req.url);
  const status = url.searchParams.get("status");
  const { page, limit } = parsePagination(url);
  const offset = (page - 1) * limit;

  let where = "";
  const params: unknown[] = [];

  if (status && ["new", "processing", "sent", "completed"].includes(status)) {
    where = "WHERE qr.status = ?";
    params.push(status);
  }

  // Count
  const countRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM quotation_requests qr ${where}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const total = countRow?.total ?? 0;

  // Fetch with item count
  const rows = await c.env.DB.prepare(
    `SELECT qr.*,
            (SELECT COUNT(*) FROM quotation_items qi WHERE qi.quote_id = qr.id) as item_count
     FROM quotation_requests qr
     ${where}
     ORDER BY qr.created_at DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all();

  return paginated(rows.results, total, { page, limit });
});

/** GET /api/admin/quotations/:id — detail with items */
quotations.get("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));

  // Check if this is the /excel sub-route (Hono path ambiguity)
  if (c.req.param("id") === "excel") return c.notFound();

  const request = await c.env.DB.prepare(
    "SELECT * FROM quotation_requests WHERE id = ?",
  )
    .bind(id)
    .first<QuotationRequestRow>();

  if (!request) return err("Quotation request not found", 404);

  const items = await c.env.DB.prepare(
    "SELECT * FROM quotation_items WHERE quote_id = ? ORDER BY id ASC",
  )
    .bind(id)
    .all<QuotationItemRow>();

  return ok({
    ...request,
    items: items.results,
  });
});

/** GET /api/admin/quotations/:id/excel — download or regenerate XLSX */
quotations.get("/:id/excel", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));

  // Fetch quote + items
  const request = await c.env.DB.prepare(
    "SELECT * FROM quotation_requests WHERE id = ?",
  )
    .bind(id)
    .first<QuotationRequestRow>();

  if (!request) return err("Quotation request not found", 404);

  const items = await c.env.DB.prepare(
    "SELECT * FROM quotation_items WHERE quote_id = ? ORDER BY id ASC",
  )
    .bind(id)
    .all<QuotationItemRow>();

  const fileName = getXlsxFileName(id, request.created_at);

  // Try to serve from R2 first
  if (request.excel_url) {
    const r2Object = await c.env.IMAGES.get(request.excel_url);
    if (r2Object) {
      return new Response(r2Object.body, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  }

  // Regenerate XLSX
  const xlsxData: XlsxQuotationData = {
    id: request.id,
    customer_name: request.customer_name,
    company_name: request.company_name,
    email: request.email,
    phone: request.phone,
    project_name: request.project_name,
    note: request.note,
    items: items.results.map((item) => ({
      product_name: item.product_name,
      product_image: item.product_image,
      category_name: item.category_name,
      quantity: item.quantity,
      notes: item.notes,
    })),
    created_at: request.created_at,
  };

  const xlsxBuffer = await generateQuotationXlsx(xlsxData);
  const r2Key = `rfq/${fileName}`;

  // Upload to R2 for caching
  try {
    await c.env.IMAGES.put(r2Key, xlsxBuffer, {
      httpMetadata: {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        contentDisposition: `attachment; filename="${fileName}"`,
      },
    });

    // Update excel_url
    await c.env.DB.prepare(
      "UPDATE quotation_requests SET excel_url = ? WHERE id = ?",
    )
      .bind(r2Key, id)
      .run();
  } catch (e) {
    console.error("[R2 Upload Error]", e);
    // Still return the XLSX even if R2 upload fails
  }

  return new Response(xlsxBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
});

/** PUT /api/admin/quotations/:id/status — update status */
quotations.put("/:id/status", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<{ status: string }>();

  const validStatuses = ["new", "processing", "sent", "completed"];
  if (!validStatuses.includes(body.status)) {
    return err(
      `Invalid status. Use: ${validStatuses.join(", ")}`,
    );
  }

  const existing = await c.env.DB.prepare(
    "SELECT id FROM quotation_requests WHERE id = ?",
  )
    .bind(id)
    .first();

  if (!existing) return err("Quotation request not found", 404);

  await c.env.DB.prepare(
    "UPDATE quotation_requests SET status = ?, updated_at = datetime('now') WHERE id = ?",
  )
    .bind(body.status, id)
    .run();

  return ok({ id, status: body.status });
});

/** DELETE /api/admin/quotations/:id — soft delete */
quotations.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));

  const existing = await c.env.DB.prepare(
    "SELECT id, excel_url FROM quotation_requests WHERE id = ?",
  )
    .bind(id)
    .first<{ id: number; excel_url: string | null }>();

  if (!existing) return err("Quotation request not found", 404);

  // Delete XLSX from R2 if exists (cleanup R2 on soft-delete)
  if (existing.excel_url) {
    try {
      await c.env.IMAGES.delete(existing.excel_url);
    } catch {
      // Best-effort cleanup
    }
  }

  // Soft delete the quotation request (keep items for audit trail)
  await c.env.DB.prepare(
    "UPDATE quotation_requests SET deleted_at = datetime('now') WHERE id = ?",
  ).bind(id).run();

  return ok({ deleted: true });
});

export default quotations;
