---
phase: planning
feature: solution-hardcode-redesign
---
# Solution Hardcode Redesign — Planning

## Task Breakdown

### Sprint 1: Data Layer + Backend Cleanup (P0)

#### Task 1.1: Create Solution Data Files
- Create `src/data/solutions/types.ts` — SolutionData interface
- Create 11 solution data files (cctv.ts, access-control.ts, etc.)
- Create `src/data/solutions/index.ts` — export SOLUTIONS array
- **Content**: Research ELV specs từ Hikvision, Honeywell, ZKTeco, Bosch, TOA docs
- **Est**: 30 min

#### Task 1.2: Backend Cleanup
- DELETE `server/src/routes/solutions.ts`
- MODIFY `server/src/index.ts` — remove solution route imports
- MODIFY `src/hooks/useApi.ts` — remove useSolutions/useSolution
- DELETE `src/pages/admin/AdminSolutions.tsx`
- **Est**: 10 min

#### Task 1.3: Update Existing Components
- MODIFY `SolutionCards.tsx` — import from `@/data/solutions` thay vì `useApi`
- MODIFY `Solutions.tsx` — same, remove API dependency
- **Est**: 5 min

---

### Sprint 2: Solution Detail Components (P0)

#### Task 2.1: Core Layout Components
- Create `src/components/solutions/SolutionHero.tsx`
- Create `src/components/solutions/ConsultCTA.tsx` (sticky sidebar)
- **Est**: 20 min

#### Task 2.2: Content Sections
- Create `src/components/solutions/TechExcellenceGrid.tsx`
- Create `src/components/solutions/SystemArchitecture.tsx`
- Create `src/components/solutions/TechSpecsTable.tsx`
- Create `src/components/solutions/ImplementationWorkflow.tsx`
- **Est**: 30 min

#### Task 2.3: Project Linkage
- Create `src/components/solutions/RelatedProjects.tsx` — fetch from D1 API
- **Est**: 10 min

#### Task 2.4: Rewrite SolutionDetail.tsx
- Compose all components into single page
- Add sticky sidebar layout
- **Est**: 15 min

---

### Sprint 3: Polish + Verification (P1)

#### Task 3.1: Typography + Visual
- Add Roboto Mono Google Font for specs
- Fine-tune shadows, spacing, responsive
- **Est**: 10 min

#### Task 3.2: Testing
- `tsc --noEmit` pass
- Browser verify all 11 solution pages
- Mobile responsive check
- **Est**: 15 min

## Execution Order

```
1.1 (Data) → 1.2 (Backend) → 1.3 (Components) → 2.1 (Hero+CTA) → 2.2 (Sections) → 2.3 (Projects) → 2.4 (Detail) → 3.1 (Polish) → 3.2 (Test)
```

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| DB table `solutions` still exists | Don't drop table, just remove API routes. Data stays dormant. |
| Admin users confused | Solutions section hidden from admin nav. Other entities unchanged. |
| 11 data files bloat | Each ~50 lines, total ~550 lines. Acceptable for B2B content. |
