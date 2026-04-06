---
phase: design
feature: case-study-system
status: approved
created: 2026-04-04
---
# Case Study System — Design

## Architecture
### Backend
- Migration 0017: Add `challenges`, `outcomes`, `testimonial_name`, `testimonial_content`, `video_url` to `projects` table
- Update `ProjectRow` type + `fields` array in PUT/POST routes

### Frontend Admin
- Rewrite `ProjectFormSheet.tsx` to full-screen 2-column layout (70/30):
  - Left (70%): 2 Tabs — "Nội dung chi tiết" (Markdown + Challenges/Outcomes) + "Hình ảnh Gallery" (large grid uploader)
  - Right (30%): Sticky sidebar — Key Metrics, Project Info, Linkages, SEO, Testimonial

### Frontend Public
- New: `InfographicStats` — 3-4 big numbers after hero (glassmorphism cards)
- Upgrade: `ProjectGallery` → Masonry grid layout
- New: `TestimonialBlock` — Quote with client name
- Upgrade: Bottom CTA → "Discuss a similar project" full-width section

## Components
### New
- `InfographicStats.tsx` — Big number stats (glassmorphism, monospace)
- `TestimonialBlock.tsx` — Client quote block
- Migration `0017_case_study_fields.sql`

### Modified
- `ProjectFormSheet.tsx` — Full-screen 2-column
- `ProjectDetail.tsx` — Add Infographic + Testimonial sections
- `ProjectGallery.tsx` — Masonry layout
- `server/src/types.ts` — Add new ProjectRow fields
- `server/src/routes/projects.ts` — Add new fields to INSERT/UPDATE
- `src/types/index.ts` — Update Project interface
- `src/lib/admin-api.ts` — Update Project type
