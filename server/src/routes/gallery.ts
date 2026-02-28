import { Hono } from "hono";
import type { Env, GalleryAlbumRow, GalleryImageRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const gallery = new Hono<{ Bindings: Env }>();

/** GET /api/gallery — list active albums with image count */
gallery.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT ga.*, COUNT(gi.id) as image_count
     FROM gallery_albums ga
     LEFT JOIN gallery_images gi ON gi.album_id = ga.id
     WHERE ga.is_active = 1
     GROUP BY ga.id
     ORDER BY ga.sort_order ASC`,
  ).all<GalleryAlbumRow & { image_count: number }>();

  return ok(rows.results);
});

/* ───────── Admin CRUD ───────── */

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

/** GET /api/gallery/:slug — get album with all images */
gallery.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const album = await c.env.DB.prepare(
    "SELECT * FROM gallery_albums WHERE slug = ? AND is_active = 1",
  )
    .bind(slug)
    .first<GalleryAlbumRow>();

  if (!album) return err("Album not found", 404);

  const images = await c.env.DB.prepare(
    "SELECT * FROM gallery_images WHERE album_id = ? ORDER BY sort_order ASC",
  )
    .bind(album.id)
    .all<GalleryImageRow>();

  return ok({ ...album, images: images.results });
});

/* ───────── Admin CRUD ───────── */

/** POST /api/admin/gallery/albums */
gallery.post("/albums", requireAuth, async (c) => {
  const body = await c.req.json<Partial<GalleryAlbumRow>>();
  if (!body.slug || !body.title) return err("slug and title are required");

  const result = await c.env.DB.prepare(
    `INSERT INTO gallery_albums (slug, title, cover_url, sort_order, is_active)
     VALUES (?, ?, ?, ?, 1)`,
  )
    .bind(body.slug, body.title, body.cover_url ?? null, body.sort_order ?? 0)
    .run();

  return ok({ id: result.meta.last_row_id });
});

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

/** PUT /api/admin/gallery/albums/:id */
gallery.put("/albums/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<GalleryAlbumRow>>();

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
  if (body.cover_url !== undefined) {
    sets.push("cover_url = ?");
    values.push(body.cover_url);
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
    `UPDATE gallery_albums SET ${sets.join(", ")} WHERE id = ?`,
  )
    .bind(...values)
    .run();

  return ok({ id });
});

/** DELETE /api/admin/gallery/albums/:id */
gallery.delete("/albums/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  // Delete images first, then album
  await c.env.DB.prepare("DELETE FROM gallery_images WHERE album_id = ?")
    .bind(id)
    .run();
  await c.env.DB.prepare("DELETE FROM gallery_albums WHERE id = ?")
    .bind(id)
    .run();
  return ok({ deleted: true });
});

/** DELETE /api/admin/gallery/images/:id */
gallery.delete("/images/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM gallery_images WHERE id = ?")
    .bind(id)
    .run();
  return ok({ deleted: true });
});

export default gallery;
