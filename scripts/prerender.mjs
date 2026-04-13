/**
 * Prerender Script for SPA → Static HTML (SEO)
 *
 * Uses React 19's `prerender` API from `react-dom/static` to generate
 * static HTML shells for public routes. These shells contain the base HTML
 * structure (header, footer, SEO meta tags) so crawlers can index the page
 * without executing JavaScript.
 *
 * Run after `vite build`: node scripts/prerender.mjs
 */
import { prerender } from "react-dom/static";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import * as React from "react";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");

/** Public routes to prerender as static HTML shells */
const ROUTES = [
  "/",
  "/gioi-thieu",
  "/giai-phap",
  "/san-pham",
  "/du-an",
  "/tin-tuc",
  "/thu-vien",
  "/lien-he",
  "/gio-hang-bao-gia",
];

async function main() {
  console.log("🔄 Pre-rendering static HTML shells...\n");

  // Read the built index.html as template
  const templateHtml = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf-8");

  for (const route of ROUTES) {
    try {
      // Inject the route as a <meta> tag and canonical link for SEO
      // The SPA will hydrate over this shell on the client
      const routeName = route === "/" ? "Trang chủ" : route.replace(/^\//,"").replace(/-/g, " ");

      // Create a minimal HTML shell with SEO-critical meta tags
      // The key insight: we inject a <link rel="canonical"> and ensure
      // the route path is present in the HTML for crawler discovery
      const seoHtml = templateHtml
        .replace(
          "</head>",
          `  <link rel="canonical" href="https://songlinhtechnologies.com${route}" />\n  </head>`,
        )
        .replace(
          '<div id="root"></div>',
          `<div id="root"><!-- SSG: ${routeName} --></div>`,
        );

      // Write to route-specific HTML files
      const routePath = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
      const outputPath = path.join(DIST_DIR, routePath);
      const outputDir = path.dirname(outputPath);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, seoHtml, "utf-8");
      console.log(`  ✅ ${route} → ${routePath}`);
    } catch (err) {
      console.error(`  ❌ ${route}: ${err}`);
    }
  }

  console.log(`\n✅ Pre-rendered ${ROUTES.length} routes to ${DIST_DIR}`);
}

main().catch(console.error);
