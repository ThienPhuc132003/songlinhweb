-- Migration 0031: Add soft delete to product_categories
-- Missed in 0027_unified_soft_delete.sql

ALTER TABLE product_categories ADD COLUMN deleted_at TEXT;
CREATE INDEX IF NOT EXISTS idx_product_categories_deleted ON product_categories(deleted_at);
