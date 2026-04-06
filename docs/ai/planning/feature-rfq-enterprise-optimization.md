---
phase: planning
feature: rfq-enterprise-optimization
---
# Planning — RFQ Enterprise Optimization

## Task Breakdown

### Task 1: Add XLSX Attachment to Admin Email
- **File:** `server/src/services/quotation-email.ts`
- **Changes:**
  1. Add `xlsxBuffer?: ArrayBuffer` parameter to `sendQuotationAdminEmail()`
  2. Create `uint8ToBase64()` helper (Workers-compatible, no Node.js Buffer)
  3. Add `attachments` array to Resend payload when `xlsxBuffer` is provided
  4. Generate attachment filename: `SLTECH_RFQ_{id}.xlsx`
- **Status:** not-started

### Task 2: Add Admin Dashboard Deeplink to Email
- **File:** `server/src/services/quotation-email.ts`
- **Changes:**
  1. Add `SITE_URL` to Env type in `types.ts`
  2. Extract base URL from `CORS_ORIGIN` (first origin) or `SITE_URL` 
  3. Add CTA button in admin email HTML: "Xem chi tiết trong Admin Panel →"
  4. Link format: `{baseUrl}/admin/quotations/{id}`
- **Status:** not-started

### Task 3: Pass XLSX Buffer to Email Function
- **File:** `server/src/routes/quotations.ts`
- **Changes:**
  1. Store `xlsxBuffer` from XLSX generation step
  2. Pass it to `sendQuotationAdminEmail(c.env, quotationData, xlsxBuffer)` 
  3. Ensure buffer is only passed when XLSX generation succeeded
- **Status:** not-started

### Task 4: Create R2 Cleanup Service
- **File:** `server/src/services/r2-cleanup.ts` (NEW)
- **Changes:**
  1. Create `cleanupOldXlsxFiles(env: Env)` function
  2. R2 `list()` with prefix `rfq/`, paginate with cursor
  3. Filter objects with `uploaded` timestamp > 180 days ago
  4. R2 `delete()` matching keys
  5. D1 batch update: `SET excel_url = NULL WHERE excel_url IN (...)`
  6. Log cleanup results
- **Status:** not-started

### Task 5: Register Cron Trigger
- **Files:** `server/src/index.ts`, `server/wrangler.toml`
- **Changes:**
  1. Add `[triggers]` section to `wrangler.toml`: `crons = ["0 3 * * *"]`
  2. Change `export default app` to export object with `fetch` + `scheduled` handlers
  3. Import and call `cleanupOldXlsxFiles()` in scheduled handler
- **Status:** not-started

### Task 6: Deploy & Verify
- **Changes:**
  1. `npm run deploy` — deploy updated Worker
  2. Test RFQ submission → verify admin email has XLSX attachment
  3. Verify deeplink in email points to correct admin URL
  4. Test cron trigger manually via `wrangler` (optional)
- **Status:** not-started

## Execution Order

```
Task 1 + Task 2 (parallel, same file)
    ↓
Task 3 (depends on Task 1 signature change)
    ↓
Task 4 (independent)
    ↓
Task 5 (depends on Task 4)
    ↓
Task 6 (deploy & verify)
```

## Risk Assessment

| Risk | Mitigation |
|---|---|
| `btoa()` fails on binary data | Use chunk-based base64 encoding for Uint8Array |
| Cron trigger not firing | Can test with `wrangler dev` + manual trigger |
| XLSX too large for email | Current files ~50KB, Resend limit 40MB — no risk |
| R2 cleanup deletes active files | 180-day threshold is very conservative |
