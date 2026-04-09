import { Hono } from "hono";
import type { Env } from "../types";

const seo = new Hono<{ Bindings: Env }>();

/** GET /sitemap.xml — dynamic sitemap */
seo.get("/sitemap.xml", async (c) => {
  const baseUrl = "https://sltech.vn";

  // Fetch all active entities
  const [products, projects, solutions] = await Promise.all([
    c.env.DB.prepare(
      "SELECT slug, updated_at FROM products WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order ASC",
    ).all<{ slug: string; updated_at: string }>(),
    c.env.DB.prepare(
      "SELECT slug, created_at FROM projects WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order ASC",
    ).all<{ slug: string; created_at: string }>(),
    c.env.DB.prepare(
      "SELECT slug, updated_at FROM solutions WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order ASC",
    ).all<{ slug: string; updated_at: string }>(),
  ]);

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/gioi-thieu", priority: "0.8", changefreq: "monthly" },
    { loc: "/san-pham", priority: "0.9", changefreq: "daily" },
    { loc: "/du-an", priority: "0.8", changefreq: "weekly" },
    { loc: "/giai-phap", priority: "0.8", changefreq: "weekly" },
    { loc: "/lien-he", priority: "0.6", changefreq: "monthly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static pages
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Products
  for (const p of products.results) {
    xml += `  <url>
    <loc>${baseUrl}/san-pham/${p.slug}</loc>
    <lastmod>${p.updated_at?.split(" ")[0] || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // Projects
  for (const p of projects.results) {
    xml += `  <url>
    <loc>${baseUrl}/du-an/${p.slug}</loc>
    <lastmod>${p.created_at?.split(" ")[0] || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // Solutions
  for (const s of solutions.results) {
    xml += `  <url>
    <loc>${baseUrl}/giai-phap/${s.slug}</loc>
    <lastmod>${s.updated_at?.split(" ")[0] || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, max-age=3600",
    },
  });
});

/** GET /robots.txt */
seo.get("/robots.txt", (c) => {
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://sltech.vn/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, max-age=86400",
    },
  });
});

export default seo;
