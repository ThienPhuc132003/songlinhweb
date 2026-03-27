---
phase: testing
feature: ux-content-refinement
---
# UX & Content Refinement — Testing Plan

## Automated Tests
- TypeScript build check (`tsc --noEmit`)
- Vite dev server starts without errors

## Manual Verification
- [ ] Homepage: solution cards có icon + description
- [ ] `/giai-phap`: cards có icon, nhất quán với homepage
- [ ] `/san-pham`: hiện categories + sản phẩm nổi bật
- [ ] `/giai-phap/[slug]`: content có headings, paragraphs, không text wall
- [ ] `/du-an/[slug]`: content có sections, metrics, systems list
- [ ] Projects carousel trên homepage: placeholder không icon xám

## Browser Test
- Chrome, Safari responsive check
