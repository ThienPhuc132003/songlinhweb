---
phase: requirements
feature: b2b-website-rebuild
---
# Requirements — SLTECH B2B Website Rebuild

## Problem Statement

Song Linh Technologies (SLTECH) hiện có website WordPress cũ ([sltech.vn](https://sltech.vn)) với thiết kế lỗi thời (2016), không có luồng báo giá B2B, không tìm kiếm/lọc sản phẩm được. Cần xây dựng lại website hoàn toàn bằng stack hiện đại (React + Cloudflare Workers) để phục vụ mô hình B2B System Integrator.

## Goals

1. **Website B2B chuyên nghiệp** — Thể hiện năng lực SI, tạo trust cho CTO/IT Manager/CEO
2. **RFQ Cart Flow** — Giỏ hàng B2B (không giá) → Form → CSV/Excel → Email tự động
3. **Content Management** — Admin panel CRUD cho solutions, products, projects, posts
4. **SEO & Performance** — Edge-deployed (Cloudflare), optimized loading, meta tags
5. **Nhận diện thương hiệu** — Đúng brand colors (#3C5DAA), logo, slogan "Giải pháp tối ưu — Chất lượng vượt trội"

## Non-Goals

- ❌ E-commerce (không có thanh toán online, không hiển thị giá)
- ❌ Multi-language / i18n (chỉ tiếng Việt cho v1)
- ❌ PWA / Offline mode
- ❌ Newsletter / Email marketing
- ❌ Tuyển dụng page
- ❌ Custom image resize (dùng Cloudflare Image Resizing nếu cần)

## User Stories

### Khách hàng (CTO/IT Manager/Procurement)

| # | User Story |
|---|-----------|
| US1 | Là IT Manager, tôi muốn xem danh sách giải pháp SLTECH cung cấp để đánh giá phù hợp với nhu cầu công ty |
| US2 | Là Procurement, tôi muốn tìm kiếm và lọc sản phẩm theo danh mục để nhanh chóng tìm thiết bị cần dùng |
| US3 | Là Procurement, tôi muốn thêm nhiều sản phẩm vào giỏ báo giá và gửi yêu cầu để nhận được báo giá tổng hợp |
| US4 | Là CTO, tôi muốn xem case study dự án đã triển khai để đánh giá năng lực thực tế của SLTECH |
| US5 | Là IT Manager, tôi muốn tải datasheet sản phẩm (PDF) để so sánh thông số kỹ thuật |
| US6 | Là khách hàng, tôi muốn liên hệ SLTECH qua form trên website để được tư vấn nhanh |

### Admin (SLTECH Staff)

| # | User Story |
|---|-----------|
| US7 | Là Admin, tôi muốn quản lý (CRUD) giải pháp, sản phẩm, dự án, bài viết qua admin panel |
| US8 | Là Admin, tôi muốn xem danh sách yêu cầu báo giá và cập nhật trạng thái |
| US9 | Là Admin, tôi muốn export yêu cầu báo giá ra file CSV/Excel |
| US10 | Là Admin, tôi muốn upload ảnh sản phẩm/dự án lên cloud storage |

## Success Criteria

1. ✅ Homepage load < 3s (Lighthouse Performance > 80)
2. ✅ RFQ flow: Thêm SP → Giỏ hàng → Submit → Email nhận được CSV < 30s
3. ✅ Tất cả trang hoạt động responsive (mobile/tablet/desktop)
4. ✅ SEO: Mỗi trang có title, meta description, Open Graph
5. ✅ Admin CRUD: Tạo/sửa/xóa content hoạt động đúng
6. ✅ Brand consistency: Logo blue #3C5DAA, typography Inter

## Constraints

| Constraint | Chi tiết |
|-----------|---------|
| **Stack** | React (Vite) + Hono/Cloudflare Workers + D1 + R2 |
| **Frontend hosting** | Vercel |
| **Backend hosting** | Cloudflare Workers (free tier) |
| **Email** | Resend API (free 100 emails/ngày) |
| **Budget** | Minimal — leverage free tiers |
| **Timeline** | ~2-3 tuần cho MVP |

## Open Questions (Đã resolve ✅)

1. ~~Crawl WordPress?~~ → **KHÔNG.** Seed data thủ công.
2. ~~Dark mode?~~ → **CÓ.** Hỗ trợ dark mode cho v1.
3. ~~Quy trình bao nhiêu bước?~~ → **3 bước gốc:** Tư vấn & Thiết kế → Cung cấp & Thi công → Bảo trì & Đào tạo.
4. ~~Phân nhóm giải pháp?~~ → **CÓ phân nhóm:** An ninh & Giám sát / Bãi xe & Giao thông / Hạ tầng & Quản lý.
5. ~~Hero style?~~ → **Gradient abstract** trước, ảnh thật bổ sung sau.
6. ~~Số liệu stats?~~ → **Dùng tham khảo** (10+ năm, 200+ dự án, 50+ đối tác), chỉnh sau.
