---
status: completed
created: 2026-04-03
feature: admin-ux-restructure
design: feature-admin-ux-restructure
---

# Planning: Admin UX Restructure — Sidebar & Quotation UI

## Tasks

### Task 1: Restructure Admin Sidebar
**File:** `src/components/admin/AdminLayout.tsx`
**Status:** pending
**Estimate:** 15 min

**Steps:**
1. Remove `quotations` entry from `productSubItems` array
2. Remove `contacts` entry from `bottomNavItems` array 
3. Add `Inbox` import from lucide-react icons
4. Create `inboxSubItems` array with quotations + contacts
5. Add `isInboxRoute()` helper function
6. Add `inboxMenuOpen` state with auto-expand logic
7. Add `useEffect` to keep inbox menu open on inbox routes
8. Remove quotation routes from `isProductRoute()`
9. Render new "Hộp thư" collapsible group after "Sản phẩm" group
10. Add badge count fetch for new quotation requests
11. Display badge next to "Yêu cầu báo giá" sub-item

### Task 2: Refine Quotation UI
**File:** `src/pages/admin/AdminQuotations.tsx`
**Status:** pending  
**Estimate:** 10 min

**Steps:**
1. Add `Copy` import from lucide-react
2. Update `STATUS_CONFIG` colors (sent→indigo, completed→green)
3. Change phone number link to Zalo link with inline Zalo SVG icon
4. Add copy button next to email address
5. Upgrade "Tải Excel" button to primary style (bg-blue-600, text-white)

## Execution Order

1. Task 1 (Sidebar) — foundational change
2. Task 2 (Quotation UI) — independent refinement
3. Visual verification via browser
