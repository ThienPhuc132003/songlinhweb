---
phase: planning
feature: b2b-ecosystem-finalize
status: in-progress
created: 2026-03-31
---
# B2B Ecosystem Finalize — Planning

## Module 1: Data Integrity & Safety (P0)

### Task 1.1: Database Migration
- [x] Create `0013_b2b_ecosystem.sql` with:
  - `products.deleted_at` column
  - `audit_logs` table + indexes
  - `project_products` junction table
- [x] Apply migration locally
- [x] Apply migration to remote D1

### Task 1.2: Soft Delete for Products
- [x] Update `DELETE /api/admin/products/:id` → SET `deleted_at` instead of DELETE
- [x] Add `POST /api/admin/products/:id/restore` endpoint
- [x] Add `AND deleted_at IS NULL` to ALL public product queries
- [x] Update admin product list to show deleted items with visual indicator

### Task 1.3: Deletion Constraints
- [x] Add pre-delete check to `DELETE /api/admin/product-categories/:id`
- [x] Add pre-delete check to `DELETE /api/admin/brands/:id`
- [x] Return 409 with descriptive error message
- [ ] Update AdminCategories.tsx to show DeletionErrorDialog
- [ ] Update AdminBrands.tsx to show DeletionErrorDialog

### Task 1.4: Audit Logging
- [x] Create audit helper function `logAudit(db, entity_type, entity_id, action, changes)`
- [x] Add audit calls to product CREATE/UPDATE/DELETE/RESTORE
- [x] Add audit calls to category CREATE/UPDATE/DELETE
- [x] Add audit calls to brand CREATE/UPDATE/DELETE
- [x] Add `GET /api/admin/audit-logs` endpoint
- [x] Deploy backend

---

## Module 2: Admin Efficiency (P1)

### Task 2.1: Enhanced Dashboard
- [x] Create `GET /api/admin/dashboard/stats` endpoint
- [x] Update AdminDashboard.tsx with product/brand/category counts
- [x] Add "Sản phẩm mới thêm gần đây" table widget

### Task 2.2: Bulk Actions
- [x] Create `POST /api/admin/products/bulk` endpoint
- [x] Add checkbox column to product DataTable
- [x] Create BulkActionMenu component (status, category, delete)
- [x] Wire bulk actions with confirmation dialogs

### Task 2.3: Audit Log Viewer
- [ ] Create AdminAuditLogs.tsx page
- [ ] Add route + sidebar link
- [ ] Display paginated audit entries with filters

---

## Module 3: B2B User Experience (P1)

### Task 3.1: Breadcrumbs Enhancement
- [ ] Verify existing Breadcrumb component on Products/ProductDetail
- [ ] Add breadcrumbs to Solution pages if missing
- [ ] Ensure category hierarchy in product breadcrumbs

### Task 3.2: Product Comparison
- [ ] Create CompareContext (React Context for selected products)
- [ ] Add "Compare" button to ProductCard
- [ ] Create CompareDrawer (floating bottom bar)
- [ ] Create CompareTable (side-by-side specs)
- [ ] Add `GET /api/products/compare?ids=1,2,3` endpoint

### Task 3.3: Social Proof — Used in Projects
- [ ] Create admin UI to assign products to projects (in AdminProjects form)
- [ ] Update `GET /api/products/:slug` to include `used_in_projects`
- [ ] Create UsedInProjects component for ProductDetail

### Task 3.4: PDF Datasheet
- [ ] Install `@react-pdf/renderer`
- [ ] Create ProductPDF document component
- [ ] Add "Tải datasheet" button on ProductDetail
- [ ] Include: header, product info, specs table, features, footer

---

## Module 4: Performance & SEO (P2)

### Task 4.1: Edge Caching
- [x] Add Cache-Control headers to public product endpoints
- [ ] Add cache-bust on admin mutations (purge)

### Task 4.2: SEO Automation
- [x] Create `GET /sitemap.xml` route
- [x] Create `GET /robots.txt` route
- [x] Include products, projects, solutions, static pages
- [ ] Deploy and verify with Google Search Console

---

## Execution Order

1. **Module 1** → Data safety first (foundation for all other modules)
2. **Module 2** → Admin efficiency (improves workflow for remaining tasks)
3. **Module 3** → B2B UX features (user-facing value)
4. **Module 4** → SEO/Performance (polish layer)
