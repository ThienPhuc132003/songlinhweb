import { Hono } from "hono";
import type { Env, BrandRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { logAudit } from "../lib/audit";

const brands = new Hono<{ Bindings: Env }>();

/* ───────── Public ───────── */

/** GET /api/brands — list active brands */
brands.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT * FROM brands WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order ASC`,
  ).all<BrandRow>();
  return ok(rows.results);
});

/** GET /api/admin/brands/all — list ALL brands including inactive (MUST be before /:slug) */
brands.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT * FROM brands WHERE deleted_at IS NULL ORDER BY sort_order ASC`,
  ).all<BrandRow>();
  return ok(rows.results);
});

/** GET /api/brands/:slug — get brand detail */
brands.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    `SELECT * FROM brands WHERE slug = ? AND is_active = 1`,
  )
    .bind(slug)
    .first<BrandRow>();

  if (!row) return err("Brand not found", 404);
  return ok(row);
});

/* ───────── Admin CRUD ───────── */

/** POST /api/admin/brands */
brands.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<BrandRow>>();
  if (!body.slug || !body.name) return err("slug and name are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO brands (slug, name, logo_url, description, website_url, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
  )
    .bind(
      body.slug,
      body.name,
      body.logo_url ?? null,
      body.description ?? "",
      body.website_url ?? null,
      body.sort_order ?? 0,
    )
    .run();

  const newId = result.meta.last_row_id;
  logAudit(c.env.DB, 'brand', newId as number, 'create', { name: body.name, slug: body.slug });
  return ok({ id: newId });
});

/** PUT /api/admin/brands/:id */
brands.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<BrandRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  const fields: Array<[keyof BrandRow, string]> = [
    ["name", "name"],
    ["slug", "slug"],
    ["logo_url", "logo_url"],
    ["description", "description"],
    ["website_url", "website_url"],
    ["sort_order", "sort_order"],
    ["is_active", "is_active"],
  ];

  for (const [key, col] of fields) {
    if ((body as Record<string, unknown>)[key] !== undefined) {
      sets.push(`${col} = ?`);
      values.push((body as Record<string, unknown>)[key]);
    }
  }

  if (sets.length === 0) return err("No fields to update");
  values.push(id);

  await c.env.DB.prepare(`UPDATE brands SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  logAudit(c.env.DB, 'brand', id, 'update', body as Record<string, unknown>);
  return ok({ id });
});

/** DELETE /api/admin/brands/:id — soft delete */
brands.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));

  // Deletion constraint: check for linked products
  const count = await c.env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM products WHERE brand_id = ? AND deleted_at IS NULL",
  ).bind(id).first<{ cnt: number }>();
  if (count && count.cnt > 0) {
    return err(`Không thể xóa thương hiệu đang có ${count.cnt} sản phẩm. Vui lòng đổi thương hiệu cho sản phẩm trước.`, 409);
  }

  await c.env.DB.prepare(
    "UPDATE brands SET deleted_at = datetime('now') WHERE id = ?",
  ).bind(id).run();
  logAudit(c.env.DB, 'brand', id, 'delete');
  return ok({ deleted: true });
});

export default brands;
