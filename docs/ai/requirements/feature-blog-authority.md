---
phase: requirements
feature: blog-authority
---
# Blog Authority & Expert References Module

## Problem Statement
Module 'Tin tức & Kiến thức' hiện tại thiếu các yếu tố chuyên môn cần thiết để xây dựng uy tín chuyên gia (Expert Authority). Khi consultant/contractor truy cập, bài viết cần thể hiện tính chuyên môn qua:
- Trích dẫn nguồn tham khảo (pháp lý, tiêu chuẩn, tin tức)
- Metadata kiểm duyệt kỹ thuật (reviewed by)
- Tracking cập nhật (last_updated_at)
- Typography cao cấp kiểu tạp chí kỹ thuật (IEEE, McKinsey)

## Goals
1. **Database Enhancement**: Thêm fields `last_updated_at`, `reviewed_by`, `references` vào bảng Posts
2. **Admin Reference Manager**: Giao diện thêm/xóa dynamic references cho mỗi bài viết
3. **Frontend Authority UI**: Hiển thị metadata chuyên nghiệp, in-text citations [1], section tài liệu tham khảo
4. **Content Template**: Template "Technical Whitepaper" cho biên tập viên
5. **Magazine UI Refinement**: Typography cao cấp, sticky TOC sidebar, "Bright Engineering" palette

## Non-Goals
- Không tạo user authentication/role system mới (dùng admin key hiện tại)
- Không tạo commenting system
- Không thay đổi architecture của hệ thống CMS (vẫn dùng Markdown)
- Không tạo tính năng "peer review" workflow

## User Stories

### US-1: Admin quản lý tài liệu tham khảo
**As a** Lead Technical Strategist,  
**I want** to add/remove structured references (law, standard, news, vendor) for each article,  
**so that** articles have formal citations that build trust with B2B audiences.

### US-2: Frontend hiển thị metadata chuyên nghiệp
**As a** B2B visitor (consultant/contractor),  
**I want** to see publication date, last update, reviewer name, reading time, and print/PDF option,  
**so that** I can trust the article is current, reviewed, and authoritative.

### US-3: In-text citations liên kết đến references
**As a** reader,  
**I want** to click superscript citation numbers [1] in text that link to the reference section,  
**so that** I can verify claims against original sources.

### US-4: Reference Section chuyên nghiệp
**As a** B2B visitor,  
**I want** to see a clean "Tài liệu tham khảo & Căn cứ pháp lý" section with categorized icons,  
**so that** I immediately recognize the article's legal/technical backing.

### US-5: Template viết whitepaper kỹ thuật
**As an** editor,  
**I want** a pre-built "Technical Whitepaper" template with standard sections,  
**so that** I can write consistent, professional technical articles quickly.

### US-6: Magazine-style reading experience
**As a** reader,  
**I want** a clean, high-end reading experience with no "wall of text",  
**so that** the article feels premium and trustworthy.

## Success Criteria
1. Admin PostFormSheet có section "Reference Manager" cho phép add/remove N references
2. Mỗi reference có: title, url, type (law | standard | news | vendor)
3. Frontend BlogPost hiển thị: ngày đăng, cập nhật cuối, kiểm duyệt bởi, reading time
4. In-text `[1]` links scroll xuống reference section
5. Reference section có icons phân loại rõ ràng
6. Print/PDF button hoạt động
7. Typography line-height ≥ 1.8, sticky sidebar TOC
8. Whitepaper template available trong editor

## Constraints
- **Database**: D1 SQLite — cần migration SQL file (0019)
- **Backend**: Hono trên Cloudflare Workers — cần update routes/posts.ts
- **Frontend**: React + Vite + TailwindCSS + ShadcnUI
- **No breaking changes**: Existing posts must continue to work (new fields nullable/defaulted)
- **Performance**: References stored as JSON column (not separate table) for simplicity

## Open Questions
- ~~Cần Icon library nào cho reference types?~~ → Dùng Lucide icons đã có (Scale, Cog, Globe, Building2)
- ~~Print/PDF dùng native window.print() hay library?~~ → Dùng native window.print() với print-specific CSS media query
