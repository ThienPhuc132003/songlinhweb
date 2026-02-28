import { Hono } from "hono";
import type { Env, SolutionRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const solutions = new Hono<{ Bindings: Env }>();

/** GET /api/solutions — list all active solutions */
solutions.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM solutions WHERE is_active = 1 ORDER BY sort_order ASC",
  ).all<SolutionRow>();
  return ok(rows.results);
});

/** GET /api/admin/solutions/all — list ALL solutions including inactive (admin) */
solutions.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM solutions ORDER BY sort_order ASC",
  ).all<SolutionRow>();
  return ok(rows.results);
});

/** GET /api/solutions/:slug — get solution detail */
solutions.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM solutions WHERE slug = ? AND is_active = 1",
  )
    .bind(slug)
    .first<SolutionRow>();

  if (!row) return err("Solution not found", 404);

  // Fetch related images
  const images = await c.env.DB.prepare(
    "SELECT * FROM entity_images WHERE entity_type = 'solution' AND entity_id = ? ORDER BY sort_order",
  )
    .bind(row.id)
    .all();

  return ok({ ...row, images: images.results });
});

/** POST /api/admin/solutions — create solution (admin) */
solutions.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<SolutionRow>>();
  if (!body.slug || !body.title) return err("slug and title are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO solutions (slug, title, description, content_md, icon, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
  )
    .bind(
      body.slug,
      body.title,
      body.description ?? "",
      body.content_md ?? null,
      body.icon ?? "FileCheck",
      body.sort_order ?? 0,
    )
    .run();

  return ok({ id: result.meta.last_row_id }, { total: 1 });
});

/** PUT /api/admin/solutions/:id — update solution (admin) */
solutions.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<SolutionRow>>();

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
  if (body.content_md !== undefined) {
    sets.push("content_md = ?");
    values.push(body.content_md);
  }
  if (body.icon !== undefined) {
    sets.push("icon = ?");
    values.push(body.icon);
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

  sets.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await c.env.DB.prepare(`UPDATE solutions SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/solutions/:id — delete solution (admin) */
solutions.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM solutions WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

export default solutions;
