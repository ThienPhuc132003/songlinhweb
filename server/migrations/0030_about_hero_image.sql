-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 0030: About page hero image (admin-swappable)
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('about_hero_image', '', 'About page: full-width immersive hero image URL. Upload via R2. Leave empty for default asset.');
