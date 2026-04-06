---
phase: implementation
feature: rfq-professional-system
---
# Implementation — Professional B2B RFQ System

> See `/docs/ai/planning/feature-rfq-professional-system.md` for the task breakdown.

## Phase 1: Infrastructure & Security
- [x] 1.1 D1 Migration: New Tables (`0014_rfq_professional.sql`)
- [x] 1.2 D1 Migration: Deletion Constraints (triggers)
- [x] 1.3 Server Types Update (`QuotationRequestRow`, `QuotationItemRow`)
- [x] 1.4 Frontend Types Update (`QuotationRequest`, `QuotationItem`, `QuoteStatus`)
- [x] 1.5 robots.txt (`Disallow: /admin` via `seo.ts`)
- [x] 1.6 Backend: New Quotation Routes (`quotations.ts` — CRUD)
- [x] 1.7 Backend: Register Routes (`index.ts` — mounted)
- [x] 1.8 Backend: Deletion Guard (triggers + API-level)

## Phase 2: Admin Quotation Management
- [x] 2.1 AdminQuotations Page (`AdminQuotations.tsx`)
- [x] 2.2 Admin Sidebar Update (`AdminLayout.tsx` — "Yêu cầu báo giá")
- [x] 2.3 Router Update (`router.tsx` — `/admin/quotations`)
- [x] 2.4 Admin API Functions (`admin-api.ts` — list/detail/status/delete/downloadExcel)
- [ ] 2.5 Admin Dashboard Widget (RFQ count card)

## Phase 3: Quotation Cart & User Flow
- [x] 3.1 CartContext Enhancement (`updateItemNotes`, `updateQuantity`)
- [x] 3.2 QuoteCartPage (`QuoteCart.tsx` — full product table, qty selectors, form)
- [x] 3.3 Router: Add Cart Page (`/gio-hang-bao-gia`)
- [x] 3.4 Update CartDrawer (link to `/gio-hang-bao-gia`)
- [x] 3.5 Update QuoteForm (`project_name` field)
- [x] 3.6 Update API Client (`api.ts` — quotes.submit → `/quotations`)
- [x] 3.7 Empty State (empty cart + success state)

## Phase 4: Automation Pipeline
- [x] 4.1 XLSX Generator Utility (`xlsx-generator.ts` — lightweight XML-based)
- [x] 4.2 Update Quote Submission Flow (generate XLSX → upload R2 → update `excel_url`)
- [x] 4.3 Customer Email Template (`quotation-email.ts` — "Thank You" email)
- [x] 4.4 Admin Email Update (`quotation-email.ts` — professional HTML template)
- [x] 4.5 Admin XLSX Download (`GET /:id/excel` route + admin UI button)

## Phase 5: Performance & Final Polish
- [x] 5.1 UX Polish (QuoteCart page — breadcrumb, sticky form, clear all)
- [ ] 5.2 Smart Truncation
- [x] 5.3 Loading States (skeleton in admin list, submit button spinner)
- [x] 5.4 Error Handling (toast notifications, try/catch on emails/XLSX)
- [ ] 5.5 Verification & Testing (end-to-end browser test)

## Notes
- XLSX generated using custom lightweight XML-based approach (avoids ExcelJS 2MB limit on Workers)
- Old `quote_requests` table preserved; new code uses `quotation_requests` exclusively
- Email: Admin notification (Resend) + Customer "Thank You" (Resend) — both best-effort
- R2: XLSX files stored under `rfq/` prefix, cleaned up on quotation delete
