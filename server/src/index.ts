import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types";
import { errorHandler } from "./middleware/error-handler";
import solutions from "./routes/solutions";
import products from "./routes/products";
import projects from "./routes/projects";
import posts from "./routes/posts";
import gallery from "./routes/gallery";
import partners from "./routes/partners";
import siteConfig from "./routes/site-config";
import contact from "./routes/contact";
import upload from "./routes/upload";
import quotes from "./routes/quotes";

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

app.route("/api/solutions", solutions);
app.route("/api/products", products);
app.route("/api/product-categories", products); // alias for /api/products/categories
app.route("/api/projects", projects);
app.route("/api/posts", posts);
app.route("/api/gallery", gallery);
app.route("/api/partners", partners);
app.route("/api/site-config", siteConfig);
app.route("/api/contact", contact);
app.route("/api/quotes", quotes);

/* ───────── Admin Routes ───────── */

app.route("/api/admin/solutions", solutions);
app.route("/api/admin/products", products);
app.route("/api/admin/projects", projects);
app.route("/api/admin/posts", posts);
app.route("/api/admin/gallery", gallery);
app.route("/api/admin/partners", partners);
app.route("/api/admin/site-config", siteConfig);
app.route("/api/admin/contacts", contact);
app.route("/api/admin/upload", upload);
app.route("/api/admin/quotes", quotes);

/* ───────── 404 Fallback ───────── */

app.notFound((c) => {
  return c.json({ success: false, error: "Not found" }, 404);
});

export default app;
