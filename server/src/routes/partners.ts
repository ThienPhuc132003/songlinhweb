import { Hono } from "hono";
import type { Env, PartnerRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";
import { buildDynamicUpdate } from "../lib/query-builder";

const partners = new Hono<{ Bindings: Env }>();

/** GET /api/partners — list active partners */
partners.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM partners WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order ASC",
  ).all<PartnerRow>();

  return ok(rows.results);
});

/** GET /api/admin/partners/all — list ALL partners including inactive */
partners.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM partners WHERE deleted_at IS NULL ORDER BY sort_order ASC",
  ).all<PartnerRow>();
  return ok(rows.results);
});

/** POST /api/admin/partners */
partners.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<PartnerRow>>();
  if (!body.name) return err("name is required");

  const result = await c.env.DB.prepare(
    `INSERT INTO partners (name, logo_url, website_url, sort_order, is_active)
     VALUES (?, ?, ?, ?, 1)`,
  )
    .bind(
      body.name,
      body.logo_url ?? null,
      body.website_url ?? null,
      body.sort_order ?? 0,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** PUT /api/admin/partners/:id */
partners.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<PartnerRow>>();

  const { sets, values } = buildDynamicUpdate(body as Record<string, unknown>, [
    "name", "logo_url", "website_url", "sort_order", "is_active",
  ]);

  if (sets.length === 0) return err("No fields to update");
  values.push(id);

  await c.env.DB.prepare(`UPDATE partners SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/partners/:id — soft delete */
partners.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("UPDATE partners SET deleted_at = datetime('now') WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

export default partners;
