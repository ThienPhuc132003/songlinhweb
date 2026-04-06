import { Hono } from "hono";
import type { Env } from "../types";

const images = new Hono<{ Bindings: Env }>();

/**
 * GET /api/images/* — serve images from R2 bucket
 * This allows the frontend to access uploaded images via a public URL
 * without needing a custom R2 domain.
 * 
 * Example: /api/images/products/1234567-abc123.webp
 * 
 * Key extraction: Since this sub-app is mounted at /api/images,
 * we extract the R2 key from the full URL pathname by removing the mount prefix.
 */
images.get("/*", async (c) => {
  // Try Hono's wildcard param first, then fall back to URL parsing
  let key = c.req.param("*");

  // Fallback: extract from full URL path if param("*") is empty
  if (!key) {
    const url = new URL(c.req.url);
    // pathname is like /api/images/products/xxx.webp
    // We need everything after /api/images/
    const match = url.pathname.match(/\/api\/images\/(.+)/);
    key = match?.[1] ?? "";
  }

  if (!key) {
    return c.json({ success: false, error: "No image key provided" }, 400);
  }

  const object = await c.env.IMAGES.get(key);
  if (!object) {
    return c.json({ success: false, error: "Image not found" }, 404);
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "image/webp");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag || "");

  return new Response(object.body, { headers });
});

export default images;
