---
phase: requirements
feature: ux-content-refinement
---
# UX & Content Refinement — Requirements

## Problem Statement

PO đã review website live và phát hiện 3 nhóm vấn đề UX nghiêm trọng ảnh hưởng đến ấn tượng B2B:

1. **Card layouts không nhất quán** — Solution cards trên homepage chỉ có text, không có icon hay thumbnail. Project cards hiển thị icon Building2 placeholder thay vì ảnh thật vì `thumbnail_url` trống hoặc trỏ đến file không tồn tại.
2. **Trang Sản phẩm trống** — `/san-pham` chỉ hiển thị danh mục categories nhưng không có sản phẩm thực tế nào (migration seed data 0006 chưa deploy, và trang chỉ hiển thị categories grid, không hiện danh sách products bên trong).
3. **Nội dung detail pages "boring"** — `content_md` trong DB là raw text nối liên tục bằng dấu gạch ngang, không có heading/paragraph/line break. Khi render qua `dangerouslySetInnerHTML`, nó trở thành 1 khối text wall không đọc được.

## Goals

- **G1**: Card layouts nhất quán, chuyên nghiệp — mỗi card có icon/color accent phù hợp ngành ELV
- **G2**: Trang `/san-pham` hiển thị sản phẩm thực tế ngay lập tức (client-side fallback data)
- **G3**: Detail pages (`SolutionDetail`, `ProjectDetail`, `BlogPost`) có nội dung được format đúng: headings, paragraphs, bullet lists
- **G4**: Cải thiện `content_md` trong DB qua Admin panel — rewrite nội dung có cấu trúc

## Non-Goals

- Không thay đổi backend API routes
- ~~Không tạo thêm migration SQL mới~~ → Đã tạo `0007_rewrite_content_md.sql` để fix text wall (PO approved)
- Không redesign toàn bộ layout (chỉ fix hiện tại)

## User Stories

1. **Khách B2B** truy cập homepage → thấy solution cards chuyên nghiệp với icons + descriptions rõ ràng → nhấn vào → đọc nội dung có cấu trúc
2. **Khách B2B** mở trang Sản phẩm → thấy danh mục + sản phẩm mẫu (Hikvision, Honeywell, Cisco...) → có thể duyệt xem specs
3. **PO/Reviewer** mở detail page → thấy nội dung được chia sections, có headings, paragraphs, bullet lists → không thấy text wall

## Success Criteria

- [ ] Tất cả solution cards hiện icon phù hợp (Camera, Flame, Speaker, Network...)
- [ ] `/san-pham` hiển thị ít nhất 10 products với tên, brand, mô tả
- [ ] Detail pages có content_md formatted đúng (ít nhất 3 sections per page)
- [ ] Không có placeholder icon xám nào trên homepage

## Constraints

- Migrations 0005 + 0006 chưa deploy → cần client-side fallback data
- Không có ảnh thật trong R2 → cần placeholder strategy tốt (gradient backgrounds, icons thay thế)
- Content hiện tại trong DB là text thô → cần rewrite qua Admin hoặc trực tiếp qua SQL

## Open Questions

1. PO có muốn seed content_md mới qua migration SQL hay qua Admin panel?
2. Có cần markdown parser (marked/remark) hay chỉ cần lưu HTML trong content_md?
