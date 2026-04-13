-- Migration 0032: Add deleted_at column to brands table
-- The brands route filters on deleted_at IS NULL but the column was never added

ALTER TABLE brands ADD COLUMN deleted_at TEXT;
CREATE INDEX IF NOT EXISTS idx_brands_deleted ON brands(deleted_at);
