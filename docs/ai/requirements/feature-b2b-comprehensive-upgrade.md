---
phase: requirements
feature: b2b-comprehensive-upgrade
---
# Requirements — B2B Platform Comprehensive Upgrade

## Problem Statement

Website SLTECH B2B đã có nền tảng cơ bản hoạt động (React + Cloudflare Workers), nhưng tồn tại **3 vấn đề nghiêm trọng** ảnh hưởng đến trải nghiệm B2B chuyên nghiệp:

1. **Asset Pipeline thiếu tối ưu** — Admin phải tự convert ảnh sang WebP thủ công trước khi upload. Không có pipeline tự động → ảnh nặng, tốn bandwidth R2, LCP chậm.
2. **Layout trang chi tiết còn text-heavy** — Solutions, News dùng prose blog-post layout; Project Detail đã có metrics nhưng content_md vẫn là khối text dày; Product catalog trống hoàn toàn.
3. **Admin thiếu trường dữ liệu** — Không có multi-image gallery management, PDF datasheet upload, SEO metadata per-entity. D1 schema chưa đồng bộ các trường mới.

## Goals

1. **WebP Auto-Pipeline** — Admin chọn ảnh bất kỳ → client-side convert WebP → preview → upload WebP duy nhất lên R2
2. **Industrial Authority Layout** — Redesign Solution/News/Product detail pages với Hero, Feature Grid, Technical Specs, structured sections
3. **Product Catalog Seeding** — Seed database với dữ liệu B2B ELV thực tế (Bosch, Honeywell, Cisco, Hikvision)
4. **Admin Field Sync** — Multi-image gallery, PDF upload, SEO meta fields trong admin forms; D1 migration tương ứng

## Non-Goals

- ❌ Server-side image processing (Cloudflare Workers có giới hạn CPU)
- ❌ Thay đổi auth model (vẫn giữ API Key)
- ❌ RFQ cart flow changes (đã hoạt động)
- ❌ Dark mode rework
- ❌ Backend route restructuring

## User Stories

### Admin (SLTECH Staff)

| # | User Story |
|---|-----------|
| US1 | Là Admin, tôi muốn upload ảnh .png/.jpg và hệ thống tự chuyển sang WebP để giảm dung lượng mà không cần tool ngoài |
| US2 | Là Admin, tôi muốn thấy spinner khi ảnh đang convert và preview WebP trước khi submit |
| US3 | Là Admin, tôi muốn upload nhiều ảnh cho 1 entity (project/solution/product) để tạo gallery |
| US4 | Là Admin, tôi muốn upload PDF datasheet cho sản phẩm để khách hàng tải |
| US5 | Là Admin, tôi muốn nhập SEO meta title/description riêng cho mỗi entity |

### Khách hàng (CTO/IT Manager/Procurement)

| # | User Story |
|---|-----------|
| US6 | Là CTO, tôi muốn trang giải pháp có Hero visual + Feature grid thay vì wall-of-text để đánh giá nhanh năng lực |
| US7 | Là Procurement, tôi muốn xem sản phẩm với thông số kỹ thuật chi tiết và tải datasheet PDF |
| US8 | Là IT Manager, tôi muốn case study được chia thành Overview → Challenges → Solutions → Equipment để hiểu scope dự án |
| US9 | Là CTO, tôi muốn trang tin tức có layout chuyên nghiệp với featured image lớn và structured content |

## Success Criteria

1. ✅ Admin upload ảnh .png/.jpg → nhận WebP preview trong < 3 giây (client-side)
2. ✅ Chỉ file WebP gửi lên R2 (kiểm tra Content-Type trong R2)
3. ✅ Solution Detail có hero section + feature grid + sidebar (không còn prose-only)
4. ✅ Product catalog có ≥ 15 sản phẩm seed với đầy đủ thông số
5. ✅ Admin forms có fields: multi-image gallery, PDF upload, SEO meta
6. ✅ D1 schema có columns tương ứng (migration chạy thành công)

## Constraints

| Constraint | Chi tiết |
|-----------|---------|
| **Client-side conversion** | Canvas API + `toBlob('image/webp')` — không phụ thuộc server |
| **Browser support** | WebP encoding có sẵn trên Chrome/Edge/Firefox/Safari 16+ |
| **R2 budget** | Free tier — cần giảm kích thước ảnh tối đa |
| **D1 schema** | ALTER TABLE cho existing tables — backward compatible |
| **No breaking changes** | Existing API responses phải giữ nguyên format |

## Open Questions

1. **WebP quality level?** → Đề xuất: 0.82 (balance giữa quality và file size)
2. **Max image dimensions?** → Đề xuất: resize về max 1920px wide trước khi convert
3. **Product seed data source?** → Sử dụng catalog công khai từ Hikvision, Bosch, Honeywell, Cisco
