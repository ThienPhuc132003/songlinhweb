---
phase: requirements
feature: solution-hardcode-redesign
---
# Solution Hardcode Redesign — Requirements

## Problem Statement

Solutions hiện được quản lý qua Admin/DB (Cloudflare D1), nhưng content nghèo nàn (text thô) và layout generic (markdown render). Đối với trang B2B ELV chuyên nghiệp, Solution pages cần đạt **Pixel-Perfect Industrial Design** — không thể linh hoạt qua Admin mà cần hardcode tương tự websites của Honeywell, Bosch, Schneider.

**Chiến lược mới**: Xóa Solutions khỏi Admin, hardcode toàn bộ content vào frontend.

## Goals

- **G1**: Xóa toàn bộ Solutions backend (DB schema references, API routes, Admin UI) — giảm complexity
- **G2**: Tạo data layer hardcoded tại `@/data/solutions/` — typed objects cho mỗi solution ELV
- **G3**: Thiết kế SolutionDetail page mới với 6 sections chuyên biệt (Hero, Tech Grid, Architecture, Specs Table, Workflow, Project Linkage)
- **G4**: Đạt vibe "Bright Engineering" — whitespace, Inter/Roboto Mono, industrial shadows
- **G5**: Mỗi solution page có CTA conversion: sticky sidebar "Consult an Expert" + "Request Technical Survey"

## Non-Goals

- Không thay đổi Products, Projects, News — vẫn dynamic qua Admin
- Không xóa DB table `solutions` ngay (migration risky) — chỉ loại bỏ API routes + Admin UI
- Không tạo CMS mới — content cố định, PO edit source code nếu cần

## User Stories

1. **Khách B2B** truy cập `/giai-phap/he-thong-cctv-camera-quan-sat` → thấy Hero ấn tượng với ảnh ngành, breadcrumbs, value proposition → scroll xuống thấy Technical Grid, diagram, specs table, quy trình 5 bước, dự án liên quan
2. **Khách B2B** muốn tư vấn → thấy sticky sidebar CTA "Tư vấn chuyên gia" → click → chuyển đến form liên hệ
3. **PO/Dev** cần update nội dung solution → edit file TypeScript trong `@/data/solutions/` → build + deploy

## Success Criteria

- [ ] API routes `/api/solutions` + `/api/admin/solutions` đã bị xóa/vô hiệu hóa
- [ ] admin page AdminSolutions.tsx đã bị xóa
- [ ] Mỗi solution detail page có đủ 6 sections: Hero, Tech Grid, Architecture, Specs, Workflow, Projects
- [ ] Sticky sidebar CTA hiện trên mọi solution detail page
- [ ] TypeScript build pass, không có dead code references

## Constraints

- 11 solutions hiện tại từ DB (confirmed slugs từ API)
- Images đã có sẵn tại `@/assets/Image/GiaiPhapPage/` (11 ảnh webp)
- Projects vẫn dynamic → Project Linkage section fetch từ D1 API

## Affected Files

### Backend (DELETE/MODIFY)
- `server/src/routes/solutions.ts` — DELETE entire file
- `server/src/index.ts` — REMOVE solution route imports/bindings
- `server/src/types.ts` — REMOVE SolutionRow type (if only used by solutions)

### Frontend (DELETE)
- `src/pages/admin/AdminSolutions.tsx` — DELETE
- `src/hooks/useApi.ts` — REMOVE useSolutions/useSolution hooks

### Frontend (NEW)
- `src/data/solutions/` — Solution data objects
- `src/components/solutions/` — Specialized detail components

### Frontend (MODIFY)
- `src/pages/SolutionDetail.tsx` — Complete rewrite
- `src/pages/Solutions.tsx` — Use local data only
- `src/components/home/SolutionCards.tsx` — Remove API dependency
