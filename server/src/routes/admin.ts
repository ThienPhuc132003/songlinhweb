import { Hono } from "hono";
import type { Env, AuditLogRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const admin = new Hono<{ Bindings: Env }>();

/* ───────── Dashboard Stats ───────── */

/** GET /api/admin/dashboard/stats — aggregated dashboard stats */
admin.get("/dashboard/stats", requireAuth, async (c) => {
  const [productCount, brandCount, categoryCount, projectCount] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM products WHERE deleted_at IS NULL").first<{ cnt: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM brands").first<{ cnt: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM product_categories").first<{ cnt: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM projects").first<{ cnt: number }>(),
  ]);

  const recentProducts = await c.env.DB.prepare(
    `SELECT p.id, p.name, p.slug, p.image_url, p.created_at,
            b.name as brand_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     WHERE p.deleted_at IS NULL
     ORDER BY p.created_at DESC
     LIMIT 5`,
  ).all<{ id: number; name: string; slug: string; image_url: string | null; created_at: string; brand_name: string | null }>();

  return ok({
    totalProducts: productCount?.cnt ?? 0,
    totalBrands: brandCount?.cnt ?? 0,
    totalCategories: categoryCount?.cnt ?? 0,
    totalProjects: projectCount?.cnt ?? 0,
    recentProducts: recentProducts.results,
  });
});

/* ───────── Audit Logs ───────── */

/** GET /api/admin/audit-logs — paginated audit log viewer */
admin.get("/audit-logs", requireAuth, async (c) => {
  const url = new URL(c.req.url);
  const { page, limit } = parsePagination(url);
  const entityType = url.searchParams.get("entity_type");
  const entityId = url.searchParams.get("entity_id");
  const offset = (page - 1) * limit;

  let where = "WHERE 1=1";
  const params: unknown[] = [];

  if (entityType) {
    where += " AND entity_type = ?";
    params.push(entityType);
  }
  if (entityId) {
    where += " AND entity_id = ?";
    params.push(Number(entityId));
  }

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM audit_logs ${where}`,
  ).bind(...params).first<{ total: number }>();

  const rows = await c.env.DB.prepare(
    `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  ).bind(...params, limit, offset).all<AuditLogRow>();

  return paginated(rows.results, countResult?.total ?? 0, { page, limit });
});

export default admin;
