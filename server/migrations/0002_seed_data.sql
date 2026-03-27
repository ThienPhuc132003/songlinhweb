-- Migration: 0002 — Seed data for SLTECH
-- Reference: sltech.vn (WordPress) — Nội dung chức năng hiện hành
-- Lưu ý: Data mẫu đại diện, sẽ được cập nhật qua Admin panel sau

-- ═══════════════════════════════════════════════
-- GIẢI PHÁP (Solutions) — 11 giải pháp từ sltech.vn
-- ═══════════════════════════════════════════════
INSERT INTO solutions (slug, title, description, icon, sort_order, is_active) VALUES
  ('he-thong-giam-sat-an-ninh-ai',
   'Hệ thống giám sát an ninh AI',
   'Giải pháp camera giám sát tích hợp trí tuệ nhân tạo, nhận diện đối tượng, cảnh báo xâm nhập tự động, phân tích hành vi thời gian thực.',
   'Camera', 1, 1),

  ('he-thong-kiem-soat-ra-vao',
   'Hệ thống kiểm soát ra vào',
   'Access Control — Kiểm soát cửa ra vào bằng thẻ từ, vân tay, khuôn mặt. Quản lý chấm công, phân quyền vùng truy cập cho doanh nghiệp.',
   'DoorOpen', 2, 1),

  ('he-thong-nhan-dien-khuon-mat',
   'Hệ thống nhận diện khuôn mặt',
   'Face Recognition — Nhận diện khuôn mặt chính xác cao, ứng dụng trong kiểm soát an ninh, chấm công, xác thực danh tính.',
   'ScanFace', 3, 1),

  ('he-thong-bai-xe-thong-minh',
   'Hệ thống bãi xe thông minh',
   'Smart Parking — Quản lý bãi xe tự động nhận diện biển số, tính phí, hiển thị chỗ trống, barrier tự động.',
   'ParkingCircle', 4, 1),

  ('he-thong-phan-mem-quan-ly-trung-tam',
   'Hệ thống phần mềm quản lý trung tâm',
   'VMS/CMS — Phần mềm quản lý tập trung toàn bộ hệ thống camera, kiểm soát ra vào, bãi xe trên một giao diện duy nhất.',
   'LayoutDashboard', 5, 1),

  ('he-thong-chi-dan-bai-dau-xe',
   'Hệ thống chỉ dẫn bãi đậu xe',
   'Parking Guidance — Hệ thống đèn LED và cảm biến chỉ dẫn vị trí đỗ xe trống, tối ưu lưu thông trong bãi xe.',
   'Navigation', 6, 1),

  ('he-thong-phan-lan-tu-dong',
   'Hệ thống phân làn tự động',
   'Automatic Lane Control — Phân làn xe tự động tại trạm thu phí, bãi xe, khu công nghiệp bằng barrier và cảm biến.',
   'ArrowLeftRight', 7, 1),

  ('he-thong-man-hinh-ghep',
   'Hệ thống màn hình ghép',
   'Video Wall — Màn hình ghép LCD/LED cho trung tâm điều hành, phòng họp, showroom với độ phân giải cao.',
   'Monitor', 8, 1),

  ('he-thong-video-intercom',
   'Hệ thống Video Intercom',
   'Hệ thống liên lạc nội bộ có hình ảnh cho tòa nhà, căn hộ, văn phòng. Tích hợp mở cửa từ xa.',
   'Video', 9, 1),

  ('he-thong-luu-dien',
   'Hệ thống lưu điện',
   'UPS — Bộ lưu điện không gián đoạn bảo vệ thiết bị IT, server, hệ thống camera khỏi mất điện đột ngột.',
   'BatteryCharging', 10, 1),

  ('giai-phap-ha-tang-mang-data-center',
   'Giải pháp hạ tầng mạng Data Center',
   'Thiết kế và thi công hạ tầng mạng, hệ thống cáp, tủ rack, cooling cho Data Center doanh nghiệp.',
   'Server', 11, 1);


-- ═══════════════════════════════════════════════
-- DANH MỤC SẢN PHẨM (Product Categories)
-- ═══════════════════════════════════════════════
INSERT INTO product_categories (slug, name, description, sort_order, is_active) VALUES
  ('cap-legrand-va-phu-kien',      'Cáp Legrand và phụ kiện',         'Cáp mạng, cáp quang Legrand và phụ kiện đi kèm',     1, 1),
  ('tu-rack-sj-va-phu-kien',       'Tủ rack SJ và phụ kiện',          'Tủ rack, tủ mạng SJ chất lượng cao cho server room',  2, 1),
  ('ups-legrand-va-phu-kien',      'UPS Legrand và phụ kiện',         'Bộ lưu điện UPS Legrand bảo vệ thiết bị IT',          3, 1),
  ('camera-axis-va-phu-kien',      'Camera Axis và phụ kiện',         'Camera giám sát Axis (Thụy Điển) — hàng đầu thế giới', 4, 1),
  ('camera-hanwha-techwin',        'Camera Hanwha Techwin và phụ kiện','Camera an ninh Hanwha (Hàn Quốc) — công nghệ AI',     5, 1),
  ('barrier-cong-an-ninh',         'Barrier, cổng an ninh và phụ kiện','Barrier tự động, cổng an ninh, flap barrier',          6, 1),
  ('dau-doc-the-va-phu-kien',      'Đầu đọc thẻ và phụ kiện',        'Đầu đọc thẻ RFID, thẻ từ cho hệ thống kiểm soát',    7, 1);


-- ═══════════════════════════════════════════════
-- SẢN PHẨM (Products — KHÔNG GIÁ, B2B model)
-- ═══════════════════════════════════════════════

-- Camera Axis
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (4, 'axis-p3245-v', 'AXIS P3245-V Network Camera',
   'Camera dome cố định, 2MP, hồng ngoại, WDR, Zipstream, phù hợp giám sát trong nhà.', 1, 1),
  (4, 'axis-p3267-lv', 'AXIS P3267-LV Dome Camera',
   'Camera dome 5MP, IR 30m, Deep Learning, phân tích thông minh, chống va đập IK10.', 2, 1),
  (4, 'axis-m3116-lve', 'AXIS M3116-LVE Mini Dome',
   'Camera mini dome 4MP, ngoài trời IP66, hồng ngoại 20m, giá thành tối ưu.', 3, 1),
  (4, 'axis-q6135-le', 'AXIS Q6135-LE PTZ Camera',
   'Camera PTZ 2MP, zoom quang 32x, IR 200m, phù hợp giám sát khu vực rộng.', 4, 1);

-- Camera Hanwha
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (5, 'hanwha-xnv-8080r', 'Hanwha XNV-8080R Dome Camera',
   'Camera dome 5MP, IR 30m, WDR 120dB, IP67/IK10, hỗ trợ AI analytics.', 1, 1),
  (5, 'hanwha-xno-6080r', 'Hanwha XNO-6080R Bullet Camera',
   'Camera bullet 2MP, IR 50m, chống nước IP66, phù hợp ngoài trời.', 2, 1);

-- Cáp Legrand
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (1, 'legrand-cat6-utp', 'Cáp mạng Legrand Cat6 UTP',
   'Cáp mạng Cat6 UTP 4 đôi, 305m/cuộn, đạt chuẩn TIA/EIA-568-C.2, bọc PVC.', 1, 1),
  (1, 'legrand-cat6a-ftp', 'Cáp mạng Legrand Cat6A FTP',
   'Cáp mạng Cat6A FTP chống nhiễu, 500MHz, hỗ trợ 10Gbps, phù hợp Data Center.', 2, 1);

-- Tủ rack SJ
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (2, 'tu-rack-sj-19u-600x800', 'Tủ rack SJ 19U 600x800',
   'Tủ rack đứng 19 inch, 19U, kích thước 600x800mm, thép 1.2mm, quạt giải nhiệt.', 1, 1),
  (2, 'tu-rack-sj-42u-800x1000', 'Tủ rack SJ 42U 800x1000',
   'Tủ rack server 42U, 800x1000mm, tải trọng 800kg, phù hợp Data Center.', 2, 1);

-- UPS Legrand
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (3, 'legrand-keor-sp-1000va', 'UPS Legrand KEOR SP 1000VA',
   'Bộ lưu điện line-interactive 1000VA/600W, ổ cắm đa năng, AVR, thời gian lưu điện 10 phút.', 1, 1),
  (3, 'legrand-keor-hp-3kva', 'UPS Legrand KEOR HP 3KVA',
   'UPS online double-conversion 3KVA, hiệu suất 95%, rack/tower, pin ngoài mở rộng.', 2, 1);

-- Barrier & cổng an ninh
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (6, 'barrier-bisen-bs306', 'Barrier tự động Bisen BS-306',
   'Barrier cần gập, tốc độ 3s, chiều dài cần 3-6m, động cơ servo, chống kẹt.', 1, 1);

-- Đầu đọc thẻ
INSERT INTO products (category_id, slug, name, description, sort_order, is_active) VALUES
  (7, 'hid-iclass-se-r10', 'HID iCLASS SE R10 Reader',
   'Đầu đọc thẻ không tiếp xúc HID, hỗ trợ SEOS + iCLASS + Mifare, giao tiếp Wiegand.', 1, 1),
  (7, 'hid-signo-40k', 'HID Signo Reader 40K',
   'Đầu đọc thẻ thế hệ mới HID Signo, hỗ trợ Bluetooth (mobile access), IP65.', 2, 1);


-- ═══════════════════════════════════════════════
-- DỰ ÁN (Projects) — Mẫu tham khảo
-- ═══════════════════════════════════════════════
INSERT INTO projects (slug, title, description, location, client_name, category, year, is_featured, sort_order, is_active) VALUES
  ('nha-may-long-hau',
   'Nhà máy Long Hậu Industrial Park',
   'Triển khai hệ thống giám sát an ninh AI và kiểm soát ra vào cho khu công nghiệp Long Hậu, bao gồm 120+ camera Axis, hệ thống access control 50 cửa.',
   'Long An', 'KCN Long Hậu', 'he-thong-giam-sat-an-ninh-ai', 2024, 1, 1, 1),

  ('toa-nha-van-phong-quan-7',
   'Tòa nhà văn phòng Quận 7',
   'Lắp đặt hệ thống bãi xe thông minh nhận diện biển số, barrier tự động và phần mềm quản lý cho tòa nhà 15 tầng.',
   'TP. Hồ Chí Minh', NULL, 'he-thong-bai-xe-thong-minh', 2024, 1, 2, 1),

  ('trung-tam-thuong-mai-binh-duong',
   'Trung tâm thương mại Bình Dương',
   'Thiết kế và thi công hệ thống CCTV 200+ camera, Video Wall trung tâm điều hành, hệ thống PA và chỉ dẫn bãi xe.',
   'Bình Dương', NULL, 'he-thong-man-hinh-ghep', 2023, 1, 3, 1),

  ('du-an-data-center-fpt',
   'Data Center FPT Telecom',
   'Hạ tầng mạng Data Center: hệ thống cáp quang Legrand, tủ rack 42U, UPS 100KVA, hệ thống cooling.',
   'TP. Hồ Chí Minh', 'FPT Telecom', 'giai-phap-ha-tang-mang-data-center', 2023, 0, 4, 1);


-- ═══════════════════════════════════════════════
-- ĐỐI TÁC (Partners) — từ sltech.vn
-- ═══════════════════════════════════════════════
INSERT INTO partners (name, website_url, sort_order, is_active) VALUES
  ('CommScope',       'https://www.commscope.com',        1, 1),
  ('HID Global',      'https://www.hidglobal.com',        2, 1),
  ('Avigilon',        'https://www.avigilon.com',         3, 1),
  ('Legrand',         'https://www.legrand.com',          4, 1),
  ('Axis Communications', 'https://www.axis.com',         5, 1),
  ('Hanwha Techwin',  'https://www.hanwha-security.com',  6, 1);


-- ═══════════════════════════════════════════════
-- TIN TỨC (Posts) — Bài viết mẫu
-- ═══════════════════════════════════════════════
INSERT INTO posts (slug, title, excerpt, author, tags, is_published, published_at) VALUES
  ('xu-huong-camera-ai-2025',
   'Xu hướng Camera AI năm 2025 — Những điểm nổi bật',
   'Công nghệ AI đang thay đổi ngành giám sát an ninh. Cùng SLTECH điểm qua những xu hướng camera AI đáng chú ý nhất năm 2025.',
   'SLTECH', '["camera","AI","xu hướng"]', 1, datetime('now', '-7 days')),

  ('huong-dan-chon-ups-cho-doanh-nghiep',
   'Hướng dẫn chọn UPS phù hợp cho doanh nghiệp',
   'UPS (Uninterruptible Power Supply) là thiết bị không thể thiếu cho hệ thống IT. Bài viết hướng dẫn cách chọn công suất, loại UPS phù hợp.',
   'SLTECH', '["UPS","hạ tầng","hướng dẫn"]', 1, datetime('now', '-14 days'));


-- ═══════════════════════════════════════════════
-- SITE CONFIG — Thông tin website
-- ═══════════════════════════════════════════════
INSERT INTO site_config (key, value, description) VALUES
  ('company_name',    'Công ty TNHH Công Nghệ Song Linh',    'Tên công ty đầy đủ'),
  ('company_name_en', 'Song Linh Technology Co., Ltd.',        'Tên tiếng Anh'),
  ('phone',           '028 3636 9979',                        'Số điện thoại chính'),
  ('email',           'songlinh@sltech.vn',                   'Email liên hệ'),
  ('address',         '123 Nguyễn Văn Trỗi, P.11, Q. Phú Nhuận, TP. HCM', 'Địa chỉ VP'),
  ('about_short',     'SLTECH là đơn vị chuyên tích hợp hệ thống an ninh, CNTT cho doanh nghiệp. Với hơn 10 năm kinh nghiệm, chúng tôi cung cấp giải pháp trọn gói từ tư vấn, thiết kế, thi công đến bảo trì.', 'Giới thiệu ngắn'),
  ('zalo_id',         '',                                      'Zalo OA ID'),
  ('facebook_url',    'https://facebook.com/sltech.vn',        'Facebook page');
