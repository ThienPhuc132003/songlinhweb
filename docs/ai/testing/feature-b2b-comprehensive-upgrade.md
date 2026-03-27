---
phase: testing
feature: b2b-comprehensive-upgrade
---
# Testing — B2B Platform Comprehensive Upgrade

## Test Matrix

| Area | Test Type | Status |
|------|-----------|--------|
| WebP conversion pipeline | Browser test (Admin) | ⬜ |
| Product CRUD (Admin) | Browser test | ⬜ |
| D1 migration verification | CLI check | ⬜ |
| SolutionDetail layout | Visual inspection | ⬜ |
| ProductDetail template | Visual inspection | ⬜ |
| ProjectDetail sections | Visual inspection | ⬜ |
| BlogPost layout | Visual inspection | ⬜ |
| SEO meta tags | DOM check | ⬜ |
| R2 storage (WebP only) | Manual R2 dashboard | ⬜ |

## Browser Test Instructions

### 1. WebP Pipeline Test
1. Navigate to `http://localhost:5173/admin/products`
2. Click "Thêm mới"
3. In image upload field, select a `.png` file (> 500KB)
4. **Expected**: Spinner shows → WebP preview appears → size comparison shows reduction
5. Submit form
6. **Expected**: R2 receives `.webp` file (check network tab Content-Type)

### 2. Product CRUD Test
1. Create product with: name, slug, brand, model, specs JSON, features
2. Navigate to `/san-pham` → verify product appears
3. Click product → verify detail page shows specs table + features badges

### 3. SEO Verification
1. Navigate to any solution detail page
2. Open DevTools → `<head>` → check `<title>` and `<meta name="description">`
3. **Expected**: Uses `meta_title`/`meta_description` if set, falls back to `title`/`description`

## Manual Tests (Project Owner)
- [ ] Upload `.png`, `.jpg`, `.bmp` through admin → all convert to WebP
- [ ] Browse redesigned solution/project/product detail pages → visual quality OK
- [ ] Check product catalog shows seeded B2B data
- [ ] Verify PDF datasheet download works
