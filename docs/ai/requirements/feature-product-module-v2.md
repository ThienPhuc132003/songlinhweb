---
phase: requirements
feature: product-module-v2
---
# Product Module v2 — Fix & Enhance

## Problem Statement
The current product module has several critical issues that prevent it from being usable:
1. **Brand blue color lost** — CSS `--primary` was overwritten to grayscale `oklch(0.205 0 0)` instead of the brand blue `#3C5DAA`, making the entire site look washed out
2. **"0 sản phẩm" bug** — API returns `total: 0` (no DB data), but SAMPLE_PRODUCTS render — count mismatch confuses users
3. **Grid layout** — 3 products/row is too sparse for B2B catalog; industry standard is 4/row
4. **No categories in sidebar** — CategorySidebar is empty because no categories exist in D1
5. **No brand filter data** — BrandFilter shows nothing because brands table is empty in D1
6. **No product filter by specs** — Can't search by "IP67", "4MP", etc. — need tag/feature filtering
7. **Admin empty** — Products/Categories/Brands management pages have no seed data to test
8. **No AdminBrands page** — Brands CRUD page was deferred and never built
9. **Pagination needs fix** — Should work properly with sample data fallback

## Goals
1. **Restore brand identity** — Fix CSS `--primary` to proper SLTECH blue `#3C5DAA`
2. **Seed data** — Create migration with categories, brands, and products so the system works end-to-end without real API data coming from D1
3. **Product count fix** — Show correct count when using SAMPLE_PRODUCTS fallback
4. **4-column grid** — Change from `grid-cols-3` to `grid-cols-4` on desktop (responsive: 1→2→3→4)
5. **Tag/feature filter** — Allow filtering products by feature tags (IP67, PoE, AI, etc.)
6. **Admin Brands page** — Full CRUD for brands with logo upload
7. **Admin Categories page** — If not already present, create hierarchical category management
8. **Working pagination** — Client-side pagination for sample data, server-side for API data

## Non-Goals
- E-commerce (cart, checkout, pricing)
- Product comparison tool
- Multi-language support
- Real product images (placeholder icons are acceptable for now)

## User Stories
1. **Visitor** — As a visitor, I want to see the website in its brand blue color, not washed-out gray
2. **Visitor** — As a visitor, I want to browse products organized by categories in the sidebar
3. **Visitor** — As a visitor, I want to filter products by brand (Hikvision, Dahua, etc.)
4. **Visitor** — As a visitor, I want to filter products by features like "IP67", "PoE", "AI Detection"
5. **Visitor** — As a visitor, I want to see 4 products per row for efficient browsing
6. **Visitor** — As a visitor, I want proper pagination showing how many products exist
7. **Admin** — As an admin, I want to manage categories (create Camera, Access Control, etc.)
8. **Admin** — As an admin, I want to manage brands (Hikvision, Axis, with logos)
9. **Admin** — As an admin, I want to see pre-seeded products to test the full CRUD flow
10. **Admin** — As an admin, I want to add dynamic key-value specs and feature tags to products

## Success Criteria
- Brand blue `#3C5DAA` visible across the entire site (navbar, buttons, links, badges)
- Category sidebar shows at least 6 categories with product counts
- Brand filter shows at least 8 brands with toggle functionality
- Feature tag filter exists and can filter by specs like "IP67", "PoE"
- Product count matches actual displayed products
- Grid shows 4 products/row on desktop (≥1280px)
- Admin can CRUD categories, brands, and products
- At least 14 seeded products visible in both frontend and admin

## Constraints
- Must use existing Cloudflare D1 schema (extend, don't break)
- Must preserve backward compatibility with existing product API
- CSS fix must not break dark mode
- Admin pages must follow existing AdminProducts.tsx patterns (DataTable, FormDialog, etc.)
- All data should be seeded via SQL migration for reproducibility

## Open Questions
- Should feature/tag filtering be client-side (filter SAMPLE_PRODUCTS) or server-side (API param)?
  → **Recommendation**: Client-side for now (simple, fast), upgrade to server-side when DB is populated
