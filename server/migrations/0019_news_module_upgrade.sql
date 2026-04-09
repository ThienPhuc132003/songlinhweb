-- Migration: 0018 — News/Blog module upgrade
-- Adds status, category, view_count, is_featured, reading_time_min to posts

-- New columns
ALTER TABLE posts ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE posts ADD COLUMN category TEXT NOT NULL DEFAULT 'general';
ALTER TABLE posts ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN reading_time_min INTEGER NOT NULL DEFAULT 0;

-- Backfill status from is_published
UPDATE posts SET status = 'published' WHERE is_published = 1;
UPDATE posts SET status = 'draft' WHERE is_published = 0;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured);
