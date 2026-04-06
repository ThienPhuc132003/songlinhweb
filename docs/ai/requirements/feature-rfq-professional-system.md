---
phase: requirements
feature: rfq-professional-system
---
# Requirements — Professional B2B RFQ System

## Problem Statement

Website SLTECH B2B hiện có hệ thống Request for Quote (RFQ) cơ bản hoạt động (CartContext + QuoteForm → D1 `quote_requests`), nhưng thiếu **5 yếu tố quan trọng** cho quy trình B2B chuyên nghiệp:

1. **Schema chưa chuẩn hóa** — `quote_requests` lưu items dạng flat JSON text, không có `quotation_items` table → khó query/report theo sản phẩm. Thiếu `excel_url`, `project_name` fields. Không có deletion constraints cho Categories/Brands → có thể xoá data đang liên kết.
2. **Admin Quotation Dashboard thiếu** — Không có trang quản lý yêu cầu báo giá riêng trong Admin sidebar. Status management (New/Processing/Sent/Completed) chưa trực quan.
3. **User Flow chưa hoàn chỉnh** — Không có trang `/gio-hang-bao-gia` riêng để xem chi tiết giỏ hàng. CartDrawer hiện dùng slide-over, thiếu quantity selectors và product thumbnail rõ ràng.
4. **Automation Pipeline chưa có** — Chỉ export CSV đơn giản, chưa có Excel (XLSX) chuyên nghiệp với branding SLTECH. Thiếu "Thank You" confirmation email cho khách hàng.
5. **Security & SEO chưa chặt** — Admin routes không có middleware bổ sung (client-side check only). Thiếu `robots.txt` disallow cho `/admin`.

## Goals

1. **Normalized DB Schema** — Tạo `quotation_requests` + `quotation_items` tables với proper foreign keys. Thêm deletion constraints cho product_categories/brands.
2. **Admin Quotation Dashboard** — "Yêu cầu báo giá" menu trong Admin sidebar (nhóm "Sản phẩm"), list view với status toggles, detail view.
3. **Dedicated RFQ Cart Page** — `/gio-hang-bao-gia` với product table, quantity selectors, thumbnails, và submit form.
4. **Professional XLSX Generation** — File Excel với SLTECH branding, customer details, project name, product table với thumbnails và empty "Unit Price" columns.
5. **Dual Email System** — Admin notification email (với XLSX attachment) + Customer "Thank You" email.
6. **Security Hardening** — `robots.txt` Disallow `/admin`. Review client-side auth guard.

## Non-Goals

- ❌ Thay đổi backend authentication model (giữ API Key via X-API-Key header)
- ❌ Server-side rendering / Next.js middleware (đây là Vite SPA + Cloudflare Workers)
- ❌ User registration / login system
- ❌ Price management / quoting engine (chỉ RFQ)
- ❌ Dark mode redesign
- ❌ Mobile app integration

## User Stories

### Admin (SLTECH Staff)

| # | User Story |
|---|-----------|
| US1 | Là Admin, tôi muốn thấy menu "Yêu cầu báo giá" trong sidebar để quản lý RFQ tập trung |
| US2 | Là Admin, tôi muốn xem danh sách RFQ với filter theo status (New/Processing/Sent/Completed) |
| US3 | Là Admin, tôi muốn thay đổi status của từng RFQ bằng dropdown ngay trong list |
| US4 | Là Admin, tôi muốn xem chi tiết RFQ gồm thông tin khách + danh sách sản phẩm normalized |
| US5 | Là Admin, tôi muốn download file Excel chuyên nghiệp cho mỗi RFQ |
| US6 | Là Admin, tôi không thể xoá Category/Brand nếu còn Product liên kết |

### Khách hàng (B2B Buyer — CTO/Procurement)

| # | User Story |
|---|-----------|
| US7 | Là Procurement, tôi muốn click "Thêm vào danh sách báo giá" trên Product Card và Detail page |
| US8 | Là Procurement, tôi muốn xem trang `/gio-hang-bao-gia` với table sản phẩm đã chọn, chỉnh số lượng, xoá từng item |
| US9 | Là Procurement, tôi muốn nhập thông tin công ty, dự án, và gửi yêu cầu |
| US10 | Là Procurement, tôi muốn nhận email xác nhận "Cảm ơn" sau khi gửi RFQ |
| US11 | Là CTO, tôi muốn nhận file Excel chuyên nghiệp khi SLTECH phản hồi |

## Success Criteria

1. ✅ `quotation_requests` + `quotation_items` tables tạo thành công trong D1
2. ✅ DELETE Category/Brand bị chặn nếu có Products liên kết (HTTP 409)
3. ✅ Admin sidebar có menu "Yêu cầu báo giá" dưới nhóm "Sản phẩm"
4. ✅ Admin list view hiển thị RFQ với status badge + filter
5. ✅ Trang `/gio-hang-bao-gia` render đúng với product table, quantity selectors
6. ✅ Submit RFQ → D1 lưu data → XLSX generated → Admin email sent → Customer email sent
7. ✅ XLSX file có branding SLTECH, customer info, product table, empty "Unit Price" columns
8. ✅ `robots.txt` có `Disallow: /admin`
9. ✅ Excel file naming: `SLTECH_RFQ_[ID]_[Date].xlsx`

## Constraints

| Constraint | Chi tiết |
|-----------|---------|
| **Cloudflare Workers** | Max 10ms CPU free tier — `exceljs` cần evaluate xem có chạy được trong Workers không, fallback plan: generate XLSX client-side hoặc dùng lightweight library |
| **Vite SPA** | Không có Next.js middleware — `/admin` route protection là client-side (AuthContext redirect) |
| **R2 Storage** | XLSX files cần lưu vào R2 bucket, trả `excel_url` về DB |
| **Resend API** | Email service hiện dùng Resend — cần thêm customer email template |
| **D1 SQLite** | ALTER TABLE limitations — cần tạo new tables, không rename |
| **Backward Compatibility** | Existing `quote_requests` table data cần migration hoặc deprecation plan |

## Open Questions

1. **ExcelJS on Workers?** — ExcelJS ~2MB bundled, Workers có 1MB limit. → Cần dùng lightweight XLSX library (e.g., `xlsx-populate`, hoặc generate client-side với `SheetJS`). **Đề xuất**: Generate XLSX trong Workers dùng simple XML-based approach hoặc dùng `@phuocng/sheetjs` minimal build.
2. **Migrate old `quote_requests`?** — Có cần migrate data cũ sang `quotation_requests` không? → Đề xuất: Giữ table cũ, tạo table mới, code mới dùng table mới.
3. **Project Name field** — Thêm `project_name` vào quote form? → Đề xuất: Có, optional field.
4. **Product thumbnails in XLSX** — Workers có thể fetch images từ R2 để embed vào XLSX? → Đề xuất: Thumbnail URL column thay vì embed image (lightweight).
5. **Customer email gửi khi nào?** — Ngay khi submit? Hay khi Admin thay đổi status? → Đề xuất: "Thank You" ngay khi submit. Quote email khi Admin upload response.
