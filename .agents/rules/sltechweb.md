---
trigger: always_on
---

# Project Context: SLTECH (B2B ELV & ICT)
- Stack: React 19 (Vite), Cloudflare Workers (Hono), D1 (SQLite), R2 (Storage).
- UI Style: "Bright Engineering" - Professional, clean, high-contrast, using shadcn/ui.
- Data Integrity: Always use Soft Delete (`deleted_at`). Never delete master data (Categories/Brands) if linked to Products.
- Image Pipeline: Always convert to WebP on client-side before uploading to R2. Use 'sharp' logic for server-side if needed.
- B2B Focus: Prioritize technical specs, PDF datasheets, and Zalo/Email RFQ workflows over standard B2C cart logic.
- Database: SQLite (D1) limitations apply. Use JSON columns for dynamic attributes. Always check migrations before altering schema.
