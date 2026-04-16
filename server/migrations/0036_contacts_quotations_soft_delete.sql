-- Migration 0036: Add missing deleted_at column to contacts and quotation_requests
-- These tables were using soft delete in route handlers (contact.ts, quotations.ts, admin.ts)
-- but the column was never created, causing SQL errors → 500 on admin endpoints.

ALTER TABLE contacts ADD COLUMN deleted_at TEXT;
ALTER TABLE quotation_requests ADD COLUMN deleted_at TEXT;

CREATE INDEX IF NOT EXISTS idx_contacts_deleted ON contacts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_quotation_requests_deleted ON quotation_requests(deleted_at);
