---
phase: requirements
feature: b2b-ecosystem-finalize
status: draft
created: 2026-03-31
---
# B2B Ecosystem Finalize — Requirements

## Problem Statement

Hệ thống SLTech hiện tại thiếu các ràng buộc dữ liệu (deletion constraints), chưa có audit trail, và thiếu nhiều tính năng B2B thiết yếu (product comparison, PDF datasheet, breadcrumbs, social proof). Admin panel chưa hỗ trợ bulk actions và dashboard analytics. Frontend chưa tối ưu SEO (missing sitemap, robots.txt) và chưa có edge caching.

## Goals

1. **Data Integrity**: Bảo vệ dữ liệu khỏi xóa nhầm (deletion constraints, soft delete)
2. **Admin Efficiency**: Bulk actions, dashboard widgets, audit logging
3. **B2B User Experience**: Product comparison, PDF datasheet, breadcrumbs, social proof
4. **Performance & SEO**: Edge caching, dynamic sitemap.xml, robots.txt

## Non-Goals

- Pricing/e-commerce functionality (B2B = báo giá, không bán online)
- User authentication system (admin dùng API key)
- Multi-language support
- Real-time features (websockets)

## User Stories

### Task 1: Data Integrity & Safety

- **US-1.1**: As an Admin, I want to be prevented from deleting a Category that has products, so that I don't accidentally orphan products.
- **US-1.2**: As an Admin, I want to be prevented from deleting a Brand that has products, so that product-brand relationships stay intact.
- **US-1.3**: As an Admin, I want a clear error message when deletion is blocked, so I know *why* and *what* to fix first.
- **US-1.4**: As an Admin, I want to "soft-delete" products instead of permanently removing them, so that deleted products can be recovered.

### Task 2: Admin Efficiency

- **US-2.1**: As an Admin, I want to select multiple products and perform bulk actions (change status, change category, delete), so I can manage inventory efficiently.
- **US-2.2**: As an Admin, I want a Dashboard showing Total Products, Total Brands, Categories with counts, and Recently Added Products, so I have a quick operational overview.
- **US-2.3**: As an Admin, I want an audit log tracking who changed what entity and when, so I have accountability and traceability.

### Task 3: B2B User Experience

- **US-3.1**: As a User, I want dynamic breadcrumbs on Product/Solution pages, so I can navigate easily.
- **US-3.2**: As a User, I want to compare up to 3 products side-by-side (specs, features, brand), so I can make informed purchasing decisions.
- **US-3.3**: As a User, I want to download a branded PDF datasheet for a product, so I can share it internally or with procurement.
- **US-3.4**: As a User, I want to see which Projects used a specific product, so I have social proof and confidence in the product.

### Task 4: Performance & SEO

- **US-4.1**: As a User, I want the product catalog to load in sub-second times, so I have a smooth browsing experience.
- **US-4.2**: As a Search Engine, I want a dynamic `sitemap.xml` with all published products/projects/solutions, so indexing is complete.
- **US-4.3**: As a Search Engine, I want a proper `robots.txt` that excludes admin routes, so crawling is efficient.

## Success Criteria

| Criteria | Metric |
|----------|--------|
| Deletion constraint | 400/409 error with message when attempting to delete linked category/brand |
| Soft delete | Products with `deleted_at IS NOT NULL` excluded from all public queries |
| Bulk actions | Select 5+ products and bulk-update status in < 3 clicks |
| Dashboard | Shows real-time counts within 1s |
| Audit log | Every CREATE/UPDATE/DELETE on products/categories/brands logged |
| Product comparison | Side-by-side table for 2-3 products with all specs |
| PDF datasheet | < 3s generation, branded header/footer, all specs included |
| Social proof | "Dự án sử dụng sản phẩm này" section on ProductDetail |
| Cache | Product listing TTFB < 200ms after first load |
| Sitemap | Auto-updated XML with `<lastmod>` based on `updated_at` |

## Constraints

### Technical
- **Database**: Cloudflare D1 (SQLite) — no native FK enforcement at runtime, constraints must be application-level
- **Backend**: Hono on Cloudflare Workers — no long-running processes, 50ms CPU time per request
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + framer-motion
- **PDF**: Must work client-side (no server PDF generation on Workers)
- **Caching**: Cloudflare Cache API available on Workers

### Design
- Must maintain "Bright Engineering" UI style (blue/slate palette, clean typography)
- All new admin components must use existing `CrudHelpers.tsx` patterns (DataTable, PageHeader, etc.)
- No new external dependencies > 100KB gzipped without discussion

### Data
- D1 does not support `ALTER TABLE DROP COLUMN` — schema additions only
- D1 does not enforce FK constraints at runtime — must implement in application layer
- All new columns must be nullable or have defaults for backward compatibility

## Technical Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| `@react-pdf/renderer` | Client-side PDF generation | NEW — needs install |
| Cloudflare Cache API | Edge caching for product listings | Available (Workers runtime) |
| `lucide-react` | Icons for comparison/breadcrumb UI | Already installed |
| `shadcn/ui` | UI components (Dialog, Table, Checkbox) | Already installed |

## Scope Breakdown (Priority Order)

| Module | Tasks | Priority | Est. Effort |
|--------|-------|----------|-------------|
| Data Integrity | Deletion constraints + soft delete | 🔴 P0 | Medium |
| Admin Dashboard | Widget cards + recent products | 🟡 P1 | Small |
| Breadcrumbs | Dynamic on Product/Solution pages | 🟡 P1 | Small |
| Bulk Actions | Product list checkboxes + menu | 🟡 P1 | Medium |
| Audit Logging | Table + write middleware | 🟡 P1 | Medium |
| Product Comparison | Select + side-by-side table | 🟡 P1 | Large |
| Social Proof | "Used in Projects" section | 🟢 P2 | Small |
| PDF Datasheet | @react-pdf/renderer integration | 🟢 P2 | Large |
| Edge Caching | Cache-Control on Workers | 🟢 P2 | Small |
| SEO Automation | sitemap.xml + robots.txt | 🟢 P2 | Medium |

## Open Questions

> [!IMPORTANT]
> 1. **PDF Library**: Nên dùng `@react-pdf/renderer` (rich but 500KB+) hay `jspdf` (lighter but less styling)? → Recommend `@react-pdf/renderer` for branded output.
> 2. **Audit Log Viewer**: Admin cần UI xem audit logs hay chỉ lưu DB để debug? → Recommend: Simple list view ban đầu.
> 3. **Product Comparison**: Giới hạn 3 sản phẩm hay cho phép nhiều hơn? → Recommend: Max 3 (UX best practice cho side-by-side).
> 4. **Social Proof**: Liên kết Product → Project bằng cách nào? → Recommend: Tạo junction table `project_products` hoặc match qua `brands_used` JSON field trong projects.
