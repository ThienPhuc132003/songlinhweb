import { Hono } from "hono";
import type { Env } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

interface ProductFeatureRow {
  id: number;
  name: string;
  slug: string;
  group_name: string;
  sort_order: number;
  is_active: number;
  color: string | null;
  icon: string | null;
  is_priority: number;
  created_at: string;
  updated_at: string;
}

const features = new Hono<{ Bindings: Env }>();

/* ───────── Public ───────── */

/** GET /api/product-features — list active features (for frontend filter) */
features.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, name, slug, group_name, sort_order, color, icon, is_priority
     FROM product_features
     WHERE is_active = 1
     ORDER BY group_name ASC, is_priority DESC, sort_order ASC`,
  ).all<ProductFeatureRow>();
  return ok(rows.results);
});

/* ───────── Admin ───────── */

/** GET /api/admin/product-features/all — list ALL features */
features.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT pf.*,
            (SELECT COUNT(*) FROM product_to_features WHERE feature_id = pf.id) as product_count
     FROM product_features pf
     ORDER BY pf.group_name ASC, pf.sort_order ASC`,
  ).all<ProductFeatureRow & { product_count: number }>();
  return ok(rows.results);
});

/** POST /api/admin/product-features — create feature */
features.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<ProductFeatureRow>>();
  if (!body.name || !body.slug) return err("name and slug are required");

  // Check duplicate slug
  const existing = await c.env.DB.prepare(
    "SELECT id FROM product_features WHERE slug = ?",
  )
    .bind(body.slug)
    .first();
  if (existing) return err(`Slug "${body.slug}" đã tồn tại`, 409);

  const result = await c.env.DB.prepare(
    `INSERT INTO product_features (name, slug, group_name, sort_order, is_active, color, icon, is_priority)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      body.name,
      body.slug,
      body.group_name ?? "",
      body.sort_order ?? 0,
      body.is_active ?? 1,
      body.color ?? null,
      body.icon ?? null,
      body.is_priority ?? 0,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** PUT /api/admin/product-features/:id — update feature */
features.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<ProductFeatureRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.name !== undefined) {
    sets.push("name = ?");
    values.push(body.name);
  }
  if (body.slug !== undefined) {
    // Check duplicate slug
    const existing = await c.env.DB.prepare(
      "SELECT id FROM product_features WHERE slug = ? AND id != ?",
    )
      .bind(body.slug, id)
      .first();
    if (existing) return err(`Slug "${body.slug}" đã được sử dụng`, 409);
    sets.push("slug = ?");
    values.push(body.slug);
  }
  if (body.group_name !== undefined) {
    sets.push("group_name = ?");
    values.push(body.group_name);
  }
  if (body.sort_order !== undefined) {
    sets.push("sort_order = ?");
    values.push(body.sort_order);
  }
  if (body.is_active !== undefined) {
    sets.push("is_active = ?");
    values.push(body.is_active);
  }
  if (body.color !== undefined) {
    sets.push("color = ?");
    values.push(body.color);
  }
  if (body.icon !== undefined) {
    sets.push("icon = ?");
    values.push(body.icon);
  }
  if (body.is_priority !== undefined) {
    sets.push("is_priority = ?");
    values.push(body.is_priority);
  }

  if (sets.length === 0) return err("No fields to update");
  sets.push("updated_at = datetime('now')");
  values.push(id);

  await c.env.DB.prepare(
    `UPDATE product_features SET ${sets.join(", ")} WHERE id = ?`,
  )
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/product-features/:id — soft delete feature + clean junction */
features.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));

  // Clean up junction table (hard delete — child relation)
  await c.env.DB.prepare(
    "DELETE FROM product_to_features WHERE feature_id = ?",
  )
    .bind(id)
    .run();

  // Soft delete the feature itself
  await c.env.DB.prepare(
    "UPDATE product_features SET deleted_at = datetime('now') WHERE id = ?",
  ).bind(id).run();

  return ok({ deleted: true });
});

/* ───────── Product-Feature Assignment ───────── */

/** GET /api/product-features/by-product/:productId — get features for a product */
features.get("/by-product/:productId", async (c) => {
  const productId = Number(c.req.param("productId"));
  const rows = await c.env.DB.prepare(
    `SELECT pf.id, pf.name, pf.slug, pf.group_name, pf.color, pf.icon, pf.is_priority
     FROM product_features pf
     JOIN product_to_features ptf ON ptf.feature_id = pf.id
     WHERE ptf.product_id = ? AND pf.is_active = 1
     ORDER BY pf.is_priority DESC, pf.group_name ASC, pf.sort_order ASC`,
  )
    .bind(productId)
    .all<ProductFeatureRow>();
  return ok(rows.results);
});

/** PUT /api/admin/product-features/assign/:productId — sync features for a product */
features.put("/assign/:productId", requireAuth, async (c) => {
  const productId = Number(c.req.param("productId"));
  const { feature_ids } = await c.req.json<{ feature_ids: number[] }>();

  // Delete existing assignments
  await c.env.DB.prepare(
    "DELETE FROM product_to_features WHERE product_id = ?",
  )
    .bind(productId)
    .run();

  // Insert new assignments
  if (feature_ids && feature_ids.length > 0) {
    const placeholders = feature_ids.map(() => "(?, ?)").join(", ");
    const values = feature_ids.flatMap((fid) => [productId, fid]);
    await c.env.DB.prepare(
      `INSERT INTO product_to_features (product_id, feature_id) VALUES ${placeholders}`,
    )
      .bind(...values)
      .run();
  }

  return ok({ product_id: productId, feature_count: feature_ids?.length ?? 0 });
});

export default features;
