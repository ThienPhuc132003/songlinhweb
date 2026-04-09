-- ═══════════════════════════════════════════════
-- Migration 0014: Professional B2B RFQ System
-- Creates: quotation_requests, quotation_items
-- Adds: deletion constraint triggers for categories/brands
-- ═══════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. QUOTATION REQUESTS (normalized)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Customer info
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  project_name TEXT,
  -- Status workflow: new → processing → sent → completed
  status TEXT NOT NULL DEFAULT 'new',
  -- Generated files
  excel_url TEXT,
  -- Metadata
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quotation_requests_status
  ON quotation_requests(status);
CREATE INDEX IF NOT EXISTS idx_quotation_requests_created
  ON quotation_requests(created_at DESC);

-- ─────────────────────────────────────────────
-- 2. QUOTATION ITEMS (normalized, FK to products)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER NOT NULL REFERENCES quotation_requests(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  category_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quote
  ON quotation_items(quote_id);

-- ─────────────────────────────────────────────
-- 3. DELETION CONSTRAINTS (Triggers)
-- Prevent deletion of categories/brands with linked products
-- ─────────────────────────────────────────────

-- Prevent deletion of categories that have active products
CREATE TRIGGER IF NOT EXISTS prevent_category_delete
  BEFORE DELETE ON product_categories
  FOR EACH ROW
  WHEN (SELECT COUNT(*) FROM products WHERE category_id = OLD.id AND deleted_at IS NULL) > 0
BEGIN
  SELECT RAISE(ABORT, 'Cannot delete category with active products');
END;

-- Prevent deletion of brands that have active products
CREATE TRIGGER IF NOT EXISTS prevent_brand_delete
  BEFORE DELETE ON brands
  FOR EACH ROW
  WHEN (SELECT COUNT(*) FROM products WHERE brand_id = OLD.id AND deleted_at IS NULL) > 0
BEGIN
  SELECT RAISE(ABORT, 'Cannot delete brand with active products');
END;
