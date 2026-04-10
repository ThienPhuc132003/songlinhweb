---
phase: requirements
feature: product-ui-sync
---
# Requirements: Product UI Sync

## Problem Statement

The SLTECH product catalog pages (listing + detail) have several UX issues:
1. **Junk test data** — Products named "TestSp", "Axis-CO" pollute the catalog and break visual testing.
2. **Listing page sidebar** — Filter sections (Danh mục, Thương hiệu, Tính năng) are always expanded, consuming excessive vertical space on smaller screens.
3. **Product card inconsistencies** — Action buttons (Add to Quote, Compare) float in an absolute position that overlaps card content, and card heights are inconsistent.
4. **Detail page layout** — The specs table, features, and CTA sidebar need refinement to match the "Editorial Technical B2B" design language.

## Goals

1. **Data Seeding**: Remove test products and insert 3 realistic ELV products (Hikvision camera, Cisco switch, Legrand cable) with proper specs JSON.
2. **Listing Page UX**: Make sidebar filter sections collapsible using shadcn `Accordion`. Redesign product cards with consistent heights and a clean hover-reveal action bar.
3. **Detail Page UX**: Refine the hero gallery (main image + thumbnails), summary sidebar (brand, SKU, CTA), and specs table (full-width striped layout).

## Non-Goals

- **NO new database tables** for Brands, Categories, or Features — use existing D1 schema.
- No changes to the admin `ProductFormSheet.tsx` — all frontend changes must map to existing dynamic JSON fields.
- No changes to the Cart/Quote workflow logic — only visual adjustments to cart-related buttons.
- No backend API changes — only SQL data operations and frontend UI refactoring.

## User Stories

1. As an **admin**, I want junk test data removed so the product catalog looks professional.
2. As a **visitor**, I want collapsible sidebar filters so I can save screen space and focus on products.
3. As a **visitor**, I want clean product cards with consistent heights so the grid looks professional.
4. As a **visitor**, I want the product detail page to clearly show specs, features, and CTAs in a structured layout.

## Success Criteria

1. No test/junk products appear in the catalog.
2. Sidebar filters collapse/expand via Accordion.
3. Product cards all have equal heights and action buttons appear on hover as a bottom bar.
4. Product detail page: large main image, thumbnail row, striped specs table, hover zoom.
5. "Add to Quote" and "Compare" buttons still work correctly after UI changes.

## Constraints

- **Rule 1**: DO NOT create new database tables. Use existing D1 schema.
- **Rule 2**: Frontend changes must map to `ProductFormSheet.tsx` JSON fields.
- **Rule 3**: Respect WebP Image Pipeline for product galleries.
- **Tech Stack**: React 19 (Vite), shadcn/ui, framer-motion, existing API hooks.

## Open Questions

None — requirements are fully specified by the user.
