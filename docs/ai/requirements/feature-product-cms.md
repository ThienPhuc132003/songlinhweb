---
phase: requirements
feature: product-cms
---
# Product CMS — Requirements

## Problem Statement
The Product Management System has backend infrastructure (API routes, DB schema) but critical frontend admin pages are missing, migrations are not deployed to D1, and the admin shows "Không có dữ liệu". Admin cannot manage categories or use the full product creation workflow.

## Existing Infrastructure (GAP Analysis)

### ✅ Already Built
| Component | Status | Location |
|-----------|--------|----------|
| DB: `product_categories` table (with `parent_id`) | ✅ | `0001_initial_schema.sql` |
| DB: `brands` table | ✅ | `0002_product_module.sql` |
| DB: `products` columns (brand, model_number, specs JSON, features JSON, brand_id, meta_*) | ✅ | `0005_b2b_comprehensive_upgrade.sql` + `0002_product_module.sql` |
| API: Categories CRUD (POST/PUT/DELETE `/admin/product-categories`) | ✅ | `server/src/routes/products.ts` lines 139-211 |
| API: Products CRUD (POST/PUT/DELETE `/admin/products`) | ✅ | `server/src/routes/products.ts` lines 213-291 |
| API: Brands CRUD (POST/PUT/DELETE `/admin/brands`) | ✅ | `server/src/routes/brands.ts` |
| Frontend: `AdminProducts.tsx` (specs editor, features tags) | ✅ | `src/pages/admin/AdminProducts.tsx` |
| Frontend: `AdminBrands.tsx` (CRUD + logo upload) | ✅ | `src/pages/admin/AdminBrands.tsx` |
| Frontend: Products page (4-col grid, tag filter, pagination) | ✅ | `src/pages/Products.tsx` |
| Frontend: ProductDetail page (B2B CTA, specs table) | ✅ | `src/pages/ProductDetail.tsx` |

### ❌ Missing
| Component | Priority | Notes |
|-----------|----------|-------|
| **AdminCategories.tsx** | P0 | No UI to manage categories (create Camera, Access Control, etc.) |
| **AdminProducts: brand_id dropdown** | P1 | Currently text field, needs searchable dropdown from brands |
| **Deploy migrations to D1** | P0 | 0008 migration not applied → DB empty |
| **Admin: categories list endpoint** | P0 | `admin-api.ts` calls wrong endpoint for category list |
| **Schema: gallery, sku, status** | P2 | Nice-to-have for advanced product management |

## Goals
1. Build `AdminCategories.tsx` — hierarchical CRUD with parent_id selector
2. Fix `AdminProducts.tsx` — brand_id dropdown + parent_id for category
3. Deploy all migrations to D1
4. Add `gallery` (JSON), `sku`, `status` columns to products (new migration)
5. Wire frontend filters to real API data

## Non-Goals
- WebP conversion pipeline (defer to next sprint)
- Product image gallery carousel on detail page (defer)
- Bulk import/export

## User Stories
1. **Admin** — As admin, I want to create categories (Camera giám sát, PCCC, etc.) with sub-categories (Camera IP, Camera PTZ)
2. **Admin** — As admin, I want to select a brand from a dropdown when creating products
3. **Admin** — As admin, I want to see existing products/brands/categories in the admin panel
4. **Admin** — As admin, I want to add dynamic specs (key-value) and feature tags to products
5. **Visitor** — As visitor, I want to filter products by category and brand from real DB data

## Success Criteria
- Admin can CRUD categories with hierarchy
- Admin can CRUD products with brand dropdown + specs + features
- Frontend `/san-pham` shows real DB products (not sample data)
- TypeScript build passes, zero errors

## Constraints
- Must deploy existing migrations 0001→0008 to D1
- Backend routes already exist — no backend changes needed for CRUD
- Admin UI must follow existing shadcn/ui pattern
