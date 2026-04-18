---
phase: requirements
feature: simplify-codebase
status: approved
---
# Simplify Codebase

## Problem Statement

The SLTECH codebase has grown organically over multiple feature iterations, accumulating complexity in the form of monolithic page components (500–650 LOC each), duplicated logic across pages, dead/stale static data, verbose router boilerplate, and repetitive backend CRUD patterns. This increases cognitive load for maintainers and slows future feature development.

## Goals

1. **Reduce per-file complexity** — No page file should exceed ~350 LOC; extract inline sub-components and hooks.
2. **Eliminate dead code** — Remove unused static constants and dead components.
3. **DRY backend patterns** — Consolidate the repeated "dynamic UPDATE builder" across 5+ routes into a shared utility.
4. **Fix type safety gaps** — Eliminate `any` types in the mega-menu Header component.
5. **Reduce router boilerplate** — Replace 27 repetitive `<SuspenseWrapper>` blocks with a helper function.
6. **Extract shared logic** — Create reusable hooks for compare/cart actions shared between pages.

## Non-Goals

- No UI/UX changes — this is purely internal refactoring.
- No schema/database changes.
- No changes to `xlsx-generator.ts`, `email.ts`, or `admin-api.ts` (intentionally complex or already well-structured).
- No new features.

## User Stories

- As a **developer**, I want each page file to focus on composition (not implementation), so that I can understand a page in under 30 seconds.
- As a **developer**, I want a shared `buildDynamicUpdate` helper, so that adding a new CRUD entity doesn't require copy-pasting 30 lines of boilerplate.
- As a **developer**, I want dead code removed, so that `constants.ts` only contains data that is actually used.

## Success Criteria

- [ ] No page file exceeds 350 LOC (currently 4 files exceed 500 LOC).
- [ ] `npm run build` passes with zero errors after all changes.
- [ ] Zero `any` types in `src/components/layout/Header.tsx`.
- [ ] `router.tsx` reduced from ~296 LOC to ~120 LOC.
- [ ] `SOLUTIONS_DATA` removed from `constants.ts` (Footer.tsx migrated to dynamic data).
- [ ] `StatsBar.tsx` dead component removed.
- [ ] All existing functionality preserved — no visual or behavioral regressions.

## Constraints

- **Backward compatibility** — All existing routes, API endpoints, and admin functionality must work identically.
- **No new dependencies** — All simplifications use existing language/library features.
- **Phase execution** — Changes grouped into 4 low-risk phases to minimize blast radius.

## Open Questions

None — analysis is complete with verified grep results.
