import { Hono } from "hono";
import type { Env, SolutionRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { logAudit } from "../lib/audit";

/** Ensure a value is a valid JSON string, fallback to default */
function safeJson(val: unknown, fallback: string): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") {
    try {
      JSON.parse(val);
      return val;
    } catch {
      return fallback;
    }
  }
  try {
    return JSON.stringify(val);
  } catch {
    return fallback;
  }
}

const solutions = new Hono<{ Bindings: Env }>();

/** GET /api/solutions — list active solutions (paginated, public) */
solutions.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const offset = (page - 1) * limit;

  try {
    // Try the full query with new structured columns
    const countResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as total FROM solutions WHERE is_active = 1 AND deleted_at IS NULL",
    ).first<{ total: number }>();

    const rows = await c.env.DB.prepare(
      `SELECT id, slug, title, description, excerpt, content_md, icon,
              hero_image_url, features, applications,
              sort_order, is_active, meta_title, meta_description,
              created_at, updated_at
       FROM solutions
       WHERE is_active = 1 AND deleted_at IS NULL
       ORDER BY sort_order ASC, created_at DESC
       LIMIT ? OFFSET ?`,
    )
      .bind(limit, offset)
      .all<SolutionRow>();

    return paginated(rows.results, countResult?.total ?? 0, { page, limit });
  } catch {
    // Fallback: migration 0033 not yet applied — use basic columns only
    console.warn("[solutions] Fallback query — new columns not yet available. Run migration 0033.");
    const countResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as total FROM solutions WHERE is_active = 1",
    ).first<{ total: number }>();

    const rows = await c.env.DB.prepare(
      `SELECT id, slug, title, description, content_md, icon,
              sort_order, is_active, created_at, updated_at
       FROM solutions
       WHERE is_active = 1
       ORDER BY sort_order ASC, created_at DESC
       LIMIT ? OFFSET ?`,
    )
      .bind(limit, offset)
      .all();

    // Map to full shape with defaults for missing columns
    const items = rows.results.map((r: Record<string, unknown>) => ({
      ...r,
      excerpt: "",
      hero_image_url: null,
      features: "[]",
      applications: "[]",
      meta_title: null,
      meta_description: null,
      deleted_at: null,
    }));

    return paginated(items, countResult?.total ?? 0, { page, limit });
  }
});

/** GET /api/admin/solutions/all — list ALL solutions (admin, includes inactive/deleted) */
solutions.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM solutions WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC",
  ).all<SolutionRow>();

  return ok(rows.results);
});

/** GET /api/solutions/:slug — single solution by slug (public) */
solutions.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  try {
    const row = await c.env.DB.prepare(
      "SELECT * FROM solutions WHERE slug = ? AND is_active = 1 AND deleted_at IS NULL",
    )
      .bind(slug)
      .first<SolutionRow>();

    if (!row) return err("Solution not found", 404);

    // Fetch entity images for this solution
    const images = await c.env.DB.prepare(
      "SELECT * FROM entity_images WHERE entity_type = 'solution' AND entity_id = ? ORDER BY sort_order",
    )
      .bind(row.id)
      .all();

    return ok({ ...row, images: images.results });
  } catch {
    // Fallback: migration not yet applied
    console.warn("[solutions] Fallback detail query for slug:", slug);
    const row = await c.env.DB.prepare(
      "SELECT * FROM solutions WHERE slug = ? AND is_active = 1",
    )
      .bind(slug)
      .first();

    if (!row) return err("Solution not found", 404);

    return ok({
      ...row,
      excerpt: "",
      hero_image_url: null,
      features: "[]",
      applications: "[]",
      meta_title: null,
      meta_description: null,
      deleted_at: null,
      images: [],
    });
  }
});

/** POST /api/admin/solutions — create new solution */
solutions.post("/", requireAuth, async (c) => {
  try {
    const body = await c.req.json<Partial<SolutionRow>>();
    if (!body.slug || !body.title) return err("slug and title are required", 400);

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
      return err("Slug chỉ được chứa chữ thường, số và dấu gạch ngang", 400);
    }

    // Check duplicate slug
    const existing = await c.env.DB.prepare("SELECT id FROM solutions WHERE slug = ?")
      .bind(body.slug)
      .first();
    if (existing) return err(`Slug "${body.slug}" đã tồn tại. Vui lòng chọn slug khác.`, 409);

    const result = await c.env.DB.prepare(
      `INSERT INTO solutions (slug, title, description, excerpt, content_md, icon,
                              hero_image_url, features, applications,
                              sort_order, is_active, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    )
      .bind(
        body.slug,
        body.title,
        body.description ?? "",
        body.excerpt ?? "",
        body.content_md ?? null,
        body.icon ?? "FileCheck",
        body.hero_image_url ?? null,
        safeJson(body.features, "[]"),
        safeJson(body.applications, "[]"),
        body.sort_order ?? 0,
        body.meta_title ?? null,
        body.meta_description ?? null,
      )
      .run();

    const newId = result.meta.last_row_id;
    logAudit(c.env.DB, "solution", newId as number, "create", { name: body.title, slug: body.slug });
    return ok({ id: newId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Solution CREATE error:", message);

    const colMatch = message.match(/has no column named (\w+)/);
    if (colMatch) {
      return err(`Cột "${colMatch[1]}" chưa tồn tại trong database. Vui lòng chạy migration 0033.`, 500);
    }
    return err(`Lỗi tạo giải pháp: ${message}`, 500);
  }
});

/** PUT /api/admin/solutions/:id — update solution */
solutions.put("/:id", requireAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || isNaN(id)) return err("ID không hợp lệ", 400);

    const body = await c.req.json<Partial<SolutionRow>>();

    // Check exists
    const existing = await c.env.DB.prepare("SELECT id FROM solutions WHERE id = ?")
      .bind(id)
      .first();
    if (!existing) return err("Giải pháp không tồn tại", 404);

    // Check duplicate slug if slug changed
    if (body.slug) {
      const slugCheck = await c.env.DB.prepare("SELECT id FROM solutions WHERE slug = ? AND id != ?")
        .bind(body.slug, id)
        .first();
      if (slugCheck) return err(`Slug "${body.slug}" đã được sử dụng.`, 409);
    }

    const sets: string[] = [];
    const values: unknown[] = [];

    const fields: Array<[keyof SolutionRow, string]> = [
      ["title", "title"],
      ["slug", "slug"],
      ["description", "description"],
      ["excerpt", "excerpt"],
      ["content_md", "content_md"],
      ["icon", "icon"],
      ["hero_image_url", "hero_image_url"],
      ["features", "features"],
      ["applications", "applications"],
      ["sort_order", "sort_order"],
      ["is_active", "is_active"],
      ["meta_title", "meta_title"],
      ["meta_description", "meta_description"],
    ];

    for (const [key, col] of fields) {
      if ((body as Record<string, unknown>)[key] !== undefined) {
        // Ensure JSON fields are valid
        if (key === "features" || key === "applications") {
          sets.push(`${col} = ?`);
          values.push(safeJson((body as Record<string, unknown>)[key], "[]"));
        } else {
          sets.push(`${col} = ?`);
          values.push((body as Record<string, unknown>)[key]);
        }
      }
    }

    if (sets.length > 0) {
      sets.push("updated_at = datetime('now')");
      values.push(id);
      await c.env.DB.prepare(
        `UPDATE solutions SET ${sets.join(", ")} WHERE id = ?`,
      )
        .bind(...values)
        .run();
    }

    logAudit(c.env.DB, "solution", id, "update", body as Record<string, unknown>);
    return ok({ id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Solution UPDATE error:", message);

    const colMatch = message.match(/has no column named (\w+)/);
    if (colMatch) {
      return err(`Cột "${colMatch[1]}" chưa tồn tại trong database. Vui lòng chạy migration 0033.`, 500);
    }
    return err(`Lỗi cập nhật giải pháp: ${message}`, 500);
  }
});

/** DELETE /api/admin/solutions/:id — Soft delete */
solutions.delete("/:id", requireAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (!id || isNaN(id)) return err("ID không hợp lệ", 400);

    const existing = await c.env.DB.prepare("SELECT id, title FROM solutions WHERE id = ?")
      .bind(id)
      .first<{ id: number; title: string }>();
    if (!existing) return err("Giải pháp không tồn tại", 404);

    await c.env.DB.prepare("UPDATE solutions SET deleted_at = datetime('now') WHERE id = ?")
      .bind(id)
      .run();
    logAudit(c.env.DB, "solution", id, "delete", { name: existing.title });
    return ok({ deleted: true, name: existing.title });
  } catch (e) {
    console.error("Solution DELETE error:", e);
    return err(`Lỗi xóa giải pháp: ${e instanceof Error ? e.message : "Unknown error"}`, 500);
  }
});

/** POST /api/admin/solutions/:id/restore — Restore soft-deleted */
solutions.post("/:id/restore", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  if (!id || isNaN(id)) return err("ID không hợp lệ", 400);

  const existing = await c.env.DB.prepare("SELECT id, title, deleted_at FROM solutions WHERE id = ?")
    .bind(id)
    .first<{ id: number; title: string; deleted_at: string | null }>();
  if (!existing) return err("Giải pháp không tồn tại", 404);
  if (!existing.deleted_at) return err("Giải pháp chưa bị xóa", 400);

  await c.env.DB.prepare("UPDATE solutions SET deleted_at = NULL WHERE id = ?")
    .bind(id)
    .run();
  logAudit(c.env.DB, "solution", id, "restore", { name: existing.title });
  return ok({ restored: true, name: existing.title });
});

export default solutions;
