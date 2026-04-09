import { Hono } from "hono";
import type { Env, SiteConfigRow } from "../types";
import { ok, err } from "../lib/response";
import { requireAuth } from "../middleware/auth";

const siteConfig = new Hono<{ Bindings: Env }>();

/** GET /api/site-config — get all config as key-value map */
siteConfig.get("/", async (c) => {
  // Try cache first (guard: CACHE binding may not exist)
  if (c.env.CACHE) {
    try {
      const cached = await c.env.CACHE.get("site-config", "json");
      if (cached) return ok(cached);
    } catch {
      // KV unavailable — fall through to DB
    }
  }

  const rows = await c.env.DB.prepare(
    "SELECT key, value FROM site_config",
  ).all<SiteConfigRow>();

  const config: Record<string, string> = {};
  for (const row of rows.results) {
    config[row.key] = row.value;
  }

  // Cache for 5 minutes (best-effort)
  if (c.env.CACHE) {
    try {
      await c.env.CACHE.put("site-config", JSON.stringify(config), {
        expirationTtl: 300,
      });
    } catch {
      // KV unavailable — skip caching
    }
  }

  return ok(config);
});

/** GET /api/admin/site-config/all — get all config as array (admin) */
siteConfig.get("/all", requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT key, value FROM site_config",
  ).all<SiteConfigRow>();
  return ok(rows.results);
});

/** PUT /api/admin/site-config — update config entries */
siteConfig.put("/", requireAuth, async (c) => {
  const body = await c.req.json<Record<string, string>>();
  const entries = Object.entries(body);

  if (entries.length === 0) return err("No config entries to update");

  const stmt = c.env.DB.prepare(
    "INSERT OR REPLACE INTO site_config (key, value) VALUES (?, ?)",
  );

  const batch = entries.map(([key, value]) => stmt.bind(key, value));
  await c.env.DB.batch(batch);

  // Invalidate cache (best-effort)
  if (c.env.CACHE) {
    try {
      await c.env.CACHE.delete("site-config");
    } catch {
      // KV unavailable — skip
    }
  }

  return ok({ updated: entries.length });
});

/** POST /api/admin/site-config/clear-cache — manually clear KV cache */
siteConfig.post("/clear-cache", requireAuth, async (c) => {
  if (c.env.CACHE) {
    try {
      await c.env.CACHE.delete("site-config");
      return ok({ cleared: true });
    } catch {
      return err("KV cache unavailable");
    }
  }
  return ok({ cleared: false, message: "No KV cache configured" });
});

export default siteConfig;
