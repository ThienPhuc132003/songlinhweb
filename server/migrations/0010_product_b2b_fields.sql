-- ═══════════════════════════════════════════════
-- Migration 0010: Product B2B Fields
-- Adds: gallery_urls, inventory_status, warranty
-- ═══════════════════════════════════════════════

-- Gallery images (JSON array of URLs for multi-image display)
ALTER TABLE products ADD COLUMN gallery_urls TEXT DEFAULT '[]';

-- Inventory status: 'in-stock', 'pre-order', 'contact'
ALTER TABLE products ADD COLUMN inventory_status TEXT DEFAULT 'in-stock';

-- Warranty duration free text (e.g., '24 Months', '36 Tháng')
ALTER TABLE products ADD COLUMN warranty TEXT DEFAULT '';
