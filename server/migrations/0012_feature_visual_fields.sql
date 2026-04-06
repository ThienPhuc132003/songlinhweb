-- ============================================================
-- Migration 0012: Feature Visual Fields
-- Adds color, icon, and is_priority to product_features
-- ============================================================

-- Badge color (hex format e.g. '#3B82F6')
ALTER TABLE product_features ADD COLUMN color TEXT DEFAULT NULL;

-- Lucide icon name (e.g. 'wifi', 'shield', 'camera')
ALTER TABLE product_features ADD COLUMN icon TEXT DEFAULT NULL;

-- Priority flag: 1 = show first on product cards
ALTER TABLE product_features ADD COLUMN is_priority INTEGER DEFAULT 0;
