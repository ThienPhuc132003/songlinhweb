---
phase: planning
feature: product-module
---
# Product Module — Planning

## Task Breakdown

### Sprint 1: Database & Backend (Est: 4 tasks)
- [x] **T1.1** Create migration `0002_product_module.sql` — brands table + ALTER products
- [x] **T1.2** Add `BrandRow` type to `server/src/types.ts`
- [x] **T1.3** Create `server/src/routes/brands.ts` — CRUD endpoints
- [x] **T1.4** Enhance `products.ts` — add brand filter, include brand data in responses

### Sprint 2: Admin UI (Est: 3 tasks)
- [x] **T2.1** API layer: brands API client in `api.ts` + `useBrands` hook
- [x] **T2.2** Enhance products API to accept brand filter param
- [ ] **T2.3** _(Deferred)_ Create `AdminBrands.tsx` — CRUD with logo upload + enhance AdminProducts

### Sprint 3: Product Catalog Redesign (Est: 4 tasks)
- [x] **T3.1** Create `CategorySidebar` component (collapsible tree)
- [x] **T3.2** Create `BrandFilter` + `ProductSearchBar` components
- [x] **T3.3** Redesign `Products.tsx` — sidebar layout, filters, search, pagination
- [x] **T3.4** Refine `ProductCard` component — B2B design

### Sprint 4: Product Detail Page (Est: 3 tasks)
- [x] **T4.1** Redesign `ProductDetail.tsx` — gallery, brand info, "Yêu cầu báo giá" CTA
- [x] **T4.2** Add `RelatedProducts` section + enhanced specs table
- [x] **T4.3** Add downloads section for datasheets

### Sprint 5: Navbar Mega Menu (Est: 1 task)
- [x] **T5.1** Create `ProductsDropdown` in Header — 4-column mega menu

## Implementation Order
1. Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5

## Status: 14/15 tasks complete. T2.3 (Admin UI pages) deferred.
