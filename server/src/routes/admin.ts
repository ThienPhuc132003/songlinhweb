import { Hono } from "hono";
import type { Env, AuditLogRow } from "../types";
import { ok, err, paginated, parsePagination } from "../lib/response";
import { requireAuth, safeCompare } from "../middleware/auth";
import { setCookie, deleteCookie } from "hono/cookie";

const admin = new Hono<{ Bindings: Env }>();

/* ───────── Auth: Login / Logout / Me ───────── */

/** POST /api/admin/login — validate API key and set HttpOnly session cookie */
admin.post("/login", async (c) => {
  try {
    const { api_key } = await c.req.json<{ api_key: string }>();
    if (!api_key) return err("API key is required", 400);

    const isValid = await safeCompare(api_key, c.env.ADMIN_API_KEY);
    if (!isValid) return err("Invalid API key", 401);

    // Create HMAC-signed session token
    const encoder = new TextEncoder();
    const keyData = encoder.encode(c.env.ADMIN_API_KEY);
    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    const timestamp = Date.now().toString();
    const signature = await crypto.subtle.sign(
      "HMAC", cryptoKey, encoder.encode(`session:${timestamp}`),
    );
    const sigHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0")).join("");
    const token = `${timestamp}.${sigHex}`;

    // Set HttpOnly cookie (24h expiry)
    setCookie(c, "sltech_session", token, {
      path: "/api/admin",
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 86400, // 24 hours
    });

    return ok({ authenticated: true });
  } catch {
    return err("Login failed", 500);
  }
});

/** POST /api/admin/logout — clear session cookie */
admin.post("/logout", (c) => {
  deleteCookie(c, "sltech_session", { path: "/api/admin" });
  return ok({ authenticated: false });
});

/** GET /api/admin/me — check if session is valid */
admin.get("/me", requireAuth, (c) => {
  return ok({ authenticated: true });
});

/* ───────── Dashboard Stats ───────── */

/** GET /api/admin/dashboard/stats — aggregated dashboard stats */
admin.get("/dashboard/stats", requireAuth, async (c) => {
  const [productCount, featuredProjectCount, unreadQuotes, unreadContacts] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM products WHERE deleted_at IS NULL").first<{ cnt: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM projects WHERE is_featured = 1 AND deleted_at IS NULL").first<{ cnt: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM quotation_requests WHERE status = 'new' AND deleted_at IS NULL").first<{ cnt: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as cnt FROM contacts WHERE status = 'new' AND deleted_at IS NULL").first<{ cnt: number }>(),
  ]);

  const recentQuotes = await c.env.DB.prepare(
    `SELECT id, customer_name, project_name, status, created_at
     FROM quotation_requests
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 5`,
  ).all();

  const quotesChart = await c.env.DB.prepare(
    `SELECT strftime('%Y-%m', created_at) as month, count(*) as cnt 
     FROM quotation_requests 
     WHERE deleted_at IS NULL
     GROUP BY month 
     ORDER BY month DESC 
     LIMIT 6`,
  ).all();

  return ok({
    totalProducts: productCount?.cnt ?? 0,
    featuredProjects: featuredProjectCount?.cnt ?? 0,
    unreadQuotes: unreadQuotes?.cnt ?? 0,
    unreadContacts: unreadContacts?.cnt ?? 0,
    recentQuotes: recentQuotes.results,
    quotesChart: quotesChart.results.reverse(), // chronological order
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
