---
phase: requirements
feature: b2b-portfolio
status: draft
created: 2026-04-04
---
# B2B Professional Portfolio — Requirements

## Problem Statement

The current 'Dự án' (Projects) module on the Song Linh Technologies website functions as a basic listing page with minimal project data. It lacks the depth and professionalism expected by high-end B2B corporate clients (Technical Directors, Procurement Managers) who need to evaluate the company's track record.

**Current gaps:**
- No `completion_year` field (only a generic `year` which is integer, needs to be string-friendly)
- No dedicated `gallery` JSON column — images are managed via `entity_images` junction table (functional but limited for API convenience)
- No `related_solutions` or `related_products` relational JSON fields for cross-referencing
- No `seo_metadata` JSON for per-project SEO control
- Admin form lacks a proper multi-image uploader with WebP conversion (already exists via `ImageUploadField` but gallery sync needs improvement)
- Admin list view lacks quick toggles for Featured/Active status
- Frontend project listing cards are not fully uniform in height
- Project detail page is a basic single-column layout without hero section, sidebar, or product showcase

## Goals

1. **G1 — Schema Enhancement**: Extend the `projects` table with `completion_year` (TEXT), `gallery` (JSON), `related_solutions` (JSON), `related_products` (JSON), and `seo_metadata` (JSON) columns
2. **G2 — Admin UX Upgrade**: Add searchable multi-select for Solutions and Products linkage, quick toggles for Featured/Active in list view, and improve gallery management
3. **G3 — Listing Page Refinement**: Uniform card heights with `flex-col` + `mt-auto`, `aspect-video` for covers, `line-clamp-2` for titles, smooth category filtering without page reload
4. **G4 — Project Detail Showcase**: New layout with Hero + Sidebar + Content + Gallery + Used Equipment sections

## Non-Goals

- **N1**: Price/cost information display — this is a B2B system, no pricing
- **N2**: User authentication / login for end-users — admin-only auth
- **N3**: Full CMS migration — keep Cloudflare D1 + R2 architecture
- **N4**: Video gallery support — images only for this phase
- **N5**: Project comparison feature — not in scope

## User Stories

### Admin (Song Linh Staff)
- **US1**: As an admin, I want to add completion year, location, and client name to projects, so that project metadata is complete for portfolio presentation
- **US2**: As an admin, I want to upload multiple gallery images with automatic WebP conversion, so that project showcases have rich visual content
- **US3**: As an admin, I want to link related solutions and products to a project, so that cross-referencing is automated
- **US4**: As an admin, I want to quickly toggle Featured/Active status from the list view, so that I can manage project visibility efficiently
- **US5**: As an admin, I want per-project SEO metadata (meta title, description), so that each project page ranks well in search engines

### End User (B2B Client — Technical Director)
- **US6**: As a technical director evaluating SLTECH, I want to see project cards with consistent layout and cover images, so that I can quickly browse the portfolio
- **US7**: As a technical director, I want to filter projects by industry category (Commercial, Industrial, etc.), so that I can find relevant case studies
- **US8**: As a technical director, I want a professional project detail page with hero image, project info sidebar, image gallery, and used equipment section, so that I can evaluate SLTECH's capabilities
- **US9**: As a potential client, I want to see which products SLTECH used in a project, so that I can assess their technical expertise and product portfolio

## Success Criteria

| # | Criterion | Metric |
|---|-----------|--------|
| SC1 | All new DB columns added without breaking existing data | Migration runs without errors; existing projects load correctly |
| SC2 | Admin can CRUD projects with all new fields | Create, edit, delete flow works end-to-end |
| SC3 | Gallery upload works with WebP conversion | Images uploaded and displayed correctly |
| SC4 | Project listing cards have uniform height | Visual consistency across all cards |
| SC5 | Category tabs filter without page reload | Smooth client-side filtering |
| SC6 | Project detail shows Hero + Sidebar + Gallery + Equipment | All 4 sections render correctly |
| SC7 | Solutions/Products relational selectors work | Can link and display related items |

## Constraints

- **C1**: Database: Cloudflare D1 (SQLite) — no ALTER TABLE DROP COLUMN support; additive migrations only
- **C2**: Storage: Cloudflare R2 for images, WebP format preferred
- **C3**: Frontend: React + TypeScript + TailwindCSS + shadcn/ui — maintain existing patterns
- **C4**: Backend: Hono on Cloudflare Workers — maintain existing API patterns
- **C5**: Existing data must be preserved — backward-compatible schema changes
- **C6**: Maintain 'Bright Engineering' aesthetic — professional, clean, trust-building for corporate clients

## Open Questions

1. ~~Should `completion_year` be TEXT or INTEGER?~~ → **Decision: TEXT** (allows "Q1 2024", "2023–2024" ranges)
2. ~~Should `gallery` be stored as JSON column or continue using `entity_images` table?~~ → **Decision: Keep `entity_images` for DB-level management + add `gallery` JSON for API convenience.** Actually, we'll continue using `entity_images` only to avoid data duplication. The API response already includes `images[]` from `entity_images`.
3. `related_solutions` and `related_products`: Store as JSON arrays of IDs or use junction tables? → **Decision: JSON arrays** for simplicity since D1 is SQLite and the relationship cardinality is low
4. Should the project detail layout use a 2-column (content + sidebar) or single-column with inline info? → **Decision: 2-column with content area + sidebar for project info**
