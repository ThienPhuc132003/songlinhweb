import { Hono } from "hono";
import type { Env, ProjectRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { logAudit } from "../lib/audit";

/** Ensure a value is a valid JSON string, fallback to default */
function safeJson(val: unknown, fallback: string): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') {
    try { JSON.parse(val); return val; } catch { return fallback; }
  }
  // If it's an object/array, serialize it
  try { return JSON.stringify(val); } catch { return fallback; }
}

const projects = new Hono<{ Bindings: Env }>();

/** GET /api/projects — list projects, with optional category, industry filter */
projects.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const category = url.searchParams.get("category");
  const industry = url.searchParams.get("industry");
  const featured = url.searchParams.get("featured");
  const offset = (page - 1) * limit;

  let where = "WHERE is_active = 1 AND deleted_at IS NULL";
  const params: unknown[] = [];

  if (category) {
    where += " AND category = ?";
    params.push(category);
  }
  if (industry) {
    where += " AND client_industry = ?";
    params.push(industry);
  }
  if (featured === "true") {
    where += " AND is_featured = 1";
  }

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM projects ${where}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const rows = await c.env.DB.prepare(
    `SELECT * FROM projects ${where} ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all<ProjectRow>();

  return paginated(rows.results, countResult?.total ?? 0, { page, limit });
});

/** GET /api/admin/projects/all — list ALL projects including inactive */
projects.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC",
  ).all<ProjectRow>();

  const projectIds = rows.results.map((r) => r.id);

  // Batch-fetch junction product IDs for ALL projects (single source of truth)
  const junctionMap = new Map<number, number[]>();
  try {
    const allJunction = await c.env.DB.prepare(
      "SELECT project_id, product_id FROM project_products",
    ).all<{ project_id: number; product_id: number }>();
    for (const j of allJunction.results) {
      if (!junctionMap.has(j.project_id)) junctionMap.set(j.project_id, []);
      junctionMap.get(j.project_id)!.push(j.product_id);
    }
  } catch { /* table may not exist */ }

  // Batch-fetch ALL project images in a SINGLE query (kills N+1)
  const imageMap = new Map<number, Array<{ image_url: string }>>();
  if (projectIds.length > 0) {
    const placeholders = projectIds.map(() => "?").join(",");
    const allImages = await c.env.DB.prepare(
      `SELECT entity_id, image_url FROM entity_images
       WHERE entity_type = 'project' AND entity_id IN (${placeholders})
       ORDER BY sort_order`,
    ).bind(...projectIds).all<{ entity_id: number; image_url: string }>();
    for (const img of allImages.results) {
      if (!imageMap.has(img.entity_id)) imageMap.set(img.entity_id, []);
      imageMap.get(img.entity_id)!.push({ image_url: img.image_url });
    }
  }

  // Map results in memory — NO async, NO extra queries
  const data = rows.results.map((row) => {
    const junctionProducts = junctionMap.get(row.id) || [];
    return {
      ...row,
      related_products: JSON.stringify(junctionProducts),
      images: imageMap.get(row.id) || [],
    };
  });

  return ok(data);
});

/** GET /api/projects/:slug — get project detail with images + linked solutions/products */
projects.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE slug = ? AND is_active = 1 AND deleted_at IS NULL",
  )
    .bind(slug)
    .first<ProjectRow>();

  if (!row) return err("Project not found", 404);

  // Fetch gallery images
  const images = await c.env.DB.prepare(
    "SELECT * FROM entity_images WHERE entity_type = 'project' AND entity_id = ? ORDER BY sort_order",
  )
    .bind(row.id)
    .all();

  // Resolve linked solutions from JSON array of IDs
  let linked_solutions: Array<{ id: number; title: string; slug: string; icon: string }> = [];
  try {
    const solutionIds: number[] = JSON.parse(row.related_solutions || "[]");
    if (solutionIds.length > 0) {
      const placeholders = solutionIds.map(() => "?").join(",");
      const solRows = await c.env.DB.prepare(
        `SELECT id, title, slug, icon FROM solutions WHERE id IN (${placeholders}) AND is_active = 1`,
      )
        .bind(...solutionIds)
        .all<{ id: number; title: string; slug: string; icon: string }>();
      linked_solutions = solRows.results;
    }
  } catch { /* ignore parse errors */ }

  // Resolve linked products from JSON array of IDs
  let linked_products: Array<{ id: number; name: string; slug: string; image_url: string | null; category_name: string | null }> = [];
  try {
    const productIds: number[] = JSON.parse(row.related_products || "[]");
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => "?").join(",");
      const prodRows = await c.env.DB.prepare(
        `SELECT p.id, p.name, p.slug, p.image_url, c.name as category_name
         FROM products p
         LEFT JOIN product_categories c ON p.category_id = c.id
         WHERE p.id IN (${placeholders}) AND p.is_active = 1`,
      )
        .bind(...productIds)
        .all<{ id: number; name: string; slug: string; image_url: string | null; category_name: string | null }>();
      linked_products = prodRows.results;
    }
  } catch { /* ignore parse errors */ }

  return ok({ ...row, images: images.results, linked_solutions, linked_products });
});

/** POST /api/admin/projects */
projects.post("/", requireAuth, async (c) => {
  try {
    const body = await c.req.json<Partial<ProjectRow>>();
    if (!body.slug || !body.title) return err("slug and title are required", 400);

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
      return err("Slug chỉ được chứa chữ thường, số và dấu gạch ngang", 400);
    }

    // Check for duplicate slug
    const existing = await c.env.DB.prepare("SELECT id FROM projects WHERE slug = ?")
      .bind(body.slug)
      .first();
    if (existing) return err(`Slug "${body.slug}" đã tồn tại. Vui lòng chọn slug khác.`, 409);

    const result = await c.env.DB.prepare(
      `INSERT INTO projects (slug, title, description, location, client_name, thumbnail_url, content_md, category, year, sort_order, is_featured, is_active, system_types, brands_used, area_sqm, duration_months, key_metrics, compliance_standards, client_industry, project_scale, meta_title, meta_description, completion_year, related_solutions, related_products, challenges, outcomes, testimonial_name, testimonial_content, video_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        body.slug,
        body.title,
        body.description ?? "",
        body.location ?? "",
        body.client_name ?? null,
        body.thumbnail_url || null,
        body.content_md ?? null,
        body.category ?? "",
        body.year ?? null,
        body.sort_order ?? 0,
        body.is_featured ?? 0,
        safeJson(body.system_types, "[]"),
        safeJson(body.brands_used, "[]"),
        body.area_sqm ?? null,
        body.duration_months ?? null,
        safeJson(body.key_metrics, "{}"),
        safeJson(body.compliance_standards, "[]"),
        body.client_industry ?? null,
        body.project_scale ?? null,
        body.meta_title ?? null,
        body.meta_description ?? null,
        body.completion_year ?? null,
        safeJson(body.related_solutions, "[]"),
        safeJson(body.related_products, "[]"),
        body.challenges ?? null,
        body.outcomes ?? null,
        body.testimonial_name ?? null,
        body.testimonial_content ?? null,
        body.video_url ?? null,
      )
      .run();

    const newId = result.meta.last_row_id;

    // Batch gallery images + junction inserts for transactional integrity
    const batchStmts: ReturnType<typeof c.env.DB.prepare>[] = [];

    const galleryUrls = (body as Record<string, unknown>).gallery_urls as string[] | undefined;
    if (galleryUrls && Array.isArray(galleryUrls) && galleryUrls.length > 0) {
      for (let i = 0; i < galleryUrls.length; i++) {
        batchStmts.push(
          c.env.DB.prepare(
            "INSERT INTO entity_images (entity_type, entity_id, image_url, sort_order) VALUES ('project', ?, ?, ?)",
          ).bind(newId, galleryUrls[i], i),
        );
      }
    }

    // Sync project_products junction table
    try {
      const productIds: number[] = JSON.parse(body.related_products || "[]");
      for (const pid of productIds) {
        batchStmts.push(
          c.env.DB.prepare(
            "INSERT OR IGNORE INTO project_products (project_id, product_id) VALUES (?, ?)",
          ).bind(newId, pid),
        );
      }
    } catch { /* ignore parse errors */ }

    if (batchStmts.length > 0) {
      await c.env.DB.batch(batchStmts);
    }

    logAudit(c.env.DB, 'project', newId as number, 'create', { name: body.title, slug: body.slug });
    return ok({ id: newId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Project CREATE error:", message);

    // Parse D1 column errors
    const colMatch = message.match(/has no column named (\w+)/);
    if (colMatch) {
      return err(`Cột "${colMatch[1]}" chưa tồn tại trong database. Vui lòng chạy migration 0020_project_schema_sync.sql.`, 500);
    }
    return err(`Lỗi tạo dự án: ${message}`, 500);
  }
});

/** PUT /api/admin/projects/:id */
projects.put("/:id", requireAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || isNaN(id)) return err("ID dự án không hợp lệ", 400);

    const body = await c.req.json<Partial<ProjectRow>>();

    // Check project exists
    const existing = await c.env.DB.prepare("SELECT id FROM projects WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return err("Dự án không tồn tại", 404);

    // Check duplicate slug if slug is being changed
    if (body.slug) {
      const slugCheck = await c.env.DB.prepare("SELECT id FROM projects WHERE slug = ? AND id != ?")
        .bind(body.slug, id)
        .first();
      if (slugCheck) return err(`Slug "${body.slug}" đã được sử dụng.`, 409);
    }

    const sets: string[] = [];
    const values: unknown[] = [];

    const fields: Array<[keyof ProjectRow, string]> = [
      ["title", "title"],
      ["slug", "slug"],
      ["description", "description"],
      ["location", "location"],
      ["client_name", "client_name"],
      ["thumbnail_url", "thumbnail_url"],
      ["content_md", "content_md"],
      ["category", "category"],
      ["year", "year"],
      ["sort_order", "sort_order"],
      ["is_featured", "is_featured"],
      ["is_active", "is_active"],
      ["system_types", "system_types"],
      ["brands_used", "brands_used"],
      ["area_sqm", "area_sqm"],
      ["duration_months", "duration_months"],
      ["key_metrics", "key_metrics"],
      ["compliance_standards", "compliance_standards"],
      ["client_industry", "client_industry"],
      ["project_scale", "project_scale"],
      ["meta_title", "meta_title"],
      ["meta_description", "meta_description"],
      ["completion_year", "completion_year"],
      ["related_solutions", "related_solutions"],
      ["related_products", "related_products"],
      ["challenges", "challenges"],
      ["outcomes", "outcomes"],
      ["testimonial_name", "testimonial_name"],
      ["testimonial_content", "testimonial_content"],
      ["video_url", "video_url"],
    ];

    for (const [key, col] of fields) {
      if ((body as Record<string, unknown>)[key] !== undefined) {
        sets.push(`${col} = ?`);
        values.push((body as Record<string, unknown>)[key]);
      }
    }

    // Build batch for gallery + junction sync (transactional)
    const batchStmts: ReturnType<typeof c.env.DB.prepare>[] = [];

    if (sets.length > 0) {
      values.push(id);
      batchStmts.push(
        c.env.DB.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`).bind(...values),
      );
    }

    // Sync gallery images if provided
    const galleryUrls = (body as Record<string, unknown>).gallery_urls as string[] | undefined;
    if (galleryUrls !== undefined) {
      batchStmts.push(
        c.env.DB.prepare(
          "DELETE FROM entity_images WHERE entity_type = 'project' AND entity_id = ?",
        ).bind(id),
      );
      if (Array.isArray(galleryUrls)) {
        for (let i = 0; i < galleryUrls.length; i++) {
          batchStmts.push(
            c.env.DB.prepare(
              "INSERT INTO entity_images (entity_type, entity_id, image_url, sort_order) VALUES ('project', ?, ?, ?)",
            ).bind(id, galleryUrls[i], i),
          );
        }
      }
    }

    // Sync project_products junction table if related_products changed
    if (body.related_products !== undefined) {
      try {
        const productIds: number[] = JSON.parse(body.related_products || "[]");
        batchStmts.push(
          c.env.DB.prepare("DELETE FROM project_products WHERE project_id = ?").bind(id),
        );
        for (const pid of productIds) {
          batchStmts.push(
            c.env.DB.prepare(
              "INSERT OR IGNORE INTO project_products (project_id, product_id) VALUES (?, ?)",
            ).bind(id, pid),
          );
        }
      } catch { /* ignore parse errors */ }
    }

    if (batchStmts.length > 0) {
      await c.env.DB.batch(batchStmts);
    }

    logAudit(c.env.DB, 'project', id, 'update', body as Record<string, unknown>);
    return ok({ id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Project UPDATE error:", message);

    // Parse D1 column errors
    const colMatch = message.match(/has no column named (\w+)/);
    if (colMatch) {
      return err(`Cột "${colMatch[1]}" chưa tồn tại trong database. Vui lòng chạy migration 0020_project_schema_sync.sql.`, 500);
    }
    return err(`Lỗi cập nhật dự án: ${message}`, 500);
  }
});

/** DELETE /api/admin/projects/:id — Soft delete */
projects.delete("/:id", requireAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || isNaN(id)) return err("ID dự án không hợp lệ", 400);

    const existing = await c.env.DB.prepare("SELECT id, title FROM projects WHERE id = ?")
      .bind(id)
      .first<{ id: number; title: string }>();
    if (!existing) return err("Dự án không tồn tại", 404);

    // Soft delete
    await c.env.DB.prepare("UPDATE projects SET deleted_at = datetime('now') WHERE id = ?")
      .bind(id)
      .run();
    logAudit(c.env.DB, 'project', id, 'delete', { name: existing.title });
    return ok({ deleted: true, name: existing.title });
  } catch (e) {
    console.error("Project DELETE error:", e);
    return err(`Lỗi xóa dự án: ${e instanceof Error ? e.message : "Unknown error"}`, 500);
  }
});

/** POST /api/admin/projects/:id/restore — Restore soft-deleted project */
projects.post("/:id/restore", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  if (!id || isNaN(id)) return err("ID không hợp lệ", 400);

  const existing = await c.env.DB.prepare("SELECT id, title, deleted_at FROM projects WHERE id = ?")
    .bind(id)
    .first<{ id: number; title: string; deleted_at: string | null }>();
  if (!existing) return err("Dự án không tồn tại", 404);
  if (!existing.deleted_at) return err("Dự án chưa bị xóa", 400);

  await c.env.DB.prepare("UPDATE projects SET deleted_at = NULL WHERE id = ?")
    .bind(id)
    .run();
  logAudit(c.env.DB, 'project', id, 'restore', { name: existing.title });
  return ok({ restored: true, name: existing.title });
});

export default projects;
