---
phase: testing
feature: b2b-website-rebuild
---
# Testing — SLTECH B2B Website Rebuild

## Test Strategy

### Per-Phase Testing

| Phase | Test Type | Cách kiểm tra |
|-------|----------|---------------|
| 1 (Done) | Backend health | `npx wrangler dev` → `curl localhost:8787` |
| 1 (Done) | TypeScript | `npx tsc --noEmit` ✅ |
| 2 | Visual | Browser: kiểm tra brand blue #3C5DAA đúng |
| 3 | API | `curl localhost:8787/api/solutions` → JSON array |
| 3 | Pagination | `curl localhost:8787/api/products?page=1&limit=5` → meta.total |
| 3 | Search | `curl localhost:8787/api/products?search=axis` → filtered results |
| 4 | Frontend | Browser: mở trang → data từ API, không hardcoded |
| 5 | RFQ flow | Browser: thêm SP → giỏ hàng → form → submit → check email |
| 6 | Admin | Browser: login admin → CRUD content |
| 7 | Production | `curl https://api.sltech.vn` → health check |

### Manual Verification (User checkpoints)

| Khi nào | Người kiểm tra | Kiểm tra gì |
|---------|----------------|-------------|
| Sau Phase 4 | User | Trang web hiển thị đúng data, brand nhất quán |
| Sau Phase 5 | User | Test RFQ flow end-to-end, kiểm tra email nhận CSV |
| Sau Phase 7 | User | Production site hoàn chỉnh, all pages |

## Test Data

- Seed data có sẵn: `server/migrations/0002_seed_data.sql`
- Seed local: `wrangler d1 execute songlinh-db --local --file=migrations/0002_seed_data.sql`
