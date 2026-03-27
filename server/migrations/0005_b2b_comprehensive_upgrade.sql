-- Migration: 0005 — B2B Comprehensive Upgrade
-- Add new columns for products, solutions, projects, posts

-- ═══════════════════════════════════════════════
-- PRODUCTS: add B2B detail fields
-- ═══════════════════════════════════════════════
ALTER TABLE products ADD COLUMN brand TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN model_number TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN specifications TEXT DEFAULT '{}';
ALTER TABLE products ADD COLUMN features TEXT DEFAULT '[]';
ALTER TABLE products ADD COLUMN meta_title TEXT;
ALTER TABLE products ADD COLUMN meta_description TEXT;
ALTER TABLE products ADD COLUMN updated_at TEXT DEFAULT (datetime('now'));

-- ═══════════════════════════════════════════════
-- SOLUTIONS: add hero image + SEO
-- ═══════════════════════════════════════════════
ALTER TABLE solutions ADD COLUMN hero_image_url TEXT;
ALTER TABLE solutions ADD COLUMN meta_title TEXT;
ALTER TABLE solutions ADD COLUMN meta_description TEXT;

-- ═══════════════════════════════════════════════
-- PROJECTS: add SEO (case study fields already exist from 0004)
-- ═══════════════════════════════════════════════
ALTER TABLE projects ADD COLUMN meta_title TEXT;
ALTER TABLE projects ADD COLUMN meta_description TEXT;

-- ═══════════════════════════════════════════════
-- POSTS: add SEO
-- ═══════════════════════════════════════════════
ALTER TABLE posts ADD COLUMN meta_title TEXT;
ALTER TABLE posts ADD COLUMN meta_description TEXT;
