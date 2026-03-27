-- Migration: 0001 — Initial schema for SLTECH API
-- Based on existing TypeScript types in server/src/types.ts

-- ═══════════════════════════════════════════════
-- GIẢI PHÁP (Solutions)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS solutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content_md TEXT,
  icon TEXT NOT NULL DEFAULT 'FileCheck',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════
-- DANH MỤC SẢN PHẨM (Product Categories)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  parent_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- ═══════════════════════════════════════════════
-- SẢN PHẨM (Products — KHÔNG CÓ GIÁ)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  spec_sheet_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════
-- DỰ ÁN (Projects)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  client_name TEXT,
  thumbnail_url TEXT,
  content_md TEXT,
  category TEXT NOT NULL DEFAULT '',
  year INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════
-- TIN TỨC (Posts / Blog)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_md TEXT,
  thumbnail_url TEXT,
  author TEXT NOT NULL DEFAULT 'SLTECH',
  tags TEXT NOT NULL DEFAULT '[]',
  is_published INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════
-- THƯ VIỆN (Gallery Albums & Images)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS gallery_albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  cover_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ═══════════════════════════════════════════════
-- ĐỐI TÁC (Partners)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS partners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- ═══════════════════════════════════════════════
-- LIÊN HỆ (Contacts)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL DEFAULT '',
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════
-- CÀI ĐẶT WEBSITE (Site Config)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  description TEXT
);

-- ═══════════════════════════════════════════════
-- HÌNH ẢNH CHI TIẾT (Entity Images — cho solutions, projects)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS entity_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,  -- 'solution', 'project', 'product'
  entity_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_entity_images_lookup
  ON entity_images(entity_type, entity_id);

-- ═══════════════════════════════════════════════
-- YÊU CẦU BÁO GIÁ (Quote Requests — giỏ hàng)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  company TEXT,
  items TEXT NOT NULL DEFAULT '[]',  -- JSON [{product_id, product_name, qty}]
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_solutions_slug ON solutions(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, published_at);
