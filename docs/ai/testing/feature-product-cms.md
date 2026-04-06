---
phase: testing
feature: product-cms
---
# Product CMS — Testing Plan

## Status: ✅ Implemented (55 tests passing)

## Test Infrastructure
- **Framework**: Vitest 3.x + jsdom
- **Setup**: `src/__tests__/setup.ts` (jest-dom matchers)
- **Config**: `vite.config.ts` → `test` section
- **Scripts**: `npm test`, `npm run test:watch`, `npm run test:coverage`

## Test Files

### 1. [admin-api.test.ts](file:///d:/GitHub/SongLinh_Website/src/__tests__/admin-api.test.ts) — 8 tests
| Test | Category |
|------|----------|
| hasApiKey returns false when no key set | Auth |
| setApiKey stores key + hasApiKey returns true | Auth |
| clearApiKey removes key | Auth |
| setApiKey overwrite behavior | Auth |
| clearApiKey safe when no key | Auth |
| admin-api re-exports ProductCategory | Types |
| ProductCategory has correct shape | Types |
| ProductCategory supports product_count | Types |

### 2. [product-filters.test.ts](file:///d:/GitHub/SongLinh_Website/src/__tests__/product-filters.test.ts) — 31 tests
| Group | Tests |
|-------|-------|
| filterByCategory | 4 (all, camera, non-existent, single) |
| filterByBrand | 4 (all, case-insensitive, uppercase, unknown) |
| filterBySearch | 7 (all, name, model, brand, description, multi-match, case) |
| filterByTags | 7 (all, single, multiple AND, case, empty, JSON string, malformed) |
| Combined Filters | 3 (category+brand, category+tag, search+tag) |
| Pagination | 6 (page1, page2, out-of-range, total calc, empty, single-page) |

### 3. [category-hierarchy.test.ts](file:///d:/GitHub/SongLinh_Website/src/__tests__/category-hierarchy.test.ts) — 16 tests
| Group | Tests |
|-------|-------|
| sortCategoriesHierarchically | 5 (root-first, children grouped, sort preserved, empty, root-only) |
| getRootCategories | 2 (filter roots, exclude specific ID) |
| getChildCategories | 3 (camera children, single child, no children) |
| Category Validation | 4 (circular ref, 2-level depth, slug format, uniqueness) |
| Active/Inactive | 2 (active filter, admin view includes inactive) |

## Coverage Gaps (Deferred)
- No component render tests (need mock for react-query + router)
- No E2E tests for admin CRUD flows (need Playwright setup)
- No backend API integration tests (need Cloudflare Workers test harness)

## Results
```
✓ src/__tests__/product-filters.test.ts (31 tests)
✓ src/__tests__/category-hierarchy.test.ts (16 tests)
✓ src/__tests__/admin-api.test.ts (8 tests)

Test Files  3 passed (3)
     Tests  55 passed (55)
  Duration  4.40s
```
