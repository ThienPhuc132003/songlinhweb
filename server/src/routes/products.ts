import { Hono } from "hono";
import type { Env, ProductCategoryRow, ProductRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const products = new Hono<{ Bindings: Env }>();

/* ───────── Categories ───────── */

/** GET /api/product-categories — list active categories */
products.get("/categories", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT pc.*, COUNT(p.id) as product_count
     FROM product_categories pc
     LEFT JOIN products p ON p.category_id = pc.id AND p.is_active = 1
     WHERE pc.is_active = 1
     GROUP BY pc.id
     ORDER BY pc.sort_order ASC`,
  ).all<ProductCategoryRow & { product_count: number }>();
  return ok(rows.results);
});

/** GET /api/admin/products/categories/all — list ALL categories (admin) */
products.get("/categories/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT pc.*, COUNT(p.id) as product_count,
            parent.name as parent_name
     FROM product_categories pc
     LEFT JOIN products p ON p.category_id = pc.id
     LEFT JOIN product_categories parent ON parent.id = pc.parent_id
     GROUP BY pc.id
     ORDER BY pc.sort_order ASC`,
  ).all<ProductCategoryRow & { product_count: number; parent_name: string | null }>();
  return ok(rows.results);
});

/* ───────── Products ───────── */

/** GET /api/products — list products with optional category, brand, search filters */
products.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const category = url.searchParams.get("category");
  const brand = url.searchParams.get("brand");
  const search = url.searchParams.get("search");
  const offset = (page - 1) * limit;

  let where = "WHERE p.is_active = 1";
  const params: unknown[] = [];

  if (category) {
    where += " AND pc.slug = ?";
    params.push(category);
  }
  if (brand) {
    where += " AND b.slug = ?";
    params.push(brand);
  }
  if (search) {
    where += " AND (p.name LIKE ? OR p.description LIKE ? OR p.model_number LIKE ? OR p.brand LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     LEFT JOIN brands b ON b.id = p.brand_id
     ${where}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const rows = await c.env.DB.prepare(
    `SELECT p.*, pc.name as category_name, pc.slug as category_slug,
            b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo
     FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     LEFT JOIN brands b ON b.id = p.brand_id
     ${where}
     ORDER BY p.sort_order ASC
     LIMIT ? OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all<ProductRow & { category_name: string; category_slug: string; brand_name: string | null; brand_slug: string | null; brand_logo: string | null }>();

  return paginated(rows.results, countResult?.total ?? 0, { page, limit });
});

/* ───────── Admin CRUD ───────── */

/** GET /api/admin/products/all — list ALL product categories including inactive */
products.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT pc.*, COUNT(p.id) as product_count
     FROM product_categories pc
     LEFT JOIN products p ON p.category_id = pc.id
     GROUP BY pc.id
     ORDER BY pc.sort_order ASC`,
  ).all<ProductCategoryRow & { product_count: number }>();
  return ok(rows.results);
});

/** GET /api/admin/products/items/all — list ALL products including inactive */
products.get("/items/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT p.*, pc.name as category_name, pc.slug as category_slug
     FROM products p
     LEFT JOIN product_categories pc ON pc.id = p.category_id
     ORDER BY p.sort_order ASC`,
  ).all<ProductRow & { category_name: string; category_slug: string }>();
  return ok(rows.results);
});

/** GET /api/products/:slug — get product detail with brand + images + related */
products.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    `SELECT p.*, pc.name as category_name, pc.slug as category_slug,
            b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo, b.website_url as brand_website
     FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     LEFT JOIN brands b ON b.id = p.brand_id
     WHERE p.slug = ? AND p.is_active = 1`,
  )
    .bind(slug)
    .first<ProductRow & { category_name: string; category_slug: string; brand_name: string | null; brand_slug: string | null; brand_logo: string | null; brand_website: string | null }>();

  if (!row) return err("Product not found", 404);

  // Fetch related images
  const images = await c.env.DB.prepare(
    "SELECT * FROM entity_images WHERE entity_type = 'product' AND entity_id = ? ORDER BY sort_order",
  )
    .bind(row.id)
    .all();

  // Fetch related products (same category, excluding current)
  const related = await c.env.DB.prepare(
    `SELECT p.slug, p.name, p.image_url, p.brand, p.model_number, pc.name as category_name
     FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
     ORDER BY p.sort_order ASC LIMIT 4`,
  )
    .bind(row.category_id, row.id)
    .all();

  return ok({ ...row, images: images.results, related: related.results });
});

/* ───────── Admin CRUD ───────── */

/** POST /api/admin/product-categories */
products.post("/categories", requireAuth, async (c) => {
  const body = await c.req.json<Partial<ProductCategoryRow>>();
  if (!body.slug || !body.name) return err("slug and name are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO product_categories (slug, name, description, image_url, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, 1)`,
  )
    .bind(
      body.slug,
      body.name,
      body.description ?? "",
      body.image_url ?? null,
      body.sort_order ?? 0,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});
/** PUT /api/admin/product-categories/:id */
products.put("/categories/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<ProductCategoryRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.name !== undefined) {
    sets.push("name = ?");
    values.push(body.name);
  }
  if (body.slug !== undefined) {
    sets.push("slug = ?");
    values.push(body.slug);
  }
  if (body.description !== undefined) {
    sets.push("description = ?");
    values.push(body.description);
  }
  if (body.image_url !== undefined) {
    sets.push("image_url = ?");
    values.push(body.image_url);
  }
  if (body.sort_order !== undefined) {
    sets.push("sort_order = ?");
    values.push(body.sort_order);
  }
  if (body.is_active !== undefined) {
    sets.push("is_active = ?");
    values.push(body.is_active);
  }

  if (sets.length === 0) return err("No fields to update");
  values.push(id);

  await c.env.DB.prepare(
    `UPDATE product_categories SET ${sets.join(", ")} WHERE id = ?`,
  )
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/product-categories/:id */
products.delete("/categories/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM product_categories WHERE id = ?")
    .bind(id)
    .run();
  return ok({ deleted: true });
});

/** POST /api/admin/products */
products.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<ProductRow>>();
  if (!body.slug || !body.name || !body.category_id)
    return err("slug, name, and category_id are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO products (category_id, slug, name, description, brand, model_number, image_url, spec_sheet_url, specifications, features, sort_order, is_active, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
  )
    .bind(
      body.category_id,
      body.slug,
      body.name,
      body.description ?? "",
      body.brand ?? "",
      body.model_number ?? "",
      body.image_url ?? null,
      body.spec_sheet_url ?? null,
      body.specifications ?? "{}",
      body.features ?? "[]",
      body.sort_order ?? 0,
      body.meta_title ?? null,
      body.meta_description ?? null,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** PUT /api/admin/products/:id */
products.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<ProductRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  const fields: Array<[keyof ProductRow, string]> = [
    ["name", "name"],
    ["slug", "slug"],
    ["description", "description"],
    ["brand", "brand"],
    ["model_number", "model_number"],
    ["image_url", "image_url"],
    ["spec_sheet_url", "spec_sheet_url"],
    ["specifications", "specifications"],
    ["features", "features"],
    ["category_id", "category_id"],
    ["sort_order", "sort_order"],
    ["is_active", "is_active"],
    ["meta_title", "meta_title"],
    ["meta_description", "meta_description"],
  ];

  for (const [key, col] of fields) {
    if ((body as Record<string, unknown>)[key] !== undefined) {
      sets.push(`${col} = ?`);
      values.push((body as Record<string, unknown>)[key]);
    }
  }

  if (sets.length === 0) return err("No fields to update");
  sets.push("updated_at = datetime('now')");
  values.push(id);

  await c.env.DB.prepare(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/products/:id */
products.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

export default products;
