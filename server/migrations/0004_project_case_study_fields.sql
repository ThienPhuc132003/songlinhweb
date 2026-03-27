-- Migration: Add case study metadata fields to projects table
-- These fields enable structured project case studies for B2B ELV industry

ALTER TABLE projects ADD COLUMN system_types TEXT DEFAULT '[]';
-- JSON array: ["CCTV", "Access Control", "PA", "BMS"]

ALTER TABLE projects ADD COLUMN brands_used TEXT DEFAULT '[]';
-- JSON array: ["Hikvision", "ZKTeco", "TOA"]

ALTER TABLE projects ADD COLUMN area_sqm INTEGER;

ALTER TABLE projects ADD COLUMN duration_months INTEGER;

ALTER TABLE projects ADD COLUMN key_metrics TEXT DEFAULT '{}';
-- JSON: {"cameras": 120, "access_points": 50, "floors": 12}

ALTER TABLE projects ADD COLUMN compliance_standards TEXT DEFAULT '[]';
-- JSON array: ["TCVN 7336:2003", "ONVIF Profile S"]

ALTER TABLE projects ADD COLUMN client_industry TEXT;
-- "banking", "hospitality", "government", "industrial", "education"

ALTER TABLE projects ADD COLUMN project_scale TEXT;
-- "small" (<500m²), "medium" (500-5000m²), "large" (>5000m²)
