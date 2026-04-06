---
phase: requirements
feature: case-study-system
status: approved
created: 2026-04-04
---
# Case Study System — Requirements

## Problem Statement
Module 'Dự án' đã được refactor sang portfolio-v2 (5-tab form, PDF-style frontend), nhưng còn thiếu:
- Admin form max-w-6xl vẫn chưa đủ cảm giác "Dashboard Editor" (cần full-screen 2-column)
- Chưa có fields: challenges, outcomes, testimonials, video_url
- Gallery chưa hiển thị masonry/slider style
- Frontend thiếu "Infographic Big Numbers" section ngay sau Hero
- Chưa có testimonial section

## Goals
1. Admin UI → Full-screen 2-column layout (70/30 split) với 2 tabs trái + sidebar phải
2. DB Schema → mở rộng thêm challenges, outcomes, testimonial_name, testimonial_content, video_url
3. Frontend → Infographic stats + Masonry gallery + Testimonial block + "Bright Engineering" aesthetic
4. Image pipeline đã hoạt động (upload.ts + ImageUploadField.tsx) — chỉ cần verify + enhance gallery admin UX

## Non-Goals
- Không thêm API endpoints mới (reuse existing CRUD)
- Drag-and-drop gallery reorder (phase 2)
