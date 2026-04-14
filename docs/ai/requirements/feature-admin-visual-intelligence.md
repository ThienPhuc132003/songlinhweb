---
phase: requirements
feature: admin-visual-intelligence
---
# Feature: Admin Visual Intelligence

## Problem Statement

The SLTECH admin panel currently has two visual quality gaps:

1. **Email notifications** sent via Resend are plain, unbranded HTML. They lack a logo, structured card layout, and secondary CTAs (Zalo, compose email). For a B2B ELV company, these emails should look like branded technical documents — not raw alerts.
2. **Admin Dashboard** uses basic stat counters and a manually drawn CSS bar chart. It lacks trend indicators, a proper charting library, and operational monitoring (storage usage). It feels like a placeholder rather than a Business Intelligence hub.

## Goals

1. Transform all transactional emails (quotation admin, contact admin, quotation customer confirmation) into branded, editorial-quality HTML documents using the `#3C5DAA` design language.
2. Replace the Dashboard's simple counters with a full BI hub: 4 stat cards with trend deltas, a Recharts AreaChart for quotation trends (last 30 days), a Recent Activities table, and a Storage Usage monitor (D1 row counts + R2 object summary).

## Non-Goals

- Customer-facing marketing email campaigns (out of scope).
- Real-time WebSocket-driven dashboard (live D1 polling is sufficient).
- Email sending logic changes — only the HTML template output changes.
- R2 file browser or advanced storage management UI.

## User Stories

1. **As the SLTECH admin**, I want to receive a professionally branded email notification when a new quotation request arrives, so that I can immediately assess the request's details, click an Admin deeplink, chat on Zalo, or compose a reply — all from the email itself.
2. **As the SLTECH admin**, I want the customer confirmation email to look polished and branded, reinforcing trust in Song Linh Technologies.
3. **As the SLTECH admin**, I want to see at-a-glance trend indicators on the dashboard cards (e.g., "+3 from last week") so I can understand momentum without digging into raw data.
4. **As the SLTECH admin**, I want a proper area chart showing quotation request volume over the last 30 days, so I can identify daily patterns and demand spikes.
5. **As the SLTECH admin**, I want to see D1 row counts and R2 storage usage on the dashboard, so I can monitor platform health at a glance.

## Success Criteria

- All 3 email templates render with: logo-left / title-right header, `#3C5DAA` hairline divider, white-card data presentation, and CTA buttons (Admin deeplink, Zalo chat, compose email).
- Dashboard loads real-time stats from D1 with correctly computed trend deltas (this week vs. last week).
- Recharts AreaChart renders with `stroke: #3C5DAA`, gradient fill, responsive on mobile.
- Storage monitor shows D1 row counts per entity and R2 object count/size.
- No TypeScript errors (`npx tsc --noEmit` passes in both `server/` and root).

## Constraints

- **Email HTML**: Must be inline-CSS only. No external stylesheets — email clients strip `<style>` tags. No JavaScript.
- **Logo in email**: Must use a publicly accessible URL (hosted on R2 or a CDN), not a data:URI (Gmail strips large data URIs). Fallback to text-only header if logo URL is unavailable.
- **Recharts**: Must be installed as a new dependency (`recharts`). Bundle size impact is acceptable for admin-only pages (lazy-loaded).
- **D1/R2 API**: Storage monitoring must use existing Cloudflare bindings — no external API calls needed. R2's `.list()` provides object count. D1 row counts via `SELECT COUNT(*)`.
- **Zalo link in email**: Use `https://zalo.me/{phone}` pattern already established in `AdminQuotations.tsx`.

## Open Questions

None — all requirements are well-defined from the user's specification.
