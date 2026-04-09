-- Migration: 0025 — Standardize site_config keys
-- Purpose: Rename old keys to consistent naming and add missing config entries
-- This migration ensures AdminSettings form keys match DB keys exactly

-- ═══════════════════════════════════════════════
-- Phase 1: Rename old keys → new standard keys
-- ═══════════════════════════════════════════════

-- phone → company_phone
INSERT OR REPLACE INTO site_config (key, value, description)
  SELECT 'company_phone', value, 'Số điện thoại chính'
  FROM site_config WHERE key = 'phone';
DELETE FROM site_config WHERE key = 'phone';

-- email → company_email
INSERT OR REPLACE INTO site_config (key, value, description)
  SELECT 'company_email', value, 'Email liên hệ'
  FROM site_config WHERE key = 'email';
DELETE FROM site_config WHERE key = 'email';

-- address → company_address
INSERT OR REPLACE INTO site_config (key, value, description)
  SELECT 'company_address', value, 'Địa chỉ văn phòng'
  FROM site_config WHERE key = 'address';
DELETE FROM site_config WHERE key = 'address';

-- facebook_url → social_facebook
INSERT OR REPLACE INTO site_config (key, value, description)
  SELECT 'social_facebook', value, 'Facebook URL'
  FROM site_config WHERE key = 'facebook_url';
DELETE FROM site_config WHERE key = 'facebook_url';

-- zalo_id → social_zalo
INSERT OR REPLACE INTO site_config (key, value, description)
  SELECT 'social_zalo', value, 'Zalo URL'
  FROM site_config WHERE key = 'zalo_id';
DELETE FROM site_config WHERE key = 'zalo_id';

-- about_short → company_slogan (repurpose as slogan)
INSERT OR REPLACE INTO site_config (key, value, description)
  SELECT 'company_slogan', 'Giải pháp tối ưu – Chất lượng vượt trội', 'Slogan công ty'
  FROM site_config WHERE key = 'about_short';
DELETE FROM site_config WHERE key = 'about_short';

-- company_name_en → remove (not used in new form)
DELETE FROM site_config WHERE key = 'company_name_en';

-- ═══════════════════════════════════════════════
-- Phase 2: Insert missing keys with defaults
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('company_hotline', '0968.811.911', 'Hotline'),
  ('company_hours', '08:00 - 17:00', 'Giờ làm việc'),
  ('company_tax_id', '0313573739', 'Mã số thuế'),
  ('social_linkedin', '', 'LinkedIn URL'),
  ('social_youtube', '', 'YouTube URL'),
  ('site_title', 'Song Linh Technologies — Giải pháp ELV & ICT', 'Tiêu đề website'),
  ('site_description', 'SLTECH chuyên tư vấn, thiết kế và thi công hệ thống camera, PCCC, mạng, điện nhẹ cho doanh nghiệp.', 'Mô tả website'),
  ('meta_keywords', 'camera, PCCC, điện nhẹ, ELV, Song Linh, SLTECH', 'Từ khóa SEO'),
  ('ga4_id', '', 'Google Analytics GA4 ID'),
  ('gsc_verification', '', 'Google Search Console verification'),
  ('fb_pixel_id', '', 'Facebook Pixel ID'),
  ('favicon_url', '', 'Favicon URL'),
  ('logo_light_url', '', 'Logo chế độ sáng'),
  ('logo_dark_url', '', 'Logo chế độ tối'),
  ('portfolio_pdf_url', '', 'Hồ sơ năng lực PDF'),
  ('footer_copyright', '© 2026 Song Linh Technologies. Bản quyền thuộc CÔNG TY TNHH TM CÔNG NGHỆ SONG LINH.', 'Footer copyright'),
  ('privacy_policy_url', '', 'Chính sách bảo mật URL'),
  ('warranty_policy_url', '', 'Chính sách bảo hành URL'),
  ('maintenance_mode', 'false', 'Chế độ bảo trì'),
  ('map_embed_url', '', 'Google Maps embed URL');
