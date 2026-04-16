-- Migration 0035: Add missing deleted_at column to product_features
-- The backend soft-delete handler and list query both reference this column,
-- but it was never added when the table was created in migration 0012.

ALTER TABLE product_features ADD COLUMN deleted_at TEXT;

CREATE INDEX IF NOT EXISTS idx_product_features_deleted ON product_features(deleted_at);
