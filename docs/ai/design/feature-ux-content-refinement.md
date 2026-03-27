---
phase: design
feature: ux-content-refinement
---
# UX & Content Refinement — Design

## Architecture Overview

Không có thay đổi kiến trúc lớn. Đây là tập hợp các cải thiện frontend:

```
┌─────────────────────────────────────────────┐
│  Issue 1: Card Consistency                   │
│  SolutionCards.tsx + Solutions.tsx            │
│  → Thêm dynamic icon từ SOLUTIONS_DATA       │
│  → Thêm color accent per-category            │
│                                              │
│  FeaturedProjects.tsx                        │
│  → Cải thiện placeholder (gradient+title)    │
├─────────────────────────────────────────────┤
│  Issue 2: Empty Product Page                 │
│  Products.tsx → Hiện products lẫn categories │
│  constants.ts → Thêm SAMPLE_PRODUCTS data    │
│  ProductCategory.tsx → Grid sản phẩm bên     │
│    trong mỗi category                        │
├─────────────────────────────────────────────┤
│  Issue 3: Text Wall Content                  │
│  Thêm markdown parser (marked) pipeline     │
│  Rewrite content_md seed data có structure   │
│  SolutionDetail/ProjectDetail sử dụng parsed │
│    markdown thay vì raw dangerouslySetHTML   │
└─────────────────────────────────────────────┘
```

## Component Changes

### 1. Solution Cards Enhancement

#### [MODIFY] [SolutionCards.tsx](file:///d:/GitHub/SongLinh_Website/src/components/home/SolutionCards.tsx)

**Hiện tại**: Cards chỉ chứa `<h3>` + `<p>`, không có icon.
**Thay đổi**:
- Import & render Lucide icon dựa trên `solution.icon` field
- Thêm colored icon container (gradient bg theo category)
- Giữ compact size, thêm "Xem chi tiết →" link text

#### [MODIFY] [Solutions.tsx](file:///d:/GitHub/SongLinh_Website/src/pages/Solutions.tsx)

**Hiện tại**: Cards text-only, giống pattern như SolutionCards.
**Thay đổi**:
- Đồng bộ icon rendering giống SolutionCards
- Card height nhất quán qua `h-full` + flex layout

---

### 2. Product Page Initialization

#### [MODIFY] [Products.tsx](file:///d:/GitHub/SongLinh_Website/src/pages/Products.tsx)

**Hiện tại**: Chỉ hiện grid categories, click vào → detail page trống.
**Thay đổi**:
- Thêm "Sản phẩm nổi bật" section bên dưới categories
- Sử dụng `SAMPLE_PRODUCTS` fallback khi API trống
- Product cards: name, brand badge, model, description snippet

#### [MODIFY] [constants.ts](file:///d:/GitHub/SongLinh_Website/src/lib/constants.ts)

**Thêm**: `SAMPLE_PRODUCTS` array — 12-15 sản phẩm B2B ELV placeholder (map data từ migration 0006 nhưng hardcode client-side)

---

### 3. Content Formatting Pipeline

#### [NEW] [useMarkdown.ts](file:///d:/GitHub/SongLinh_Website/src/hooks/useMarkdown.ts)

**Mục đích**: Hook parse markdown text → HTML
- Sử dụng `marked` library (lightweight)
- Sanitize output
- Cache parsed result

#### [MODIFY] [SolutionDetail.tsx](file:///d:/GitHub/SongLinh_Website/src/pages/SolutionDetail.tsx)

**Thay đổi**:
- Sử dụng useMarkdown hook thay vì raw `dangerouslySetInnerHTML`
- `parseSections()` đã có từ sprint trước → vẫn hoạt động nếu content có `##` headings

#### [MODIFY] [ProjectDetail.tsx](file:///d:/GitHub/SongLinh_Website/src/pages/ProjectDetail.tsx)

**Thay đổi**:
- Thêm useMarkdown hook cho content_md rendering
- Đảm bảo `white-space: pre-line` trong prose container

#### [NEW] [0007_rewrite_content_md.sql](file:///d:/GitHub/SongLinh_Website/server/migrations/0007_rewrite_content_md.sql)

**Mục đích**: UPDATE content_md cho solutions + projects với nội dung markdown có cấu trúc:
- Solutions: Mỗi solution có `## Tổng quan`, `## Tính năng`, `## Ứng dụng`, `## Thiết bị sử dụng`
- Projects: Mỗi project có `## Tổng quan dự án`, `## Thách thức`, `## Giải pháp triển khai`, `## Thông số kỹ thuật`

---

### 4. Project Cards Placeholder

#### [MODIFY] [FeaturedProjects.tsx](file:///d:/GitHub/SongLinh_Website/src/components/home/FeaturedProjects.tsx)

**Hiện tại**: `onError` → hiện icon Building2 xám trông rất nghèo nàn.
**Thay đổi**:
- Improve error state: gradient background đậm hơn, category badge, title overlay
- Không dùng icon xám trống — thay bằng compact card thông tin

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Dùng `marked` thay vì custom parser | Lightweight (<10KB), well-tested, handles edge cases |
| Client-side fallback products | Migration 0006 chưa deploy → UX không thể đợi backend |
| Content rewrite qua SQL | Nhanh hơn tay update Admin, đảm bảo professional content ngay |
| Icon mapping từ string | SOLUTIONS_DATA đã có field `icon` (Camera, Flame, etc.) — chỉ cần import & render |

## Performance Considerations

- `marked` parse chỉ chạy 1 lần (useMemo), output được cache
- Fallback data được tree-shaken khi API response có data
