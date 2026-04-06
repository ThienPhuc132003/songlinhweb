import { Hono } from "hono";
import type { Env, ProductCategoryRow, ProductRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { logAudit } from "../lib/audit";

const products = new Hono<{ Bindings: Env }>();

/* ───────── Categories ───────── */

/** GET /api/product-categories — list active categories */
products.get("/categories", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT pc.*, COUNT(p.id) as product_count
     FROM product_categories pc
     LEFT JOIN products p ON p.category_id = pc.id AND p.is_active = 1 AND p.deleted_at IS NULL
     WHERE pc.is_active = 1
     GROUP BY pc.id
     ORDER BY pc.sort_order ASC`,
  ).all<ProductCategoryRow & { product_count: number }>();
  return ok(rows.results);
});

/** GET /api/admin/products/categories/all — list ALL categories (admin) */
products.get("/categories/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT pc.id, pc.slug, pc.name, pc.description, pc.image_url, 
            pc.parent_id, pc.sort_order, pc.is_active,
            (SELECT COUNT(*) FROM products WHERE category_id = pc.id) as product_count,
            (SELECT name FROM product_categories WHERE id = pc.parent_id) as parent_name
     FROM product_categories pc
     ORDER BY pc.sort_order ASC`,
  ).all<ProductCategoryRow & { product_count: number; parent_name: string | null }>();
  return ok(rows.results);
});

/* ───────── Products ───────── */

/** GET /api/products — list products with optional category, brand, search, tag filters */
products.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const category = url.searchParams.get("category");
  const brand = url.searchParams.get("brand");
  const search = url.searchParams.get("search");
  const tags = url.searchParams.getAll("tag"); // feature slugs
  const offset = (page - 1) * limit;

  let where = "WHERE p.is_active = 1 AND p.deleted_at IS NULL";
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
  // Server-side tag filtering: product must have ALL specified feature slugs
  if (tags.length > 0) {
    where += ` AND (
      SELECT COUNT(DISTINCT pf_tag.slug)
      FROM product_to_features ptf_tag
      JOIN product_features pf_tag ON pf_tag.id = ptf_tag.feature_id
      WHERE ptf_tag.product_id = p.id AND pf_tag.slug IN (${tags.map(() => "?").join(",")})
    ) = ?`;
    params.push(...tags, tags.length);
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

  // Batch-fetch features for returned products (same pattern as admin endpoint)
  const productIds = rows.results.map((r) => r.id);
  let featureMap = new Map<number, Array<{ id: number; name: string; slug: string; group_name: string; color: string | null; icon: string | null; is_priority: number }>>();

  if (productIds.length > 0) {
    const allFeatures = await c.env.DB.prepare(
      `SELECT ptf.product_id, pf.id, pf.name, pf.slug, pf.group_name, pf.color, pf.icon, pf.is_priority
       FROM product_to_features ptf
       JOIN product_features pf ON pf.id = ptf.feature_id
       WHERE ptf.product_id IN (${productIds.map(() => "?").join(",")}) AND pf.is_active = 1
       ORDER BY pf.is_priority DESC, pf.group_name ASC, pf.sort_order ASC`,
    )
      .bind(...productIds)
      .all<{ product_id: number; id: number; name: string; slug: string; group_name: string; color: string | null; icon: string | null; is_priority: number }>();

    for (const f of allFeatures.results) {
      if (!featureMap.has(f.product_id)) featureMap.set(f.product_id, []);
      featureMap.get(f.product_id)!.push({ id: f.id, name: f.name, slug: f.slug, group_name: f.group_name, color: f.color, icon: f.icon, is_priority: f.is_priority });
    }
  }

  const enriched = rows.results.map((r) => ({
    ...r,
    product_features: featureMap.get(r.id) || [],
  }));

  return paginated(enriched, countResult?.total ?? 0, { page, limit });
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
    `SELECT p.*, pc.name as category_name, pc.slug as category_slug,
            b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo
     FROM products p
     LEFT JOIN product_categories pc ON pc.id = p.category_id
     LEFT JOIN brands b ON b.id = p.brand_id
     ORDER BY p.sort_order ASC`,
  ).all<ProductRow & { category_name: string; category_slug: string; brand_name: string | null; brand_slug: string | null; brand_logo: string | null }>();

  // Fetch features for all products in one batch
  const allFeatures = await c.env.DB.prepare(
    `SELECT ptf.product_id, pf.id, pf.name, pf.slug, pf.group_name, pf.color, pf.icon, pf.is_priority
     FROM product_to_features ptf
     JOIN product_features pf ON pf.id = ptf.feature_id
     ORDER BY pf.is_priority DESC, pf.group_name ASC, pf.sort_order ASC`,
  ).all<{ product_id: number; id: number; name: string; slug: string; group_name: string; color: string | null; icon: string | null; is_priority: number }>();

  // Group features by product_id
  const featureMap = new Map<number, Array<{ id: number; name: string; slug: string; group_name: string; color: string | null; icon: string | null; is_priority: number }>>();
  for (const f of allFeatures.results) {
    if (!featureMap.has(f.product_id)) featureMap.set(f.product_id, []);
    featureMap.get(f.product_id)!.push({ id: f.id, name: f.name, slug: f.slug, group_name: f.group_name, color: f.color, icon: f.icon, is_priority: f.is_priority });
  }

  const enriched = rows.results.map((r) => ({
    ...r,
    product_features: featureMap.get(r.id) || [],
  }));

  return ok(enriched);
});

/** GET /api/products/compare?ids=1,2,3 — compare multiple products */
products.get("/compare", async (c) => {
  const idsParam = new URL(c.req.url).searchParams.get("ids");
  if (!idsParam) return err("ids parameter required", 400);
  const ids = idsParam.split(",").map(Number).filter(Boolean).slice(0, 5);
  if (ids.length < 2) return err("At least 2 product IDs required", 400);

  const placeholders = ids.map(() => "?").join(",");
  const rows = await c.env.DB.prepare(
    `SELECT p.*, pc.name as category_name, pc.slug as category_slug,
            b.name as brand_name, b.slug as brand_slug, b.logo_url as brand_logo
     FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     LEFT JOIN brands b ON b.id = p.brand_id
     WHERE p.id IN (${placeholders}) AND p.is_active = 1 AND p.deleted_at IS NULL`,
  ).bind(...ids).all<ProductRow & { category_name: string; category_slug: string; brand_name: string | null; brand_slug: string | null; brand_logo: string | null }>();

  // Batch-fetch features
  const pids = rows.results.map((r) => r.id);
  const featureRows = pids.length > 0
    ? await c.env.DB.prepare(
        `SELECT ptf.product_id, pf.id, pf.name, pf.slug, pf.group_name, pf.color, pf.icon, pf.is_priority
         FROM product_to_features ptf
         JOIN product_features pf ON pf.id = ptf.feature_id
         WHERE ptf.product_id IN (${pids.map(() => "?").join(",")}) AND pf.is_active = 1`,
      ).bind(...pids).all<{ product_id: number; id: number; name: string; slug: string; group_name: string; color: string | null; icon: string | null; is_priority: number }>()
    : { results: [] as Array<{ product_id: number; id: number; name: string; slug: string; group_name: string; color: string | null; icon: string | null; is_priority: number }> };

  const fmap = new Map<number, typeof featureRows.results>();
  for (const f of featureRows.results) {
    if (!fmap.has(f.product_id)) fmap.set(f.product_id, []);
    fmap.get(f.product_id)!.push(f);
  }

  const enriched = rows.results.map((r) => ({
    ...r,
    product_features: fmap.get(r.id) || [],
  }));

  return ok(enriched);
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
     WHERE p.slug = ? AND p.is_active = 1 AND p.deleted_at IS NULL`,
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

  // Fetch assigned features
  const productFeatures = await c.env.DB.prepare(
    `SELECT pf.id, pf.name, pf.slug, pf.group_name, pf.color, pf.icon, pf.is_priority
     FROM product_features pf
     JOIN product_to_features ptf ON ptf.feature_id = pf.id
     WHERE ptf.product_id = ? AND pf.is_active = 1
     ORDER BY pf.is_priority DESC, pf.group_name ASC, pf.sort_order ASC`,
  )
    .bind(row.id)
    .all();

  // Fetch related products (same category, excluding current)
  const related = await c.env.DB.prepare(
    `SELECT p.slug, p.name, p.image_url, p.brand, p.model_number, pc.name as category_name
     FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1 AND p.deleted_at IS NULL
     ORDER BY p.sort_order ASC LIMIT 4`,
  )
    .bind(row.category_id, row.id)
    .all();

  // Fetch linked projects (social proof via project_products junction table)
  let linkedProjects: { slug: string; title: string; thumbnail_url: string | null; client_name: string | null; location: string }[] = [];
  try {
    const projectRows = await c.env.DB.prepare(
      `SELECT pr.slug, pr.title, pr.thumbnail_url, pr.client_name, pr.location
       FROM projects pr
       JOIN project_products pp ON pp.project_id = pr.id
       WHERE pp.product_id = ? AND pr.is_active = 1
       ORDER BY pr.sort_order ASC LIMIT 5`,
    ).bind(row.id).all<{ slug: string; title: string; thumbnail_url: string | null; client_name: string | null; location: string }>();
    linkedProjects = projectRows.results;
  } catch {
    // project_products table may not exist yet — fail silently
  }

  return ok({ ...row, images: images.results, related: related.results, product_features: productFeatures.results, linked_projects: linkedProjects });
});

/* ───────── Admin CRUD ───────── */

/** POST /api/admin/product-categories */
products.post("/categories", requireAuth, async (c) => {
  const body = await c.req.json<Partial<ProductCategoryRow>>();
  if (!body.slug || !body.name) return err("slug and name are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO product_categories (slug, name, description, image_url, parent_id, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
  )
    .bind(
      body.slug,
      body.name,
      body.description ?? "",
      body.image_url ?? null,
      body.parent_id ?? null,
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
  if (body.parent_id !== undefined) {
    sets.push("parent_id = ?");
    values.push(body.parent_id);
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

  // Deletion constraint: check for linked products
  const count = await c.env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM products WHERE category_id = ? AND deleted_at IS NULL",
  ).bind(id).first<{ cnt: number }>();
  if (count && count.cnt > 0) {
    return err(`Không thể xóa danh mục đang có ${count.cnt} sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước.`, 409);
  }

  await c.env.DB.prepare("DELETE FROM product_categories WHERE id = ?")
    .bind(id)
    .run();
  logAudit(c.env.DB, 'category', id, 'delete');
  return ok({ deleted: true });
});

/** POST /api/admin/products */
products.post("/", requireAuth, async (c) => {
  try {
    const body = await c.req.json<Partial<ProductRow>>();
    if (!body.slug || !body.name || !body.category_id)
      return err("Thiếu thông tin bắt buộc: slug, tên sản phẩm, và danh mục", 400);

    // Check for duplicate slug
    const existing = await c.env.DB.prepare("SELECT id FROM products WHERE slug = ?")
      .bind(body.slug)
      .first();
    if (existing) return err(`Slug "${body.slug}" đã tồn tại. Vui lòng chọn slug khác.`, 409);

    // Try full INSERT with all B2B columns first
    try {
      const result = await c.env.DB.prepare(
        `INSERT INTO products (category_id, brand_id, slug, name, description, brand, model_number, image_url, gallery_urls, spec_sheet_url, specifications, features, inventory_status, warranty, sort_order, is_active, meta_title, meta_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      )
        .bind(
          body.category_id,
          body.brand_id ?? null,
          body.slug,
          body.name,
          body.description ?? "",
          body.brand ?? "",
          body.model_number ?? "",
          body.image_url ?? null,
          body.gallery_urls ?? "[]",
          body.spec_sheet_url ?? null,
          body.specifications ?? "{}",
          body.features ?? "[]",
          body.inventory_status ?? "in-stock",
          body.warranty ?? "",
          body.sort_order ?? 0,
          body.meta_title ?? null,
          body.meta_description ?? null,
        )
        .run();
      const newId = result.meta.last_row_id;
      // Sync feature assignments if provided
      const featureIds = (body as Record<string, unknown>).feature_ids as number[] | undefined;
      if (featureIds && Array.isArray(featureIds) && featureIds.length > 0) {
        const placeholders = featureIds.map(() => "(?, ?)").join(", ");
        const vals = featureIds.flatMap((fid: number) => [newId, fid]);
        await c.env.DB.prepare(
          `INSERT INTO product_to_features (product_id, feature_id) VALUES ${placeholders}`,
        ).bind(...vals).run();
      }
      logAudit(c.env.DB, 'product', newId as number, 'create', { name: body.name, slug: body.slug });
      return ok({ id: newId });
    } catch {
      // Fallback: core columns only (migration 0010 not yet applied)
      const result = await c.env.DB.prepare(
        `INSERT INTO products (category_id, brand_id, slug, name, description, brand, model_number, image_url, spec_sheet_url, specifications, features, sort_order, is_active, meta_title, meta_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      )
        .bind(
          body.category_id,
          body.brand_id ?? null,
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
    }
  } catch (e) {
    console.error("Product CREATE error:", e);
    return err(`Lỗi tạo sản phẩm: ${e instanceof Error ? e.message : "Unknown error"}`, 500);
  }
});

/** PUT /api/admin/products/:id */
products.put("/:id", requireAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || isNaN(id)) return err("ID sản phẩm không hợp lệ", 400);

    const body = await c.req.json<Partial<ProductRow>>();

    // Check product exists
    const existing = await c.env.DB.prepare("SELECT id FROM products WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return err("Sản phẩm không tồn tại", 404);

    // Check duplicate slug if slug is being changed
    if (body.slug) {
      const slugCheck = await c.env.DB.prepare("SELECT id FROM products WHERE slug = ? AND id != ?")
        .bind(body.slug, id)
        .first();
      if (slugCheck) return err(`Slug "${body.slug}" đã được sử dụng bởi sản phẩm khác.`, 409);
    }

    const sets: string[] = [];
    const values: unknown[] = [];

    const fields: Array<[keyof ProductRow, string]> = [
      ["name", "name"],
      ["slug", "slug"],
      ["description", "description"],
      ["brand", "brand"],
      ["brand_id", "brand_id"],
      ["model_number", "model_number"],
      ["image_url", "image_url"],
      ["gallery_urls", "gallery_urls"],
      ["spec_sheet_url", "spec_sheet_url"],
      ["specifications", "specifications"],
      ["features", "features"],
      ["inventory_status", "inventory_status"],
      ["warranty", "warranty"],
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

    if (sets.length === 0) return err("Không có trường nào để cập nhật", 400);
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await c.env.DB.prepare(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    // Sync feature assignments if provided
    if ((body as Record<string, unknown>).feature_ids !== undefined) {
      const featureIds = (body as Record<string, unknown>).feature_ids as number[];
      await c.env.DB.prepare("DELETE FROM product_to_features WHERE product_id = ?").bind(id).run();
      if (featureIds && featureIds.length > 0) {
        const placeholders = featureIds.map(() => "(?, ?)").join(", ");
        const vals = featureIds.flatMap((fid) => [id, fid]);
        await c.env.DB.prepare(
          `INSERT INTO product_to_features (product_id, feature_id) VALUES ${placeholders}`,
        ).bind(...vals).run();
      }
    }

    logAudit(c.env.DB, 'product', id, 'update', body as Record<string, unknown>);
    return ok({ id });
  } catch (e) {
    console.error("Product UPDATE error:", e);
    return err(`Lỗi cập nhật sản phẩm: ${e instanceof Error ? e.message : "Unknown error"}`, 500);
  }
});

/** DELETE /api/admin/products/:id — Soft delete */
products.delete("/:id", requireAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || isNaN(id)) return err("ID sản phẩm không hợp lệ", 400);

    const existing = await c.env.DB.prepare("SELECT id, name FROM products WHERE id = ?")
      .bind(id)
      .first<{ id: number; name: string }>();
    if (!existing) return err("Sản phẩm không tồn tại", 404);

    // Soft delete instead of hard delete
    await c.env.DB.prepare("UPDATE products SET deleted_at = datetime('now') WHERE id = ?")
      .bind(id)
      .run();
    logAudit(c.env.DB, 'product', id, 'delete', { name: existing.name });
    return ok({ deleted: true, name: existing.name });
  } catch (e) {
    console.error("Product DELETE error:", e);
    return err(`Lỗi xóa sản phẩm: ${e instanceof Error ? e.message : "Unknown error"}`, 500);
  }
});

/** POST /api/admin/products/:id/restore — Restore soft-deleted product */
products.post("/:id/restore", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  if (!id || isNaN(id)) return err("ID không hợp lệ", 400);

  const existing = await c.env.DB.prepare("SELECT id, name, deleted_at FROM products WHERE id = ?")
    .bind(id)
    .first<{ id: number; name: string; deleted_at: string | null }>();
  if (!existing) return err("Sản phẩm không tồn tại", 404);
  if (!existing.deleted_at) return err("Sản phẩm chưa bị xóa", 400);

  await c.env.DB.prepare("UPDATE products SET deleted_at = NULL WHERE id = ?")
    .bind(id)
    .run();
  logAudit(c.env.DB, 'product', id, 'restore', { name: existing.name });
  return ok({ restored: true, name: existing.name });
});

/** POST /api/admin/products/bulk — Bulk actions */
products.post("/bulk", requireAuth, async (c) => {
  try {
    const body = await c.req.json<{ action: string; product_ids: number[]; value?: unknown }>();
    const { action, product_ids, value } = body;

    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return err("Vui lòng chọn ít nhất 1 sản phẩm", 400);
    }

    const placeholders = product_ids.map(() => "?").join(",");

    switch (action) {
      case "update-status": {
        const isActive = value === "active" ? 1 : 0;
        await c.env.DB.prepare(
          `UPDATE products SET is_active = ?, updated_at = datetime('now') WHERE id IN (${placeholders})`,
        ).bind(isActive, ...product_ids).run();
        for (const pid of product_ids) logAudit(c.env.DB, 'product', pid, 'bulk-update', { is_active: isActive });
        break;
      }
      case "change-category": {
        const categoryId = Number(value);
        if (!categoryId) return err("Danh mục không hợp lệ", 400);
        await c.env.DB.prepare(
          `UPDATE products SET category_id = ?, updated_at = datetime('now') WHERE id IN (${placeholders})`,
        ).bind(categoryId, ...product_ids).run();
        for (const pid of product_ids) logAudit(c.env.DB, 'product', pid, 'bulk-update', { category_id: categoryId });
        break;
      }
      case "delete": {
        await c.env.DB.prepare(
          `UPDATE products SET deleted_at = datetime('now') WHERE id IN (${placeholders})`,
        ).bind(...product_ids).run();
        for (const pid of product_ids) logAudit(c.env.DB, 'product', pid, 'bulk-delete');
        break;
      }
      default:
        return err(`Hành động không hợp lệ: ${action}`, 400);
    }

    return ok({ affected: product_ids.length });
  } catch (e) {
    console.error("Bulk action error:", e);
    return err(`Lỗi bulk action: ${e instanceof Error ? e.message : "Unknown error"}`, 500);
  }
});

export default products;
