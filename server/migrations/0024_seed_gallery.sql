-- Migration: 0024 — Seed gallery with 3 dummy albums
-- Albums represent different categories for the Gallery showcase

-- Album 1: Kỹ thuật
INSERT INTO gallery_albums (slug, title, cover_url, description, category, sort_order, is_active)
VALUES (
  'thi-cong-data-center-hdbank',
  'Thi công Data Center HDBank',
  NULL,
  'Hệ thống hạ tầng Data Center cho ngân hàng HDBank — bao gồm tủ rack, hệ thống cáp quang, cooling system và UPS.',
  'ky-thuat',
  1,
  1
);

-- Album 2: Dự án
INSERT INTO gallery_albums (slug, title, cover_url, description, category, sort_order, is_active)
VALUES (
  'he-thong-an-ninh-landmark-81',
  'Hệ thống an ninh Landmark 81',
  NULL,
  'Triển khai hệ thống camera giám sát, kiểm soát ra vào và báo động cho tòa nhà Landmark 81 — Vinhomes Central Park.',
  'du-an',
  2,
  1
);

-- Album 3: Hoạt động
INSERT INTO gallery_albums (slug, title, cover_url, description, category, sort_order, is_active)
VALUES (
  'doi-ngu-sltech-dao-tao-bosch',
  'Đội ngũ SLTECH đào tạo chứng chỉ Bosch',
  NULL,
  'Đội ngũ kỹ sư Song Linh Technologies tham gia chương trình đào tạo và cấp chứng chỉ chuyên môn từ Bosch Security Systems.',
  'hoat-dong',
  3,
  1
);
