---
phase: requirements
feature: visual-feature-system
status: draft
created: 2026-03-30
---
# Visual Feature System — Requirements

## Problem Statement

Hệ thống "Tính năng" (Features) hiện tại chỉ lưu trữ `name`, `slug`, `group_name`, `sort_order` và `is_active`. Dữ liệu này quá đơn giản cho nhu cầu B2B product categorization phức tạp:

1. **Thiếu visual identity**: Không có color/icon → badges trên frontend đều đồng màu, không phân biệt trực quan
2. **Admin UX kém**: Form tạo feature thiếu color picker, icon picker → admin không preview được kết quả
3. **Product form không scalable**: Khi có 100+ features, dạng checkbox grid hiện tại khó tìm kiếm
4. **Frontend filter chưa nhóm**: Sidebar tính năng liệt kê phẳng, không collapsible theo group → khách hàng khó tìm spec

## Goals

1. **G1 — Database Enhancement**: Thêm `color` (hex), `icon` (Lucide name), `is_priority` vào `product_features` table
2. **G2 — Admin Feature Form**: Thêm Color Picker, Icon Picker, Priority toggle, Dynamic group datalist
3. **G3 — Admin Feature List**: Hiển thị colored badge + icon preview trong danh sách
4. **G4 — Product Form Upgrade**: Replace checkbox grid → Searchable multi-select Combobox, grouped by category
5. **G5 — Frontend Badge Sync**: Render feature badges với color + icon trên Product Card và Product Detail
6. **G6 — Auto Contrast**: Tự động chọn foreground (trắng/đen) dựa trên background color
7. **G7 — Smart Filtering** (Optional): Sidebar filter nhóm theo group, collapsible sections

## Non-Goals

- Không xây dựng drag-and-drop reorder UI cho features
- Không thêm multi-language support cho feature names
- Không tạo feature comparison tool giữa các products
- Không implement custom SVG upload – chỉ dùng Lucide icon library

## User Stories

### Admin
- **US-1**: Là admin, tôi muốn chọn màu hex cho mỗi tính năng, để badges hiển thị đúng màu brand
- **US-2**: Là admin, tôi muốn chọn icon Lucide cho tính năng, để người dùng nhận diện feature nhanh
- **US-3**: Là admin, tôi muốn đánh dấu tính năng là "ưu tiên", để nó hiện trước trên product card
- **US-4**: Là admin, tôi muốn preview badge (color + icon) ngay trong danh sách, để kiểm tra kết quả
- **US-5**: Là admin, tôi muốn tìm kiếm feature nhanh khi gán cho sản phẩm (100+ items)

### Customer (B2B)
- **US-6**: Là khách hàng, tôi muốn nhìn thấy badge có màu + icon trên product card, để so sánh nhanh
- **US-7**: Là khách hàng, tôi muốn filter sản phẩm theo nhóm tính năng (collapsible), để tìm spec cụ thể

## Success Criteria

| # | Metric | Target |
|---|--------|--------|
| SC-1 | DB migration passes D1 | ✓ |
| SC-2 | Admin có thể CRUD feature với color + icon + priority | ✓ |
| SC-3 | Feature list hiển thị colored preview | ✓ |
| SC-4 | Product form multi-select search < 200ms response | ✓ |
| SC-5 | Frontend badges render color + icon đúng | ✓ |
| SC-6 | Contrast ratio WCAG AA (4.5:1) tự động | ✓ |
| SC-7 | Sidebar filter grouped + collapsible | ✓ |

## Constraints

- **Database**: Cloudflare D1 (SQLite) — ALTER TABLE chỉ hỗ trợ `ADD COLUMN`, không DROP/RENAME
- **Frontend**: React + shadcn/ui + Lucide icons (đã installed)
- **Backend**: Hono framework trên Cloudflare Workers
- **Tương thích ngược**: Các features hiện tại (30 seed records) phải hoạt động bình thường với color/icon = null
- **Performance**: Product listing page < 1.5s initial load

## Open Questions

- [x] ~~Liệu có cần lưu SVG custom hay chỉ dùng Lucide icon name?~~ → Chỉ Lucide
- [ ] Có muốn default color palette (preset colors) hay hoàn toàn tự chọn hex?
- [ ] Feature `group` nên dùng datalist hay fixed dropdown (enum)?
