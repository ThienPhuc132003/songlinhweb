-- Migration: Add soft delete + project_products junction table

-- Add deleted_at for soft delete (consistent with products)
ALTER TABLE projects ADD COLUMN deleted_at TEXT;

-- Junction table: link products to projects (social proof)
CREATE TABLE IF NOT EXISTS project_products (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, product_id)
);
