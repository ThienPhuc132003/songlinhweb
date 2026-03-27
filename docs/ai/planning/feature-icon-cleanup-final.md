---
phase: planning
feature: icon-cleanup-final
status: done
---

# Icon Cleanup Final — Planning

## Task Queue

### Section 1: Breadcrumb Home Icon → Text
- [x] `page-hero.tsx`: Replace `<Home>` icon with text "Trang chủ"
- [x] Remove `Home` import from lucide-react

### Section 2: Solution Cards — Remove Lucide Icons
- [x] `SolutionCards.tsx` (homepage): Remove ICON_MAP, show title + description only
- [x] `Solutions.tsx` (page): Remove ICON_MAP + framer-motion → useScrollReveal
- [x] `constants.ts`: `icon` field no longer referenced (kept for API compat)

### Section 3: framer-motion Cleanup
- [x] `Solutions.tsx`: Replaced `motion.div` with `useScrollReveal`
- [x] TypeScript check passed (exit code 0)
