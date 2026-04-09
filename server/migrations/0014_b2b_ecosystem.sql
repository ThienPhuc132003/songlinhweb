-- ═══════════════════════════════════════════════
-- Migration 0013: B2B Ecosystem Finalize
-- Adds: soft delete, audit logs, project-product link
-- ═══════════════════════════════════════════════

-- 1) Soft delete for products
ALTER TABLE products ADD COLUMN deleted_at TEXT DEFAULT NULL;

-- 2) Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  changes TEXT DEFAULT '{}',
  performed_by TEXT DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_entity
  ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created
  ON audit_logs(created_at);

-- 3) Project-Product junction (social proof)
CREATE TABLE IF NOT EXISTS project_products (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, product_id)
);
