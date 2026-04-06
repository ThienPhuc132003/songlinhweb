-- Migration: 0016 — B2B Portfolio upgrade
-- Adds fields for professional portfolio presentation

-- Flexible completion year (supports "Q1 2024", "2023–2024", etc.)
ALTER TABLE projects ADD COLUMN completion_year TEXT;

-- Related solutions (JSON array of solution IDs: [1, 3, 5])
ALTER TABLE projects ADD COLUMN related_solutions TEXT DEFAULT '[]';

-- Related products (JSON array of product IDs: [12, 45, 67])
ALTER TABLE projects ADD COLUMN related_products TEXT DEFAULT '[]';
