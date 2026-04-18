---
phase: planning
feature: production-readiness
status: done
---
# Planning — Production Readiness

## Task Breakdown

### Phase 1 — Rate Limiting Verification ✅

- [x] **T1**: Verified rate limiting is already active on `POST /api/contact` (line 11) and `POST /api/quotations` (line 23) — both call `rateLimit(5, 3600)`.
- [x] **T2**: Updated `docs/architecture.md` to mark rate limiting as **ACTIVE**.

### Phase 2 — Cloudflare Turnstile Integration ✅

- [x] **T3**: Installed `@marsidev/react-turnstile` frontend package.
- [x] **T4**: Created `src/components/ui/TurnstileWidget.tsx` — shared widget component with opt-in pattern.
- [x] **T5**: Created `server/src/lib/turnstile.ts` — server-side token verification utility.
- [x] **T6**: Added `TURNSTILE_SECRET_KEY` to `server/src/types.ts` Env interface.
- [x] **T7**: Integrated Turnstile verification into `server/src/routes/contact.ts` POST handler.
- [x] **T8**: Integrated Turnstile verification into `server/src/routes/quotations.ts` POST handler.
- [x] **T9**: Integrated `<TurnstileWidget>` into `src/pages/Contact.tsx` form.
- [x] **T10**: Integrated `<TurnstileWidget>` into `src/pages/QuoteCart.tsx` form.
- [x] **T11**: Updated `.env.example` with `VITE_TURNSTILE_SITE_KEY`.

### Phase 3 — SEO Hardening ✅

> **Design Pivot:** Research confirmed `vite-plugin-prerender` and `react-snap` are deprecated/unmaintained in 2025+. Modern Google Bot renders JS SPAs. Instead of risky prerender plugins, we applied **proven SEO best practices** that work reliably:

- [x] **T12**: Added JSON-LD structured data (Organization + WebSite schemas) to `index.html`.
- [x] **T13**: Added `<noscript>` fallback content with company info, solutions list, and navigation links.
- [x] **T14**: Added Open Graph meta tags, robots directive, and canonical URL to `index.html`.

### Phase 4 — Validation ✅

- [x] **T15**: `npx tsc --noEmit` — zero errors.
- [x] **T16**: `npm run build` — Vite build succeeds in 21s. `dist/index.html` contains structured data.
