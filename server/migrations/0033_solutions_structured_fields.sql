-- Migration: 0033 — Solutions structured fields for Dynamic CMS
-- Adds excerpt, features (JSON), applications (JSON) columns
-- hero_image_url (already exists from prior usage) serves as cover_url

ALTER TABLE solutions ADD COLUMN excerpt TEXT NOT NULL DEFAULT '';

-- JSON array: [{"icon":"Brain","title":"AcuSense AI","description":"..."}]
ALTER TABLE solutions ADD COLUMN features TEXT NOT NULL DEFAULT '[]';

-- JSON array: ["Tòa nhà văn phòng", "Khu công nghiệp", ...]
ALTER TABLE solutions ADD COLUMN applications TEXT NOT NULL DEFAULT '[]';
