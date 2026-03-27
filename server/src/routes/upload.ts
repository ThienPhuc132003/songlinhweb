import { Hono } from "hono";
import type { Env } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const upload = new Hono<{ Bindings: Env }>();

/** POST /api/admin/upload — upload image to R2 */
upload.post("/", requireAuth, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string | null;

  if (!file) return err("No file provided");

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.type)) {
    return err("Invalid file type. Allowed: JPEG, PNG, WebP, SVG, PDF");
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return err("File too large. Maximum 10MB");
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const prefix = folder ? `${folder}/` : "";
  const key = `${prefix}${timestamp}-${random}.${ext}`;

  // Upload to R2
  await c.env.IMAGES.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  // Return the public URL (assumes R2 custom domain or public bucket)
  const url = `/images/${key}`;

  return ok({ key, url, size: file.size, type: file.type });
});

/** DELETE /api/admin/upload/:key — delete image from R2 */
upload.delete("/*", requireAuth, async (c) => {
  const key = c.req.path.replace("/", ""); // everything after /api/admin/upload/
  await c.env.IMAGES.delete(key);
  return ok({ deleted: true });
});

export default upload;
