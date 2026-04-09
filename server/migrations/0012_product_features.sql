-- ============================================================
-- Migration 0011: Product Features Module
-- Creates product_features table and product_to_features junction
-- ============================================================

-- Product Features master table
CREATE TABLE IF NOT EXISTS product_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  group_name TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Junction table: Product <-> Features (Many-to-Many)
CREATE TABLE IF NOT EXISTS product_to_features (
  product_id INTEGER NOT NULL,
  feature_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, feature_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (feature_id) REFERENCES product_features(id) ON DELETE CASCADE
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ptf_product ON product_to_features(product_id);
CREATE INDEX IF NOT EXISTS idx_ptf_feature ON product_to_features(feature_id);
CREATE INDEX IF NOT EXISTS idx_pf_group ON product_features(group_name);
CREATE INDEX IF NOT EXISTS idx_pf_slug ON product_features(slug);

-- Seed common ELV feature tags
INSERT INTO product_features (name, slug, group_name, sort_order) VALUES
  ('PoE', 'poe', 'Kết nối', 1),
  ('PoE+', 'poe-plus', 'Kết nối', 2),
  ('WiFi', 'wifi', 'Kết nối', 3),
  ('TCP/IP', 'tcp-ip', 'Kết nối', 4),
  ('Wiegand', 'wiegand', 'Kết nối', 5),
  ('4K Ultra HD', '4k-ultra-hd', 'Hình ảnh', 10),
  ('AcuSense AI', 'acusense-ai', 'Hình ảnh', 11),
  ('DarkFighter', 'darkfighter', 'Hình ảnh', 12),
  ('H.265+', 'h265-plus', 'Hình ảnh', 13),
  ('120dB WDR', '120db-wdr', 'Hình ảnh', 14),
  ('Smart Tracking', 'smart-tracking', 'Hình ảnh', 15),
  ('IP67', 'ip67', 'Chống nước/bụi', 20),
  ('IP66', 'ip66', 'Chống nước/bụi', 21),
  ('Addressable', 'addressable', 'PCCC', 30),
  ('UL Listed', 'ul-listed', 'PCCC', 31),
  ('FM Approved', 'fm-approved', 'PCCC', 32),
  ('EN 54-7', 'en-54-7', 'PCCC', 33),
  ('Anti-Passback', 'anti-passback', 'Access Control', 40),
  ('Face Recognition', 'face-recognition', 'Access Control', 41),
  ('Vân tay + Thẻ', 'van-tay-the', 'Access Control', 42),
  ('Mask Detection', 'mask-detection', 'Access Control', 43),
  ('Chống cháy', 'chong-chay', 'An toàn', 50),
  ('VDE Certified', 'vde-certified', 'An toàn', 51),
  ('SD-WAN', 'sd-wan', 'Mạng', 60),
  ('Managed L3', 'managed-l3', 'Mạng', 61),
  ('StackWise', 'stackwise', 'Mạng', 62),
  ('SD-Access', 'sd-access', 'Mạng', 63);
