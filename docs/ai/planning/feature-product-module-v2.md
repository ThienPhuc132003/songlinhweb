---
phase: planning
feature: product-module-v2
---
# Product Module v2 — Planning

## Task Breakdown

### Sprint A: Brand Color Fix (Est: 1 task, ~10 min)
- [ ] **A.1** Fix `globals.css` — restore `--primary` to SLTECH blue oklch values (light + dark mode)

### Sprint B: Seed Data Migration (Est: 1 task, ~20 min)
- [ ] **B.1** Create `0003_seed_data.sql` — INSERT categories (10), brands (2 extra: Grandstream, Legrand), products (14 from SAMPLE_PRODUCTS)

### Sprint C: Frontend Fixes (Est: 4 tasks, ~30 min)
- [ ] **C.1** Fix product count display (use `products.length` when fallback)
- [ ] **C.2** Change grid to 4-col: `xl:grid-cols-4`
- [ ] **C.3** Add feature/tag filter (client-side, checkbox UI with common tags)
- [ ] **C.4** Fix pagination (client-side slicing for sample data)

### Sprint D: Admin Pages (Est: 4 tasks, ~40 min)
- [ ] **D.1** Create `AdminBrands.tsx` — full CRUD with logo upload
- [ ] **D.2** Verify/create `AdminCategories.tsx` — parent_id hierarchy
- [ ] **D.3** Enhance `AdminProducts.tsx` — add brand_id selector
- [ ] **D.4** Add `brands` methods to `admin-api.ts` + register admin routes in router

### Sprint E: Verification (Est: 2 tasks, ~15 min)
- [ ] **E.1** TypeScript build check
- [ ] **E.2** Visual QA in browser (color, grid, filters, pagination, admin)

## Implementation Order
A → B → C → D → E (sprints are mostly independent, A and C can overlap)

## Risks
| Risk | Mitigation |
|------|-----------|
| oklch conversion inaccurate | Use online oklch converter, test visually |
| Seed data FK violations | Ensure brands INSERT before products |
| Admin route conflicts | Follow existing registration pattern |

## Total Estimated Effort: ~2 hours
