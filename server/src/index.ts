import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types";
import { errorHandler } from "./middleware/error-handler";
import products from "./routes/products";
import images from "./routes/images";
import brands from "./routes/brands";
import projects from "./routes/projects";
import posts from "./routes/posts";
import gallery from "./routes/gallery";
import partners from "./routes/partners";
import siteConfig from "./routes/site-config";
import contact from "./routes/contact";
import upload from "./routes/upload";
import quotes from "./routes/quotes";
import quotations from "./routes/quotations";
import features from "./routes/features";
import admin from "./routes/admin";
import seo from "./routes/seo";
import { cleanupOldXlsxFiles } from "./services/r2-cleanup";

const app = new Hono<{ Bindings: Env }>();

/* ───────── Global Middleware ───────── */

// CORS — using Hono built-in cors middleware
app.use("*", async (c, next) => {
  const corsOriginEnv = c.env.CORS_ORIGIN || "*";

  const corsMiddleware = cors({
    origin: corsOriginEnv === "*"
      ? "*"
      : corsOriginEnv.split(",").map((s: string) => s.trim()),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    maxAge: 86400,
  });

  return corsMiddleware(c, next);
});

// Error handler
app.use("*", errorHandler);

// Cache-Control for public API endpoints
app.use("/api/products*", async (c, next) => {
  await next();
  // Only set cache headers on GET, non-admin requests
  if (c.req.method === "GET" && !c.req.url.includes("/admin/")) {
    c.header("Cache-Control", "public, s-maxage=300, max-age=60");
  }
});
app.use("/api/product-features*", async (c, next) => {
  await next();
  if (c.req.method === "GET" && !c.req.url.includes("/admin/")) {
    c.header("Cache-Control", "public, s-maxage=3600, max-age=300");
  }
});

/* ───────── Health Check ───────── */

app.get("/", (c) => {
  return c.json({
    name: "SLTECH API",
    version: "1.0.0",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ───────── Public API Routes ───────── */

app.route("/api/products", products);
app.route("/api/images", images);
app.route("/api/brands", brands);
app.route("/api/projects", projects);
app.route("/api/posts", posts);
app.route("/api/gallery", gallery);
app.route("/api/partners", partners);
app.route("/api/site-config", siteConfig);
app.route("/api/contact", contact);
app.route("/api/quotes", quotes);
app.route("/api/quotations", quotations);
app.route("/api/product-features", features);

/* ───────── Admin Routes ───────── */

app.route("/api/admin/products", products);
app.route("/api/admin/brands", brands);
app.route("/api/admin/projects", projects);
app.route("/api/admin/posts", posts);
app.route("/api/admin/gallery", gallery);
app.route("/api/admin/partners", partners);
app.route("/api/admin/site-config", siteConfig);
app.route("/api/admin/contacts", contact);
app.route("/api/admin/upload", upload);
app.route("/api/admin/quotes", quotes);
app.route("/api/admin/quotations", quotations);
app.route("/api/admin/product-features", features);
app.route("/api/admin", admin);

/* ───────── SEO Routes ───────── */
app.route("", seo);

/* ───────── 404 Fallback ───────── */

app.notFound((c) => {
  return c.json({ success: false, error: "Not found" }, 404);
});

/* ───────── Worker Export ───────── */

export default {
  fetch: app.fetch,
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(cleanupOldXlsxFiles(env));
  },
};
