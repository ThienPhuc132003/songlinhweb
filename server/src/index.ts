import { Hono } from "hono";
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

// CORS — support multiple origins (production + Vercel previews)
app.use("*", async (c, next) => {
  const requestOrigin = c.req.header("Origin") || "";
  const allowedOrigins = (c.env.CORS_ORIGIN || "*").split(",").map((s: string) => s.trim());

  // Check if request origin is allowed (supports wildcard *.vercel.app)
  let corsOrigin = allowedOrigins[0]; // default
  if (allowedOrigins.includes("*")) {
    corsOrigin = "*";
  } else if (allowedOrigins.includes(requestOrigin)) {
    corsOrigin = requestOrigin;
  } else if (allowedOrigins.some((o: string) => o.includes("vercel.app")) && requestOrigin.endsWith(".vercel.app")) {
    corsOrigin = requestOrigin;
  }

  c.header("Access-Control-Allow-Origin", corsOrigin);
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-API-Key",
  );
  c.header("Access-Control-Max-Age", "86400");

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
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
