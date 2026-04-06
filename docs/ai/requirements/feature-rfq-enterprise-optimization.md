---
phase: requirements
feature: rfq-enterprise-optimization
---
# Requirements — RFQ Enterprise Optimization

## Problem Statement

Hệ thống RFQ hiện tại đã hoạt động tốt (submit → D1 → XLSX/R2 → email Resend → Admin panel) nhưng cần **3 cải tiến quan trọng** để đạt mức enterprise-ready:

1. **Admin email thiếu XLSX attachment** — Email admin nhận chỉ có HTML table tóm tắt, không có file Excel đính kèm. Sales team phải vào Admin Dashboard để download Excel riêng → thêm bước thừa.
2. **Admin email thiếu deeplink** — Không có link trực tiếp đến chi tiết RFQ trong Admin Dashboard, phải search thủ công.
3. **R2 storage không có cleanup** — File XLSX tích lũy vô hạn trong R2 bucket, sẽ vượt free tier (10GB) nếu không dọn dẹp.

### Existing Implementation (Đã Hoàn Thành ✅)

| Component | Status | File |
|---|---|---|
| D1 schema (`quotation_requests` + `quotation_items`) | ✅ | `0014_rfq_professional.sql` |
| XLSX generator (lightweight XML, no deps) | ✅ | `xlsx-generator.ts` (492 lines) |
| R2 upload + `excel_url` in D1 | ✅ | `quotations.ts` L113-154 |
| Admin CRUD (list/detail/status/delete) | ✅ | `AdminQuotations.tsx` (501 lines) |
| Status workflow (new→processing→sent→completed) | ✅ | Full CRUD API |
| Dual email (admin HTML + customer confirmation) | ✅ | `quotation-email.ts` |
| Honeypot + Rate limiting (5/hr/IP) | ✅ | Frontend forms + middleware |
| XLSX: Unit Price + Thành tiền columns (blank) | ✅ | `xlsx-generator.ts` L68-107 |
| Admin email to env variable | ✅ | `ADMIN_NOTIFICATION_EMAIL` |
| Frontend success state with RFQ ID | ✅ | `QuoteCart.tsx` |

## Goals

1. **G1: Excel Attachment in Admin Email** — Đính kèm file XLSX (base64) vào email thông báo admin qua Resend `attachments` API.
2. **G2: Admin Dashboard Deeplink** — Thêm link trực tiếp `https://sltech.vn/admin/quotations/{id}` trong email admin để mở ngay RFQ detail.
3. **G3: R2 Storage Cleanup** — Scheduled handler (Cloudflare Cron Trigger) tự động xoá XLSX files > 6 tháng từ R2.

## Non-Goals

- ❌ Rebuild XLSX generator (đã hoạt động tốt)
- ❌ Thay đổi DB schema (đã ổn định)
- ❌ Rebuild Admin Quotations UI (đã đầy đủ CRUD)
- ❌ Thay đổi frontend submission flow (đã optimized)
- ❌ Thay đổi email provider (giữ Resend)
- ❌ Embed images trong Excel (giữ text links, lightweight)

## User Stories

### Admin (SLTECH Sales Team)

| # | User Story |
|---|-----------|
| US1 | Là Sales, tôi muốn nhận email admin có **đính kèm file Excel** để mở báo giá ngay trên desktop mà không cần vào Dashboard |
| US2 | Là Sales, tôi muốn email admin có **link trực tiếp** đến RFQ detail trong Admin Panel để xem chi tiết nhanh |
| US3 | Là Admin, tôi muốn hệ thống **tự động dọn R2** để storage không tăng vượt free tier |

### System

| # | User Story |
|---|-----------|
| US4 | Là System, R2 cleanup chạy vào lúc ít tải (ví dụ 3:00 AM UTC hàng ngày) |
| US5 | Là System, khi xoá XLSX từ R2, cập nhật `excel_url = NULL` trong D1 |

## Success Criteria

1. ✅ Email admin gửi tới Sales có file `.xlsx` đính kèm (< 1MB, base64)
2. ✅ Email admin có link `https://sltech.vn/admin/quotations/{id}` 
3. ✅ Cron trigger chạy hàng ngày, xoá XLSX > 180 ngày
4. ✅ D1 `excel_url` set NULL sau khi R2 object bị xoá
5. ✅ Không gián đoạn hoạt động hiện tại (backward compatible)

## Technical Approach

### G1: Excel Attachment

```typescript
// In quotation-email.ts sendQuotationAdminEmail()
const emailPayload = {
  from: "SLTECH Website <onboarding@resend.dev>",
  to: [adminEmail],
  subject: `[RFQ #${data.id}] ...`,
  html,
  attachments: [{
    content: Buffer.from(xlsxBuffer).toString("base64"),
    filename: `SLTECH_RFQ_${data.id}_${date}.xlsx`,
  }],
};
```

**Concern:** `xlsxBuffer` cần được pass vào `sendQuotationAdminEmail()` → cần mở rộng function signature.

### G2: Admin Deeplink

```html
<!-- In admin email HTML -->
<a href="https://sltech.vn/admin/quotations/{id}">
  Xem chi tiết trong Admin Panel →
</a>
```

**Concern:** URL có thể thay đổi (dev vs production). → Dùng env variable `SITE_URL` hoặc hardcode `sltech.vn`.

### G3: R2 Cleanup Cron

```toml
# wrangler.toml
[triggers]
crons = ["0 3 * * *"]  # Daily at 3:00 AM UTC
```

```typescript
// In index.ts or scheduled handler
export default {
  async scheduled(event, env, ctx) {
    // List rfq/ prefix in R2
    // Filter by uploaded date > 180 days
    // Delete + nullify excel_url
  }
};
```

**Concern:** R2 `list()` trả metadata kèm `uploaded` timestamp. D1 batch update cần match R2 keys với DB records.

## Constraints

| Constraint | Chi tiết |
|---|---|
| Resend Attachment Limit | 40MB per email after base64. XLSX files ~50KB → well within limit |
| Cloudflare Workers CPU | Cron handler runs in same Worker → keep R2 list + delete batched |
| R2 Free Tier | 10GB storage, 10M reads, 1M writes/month |
| Base64 Overhead | ~33% larger than binary. 50KB XLSX → ~67KB base64 — trivial |

## Open Questions

1. **SITE_URL env variable?** — Nên dùng env variable cho deeplink hay hardcode `sltech.vn`? → Đề xuất: Dùng `CORS_ORIGIN` (đã có) làm base URL.
2. **Cron frequency?** — Daily, weekly, monthly? → Đề xuất: Daily at 3 AM UTC (10 AM VN). Lightweight operation.
3. **Re-generation after cleanup?** — Nếu Admin cần download Excel sau 6 tháng, hệ thống đã có regenerate logic (`/:id/excel` endpoint). → Chỉ xoá R2 cache, không xoá DB data.
