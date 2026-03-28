---
phase: requirements
feature: product-module
---
# Product Module — Enterprise-Grade B2B Catalog

## Problem Statement
The current product catalog is minimal: only featured products with sample data fallback, no advanced filtering, basic detail pages using `AddToCartButton` (consumer-style vs B2B), no brand management, and the DB schema lacks columns for `brand`, `model_number`, `specifications`, and `features` (these exist only in the API route code, added post-migration via ALTER TABLE).

## Goals
1. **Database & Admin Sync** — Expand DB schema with brands table, add missing product columns, and create admin UI for categories + brands management
2. **Product Catalog** — Category sidebar, brand/attribute filters, smart search (SKU, brand, name), B2B card design
3. **Product Detail Page** — Gallery, technical specs table, brand logo, "Request Quote" CTA (replacing cart button), related products, downloads section
4. **Navbar Mega Menu** — "Sản phẩm" dropdown showing top categories with sub-categories in 3-4 column layout

## Non-Goals
- E-commerce checkout (this is B2B — quote-based)
- Real-time inventory tracking
- Multi-currency pricing
- Product comparison tool (future phase)

## User Stories
1. **Admin** — As an admin, I want to manage categories (hierarchical), brands (with logos), and products (with dynamic specs) from the admin panel
2. **Visitor** — As a visitor, I want to browse products by category, filter by brand, and search by SKU/name
3. **Visitor** — As a visitor, I want to see detailed product specs, brand info, and request a quote
4. **Visitor** — As a visitor, I want quick access to product categories from the navbar dropdown

## Success Criteria
- Admin can CRUD categories, brands, and products with custom key-value specifications
- Product catalog supports filtering by category, brand, and search
- Product detail renders specs from JSON, shows brand badge, and has "Request Quote" CTA
- Navbar "Sản phẩm" shows mega menu with categorized links

## Constraints
- **Tech stack**: Cloudflare D1 (SQLite), Hono API, React + shadcn/ui frontend
- **Existing schema**: `product_categories` (has `parent_id`), `products` (basic — need ALTER TABLE)
- **No breaking changes**: Products API must remain backward-compatible
- **B2B only**: No pricing, no cart, quote-based workflow

## Open Questions
- None — user has provided comprehensive specs.
