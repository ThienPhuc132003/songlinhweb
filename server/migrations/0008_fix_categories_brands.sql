-- Migration: 0008 — Fix categories & brand_id linkage
-- Problem: 0006 products reference category slugs (camera-giam-sat, bao-chay, etc.)
--          but 0002_seed_data only created brand-specific categories (Camera Axis, etc.)
-- Fix: Add generic ELV categories + update brand_id on seeded products

-- ═══════════════════════════════════════════════
-- GENERIC ELV CATEGORIES (used by 0006 products)
-- ═══════════════════════════════════════════════
INSERT OR IGNORE INTO product_categories (slug, name, description, sort_order, is_active, parent_id) VALUES
  ('camera-giam-sat',    'Camera giám sát',       'Camera IP, Analog, PTZ, NVR/DVR cho hệ thống an ninh', 1, 1, NULL),
  ('bao-chay',           'PCCC & Báo cháy',       'Đầu báo khói, trung tâm báo cháy, hệ thống chữa cháy', 2, 1, NULL),
  ('kiem-soat-ra-vao',   'Kiểm soát ra vào',      'Access Control, máy chấm công, đầu đọc thẻ, barrier', 3, 1, NULL),
  ('ha-tang-mang',       'Hạ tầng mạng',          'Switch, Router, Access Point, cáp mạng, tủ rack', 4, 1, NULL),
  ('am-thanh-thong-bao', 'Âm thanh thông báo',    'Hệ thống PA, mixer amplifier, loa trần, loa nén', 5, 1, NULL),
  ('tong-dai',           'Tổng đài điện thoại',   'Tổng đài IP PBX, điện thoại IP, gateway VoIP', 6, 1, NULL),
  ('thiet-bi-dien-nhe',  'Thiết bị điện nhẹ',     'Ổ cắm, công tắc, mặt nạ, hệ thống chiếu sáng', 7, 1, NULL);

-- Sub-categories (for camera hierarchy)
INSERT OR IGNORE INTO product_categories (slug, name, description, sort_order, is_active, parent_id) VALUES
  ('camera-ip',    'Camera IP',         'Camera mạng (Network Camera) độ phân giải cao', 1, 1,
    (SELECT id FROM product_categories WHERE slug = 'camera-giam-sat' LIMIT 1)),
  ('camera-ptz',   'Camera PTZ',        'Camera Speed Dome quay quét, zoom quang', 2, 1,
    (SELECT id FROM product_categories WHERE slug = 'camera-giam-sat' LIMIT 1)),
  ('dau-ghi-hinh', 'Đầu ghi hình NVR/DVR', 'Đầu ghi hình mạng NVR và đầu ghi analog DVR', 3, 1,
    (SELECT id FROM product_categories WHERE slug = 'camera-giam-sat' LIMIT 1));

-- ═══════════════════════════════════════════════
-- ADD MISSING BRANDS (Grandstream, Legrand)
-- ═══════════════════════════════════════════════
INSERT OR IGNORE INTO brands (slug, name, description, sort_order) VALUES
  ('grandstream', 'Grandstream', 'Tổng đài IP và thiết bị VoIP doanh nghiệp', 11),
  ('legrand', 'Legrand', 'Thiết bị điện nhẹ và hạ tầng cáp chuẩn Pháp', 12);

-- ═══════════════════════════════════════════════
-- LINK brand_id to seeded products
-- ═══════════════════════════════════════════════
UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'hikvision' LIMIT 1)
  WHERE brand = 'Hikvision' AND brand_id IS NULL;

UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'honeywell' LIMIT 1)
  WHERE brand = 'Honeywell' AND brand_id IS NULL;

UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'zkteco' LIMIT 1)
  WHERE brand = 'ZKTeco' AND brand_id IS NULL;

UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'cisco' LIMIT 1)
  WHERE brand = 'Cisco' AND brand_id IS NULL;

UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'toa' LIMIT 1)
  WHERE brand = 'TOA' AND brand_id IS NULL;

UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'grandstream' LIMIT 1)
  WHERE brand = 'Grandstream' AND brand_id IS NULL;

UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'legrand' LIMIT 1)
  WHERE brand = 'Legrand' AND brand_id IS NULL;
