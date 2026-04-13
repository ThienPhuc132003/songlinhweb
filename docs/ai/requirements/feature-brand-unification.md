---
feature: brand-unification
status: draft
created: 2026-04-12
---

# Feature: Brand Unification — "SLTECH" → "Song Linh Technologies"

## 1. Context & Problem

Sếp yêu cầu **không sử dụng "SLTECH" cho trang web nữa**, chỉ sử dụng **"Song Linh Technologies"** (hoặc tên pháp lý đầy đủ "CÔNG TY TNHH TM CÔNG NGHỆ SONG LINH"). Hiện tại "SLTECH" xuất hiện ở ~70 vị trí trên frontend + backend.

Ngoài ra, cần **review lại nội dung các trang** (đặc biệt trang Giải pháp, Giới thiệu) để đảm bảo phù hợp với mô hình **B2B ELV & ICT**.

## 2. Scope

### 2.1 Branding Changes (SLTECH → Song Linh Technologies)

#### A. User-Facing Content (~25 locations)
| File | Current | Change To |
|---|---|---|
| `constants.ts` L3 | `shortName: "SLTECH"` | `shortName: "Song Linh Technologies"` |
| `seo.tsx` L12 | `SITE.shortName` in title | Will auto-follow shortName change |
| `seo.tsx` L14 | `https://sltech.vn` fallback | `https://songlinhtech.vn` ← **NEEDS CONFIRMATION** |
| `QuoteCart.tsx` L113 | `SLTECH_RFQ_{id}` | `SLT_RFQ_{id}` or `SongLinh_RFQ_{id}` ← **NEEDS CONFIRMATION** |
| `QuoteCart.tsx` L129 | "Đội ngũ SLTECH" | "Đội ngũ Song Linh Technologies" |
| `QuoteCart.tsx` L417 | "SLTECH tiếp nhận" | "Song Linh Technologies tiếp nhận" |
| `ProductDetail.tsx` L568 | "đội ngũ kỹ thuật SLTECH" | "đội ngũ kỹ thuật Song Linh Technologies" |
| `About.tsx` L172 | "SLTECH (Song Linh Technologies)" | "Song Linh Technologies" |
| `About.tsx` L206,301 | alt attributes "SLTECH" | "Song Linh Technologies" |
| `AdminLayout.tsx` L285 | "SLTECH" title | "Song Linh Technologies" |
| Admin form sheets (3 files) | "— SLTECH" SEO preview | "— Song Linh Technologies" |
| `AdminSettings.tsx` L447,594,669 | Various "SLTECH" refs | "Song Linh Technologies" |

#### B. Internal/Technical Keys (~15 locations) — *Low risk but for consistency*
| File | Key | Recommendation |
|---|---|---|
| `admin-api.ts` | `sltech_admin_key` localStorage key | **KEEP** — internal, changing would log out all admins |
| `CompareContext.tsx` | `sltech-compare` localStorage key | **KEEP** — internal |
| `CartContext.tsx` | `sltech-rfq-cart` localStorage key | **KEEP** — internal |
| `ThemeProvider.tsx` | `sltech-theme` localStorage key | **KEEP** — internal |
| `email.ts` | `sltech-email-rate` rate limit key | **KEEP** — internal |

#### C. Server-Side (~25 locations)
| File | Content | Change To |
|---|---|---|
| `index.ts` L81 | `"SLTECH API"` | `"Song Linh Technologies API"` |
| `xlsx-generator.ts` | `SLTECH_RFQ_*` filenames + headers | `SLT_RFQ_*` or `SongLinh_RFQ_*` |
| `quotation-email.ts` | ~15 "SLTECH" refs in HTML emails | "Song Linh Technologies" |
| `email.ts` | "SLTECH Website" sender name | "Song Linh Technologies" |
| `csv-export.ts` | "YÊU CẦU BÁO GIÁ - SLTECH" | "YÊU CẦU BÁO GIÁ - Song Linh Technologies" |
| `contact.ts` | "SLTECH Website" sender | "Song Linh Technologies" |
| `seo.ts` | `https://sltech.vn` fallback | **NEEDS CONFIRMATION** |

#### D. CSS Comments (~2 locations) — *Low priority*
| File | Line |
|---|---|
| `theme.css` L1 | "SLTECH Design Tokens" → "Song Linh Design Tokens" |
| `globals.css` L195 | "SLTECH Brand Identity" → "Song Linh Brand Identity" |

### 2.2 Content Review — B2B Fitness

#### Trang Giải pháp (Solutions)
- `SOLUTIONS_DATA` trong `constants.ts` — 11 giải pháp
- `src/data/solutions/` — 12 files chi tiết (cctv, access-control, parking, video-wall, etc.)
- **Cần review**: Nội dung mô tả, technical specs, và bố cục có phù hợp B2B chưa?

#### Trang Giới thiệu (About)
- `About.tsx` — Phần narrative, company stats, team section
- **Cần review**: Default narrative content phù hợp chưa?

## 3. Open Questions

> [!IMPORTANT]
> Câu hỏi cần xác nhận từ sếp trước khi triển khai:

1. **Domain**: Tên miền vẫn là `sltech.vn` hay đổi sang domain khác? (Điều này ảnh hưởng URLs trong SEO, email fallback, XLSX headers)

2. **RFQ Code Format**: Mã báo giá hiện là `SLTECH_RFQ_123`. Đổi thành format nào?
   - `SLT_RFQ_123` (viết tắt ngắn gọn)
   - `SongLinh_RFQ_123`
   - Giữ `SLTECH_RFQ_123` (vì đã có dữ liệu cũ)

3. **Email sender name**: "SLTECH Website" → "Song Linh Technologies" hay format khác?

4. **Nội dung trang Giải pháp**: Anh/chị có muốn xem lại từng trang giải pháp chi tiết, hay nội dung kỹ thuật hiện tại đã ổn? (Tôi đã xem qua — nội dung chuyên môn khá tốt cho B2B, nhưng cần xác nhận thêm về: tiêu chuẩn áp dụng, thương hiệu đối tác, quy trình triển khai)

5. **Nội dung trang Giới thiệu**: Phần "SLTECH (Song Linh Technologies) là công ty chuyên về..." — cần viết lại narrative này không?

6. **Chỉ frontend hay cả admin CMS?**: Có cần đổi "SLTECH" trong admin panel (chỉ nhân viên nội bộ thấy) không?
