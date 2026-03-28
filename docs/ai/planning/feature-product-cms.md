---
phase: planning
feature: product-cms
---
# Product CMS — Planning

## Task Breakdown

### Sprint 1: Deploy Migrations + Fix API (Est: 15 min)
- [ ] **1.1** Deploy migrations 0001→0008 to D1 production via `wrangler d1 execute`
- [ ] **1.2** Add admin categories list-all endpoint in `products.ts` (return ALL including inactive + parent_id)
- [ ] **1.3** Fix `admin-api.ts` category list endpoint + add `parent_id` to ProductCategory type
- [ ] **1.4** Redeploy worker after backend changes

### Sprint 2: AdminCategories Page (Est: 25 min)
- [ ] **2.1** Create `AdminCategories.tsx` — hierarchical CRUD with parent_id selector
- [ ] **2.2** Register route in `router.tsx` + add nav link in `AdminLayout.tsx`
- [ ] **2.3** Add `categories` namespace to `admin-api.ts` (if not already correct)

### Sprint 3: Enhanced AdminProducts (Est: 15 min)
- [ ] **3.1** Replace text `brand` field with `brand_id` dropdown (from brands query)
- [ ] **3.2** Add hierarchy-aware category dropdown (indented sub-categories)

### Sprint 4: Schema Enhancement (Est: 10 min)
- [ ] **4.1** Create `0009_product_enhancements.sql` (sku, gallery, status columns)
- [ ] **4.2** Update backend INSERT/UPDATE to handle new columns
- [ ] **4.3** Update AdminProducts form to include SKU, status, gallery fields

### Sprint 5: Verification (Est: 10 min)
- [ ] **5.1** TypeScript build check
- [ ] **5.2** Browser QA: admin CRUD test (categories → brands → products)
- [ ] **5.3** Frontend sync: verify real DB data shows on `/san-pham`

## Implementation Order
Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5

## Risks
| Risk | Mitigation |
|------|-----------|
| Migration conflicts on D1 | Run in order, use INSERT OR IGNORE |
| Category parent_id cycles | Only allow 2-level hierarchy (root + child) |
| Backend route not found | Verify wrangler deploy succeeds |

## Total Estimated Effort: ~1.5 hours
