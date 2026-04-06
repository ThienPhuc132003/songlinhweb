---
phase: design
feature: project-portfolio-v2
status: approved
created: 2026-04-04
---
# Technical Portfolio V2 — Design

## Architecture
No backend changes. Pure frontend refactor:
- Admin: ProjectFormSheet (max-w-6xl + Tabs) + KeyMetricsEditor
- Frontend: Hero/Sidebar/MetricsBar redesign + QA Badge

## Components
### New
- `ProjectFormSheet.tsx` — Tabbed admin form dialog
- `KeyMetricsEditor.tsx` — Dynamic key-value pairs editor
- `QualityAssuranceBadge.tsx` — Footer QA section

### Modified
- `AdminProjects.tsx` — Swap FormDialog → ProjectFormSheet
- `ProjectHero.tsx` — Lighter gradient + metadata inline
- `ProjectInfoSidebar.tsx` — Add Systems/Brands, rename to "Project Specs"
- `ProjectMetricsBar.tsx` — PDF-style with accent border + monospace
- `ProjectDetail.tsx` — Reorder sections, add QA badge

## Design Decisions
- Use existing `Tabs` + `Dialog` shadcn components
- No external dependencies needed
- Typography: Inter (body), Roboto Mono (metrics)
