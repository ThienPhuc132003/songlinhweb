---
status: approved
created: 2026-04-03
feature: admin-ux-restructure
---

# Feature: Admin UX Restructure — Sidebar & Quotation UI

## Problem Statement

The current Admin sidebar groups "Yêu cầu báo giá" (RFQ) under "Sản phẩm" (Products), conflating Catalog Management with Lead Management. Additionally, "Liên hệ" (Contact) sits as a standalone bottom-nav item. For SLTECH's B2B growth, leads and communications should be clearly separated into their own "Hộp thư" (Inbox) group. The Quotation detail panel also lacks integration with common communication tools (Zalo, Email copy) and has inconsistent status color coding.

## User Stories

### US-1: Sidebar "Hộp thư" Group
**As an** admin user,  
**I want** "Yêu cầu báo giá" and "Liên hệ" grouped under a collapsible "Hộp thư" (Inbox) menu,  
**So that** I can quickly access all lead/communication items in one place.

### US-2: New Request Badge (Optional)
**As an** admin user,  
**I want** to see a count badge next to "Yêu cầu báo giá" showing the number of "Mới" (New) requests,  
**So that** I can immediately see pending work without clicking into the page.

### US-3: Zalo Integration on Phone Number
**As an** admin user,  
**I want** the customer phone number in the quotation detail to link to `https://zalo.me/{phone}` with a Zalo icon,  
**So that** I can quickly contact the customer via Zalo.

### US-4: Email Copy Action
**As an** admin user,  
**I want** a "Copy" icon next to the customer email in the quotation detail,  
**So that** I can copy the email address to clipboard with one click.

### US-5: Clear Status Color Coding
**As an** admin user,  
**I want** the status change buttons to be color-coded (Mới=Blue, Đang xử lý=Amber, Đã gửi=Indigo, Hoàn tất=Green),  
**So that** I can visually distinguish statuses at a glance.

### US-6: Clean Expanded Layout
**As an** admin user,  
**I want** the expanded row view in the quotation table to remain clean with the "Tải Excel" button visually prominent,  
**So that** I can easily perform the most important action.

## Acceptance Criteria

1. "Yêu cầu báo giá" is removed from the "Sản phẩm" sub-menu.
2. "Liên hệ" is removed from bottom nav items.
3. A new collapsible "Hộp thư" group exists in the sidebar between "Sản phẩm" and the remaining bottom nav.
4. "Hộp thư" contains "Yêu cầu báo giá" and "Liên hệ" as sub-items.
5. (Optional) A badge shows the count of "new" quotation requests next to the menu item.
6. Phone number in quotation detail links to `https://zalo.me/{phone}` with a Zalo icon.
7. A copy button next to the email copies the address to clipboard.
8. Status buttons use distinct colors: Blue, Amber, Indigo, Green.
9. "Tải Excel" button is visually prominent in the expanded detail view.
10. No regression: all existing sidebar navigation and quotation functionality works.

## Non-Functional Requirements

- Frontend-only changes (no backend modifications needed except optionally fetching new RFQ count).
- Must work on mobile sidebar.
- Smooth collapse/expand animations consistent with existing "Sản phẩm" group.

## Dependencies

- Existing `AdminLayout.tsx` sidebar structure
- Existing `AdminQuotations.tsx` detail panel
- Lucide React icons library
- Admin API for optional badge count
