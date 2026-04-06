import { Hono } from "hono";
import type { Env, PostRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const posts = new Hono<{ Bindings: Env }>();

/** Calculate reading time from markdown content */
function calcReadingTime(content: string | null): number {
  if (!content) return 0;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** GET /api/posts — list published posts (with category + search filters) */
posts.get("/", async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const tag = url.searchParams.get("tag");
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");
  const search = url.searchParams.get("search");
  const offset = (page - 1) * limit;

  let where = "WHERE (status = 'published' OR is_published = 1)";
  const params: unknown[] = [];

  if (tag) {
    where += " AND tags LIKE ?";
    params.push(`%"${tag}"%`);
  }

  if (category && category !== "all") {
    where += " AND category = ?";
    params.push(category);
  }

  if (featured === "true") {
    where += " AND is_featured = 1";
  }

  if (search) {
    where += " AND (title LIKE ? OR excerpt LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM posts ${where}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const rows = await c.env.DB.prepare(
    `SELECT id, slug, title, excerpt, thumbnail_url, author, tags, 
            category, is_featured, view_count, reading_time_min,
            published_at, created_at
     FROM posts ${where}
     ORDER BY is_featured DESC, published_at DESC, created_at DESC
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
    "SELECT * FROM posts ORDER BY is_featured DESC, published_at DESC, created_at DESC",
  ).all<PostRow>();
  return ok(rows.results);
});

/** GET /api/posts/:slug — get full post + increment view count */
posts.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await c.env.DB.prepare(
    "SELECT * FROM posts WHERE slug = ? AND (status = 'published' OR is_published = 1)",
  )
    .bind(slug)
    .first<PostRow>();

  if (!row) return err("Post not found", 404);

  // Increment view count (fire and forget)
  c.executionCtx.waitUntil(
    c.env.DB.prepare("UPDATE posts SET view_count = view_count + 1 WHERE id = ?")
      .bind(row.id)
      .run(),
  );

  // Get related posts (same category, excluding current, max 3)
  const relatedRows = await c.env.DB.prepare(
    `SELECT id, slug, title, excerpt, thumbnail_url, author, tags, 
            category, reading_time_min, published_at, created_at
     FROM posts 
     WHERE (status = 'published' OR is_published = 1) 
       AND id != ? 
       AND category = ?
     ORDER BY published_at DESC
     LIMIT 3`,
  )
    .bind(row.id, row.category || "general")
    .all<PostRow>();

  const related = relatedRows.results.map((r) => ({
    ...r,
    tags: JSON.parse(r.tags || "[]") as string[],
  }));

  // Parse references JSON
  let parsedRefs: unknown[] = [];
  try {
    parsedRefs = JSON.parse(row.references || "[]");
  } catch { parsedRefs = []; }

  return ok({
    ...row,
    tags: JSON.parse(row.tags || "[]") as string[],
    references: parsedRefs,
    related,
  });
});

/** POST /api/admin/posts */
posts.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<PostRow> & { tags?: string[] }>();
  if (!body.slug || !body.title) return err("slug and title are required");

  const tags = JSON.stringify(body.tags ?? []);
  const readingTime = calcReadingTime(body.content_md ?? null);

  // Determine status: if status not provided, derive from is_published
  const status = body.status || (body.is_published ? "published" : "draft");
  const isPublished = status === "published" ? 1 : (body.is_published ?? 0);

  // Serialize references if provided as array
  const references = body.references !== undefined
    ? (typeof body.references === 'string' ? body.references : JSON.stringify(body.references))
    : '[]';

  const result = await c.env.DB.prepare(
    `INSERT INTO posts (slug, title, excerpt, content_md, thumbnail_url, author, tags, 
                        is_published, published_at, status, category, is_featured, 
                        reading_time_min, meta_title, meta_description,
                        reviewed_by, references)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      body.slug,
      body.title,
      body.excerpt ?? "",
      body.content_md ?? null,
      body.thumbnail_url ?? null,
      body.author ?? "Song Linh Technologies",
      tags,
      isPublished,
      body.published_at ?? null,
      status,
      body.category ?? "general",
      body.is_featured ?? 0,
      readingTime,
      body.meta_title ?? null,
      body.meta_description ?? null,
      body.reviewed_by ?? null,
      references,
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
    // Auto-recalculate reading time
    sets.push("reading_time_min = ?");
    values.push(calcReadingTime(body.content_md));
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
  if (body.status !== undefined) {
    sets.push("status = ?");
    values.push(body.status);
    // Sync is_published with status
    sets.push("is_published = ?");
    values.push(body.status === "published" ? 1 : 0);
  }
  if (body.category !== undefined) {
    sets.push("category = ?");
    values.push(body.category);
  }
  if (body.is_featured !== undefined) {
    sets.push("is_featured = ?");
    values.push(body.is_featured);
  }
  if (body.meta_title !== undefined) {
    sets.push("meta_title = ?");
    values.push(body.meta_title);
  }
  if (body.meta_description !== undefined) {
    sets.push("meta_description = ?");
    values.push(body.meta_description);
  }
  if (body.reviewed_by !== undefined) {
    sets.push("reviewed_by = ?");
    values.push(body.reviewed_by);
  }
  if (body.references !== undefined) {
    sets.push("references = ?");
    values.push(typeof body.references === 'string' ? body.references : JSON.stringify(body.references));
  }

  if (sets.length === 0) return err("No fields to update");

  sets.push("updated_at = CURRENT_TIMESTAMP");
  // Auto-set last_updated_at when content is changed
  if (body.content_md !== undefined) {
    sets.push("last_updated_at = CURRENT_TIMESTAMP");
  }
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

/** POST /api/admin/posts/bulk — bulk actions */
posts.post("/bulk", requireAuth, async (c) => {
  const body = await c.req.json<{
    action: string;
    post_ids: number[];
    value?: unknown;
  }>();

  const { action, post_ids } = body;
  if (!post_ids || post_ids.length === 0) return err("No posts selected");

  const placeholders = post_ids.map(() => "?").join(",");

  switch (action) {
    case "publish": {
      await c.env.DB.prepare(
        `UPDATE posts SET status = 'published', is_published = 1, updated_at = CURRENT_TIMESTAMP 
         WHERE id IN (${placeholders})`,
      )
        .bind(...post_ids)
        .run();
      break;
    }
    case "draft": {
      await c.env.DB.prepare(
        `UPDATE posts SET status = 'draft', is_published = 0, updated_at = CURRENT_TIMESTAMP 
         WHERE id IN (${placeholders})`,
      )
        .bind(...post_ids)
        .run();
      break;
    }
    case "delete": {
      await c.env.DB.prepare(
        `DELETE FROM posts WHERE id IN (${placeholders})`,
      )
        .bind(...post_ids)
        .run();
      break;
    }
    case "feature": {
      await c.env.DB.prepare(
        `UPDATE posts SET is_featured = 1, updated_at = CURRENT_TIMESTAMP 
         WHERE id IN (${placeholders})`,
      )
        .bind(...post_ids)
        .run();
      break;
    }
    case "unfeature": {
      await c.env.DB.prepare(
        `UPDATE posts SET is_featured = 0, updated_at = CURRENT_TIMESTAMP 
         WHERE id IN (${placeholders})`,
      )
        .bind(...post_ids)
        .run();
      break;
    }
    default:
      return err(`Unknown action: ${action}`);
  }

  return ok({ affected: post_ids.length });
});

export default posts;
