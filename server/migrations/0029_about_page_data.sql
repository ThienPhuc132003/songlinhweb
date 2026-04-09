-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 0029: About Page Dynamic Data
-- Centralizes company stats, core values, vision/mission in site_config
-- ═══════════════════════════════════════════════════════════════════════════════

-- Company description (Markdown)
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('about_description', '**SLTECH** (Song Linh Technologies) là công ty chuyên về tư vấn, thiết kế và thi công lắp đặt các hệ thống công nghệ thông tin và hạ tầng kỹ thuật.

Với hơn **10 năm kinh nghiệm**, chúng tôi đã hoàn thành hơn **500 dự án** trên khắp cả nước, từ các tòa nhà thương mại, khu công nghiệp đến bệnh viện và trường học.

Chúng tôi cam kết mang đến giải pháp tối ưu nhất cho mỗi dự án — từ khâu tư vấn ban đầu, thiết kế chi tiết, thi công chuyên nghiệp đến bảo trì dài hạn sau bàn giao.', 'About page: company description (Markdown supported)');

-- Vision & Mission
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('about_vision', 'Trở thành đối tác công nghệ hàng đầu trong lĩnh vực hệ thống kỹ thuật & IT cho doanh nghiệp tại Việt Nam, mang đến giải pháp toàn diện từ tư vấn đến vận hành.', 'About page: vision statement');

INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('about_mission', 'Cung cấp giải pháp công nghệ tối ưu, chất lượng vượt trội với chi phí hợp lý, giúp doanh nghiệp vận hành hiệu quả hơn thông qua công nghệ hiện đại.', 'About page: mission statement');

-- Company stats (JSON array)
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('company_stats', '[
    {"value": 10, "suffix": "+", "label": "Năm kinh nghiệm", "icon": "Calendar"},
    {"value": 500, "suffix": "+", "label": "Dự án hoàn thành", "icon": "FolderCheck"},
    {"value": 50, "suffix": "+", "label": "Đối tác tin cậy", "icon": "Handshake"},
    {"value": 100, "suffix": "%", "label": "Khách hàng hài lòng", "icon": "Heart"}
  ]', 'Company achievement stats (JSON). Used on Home + About pages.');

-- Core values (JSON array)
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('core_values', '[
    {"title": "Chất lượng", "description": "Cam kết sử dụng thiết bị chính hãng, thi công đạt chuẩn quốc tế", "icon": "Shield"},
    {"title": "Khách hàng", "description": "Đặt nhu cầu khách hàng làm trung tâm, tư vấn giải pháp phù hợp nhất", "icon": "Users"},
    {"title": "Uy tín", "description": "Hơn 10 năm xây dựng uy tín với 500+ dự án và 50+ đối tác chiến lược", "icon": "Award"}
  ]', 'Core values (JSON). Used on About page.');

-- Why Choose Us (JSON array — 4 B2B trust pillars)
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('why_choose_us', '[
    {"title": "Đội ngũ kỹ sư chứng chỉ", "description": "Kỹ sư được đào tạo và cấp chứng chỉ từ Axis, Hikvision, Honeywell, Legrand", "icon": "GraduationCap"},
    {"title": "Hỗ trợ kỹ thuật 24/7", "description": "Đội ngũ kỹ thuật túc trực xử lý sự cố nhanh chóng, đảm bảo hệ thống vận hành liên tục", "icon": "HeadsetIcon"},
    {"title": "Giải pháp tích hợp", "description": "Tư vấn và triển khai giải pháp end-to-end: từ thiết kế, thi công đến bảo trì dài hạn", "icon": "Layers"},
    {"title": "Bảo hành chính hãng", "description": "Tất cả thiết bị được bảo hành chính hãng, cam kết thay thế 1-đổi-1 trong thời gian bảo hành", "icon": "ShieldCheck"}
  ]', 'Why Choose Us section (JSON). B2B trust pillars on About page.');
