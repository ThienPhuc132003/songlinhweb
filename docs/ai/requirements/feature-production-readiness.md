---
phase: requirements
feature: production-readiness
status: approved
---
# Production Readiness — Security & SEO Hardening

## Problem Statement

The SLTECH platform has strong architecture (Workers + D1 + R2) but is missing 3 critical production defenses:
1. **Rate Limiting is inactive** on public form endpoints, leaving the RFQ and Contact forms vulnerable to DDoS and email spam.
2. **No CAPTCHA** protects public forms from bot scrapers (only a client-side Honeypot exists, which is trivially bypassed).
3. **SPA renders an empty `<div id="root">` to Google Bot**, killing B2B SEO for all product, solution, and blog pages.

## Goals

1. **Activate Rate Limiting** — Apply the existing in-memory rate limiter middleware to `POST /api/contact` and `POST /api/quotations` (max 5 requests per IP per hour). Return `429 Too Many Requests` when triggered.
2. **Integrate Cloudflare Turnstile** — Add the Turnstile CAPTCHA widget to both the Contact form and the Quote Cart form on the frontend. Verify the Turnstile token server-side before processing submissions.
3. **Implement SEO Prerendering** — Ensure that static routes (`/`, `/gioi-thieu`, `/giai-phap`) and high-value listing routes (`/san-pham`, `/du-an`, `/tin-tuc`) produce crawlable HTML content during the Vite build process.

## Non-Goals

- No schema/database changes.
- No UI redesigns — Turnstile widget must blend seamlessly into existing form layouts.
- No migration to SSR frameworks (Next.js, Remix). The project stays as a Vite SPA.
- No changes to Admin panel security (already behind HttpOnly Cookies).

## User Stories

- As a **business owner**, I want bots to be unable to spam the RFQ and Contact forms, so that I only receive legitimate inquiries.
- As a **search engine crawler**, I want to read meaningful HTML content on static pages, so that the company's product/solution pages can be indexed and ranked.
- As a **developer**, I want production hardening to be configuration-driven (env vars), so that Turnstile can be toggled on/off per environment.

## Success Criteria

- [ ] `POST /api/contact` and `POST /api/quotations` return `429` after 5 rapid requests from the same IP.
- [ ] Both frontend forms include a visible Turnstile widget that must be completed before submission.
- [ ] Backend rejects submissions without a valid Turnstile token (`cf-turnstile-response`).
- [ ] `npm run build` generates prerendered HTML files for at least `/`, `/gioi-thieu`, `/giai-phap`.
- [ ] The generated `index.html` for `/` contains visible text content (not just `<div id="root"></div>`).
- [ ] `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are documented in `.env.example`.
- [ ] Build passes with zero TypeScript errors.

## Constraints

- **Rate limiter is per-isolate** — Cloudflare Workers may recycle isolates, so in-memory rate limiting is "best-effort". This is acceptable for B2B (low traffic).
- **Turnstile is opt-in** — If `VITE_TURNSTILE_SITE_KEY` is empty, the widget should be hidden and backend should skip verification. This allows local dev without Turnstile.
- **Prerendering is build-time only** — No Node.js server at runtime. The HTML is statically generated during `vite build` and served by Vercel CDN.
- **No new runtime dependencies on the backend** — Turnstile verification is a single `fetch()` call to Cloudflare's API.

## Open Questions

None — all 3 features have clear implementation paths identified during the architecture review.
