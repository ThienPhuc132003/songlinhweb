-- ═══════════════════════════════════════════════
-- Migration 0002: Product Module Enhancement
-- Adds: brands table, brand_id FK on products,
--        parent_id to ProductCategoryRow sync
-- ═══════════════════════════════════════════════

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  website_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- Add brand_id FK to products (if not exists — SQLite ignores duplicate ADD COLUMN)
-- NOTE: brand TEXT column already exists from prior ALTER TABLE
ALTER TABLE products ADD COLUMN brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL;

-- Seed initial brands for ELV industry
INSERT OR IGNORE INTO brands (slug, name, description, sort_order) VALUES
  ('hikvision', 'Hikvision', 'Thương hiệu camera và giải pháp an ninh hàng đầu thế giới', 1),
  ('dahua', 'Dahua', 'Giải pháp giám sát thông minh AI', 2),
  ('zkteco', 'ZKTeco', 'Thiết bị kiểm soát ra vào và chấm công', 3),
  ('honeywell', 'Honeywell', 'Hệ thống PCCC và an ninh công nghiệp', 4),
  ('bosch', 'Bosch', 'Thiết bị an ninh và hệ thống PA chuyên nghiệp', 5),
  ('cisco', 'Cisco', 'Thiết bị mạng và hạ tầng IT doanh nghiệp', 6),
  ('toa', 'TOA', 'Hệ thống âm thanh thông báo chuyên nghiệp', 7),
  ('axis', 'Axis Communications', 'Camera IP và giải pháp video mạng', 8),
  ('hanwha', 'Hanwha Techwin', 'Camera giám sát AI thế hệ mới', 9),
  ('apc', 'APC by Schneider', 'Hệ thống UPS và bảo vệ nguồn điện', 10);
