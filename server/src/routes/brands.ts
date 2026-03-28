import { Hono } from "hono";
import type { Env, BrandRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const brands = new Hono<{ Bindings: Env }>();

/* ───────── Public ───────── */

/** GET /api/brands — list active brands */
brands.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT * FROM brands WHERE is_active = 1 ORDER BY sort_order ASC`,
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

/** GET /api/admin/brands/all — list ALL brands including inactive */
brands.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT * FROM brands ORDER BY sort_order ASC`,
  ).all<BrandRow>();
  return ok(rows.results);
});

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

  return ok({ id: result.meta.last_row_id });
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

  return ok({ id });
});

/** DELETE /api/admin/brands/:id */
brands.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM brands WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

export default brands;
