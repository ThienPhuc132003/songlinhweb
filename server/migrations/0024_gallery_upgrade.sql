-- Migration: 0023 — Gallery module upgrade
-- Add description and category to gallery_albums for filtering

ALTER TABLE gallery_albums ADD COLUMN description TEXT NOT NULL DEFAULT '';
ALTER TABLE gallery_albums ADD COLUMN category TEXT NOT NULL DEFAULT 'general';

-- Category values: 'du-an' | 'ky-thuat' | 'hoat-dong' | 'general'

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_gallery_albums_category ON gallery_albums(category);
