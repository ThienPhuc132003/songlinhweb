-- Migration: 0020 — Project Schema Sync (catchup)
-- Ensures ALL project columns exist, safe to re-run with IF NOT EXISTS pattern.
-- D1 SQLite doesn't have IF NOT EXISTS for ALTER TABLE, so we use a workaround:
-- Each ALTER TABLE will fail silently if column exists. Run each one individually.

-- From 0004_project_case_study_fields.sql
ALTER TABLE projects ADD COLUMN system_types TEXT DEFAULT '[]';
ALTER TABLE projects ADD COLUMN brands_used TEXT DEFAULT '[]';
ALTER TABLE projects ADD COLUMN area_sqm INTEGER;
ALTER TABLE projects ADD COLUMN duration_months INTEGER;
ALTER TABLE projects ADD COLUMN key_metrics TEXT DEFAULT '{}';
ALTER TABLE projects ADD COLUMN compliance_standards TEXT DEFAULT '[]';
ALTER TABLE projects ADD COLUMN client_industry TEXT;
ALTER TABLE projects ADD COLUMN project_scale TEXT;

-- From 0005: meta fields (may already exist from initial schema overwrite)
ALTER TABLE projects ADD COLUMN meta_title TEXT;
ALTER TABLE projects ADD COLUMN meta_description TEXT;

-- From 0015_project_soft_delete.sql
ALTER TABLE projects ADD COLUMN deleted_at TEXT;

-- From 0016_b2b_portfolio.sql
ALTER TABLE projects ADD COLUMN completion_year TEXT;
ALTER TABLE projects ADD COLUMN related_solutions TEXT DEFAULT '[]';
ALTER TABLE projects ADD COLUMN related_products TEXT DEFAULT '[]';

-- From 0017_case_study_fields.sql
ALTER TABLE projects ADD COLUMN challenges TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN outcomes TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN testimonial_name TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN testimonial_content TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN video_url TEXT DEFAULT NULL;

-- Junction table
CREATE TABLE IF NOT EXISTS project_products (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, product_id)
);
