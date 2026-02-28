import { Hono } from "hono";
import type { Env, PostRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const posts = new Hono<{ Bindings: Env }>();

/** GET /api/posts — list published posts */
posts.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const tag = url.searchParams.get("tag");
  const offset = (page - 1) * limit;

  let where = "WHERE is_published = 1";
  const params: unknown[] = [];

  if (tag) {
    // tags stored as JSON array, e.g. '["camera","an-ninh"]'
    where += " AND tags LIKE ?";
    params.push(`%"${tag}"%`);
  }

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM posts ${where}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const rows = await c.env.DB.prepare(
    `SELECT id, slug, title, excerpt, thumbnail_url, author, tags, published_at
     FROM posts ${where}
     ORDER BY published_at DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all<PostRow>();

  // Parse tags JSON for each row
  const data = rows.results.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags || "[]") as string[],
  }));

  return paginated(data, countResult?.total ?? 0, { page, limit });
});

/** GET /api/admin/posts/all — list ALL posts including unpublished */
posts.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT * FROM posts ORDER BY published_at DESC, created_at DESC",
  ).all<PostRow>();
  return ok(rows.results);
});

/** GET /api/posts/:slug — get full post */
posts.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM posts WHERE slug = ? AND is_published = 1",
  )
    .bind(slug)
    .first<PostRow>();

  if (!row) return err("Post not found", 404);

  return ok({
    ...row,
    tags: JSON.parse(row.tags || "[]") as string[],
  });
});

/** POST /api/admin/posts */
posts.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<PostRow> & { tags?: string[] }>();
  if (!body.slug || !body.title) return err("slug and title are required");

  const tags = JSON.stringify(body.tags ?? []);

  const result = await c.env.DB.prepare(
    `INSERT INTO posts (slug, title, excerpt, content_md, thumbnail_url, author, tags, is_published, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      body.slug,
      body.title,
      body.excerpt ?? "",
      body.content_md ?? null,
      body.thumbnail_url ?? null,
      body.author ?? "SLTECH",
      tags,
      body.is_published ?? 0,
      body.published_at ?? null,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** PUT /api/admin/posts/:id */
posts.put("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<PostRow> & { tags?: string[] }>();

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
  if (body.excerpt !== undefined) {
    sets.push("excerpt = ?");
    values.push(body.excerpt);
  }
  if (body.content_md !== undefined) {
    sets.push("content_md = ?");
    values.push(body.content_md);
  }
  if (body.thumbnail_url !== undefined) {
    sets.push("thumbnail_url = ?");
    values.push(body.thumbnail_url);
  }
  if (body.author !== undefined) {
    sets.push("author = ?");
    values.push(body.author);
  }
  if (body.tags !== undefined) {
    sets.push("tags = ?");
    values.push(JSON.stringify(body.tags));
  }
  if (body.is_published !== undefined) {
    sets.push("is_published = ?");
    values.push(body.is_published);
  }
  if (body.published_at !== undefined) {
    sets.push("published_at = ?");
    values.push(body.published_at);
  }

  if (sets.length === 0) return err("No fields to update");

  sets.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await c.env.DB.prepare(`UPDATE posts SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/posts/:id */
posts.delete("/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return ok({ deleted: true });
});

export default posts;
