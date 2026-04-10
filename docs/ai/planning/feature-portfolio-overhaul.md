---
status: "approved"
---

# Planning: Project SLTECH Portfolio Overhaul

## Task Breakdown

### Phase 1: Preparation & Migration Check
- [ ] Run `npx wrangler d1 migrations apply DB --local` to ensure local Schema supports `outcomes` and `challenges`.
- [ ] Re-run the SSG SQL seed file successfully.

### Phase 2: Admin UX Refinement (`ProjectFormSheet.tsx`)
- [ ] Increase width of `DialogContent` to `max-w-6xl` or similar for a split-view layout.
- [ ] Refactor inputs: Split into two columns `grid-cols-3` (col-span-2 for content, col-span-1 for meta/sidebar).
- [ ] Refactor `KeyMetricsEditor` (or replace the raw textarea) to a dynamic UI that updates a JSON object.
- [ ] Add `DynamicStringList` component to manage the `outcomes` field for Highlights bullets.
- [ ] Enlarge labels and text sizing slightly.

### Phase 3: Frontend Detail Redesign (`ProjectDetail.tsx`)
- [ ] Rebuild `ProjectHero` with an absolute background cover image and a dark gradient overlay. Ensure text is white and massive (e.g., `text-4xl md:text-5xl`).
- [ ] Move `ProjectMetricsBar` below the Hero. Style it with a light background and primary-colored monospace numbers.
- [ ] Create a 2-column layout in the main section: 70% left, 30% right.
- [ ] In the left column: Render content with `prose-lg`, `text-slate-800`, and `leading-relaxed`.
- [ ] In the left column: Map `outcomes` (Highlights) into a beautiful Bento Grid or Checklist using `CheckCircle` icons.
- [ ] In the right column: Keep a light, sticky sidebar with client info and the solutions/brands used.
- [ ] Check fonts to match Editorial B2B (Roboto Mono, Inter).

## Test Strategy
- Verify the seed project resolves at `/du-an/toa-nha-ssg-group-3a-3b-ton-duc-thang`.
- Ensure mobile responsiveness for the 2-column layout.
- Confirm Admin Form saves back to D1 with correct JSON format for metrics and outcomes.
