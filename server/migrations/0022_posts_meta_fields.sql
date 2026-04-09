-- Migration: 0021 — Add missing meta_title and meta_description to posts
-- Root cause: These columns were referenced in code but never added by any migration

ALTER TABLE posts ADD COLUMN meta_title TEXT;
ALTER TABLE posts ADD COLUMN meta_description TEXT;
