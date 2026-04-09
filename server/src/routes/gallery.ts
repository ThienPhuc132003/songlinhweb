import { Hono } from "hono";
import type { Env, GalleryAlbumRow, GalleryImageRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const gallery = new Hono<{ Bindings: Env }>();

/* ═══════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ═══════════════════════════════════════════════════════════════ */

/** GET /api/gallery — list active albums with image count */
gallery.get("/", async (c) => {
  const category = c.req.query("category");

  let sql = `SELECT ga.*, COUNT(gi.id) as image_count
     FROM gallery_albums ga
     LEFT JOIN gallery_images gi ON gi.album_id = ga.id
     WHERE ga.is_active = 1 AND ga.deleted_at IS NULL`;
  const binds: unknown[] = [];

  if (category && category !== "all") {
    sql += " AND ga.category = ?";
    binds.push(category);
  }

  sql += " GROUP BY ga.id ORDER BY ga.sort_order ASC";

  const stmt = binds.length > 0
    ? c.env.DB.prepare(sql).bind(...binds)
    : c.env.DB.prepare(sql);

  const rows = await stmt.all<GalleryAlbumRow & { image_count: number }>();
  return ok(rows.results);
});

/** GET /api/gallery/:slug — get album with all images */
gallery.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const album = await c.env.DB.prepare(
    "SELECT * FROM gallery_albums WHERE slug = ? AND is_active = 1 AND deleted_at IS NULL",
  )
    .bind(slug)
    .first<GalleryAlbumRow>();

  if (!album) return err("Album not found", 404);

  const images = await c.env.DB.prepare(
    "SELECT * FROM gallery_images WHERE album_id = ? ORDER BY sort_order ASC",
  )
    .bind(album.id)
    .all<GalleryImageRow>();

  // Count images
  return ok({ ...album, images: images.results, image_count: images.results.length });
});

/* ═══════════════════════════════════════════════════════════════
   ADMIN CRUD ROUTES
   ═══════════════════════════════════════════════════════════════ */

/** GET /api/admin/gallery/all — list ALL albums including inactive */
gallery.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT ga.*, COUNT(gi.id) as image_count
     FROM gallery_albums ga
     LEFT JOIN gallery_images gi ON gi.album_id = ga.id
     GROUP BY ga.id
     ORDER BY ga.sort_order ASC`,
  ).all<GalleryAlbumRow & { image_count: number }>();
  return ok(rows.results);
});

/** GET /api/admin/gallery/albums/:id — get single album with images (admin) */
gallery.get("/albums/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const album = await c.env.DB.prepare(
    "SELECT * FROM gallery_albums WHERE id = ?",
  )
    .bind(id)
    .first<GalleryAlbumRow>();

  if (!album) return err("Album not found", 404);

  const images = await c.env.DB.prepare(
    "SELECT * FROM gallery_images WHERE album_id = ? ORDER BY sort_order ASC",
  )
    .bind(album.id)
    .all<GalleryImageRow>();

  return ok({ ...album, images: images.results, image_count: images.results.length });
});

/* ───── Album CRUD ───── */

/** POST /api/admin/gallery/albums */
gallery.post("/albums", requireAuth, async (c) => {
  const body = await c.req.json<Partial<GalleryAlbumRow>>();
  if (!body.slug || !body.title) return err("slug and title are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO gallery_albums (slug, title, cover_url, description, category, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
  )
    .bind(
      body.slug,
      body.title,
      body.cover_url ?? null,
      body.description ?? "",
      body.category ?? "general",
      body.sort_order ?? 0,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** PUT /api/admin/gallery/albums/:id */
gallery.put("/albums/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<GalleryAlbumRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.title !== undefined) { sets.push("title = ?"); values.push(body.title); }
  if (body.slug !== undefined) { sets.push("slug = ?"); values.push(body.slug); }
  if (body.cover_url !== undefined) { sets.push("cover_url = ?"); values.push(body.cover_url); }
  if (body.description !== undefined) { sets.push("description = ?"); values.push(body.description); }
  if (body.category !== undefined) { sets.push("category = ?"); values.push(body.category); }
  if (body.sort_order !== undefined) { sets.push("sort_order = ?"); values.push(body.sort_order); }
  if (body.is_active !== undefined) { sets.push("is_active = ?"); values.push(body.is_active); }

  if (sets.length === 0) return err("No fields to update");
  values.push(id);

  await c.env.DB.prepare(
    `UPDATE gallery_albums SET ${sets.join(", ")} WHERE id = ?`,
  )
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/gallery/albums/:id — deletes album + images + R2 files */
gallery.delete("/albums/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const deleteR2 = c.req.query("delete_r2") !== "false"; // default: delete R2 files

  if (deleteR2) {
    // Fetch all image URLs to delete from R2
    const images = await c.env.DB.prepare(
      "SELECT image_url FROM gallery_images WHERE album_id = ?",
    ).bind(id).all<{ image_url: string }>();

    // Also get cover_url
    const album = await c.env.DB.prepare(
      "SELECT cover_url FROM gallery_albums WHERE id = ?",
    ).bind(id).first<{ cover_url: string | null }>();

    // Delete from R2
    const urlsToDelete = images.results
      .map((img) => extractR2Key(img.image_url))
      .filter(Boolean) as string[];

    if (album?.cover_url) {
      const coverKey = extractR2Key(album.cover_url);
      if (coverKey) urlsToDelete.push(coverKey);
    }

    // Batch delete from R2 (fire and forget)
    await Promise.allSettled(
      urlsToDelete.map((key) => c.env.IMAGES.delete(key)),
    );
  }

  // Delete DB records (images cascade via FK, but explicit for safety)
  await c.env.DB.prepare("DELETE FROM gallery_images WHERE album_id = ?")
    .bind(id)
    .run();
  await c.env.DB.prepare("DELETE FROM gallery_albums WHERE id = ?")
    .bind(id)
    .run();

  return ok({ deleted: true });
});

/** PUT /api/admin/gallery/albums/:id/cover — set cover from image URL */
gallery.put("/albums/:id/cover", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const { image_url } = await c.req.json<{ image_url: string }>();

  await c.env.DB.prepare("UPDATE gallery_albums SET cover_url = ? WHERE id = ?")
    .bind(image_url, id)
    .run();

  return ok({ id, cover_url: image_url });
});

/* ───── Image CRUD ───── */

/** POST /api/admin/gallery/images */
gallery.post("/images", requireAuth, async (c) => {
  const body = await c.req.json<Partial<GalleryImageRow>>();
  if (!body.album_id || !body.image_url)
    return err("album_id and image_url are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO gallery_images (album_id, image_url, caption, sort_order)
     VALUES (?, ?, ?, ?)`,
  )
    .bind(
      body.album_id,
      body.image_url,
      body.caption ?? null,
      body.sort_order ?? 0,
    )
    .run();

  return ok({ id: result.meta.last_row_id });
});

/** POST /api/admin/gallery/images/batch — batch insert multiple images */
gallery.post("/images/batch", requireAuth, async (c) => {
  const { album_id, images } = await c.req.json<{
    album_id: number;
    images: Array<{ image_url: string; caption?: string; sort_order?: number }>;
  }>();

  if (!album_id || !images?.length)
    return err("album_id and images array are required");

  const stmts = images.map((img, i) =>
    c.env.DB.prepare(
      `INSERT INTO gallery_images (album_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)`,
    ).bind(album_id, img.image_url, img.caption ?? null, img.sort_order ?? i),
  );

  await c.env.DB.batch(stmts);
  return ok({ inserted: images.length });
});

/** PUT /api/admin/gallery/images/:id — update image caption/sort_order */
gallery.put("/images/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<GalleryImageRow>>();

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.caption !== undefined) { sets.push("caption = ?"); values.push(body.caption); }
  if (body.sort_order !== undefined) { sets.push("sort_order = ?"); values.push(body.sort_order); }

  if (sets.length === 0) return err("No fields to update");
  values.push(id);

  await c.env.DB.prepare(
    `UPDATE gallery_images SET ${sets.join(", ")} WHERE id = ?`,
  )
    .bind(...values)
    .run();

  return ok({ id });
});

/** PUT /api/admin/gallery/images/reorder — batch update sort_order */
gallery.put("/images/reorder", requireAuth, async (c) => {
  const { items } = await c.req.json<{
    items: Array<{ id: number; sort_order: number }>;
  }>();

  if (!items?.length) return err("items array is required");

  const stmts = items.map((item) =>
    c.env.DB.prepare("UPDATE gallery_images SET sort_order = ? WHERE id = ?")
      .bind(item.sort_order, item.id),
  );

  await c.env.DB.batch(stmts);
  return ok({ updated: items.length });
});

/** DELETE /api/admin/gallery/images/:id — delete single image + R2 */
gallery.delete("/images/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));

  // Get image URL for R2 cleanup
  const img = await c.env.DB.prepare(
    "SELECT image_url FROM gallery_images WHERE id = ?",
  ).bind(id).first<{ image_url: string }>();

  if (img) {
    const key = extractR2Key(img.image_url);
    if (key) {
      await c.env.IMAGES.delete(key).catch(() => { /* ignore R2 errors */ });
    }
  }

  await c.env.DB.prepare("DELETE FROM gallery_images WHERE id = ?")
    .bind(id)
    .run();

  return ok({ deleted: true });
});

/** POST /api/admin/gallery/images/bulk-delete — bulk delete images + R2 */
gallery.post("/images/bulk-delete", requireAuth, async (c) => {
  const { ids } = await c.req.json<{ ids: number[] }>();
  if (!ids?.length) return err("ids array is required");

  // Get image URLs for R2 cleanup
  const placeholders = ids.map(() => "?").join(",");
  const images = await c.env.DB.prepare(
    `SELECT image_url FROM gallery_images WHERE id IN (${placeholders})`,
  )
    .bind(...ids)
    .all<{ image_url: string }>();

  // Delete from R2
  const keys = images.results
    .map((img) => extractR2Key(img.image_url))
    .filter(Boolean) as string[];

  await Promise.allSettled(
    keys.map((key) => c.env.IMAGES.delete(key)),
  );

  // Delete from DB
  await c.env.DB.prepare(
    `DELETE FROM gallery_images WHERE id IN (${placeholders})`,
  )
    .bind(...ids)
    .run();

  return ok({ deleted: ids.length });
});

/* ───── Helpers ───── */

/** Extract R2 key from full URL (e.g. https://…/api/images/gallery/xyz.webp → gallery/xyz.webp) */
function extractR2Key(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/api\/images\/(.+)$/);
  return match?.[1] ?? null;
}

export default gallery;
