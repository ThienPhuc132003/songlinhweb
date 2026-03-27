---
phase: planning
feature: project-case-study-restructure
status: done
---

# Project Case Study Restructure — Planning

## Section 1: Backend Schema Expansion
- [x] Create D1 migration `0004_project_case_study_fields.sql` (8 new columns)
- [x] Update `ProjectRow` type in `server/src/types.ts`
- [x] Update `projects.ts` route — parse JSON fields on read, accept new fields on create/update

## Section 2: Frontend Components
- [x] Create `ProjectMetricsBar` component (key numbers display)
- [x] Create `ProjectSystemsList` component (system tags + brand tags)
- [x] Create `ProjectComplianceBadges` component (standards badges)

## Section 3: ProjectDetail Page Restructure
- [x] Refactor `ProjectDetail.tsx` — integrate new components, contextual CTAs
- [x] Remove framer-motion from ProjectDetail → useScrollReveal

## Section 4: Admin Form Expansion
- [x] Update `AdminProjects.tsx` — add fields for system_types, brands, metrics, compliance, industry

## Section 5: Types Sync
- [x] Update `src/types/index.ts` — public API Project type
- [x] Update `src/lib/admin-api.ts` — admin Project type
- [x] TypeScript check passed ✅
