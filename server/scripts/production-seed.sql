-- ==========================================================
-- SLTECH: Production Seed and Cleanup Script
-- Run this securely via: npx wrangler d1 execute songlinh-db --remote --file=./scripts/production-seed.sql
-- ==========================================================

-- 1. HARD WIPE OF DUMMY/TESTING DATA
-- Ensure database is pristine before production launch

-- Delete dummy products
DELETE FROM products WHERE name LIKE '%Test%' OR name LIKE '%TestSp%' OR slug LIKE '%test%';

-- Delete dummy projects ('hdbank test')
DELETE FROM projects WHERE title LIKE '%test%' OR title LIKE '%hdbank%' OR client_name LIKE '%hdbank%';

-- Delete dummy contacts (Tester 'Ng')
DELETE FROM contacts WHERE name = 'Ng' OR name LIKE '%test%' OR email LIKE '%test@%';

-- Delete dummy quotations
DELETE FROM quotations WHERE customer_name LIKE '%test%' OR customer_name = 'Ng';

-- Delete dummy blog posts
DELETE FROM posts WHERE title LIKE '%test%';


-- 2. FOUNDATIONAL MASTER DATA: CATEGORIES
-- Uses INSERT OR IGNORE to safely seed without duplicating existing data
INSERT OR IGNORE INTO product_categories (id, slug, name, description, is_active) VALUES 
(1, 'camera-giam-sat', 'Camera giám sát', 'Giải pháp an ninh camera IP, Analog chuyên dụng', 1),
(2, 'thiet-bi-mang', 'Thiết bị mạng (IT)', 'Hạ tầng switch, router, wifi công nghiệp', 1),
(3, 'am-thanh-thong-bao', 'Âm thanh thông báo (PA)', 'Hệ thống âm thanh công cộng, hội thảo, thông báo', 1),
(4, 'kiem-soat-ra-vao', 'Kiểm soát ra vào', 'Hệ thống chấm công, barrier, máy giữ xe, khóa cửa từ', 1),
(5, 'tong-dai-noi-bo', 'Tổng đài nội bộ (PBX)', 'Hệ thống tổng đài IP và Analog', 1);


-- 3. FOUNDATIONAL MASTER DATA: BRANDS
-- Uses INSERT OR IGNORE to safely seed standard B2B brands
INSERT OR IGNORE INTO brands (id, slug, name, description, is_active) VALUES
(1, 'hikvision', 'Hikvision', 'Thương hiệu camera và an ninh hàng đầu thế giới', 1),
(2, 'dahua', 'Dahua', 'Giải pháp an ninh và giám sát thông minh AI', 1),
(3, 'cisco', 'Cisco', 'Giải pháp hạ tầng mạng cho doanh nghiệp', 1),
(4, 'bosch', 'Bosch', 'Hệ thống âm thanh PA và an ninh chuyên nghiệp', 1),
(5, 'toa', 'TOA', 'Thương hiệu âm thanh thông báo công cộng Nhật Bản', 1),
(6, 'zkteco', 'ZKTeco', 'Sản phẩm kiểm soát an ninh sinh trắc học thông minh', 1),
(7, 'apc', 'APC by Schneider', 'Hệ thống lưu điện UPS cấp doanh nghiệp', 1);
