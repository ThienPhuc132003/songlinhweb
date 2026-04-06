---
phase: requirements
feature: project-portfolio-v2
status: approved
created: 2026-04-04
---
# Technical Portfolio V2 — Requirements

## Problem Statement
Module 'Dự án' hiện tại (sau B2B portfolio upgrade) đã có đủ data fields nhưng UI/UX chưa đạt chuẩn Engineering Portfolio:
- Admin form bị nhồi trong max-w-2xl dialog, 20+ fields scroll dài
- Hero section gradient quá tối, che mất chi tiết ảnh cover
- Sidebar chỉ hiển thị basic metadata, thiếu Systems/Brands
- Key Metrics editing vẫn dùng raw JSON textarea
- Không có content template hướng dẫn admin viết bài

## Goals
1. Admin form → 5-tab max-w-6xl sheet (General, Technical, Linkages, Media, SEO)
2. Dynamic Key Metrics visual editor (key-value pairs)
3. Frontend PDF-style portfolio look (clean hero, specs sidebar, QA badge)
4. Markdown content template cho admin

## Non-Goals
- Không thay đổi DB schema
- Không thêm API endpoints mới
- Không ảnh hưởng admin pages khác

## Success Criteria
- Admin form renders trong 5 tabs rõ ràng
- Key Metrics editor cho phép add/remove rows visually
- Hero gradient nhẹ, ảnh cover visible
- Sidebar hiển thị Systems + Brands
- QA Badge footer hiển thị
- Zero TypeScript errors, build success
