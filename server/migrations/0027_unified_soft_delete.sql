-- Migration 0027: Unified soft delete across all master data tables
-- Ensures data integrity: posts, solutions, partners, gallery_albums
-- Products and projects already have deleted_at from earlier migrations

-- Add deleted_at column to tables that lack it
ALTER TABLE posts ADD COLUMN deleted_at TEXT;
ALTER TABLE solutions ADD COLUMN deleted_at TEXT;
ALTER TABLE partners ADD COLUMN deleted_at TEXT;
ALTER TABLE gallery_albums ADD COLUMN deleted_at TEXT;

-- Indexes for efficient filtering on soft-delete queries
CREATE INDEX IF NOT EXISTS idx_posts_deleted ON posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_solutions_deleted ON solutions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_partners_deleted ON partners(deleted_at);
CREATE INDEX IF NOT EXISTS idx_gallery_deleted ON gallery_albums(deleted_at);
