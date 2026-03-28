---
phase: design
feature: product-cms
---
# Product CMS — Design

## Architecture
No new backend routes needed — all CRUD APIs already exist. Focus is on:
1. New frontend admin page: `AdminCategories.tsx`
2. Enhanced `AdminProducts.tsx` with brand dropdown
3. New migration `0009` for gallery/sku/status columns
4. Deploy all migrations to production D1
5. Fix `admin-api.ts` category list endpoint

## Sprint Breakdown

### Sprint 1: Deploy Migrations + Fix API Endpoints
#### [RUN] Deploy migrations 0001→0008 to D1 production

#### [MODIFY] [admin-api.ts](file:///d:/GitHub/SongLinh_Website/src/lib/admin-api.ts)
- Fix `productCategories.list` endpoint (currently points to `/products/all`, should be `/products/categories` for public or a new admin endpoint)

#### [MODIFY] [products.ts](file:///d:/GitHub/SongLinh_Website/server/src/routes/products.ts)
- Add admin list-all endpoint: `GET /api/admin/products/categories/all` (returns ALL categories including inactive)
- Add `parent_id` support in category CREATE/UPDATE

---

### Sprint 2: AdminCategories Page
#### [NEW] [AdminCategories.tsx](file:///d:/GitHub/SongLinh_Website/src/pages/admin/AdminCategories.tsx)
- DataTable with columns: ID, Name (with indent for sub-categories), Slug, Parent, Product Count, Status
- FormDialog: name, slug, description, parent_id (dropdown of root categories), image upload, sort_order, is_active
- Use existing `CrudHelpers` pattern

#### [MODIFY] [router.tsx](file:///d:/GitHub/SongLinh_Website/src/router.tsx)
- Register `/admin/categories` route

#### [MODIFY] [AdminLayout.tsx](file:///d:/GitHub/SongLinh_Website/src/components/admin/AdminLayout.tsx)
- Add "Danh mục" nav link after "Thương hiệu"

---

### Sprint 3: Enhanced AdminProducts
#### [MODIFY] [AdminProducts.tsx](file:///d:/GitHub/SongLinh_Website/src/pages/admin/AdminProducts.tsx)
- Replace text `brand` field with searchable `brand_id` dropdown (fetching from brands query)
- Add `parent_id`-aware category dropdown (show hierarchy with indent)
- Ensure specs editor and features editor work correctly with JSON serialization

---

### Sprint 4: Schema Enhancement (Optional)
#### [NEW] [0009_product_enhancements.sql](file:///d:/GitHub/SongLinh_Website/server/migrations/0009_product_enhancements.sql)
```sql
ALTER TABLE products ADD COLUMN sku TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN gallery TEXT DEFAULT '[]';
ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'call-for-price';
```

---

## SQL Schema Summary (Current)
```sql
-- product_categories: id, slug, name, description, image_url, parent_id, sort_order, is_active
-- brands: id, slug, name, logo_url, description, website_url, sort_order, is_active
-- products: id, category_id, slug, name, description, brand, brand_id, model_number,
--           image_url, spec_sheet_url, specifications(JSON), features(JSON),
--           sort_order, is_active, meta_title, meta_description, created_at, updated_at
```

## Verification Plan
- Admin categories CRUD works (create Camera → create sub Camera IP)
- Admin products uses brand dropdown
- Frontend shows real DB data after migration deployment
- TypeScript build: zero errors
