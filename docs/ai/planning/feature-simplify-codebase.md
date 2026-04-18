---
phase: planning
feature: simplify-codebase
status: done
---
# Planning — Simplify Codebase

## Task Breakdown

### Phase 1 — Quick Wins (Low Risk, ~1h) ✅ COMPLETE

- [x] **T1**: Remove dead `StatsBar.tsx` component (0 imports, confirmed unused)
- [x] **T2**: Simplify `router.tsx` — create `lazyRoute()` helper, reduce 27 repetitions to one-liners (296 → 113 LOC, -62%)
- [x] **T3**: Add `CategoryTreeNode` type to `types/index.ts`, fix `any` in Header.tsx mega-menu (4 instances eliminated)
- [x] **T4**: DRY cache middleware in `server/src/index.ts` — extract shared middleware function (30 → 12 LOC)

### Phase 2 — Frontend Component Extractions (Low Risk, ~2h) ✅ COMPLETE

- [x] **T5**: Extract `ProductCard` from `Products.tsx` → `components/products/ProductCard.tsx` (520 → 281 LOC, -46%)
- [x] **T6**: Extract `ProductImageGallery` from `ProductDetail.tsx` → `components/products/ProductImageGallery.tsx`
- [x] **T7**: Extract `ProductSidebar` from `ProductDetail.tsx` → `components/products/ProductSidebar.tsx`
- [x] **T8**: Extract `ProductSpecTable` from `ProductDetail.tsx` → `components/products/ProductSpecTable.tsx`
- [x] **T9**: ~~Move BlogPost prose className to CSS~~ — SKIPPED (already decomposed in prior refactor)
- [x] **T10**: ~~Extract `useCountUp` hook from `About.tsx`~~ — SKIPPED (pattern does not exist)

### Phase 3 — Backend DRY + Constants Cleanup (Medium Risk, ~1.5h) ✅ COMPLETE

- [x] **T11**: Create `server/src/lib/query-builder.ts` with `buildDynamicUpdate` helper
- [x] **T12**: Refactor `products.ts` PUT route to use `buildDynamicUpdate` (-22 LOC)
- [x] **T13**: Refactor ALL remaining routes to use `buildDynamicUpdate`:
  - [x] `projects.ts` (-32 LOC)
  - [x] `posts.ts` (-45 LOC)
  - [x] `brands.ts` (-16 LOC)
  - [x] `partners.ts` (-19 LOC)
  - [x] `features.ts` (-28 LOC)
  - [x] `solutions.ts` (-17 LOC)
  - [x] `gallery.ts` — albums PUT (-7 LOC) + images PUT (-3 LOC)
  - [x] `products.ts` — categories PUT (-28 LOC)
- [x] **T14**: Migrate `Footer.tsx` from static `SOLUTIONS_DATA` to dynamic `useSolutions()`
- [x] **T15**: Remove `SOLUTIONS_DATA` from `constants.ts` (-78 LOC)
- [x] **T16**: Mark `FEATURED_PROJECTS` and `BLOG_POSTS` with `@deprecated` comments

### Phase 4 — Shared Hooks + Polish (Low Risk, ~1h) ✅ COMPLETE

- [x] **T17**: Create `useProductActions` hook for shared compare/cart logic
- [x] **T18**: Refactor `ProductDetail.tsx` to use `useProductActions` — removes inline compare/cart callbacks

## Validation

- [x] `npx tsc --noEmit` — zero errors ✅
- [x] `npm run build` (Vite) — compiled successfully ✅
- [ ] Visual spot-check in dev — recommended next step

## Summary of Changes

| Metric | Before | After | Delta |
|---|---|---|---|
| `router.tsx` | 296 LOC | 113 LOC | -62% |
| `Products.tsx` | 520 LOC | 281 LOC | -46% |
| `ProductDetail.tsx` | 643 LOC | 408 LOC | -37% |
| `constants.ts` | 283 LOC | 205 LOC | -28% |
| Backend route boilerplate | ~217 LOC across 9 builders | ~36 LOC (helper calls) | -83% |
| `any` types in Header.tsx | 4 instances | 0 | -100% |
| Dead components | 1 (StatsBar.tsx) | 0 | removed |
| New shared utilities | — | `query-builder.ts`, `useProductActions.ts` | +102 LOC |
| New components | — | `ProductCard`, `ProductImageGallery`, `ProductSpecTable`, `ProductSidebar` | extracted |
| New type | — | `CategoryTreeNode` | added |
