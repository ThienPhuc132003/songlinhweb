import { Hono } from "hono";
import type { Env, ProjectRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const projects = new Hono<{ Bindings: Env }>();

/** GET /api/projects — list projects, with optional category filter */
projects.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");
  const offset = (page - 1) * limit;

  let where = "WHERE is_active = 1";
  const params: unknown[] = [];

  if (category) {
    where += " AND category = ?";
    params.push(category);
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
  return ok(rows.results);
});

/** GET /api/projects/:slug — get project detail with images */
projects.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE slug = ? AND is_active = 1",
  )
    .bind(slug)
    .first<ProjectRow>();

  if (!row) return err("Project not found", 404);

  const images = await c.env.DB.prepare(
    "SELECT * FROM entity_images WHERE entity_type = 'project' AND entity_id = ? ORDER BY sort_order",
  )
    .bind(row.id)
    .all();

  return ok({ ...row, images: images.results });
});

/** POST /api/admin/projects */
projects.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<ProjectRow>>();
  if (!body.slug || !body.title) return err("slug and title are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO projects (slug, title, description, location, client_name, thumbnail_url, content_md, category, year, sort_order, is_featured, is_active, system_types, brands_used, area_sqm, duration_months, key_metrics, compliance_standards, client_industry, project_scale)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      body.slug,
      body.title,
      body.description ?? "",
      body.location ?? "",
      body.client_name ?? null,
      body.thumbnail_url ?? null,
      body.content_md ?? null,
      body.category ?? "",
      body.year ?? null,
      body.sort_order ?? 0,
      body.is_featured ?? 0,
      body.system_types ?? "[]",
      body.brands_used ?? "[]",
      body.area_sqm ?? null,
      body.duration_months ?? null,
      body.key_metrics ?? "{}",
      body.compliance_standards ?? "[]",
      body.client_industry ?? null,
      body.project_scale ?? null,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** PUT /api/admin/projects/:id */
projects.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<ProjectRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.title !== undefined) {
    sets.push("title = ?");
    values.push(body.title);
  }
  if (body.slug !== undefined) {
    sets.push("slug = ?");
    values.push(body.slug);
  }
  if (body.description !== undefined) {
    sets.push("description = ?");
    values.push(body.description);
  }
  if (body.location !== undefined) {
    sets.push("location = ?");
    values.push(body.location);
  }
  if (body.client_name !== undefined) {
    sets.push("client_name = ?");
    values.push(body.client_name);
  }
  if (body.thumbnail_url !== undefined) {
    sets.push("thumbnail_url = ?");
    values.push(body.thumbnail_url);
  }
  if (body.category !== undefined) {
    sets.push("category = ?");
    values.push(body.category);
  }
  if (body.year !== undefined) {
    sets.push("year = ?");
    values.push(body.year);
  }
  if (body.sort_order !== undefined) {
    sets.push("sort_order = ?");
    values.push(body.sort_order);
  }
  if (body.is_featured !== undefined) {
    sets.push("is_featured = ?");
    values.push(body.is_featured);
  }
  if (body.is_active !== undefined) {
    sets.push("is_active = ?");
    values.push(body.is_active);
  }
  // Case study metadata fields
  if (body.system_types !== undefined) {
    sets.push("system_types = ?");
    values.push(body.system_types);
  }
  if (body.brands_used !== undefined) {
    sets.push("brands_used = ?");
    values.push(body.brands_used);
  }
  if (body.area_sqm !== undefined) {
    sets.push("area_sqm = ?");
    values.push(body.area_sqm);
  }
  if (body.duration_months !== undefined) {
    sets.push("duration_months = ?");
    values.push(body.duration_months);
  }
  if (body.key_metrics !== undefined) {
    sets.push("key_metrics = ?");
    values.push(body.key_metrics);
  }
  if (body.compliance_standards !== undefined) {
    sets.push("compliance_standards = ?");
    values.push(body.compliance_standards);
  }
  if (body.client_industry !== undefined) {
    sets.push("client_industry = ?");
    values.push(body.client_industry);
  }
  if (body.project_scale !== undefined) {
    sets.push("project_scale = ?");
    values.push(body.project_scale);
  }

  if (sets.length === 0) return err("No fields to update");
  values.push(id);

  await c.env.DB.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/projects/:id */
projects.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

export default projects;
