-- ═══════════════════════════════════════════════════════════════════
-- SLTECH Portfolio: Full Data Sync
-- 1. Soft-delete test data
-- 2. Update existing projects with real data from Duan_text
-- 3. Insert missing projects
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. SOFT-DELETE TEST DATA ────────────────────────────────────
UPDATE projects SET deleted_at = datetime('now') WHERE id = 14;

-- ─── 2. UPDATE EXISTING PROJECTS ─────────────────────────────────

-- id=1: HDBank Data Center
UPDATE projects SET
  title = 'Tòa nhà Văn phòng – Trung tâm Dữ liệu HDBank',
  description = 'Hạ tầng công nghệ và cung cấp dịch vụ tài chính tại Khu Công Nghệ Cao, TP.Thủ Đức, Tp. Hồ Chí Minh.',
  client_name = 'NGÂN HÀNG HDBANK',
  location = 'TP. Hồ Chí Minh',
  category = 'Tòa nhà văn phòng',
  client_industry = 'banking',
  system_types = '["Rack Server","Rack Network","CCTV","Data Copper & Fiber"]',
  key_metrics = '{"Rack Server & Network":"25+","Node mạng thoại":"5.000+","CCTV":"Giám sát Datacenter"}',
  outcomes = '["Đạt chuẩn Tier 3 Data Center","Đảm bảo Uptime 99.982%","Hệ thống dự phòng N+1"]',
  project_scale = 'large'
WHERE id = 1;

-- id=2: ABBANK
UPDATE projects SET
  title = 'Ngân hàng An Bình (ABBANK)',
  description = 'Hệ thống giám sát an ninh tập trung cho mạng lưới 165 điểm giao dịch trên toàn quốc.',
  client_name = 'ABBANK',
  location = 'TP. Hồ Chí Minh',
  category = 'Tòa nhà văn phòng',
  client_industry = 'banking',
  system_types = '["CCTV Central"]',
  key_metrics = '{"Camera IP":"1.300+","VMS":"Central"}',
  outcomes = '["Hệ thống cảnh báo phá hoại ATM tức thời","Lưu trữ dữ liệu an toàn 24/7"]',
  project_scale = 'large'
WHERE id = 2;

-- id=3: Pearl 5 Tower
UPDATE projects SET
  title = 'Tòa nhà Pearl 5 Tower',
  description = 'Tòa nhà văn phòng hiện đại tại số 5 Lê Quý Đôn, Tp. Hồ Chí Minh.',
  client_name = 'NGỌC SƠN NAM',
  location = 'TP. Hồ Chí Minh',
  category = 'Tòa nhà văn phòng',
  client_industry = 'office',
  system_types = '["Tel Data","CCTV","Access Control","Car Parking"]',
  key_metrics = '{"Camera IP Axis":"100+","Kiểm soát vào ra":"Toàn bộ tòa nhà","Car Parking":"Thông minh"}',
  outcomes = '["Công nghệ thẻ từ HID bảo mật cao","Vận hành tự động hóa 24/24"]',
  project_scale = 'medium'
WHERE id = 3;

-- id=4: Viettel Complex
UPDATE projects SET
  title = 'Tòa nhà Viettel Complex',
  description = 'Trụ sở điều hành & trung tâm thương mại Viettel tại 285 CMT8, Tp. Hồ Chí Minh.',
  client_name = 'VIETTEL CORP',
  location = 'TP. Hồ Chí Minh',
  category = 'Tòa nhà văn phòng',
  client_industry = 'office',
  system_types = '["Tel Data","CCTV","VMS Central","Access Control"]',
  key_metrics = '{"Camera IP Axis":"300","VMS":"MileStone","Kiểm soát vào ra":"Tòa nhà"}',
  outcomes = '["Phần mềm quản lý VMS Milestone hàng đầu","Đường truyền quang tốc độ Gigabit"]',
  project_scale = 'large'
WHERE id = 4;

-- id=5: VP Trung Ương Đảng
UPDATE projects SET
  title = 'Văn phòng Trung Ương Đảng',
  description = 'Hệ thống giám sát an ninh toàn diện tại trụ sở Số 3 Phan Đình Phùng, Ba Đình, Hà Nội.',
  client_name = 'Văn Phòng Trung Ương Đảng',
  location = 'Hà Nội',
  category = 'Tòa nhà văn phòng',
  client_industry = 'government',
  system_types = '["CCTV","VMS Central"]',
  key_metrics = '{"Camera IP":"100+","VMS":"Axis Camera Station"}',
  outcomes = '["Bảo mật thông tin mức độ tối đa","Thiết bị hoạt động bền bỉ, chống xâm nhập"]',
  project_scale = 'medium'
WHERE id = 5;

-- id=6: Edison Ecopark
UPDATE projects SET
  title = 'Trường Quốc tế Edison Schools – Ecopark',
  description = 'Hệ thống trường liên cấp tại khu đô thị Ecopark, Hưng Yên.',
  client_name = 'EDISON SCHOOLS',
  location = 'Hưng Yên',
  category = 'Giáo dục',
  client_industry = 'education',
  system_types = '["Tel Data","CCTV","PA"]',
  key_metrics = '{"Camera IP":"200+","Node Data Tel":"1.000+","Fiber Optic":"2.000+","PA":"250+"}',
  outcomes = '["Đảm bảo an toàn cho học sinh","Hạ tầng mạng ổn định phục vụ giáo dục"]',
  project_scale = 'large'
WHERE id = 6;

-- id=7: Opal Tower
UPDATE projects SET
  title = 'Tòa nhà Opal Tower – Saigon Pearl',
  description = 'Tòa nhà cao 41 tầng bao gồm khu căn hộ cao cấp, khu văn phòng đẳng cấp và shophouse.',
  client_name = 'SSG GROUP & VIETNAM LAND',
  location = 'TP. Hồ Chí Minh',
  category = 'Chung cư cao cấp',
  client_industry = 'residential',
  system_types = '["CCTV"]',
  key_metrics = '{"Camera IP Axis":"250+","VMS":"Axis Camera Station"}',
  outcomes = '["Giám sát an ninh độ phân giải cao","Lưu trữ dữ liệu dự phòng an toàn"]',
  project_scale = 'large'
WHERE id = 7;

-- id=8: Marie Curie
UPDATE projects SET
  title = 'Khách sạn Marie Curie',
  description = 'Tổ hợp khách sạn cao cấp tại 157 Nam Kỳ Khởi Nghĩa, Tp. Hồ Chí Minh.',
  client_name = 'ARECO',
  location = 'TP. Hồ Chí Minh',
  category = 'Khách sạn',
  client_industry = 'hospitality',
  system_types = '["Tel Data"]',
  key_metrics = '{"Node TelData Cat6":"1.000+","Fiber Optic":"3.000+"}',
  outcomes = '["Đường truyền tốc độ cao cho khách lưu trú","Hạ tầng cáp chống nhiễu"]',
  project_scale = 'medium'
WHERE id = 8;

-- id=9: Bay Hotel
UPDATE projects SET
  title = 'Khách sạn Bay',
  description = 'Khách sạn 4 sao tại Số 7 Ngô Văn Năm, Tp. Hồ Chí Minh.',
  client_name = 'BAY HOTEL',
  location = 'TP. Hồ Chí Minh',
  category = 'Khách sạn',
  client_industry = 'hospitality',
  system_types = '["Tel Data"]',
  key_metrics = '{"Node TelData Cat6":"500+","Fiber Optic":"1.000+"}',
  outcomes = '["Đáp ứng tiêu chuẩn khách sạn 4 sao","Băng thông rộng, độ trễ thấp"]',
  project_scale = 'medium'
WHERE id = 9;

-- id=10: Doji Tower
UPDATE projects SET
  title = 'Cao ốc Doji Tower',
  description = 'Tòa nhà văn phòng tại 214 Phan Đăng Lưu, Tp. Hồ Chí Minh.',
  client_name = 'DOJI GROUP',
  location = 'TP. Hồ Chí Minh',
  category = 'Tòa nhà văn phòng',
  client_industry = 'office',
  system_types = '["Tel Data"]',
  key_metrics = '{"Node TelData":"500+","Fiber Optic":"1.000+"}',
  outcomes = '["Hạ tầng mạng ổn định cho doanh nghiệp","Thiết bị đạt chuẩn quốc tế"]',
  project_scale = 'medium'
WHERE id = 10;

-- id=11: Nassim Thảo Điền
UPDATE projects SET
  title = 'Tòa nhà Nassim Thảo Điền',
  description = 'Dự án căn hộ cao cấp tại Thảo Điền, Quận 2, Tp. Hồ Chí Minh.',
  client_name = 'SONKIM LAND',
  location = 'TP. Hồ Chí Minh',
  category = 'Chung cư cao cấp',
  client_industry = 'residential',
  system_types = '["Tel Data"]',
  key_metrics = '{"Node TelData":"1.500+","Fiber Optic":"3.000+"}',
  outcomes = '["Đường truyền cáp quang FTTH tin cậy","Chất lượng dịch vụ cao cấp"]',
  project_scale = 'large'
WHERE id = 11;

-- id=12: AJ Total
UPDATE projects SET
  title = 'Nhà máy AJ Total Việt Nam',
  description = 'Nhà máy đặt tại KCN Long Hậu, Tp.Long An, Việt Nam.',
  client_name = 'AJ TOTAL',
  location = 'Long An',
  category = 'Nhà máy',
  client_industry = 'industrial',
  system_types = '["Tel Data","CCTV","PABX"]',
  key_metrics = '{"Tổng đài PABX":"Panasonic","Camera IP":"100+","Node TelData Cat6":"500+","Fiber Optic":"2.000+"}',
  outcomes = '["Giám sát an ninh nhà máy 24/7","Liên lạc nội bộ thông suốt"]',
  project_scale = 'medium'
WHERE id = 12;

-- id=15: SSG GROUP (already seeded, just update outcomes format)
UPDATE projects SET
  outcomes = '["Nhận diện khuôn mặt VIP/Nhân viên, cảnh báo Blacklist","Kiểm soát an ninh 100+ cửa với Reader AI","Turnstile nhận diện khuôn mặt tích hợp AI"]'
WHERE id = 15;

-- ─── 3. INSERT NEW PROJECTS ──────────────────────────────────────

-- #3 Mỹ Đình Pearl
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'my-dinh-pearl',
  'Mỹ Đình Pearl',
  'Dự án tổ hợp căn hộ cao cấp do Công ty cổ phần bất động sản dầu khí Việt Nam – SSG làm chủ đầu tư.',
  'SSG GROUP',
  'Hà Nội',
  'Chung cư cao cấp',
  'residential',
  '["CCTV"]',
  '{"Tổ hợp":"2 tòa tháp 38 tầng","Camera IP Axis":"400"}',
  '["Nguồn điện dự phòng UPS liên tục","Kiểm soát an ninh đa lớp"]',
  'large', 1, 3
);

-- #6 Tòa nhà ICT Đà Nẵng
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'toa-nha-ict-da-nang',
  'Tòa nhà ICT Đà Nẵng',
  'Tổ hợp 3 khối tòa nhà ICT 20 tầng, ICT1 8 tầng và ICT2 8 tầng tại đường Như Nguyệt, phường Thuận Phước, Đà Nẵng.',
  'BAN QLDA ĐT XD CT DÂN DỤNG & CN ĐÀ NẴNG',
  'Đà Nẵng',
  'Tòa nhà văn phòng',
  'government',
  '["Tel Data"]',
  '{"Rack":"20+","Node Data Cat6A 10G":"500+","Node Data Cat6":"1.500+","FO OM3 backbone":"1.000+"}',
  null,
  'large', 1, 6
);

-- #7 Gelex Hotel
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'gelex-hotel-ha-noi',
  'Gelex Hotel',
  'Tổ hợp khách sạn, dịch vụ thương mại và văn phòng cho thuê tại Số 10 Trần Nguyên Hãn, Hà Nội.',
  'GELEX GROUP',
  'Hà Nội',
  'Khách sạn',
  'hospitality',
  '["CCTV"]',
  '{"Camera IP Axis":"300+","VMS":"ACS Central"}',
  '["Hệ thống lưu trữ Server chuyên dụng","An toàn thông tin cấp doanh nghiệp"]',
  'large', 1, 7
);

-- #8 Wellspring Sài Gòn
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'truong-wellspring-sai-gon',
  'Trường Mầm non & Tiểu học Wellspring Sài Gòn',
  'Trường Mầm non và Trường Tiểu học Wellspring Khu Nam Sài Gòn, Tp. Hồ Chí Minh.',
  'SSG GROUP',
  'TP. Hồ Chí Minh',
  'Giáo dục',
  'education',
  '["Tel Data","Wifi","CCTV","Access Control","Car Parking"]',
  '{"Node mạng":"1.000+","AP Wifi":"200+","Camera":"200+","AccessControl":"FaceID + Doors","PA":"300+ loa"}',
  '["Hệ thống UPS lưu trữ điện năng liên tục","Kiểm soát ra vào & bãi xe thông minh","Âm thanh PA 300+ loa phục vụ giảng dạy"]',
  'large', 1, 8
);

-- #10 Edison An Khánh
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'truong-edison-an-khanh',
  'Trường Quốc tế Edison An Khánh',
  'Cơ sở tại Khu đô thị Bắc An Khánh, Hoài Đức, Hà Nội.',
  'EDISON SCHOOLS',
  'Hà Nội',
  'Giáo dục',
  'education',
  '["Tel Data","CCTV","PA"]',
  '{"Camera IP":"150+","Node Data Tel":"1.000+","Fiber Optic":"2.000+","PA":"200+"}',
  '["Đồng bộ tiêu chuẩn quốc tế","Hệ thống PA thông báo khẩn cấp tin cậy"]',
  'large', 1, 10
);

-- #11 Bệnh viện Hạnh Phúc
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'benh-vien-hanh-phuc',
  'Bệnh viện Hạnh Phúc',
  'Dự án y tế trọng điểm thiết kế theo hướng kiến trúc chữa lành tại Phường Phương Canh, Nam Từ Liêm, Hà Nội.',
  'CÔNG TY CP Y HỌC VĨNH THIỆN (PHENIKAA)',
  'Hà Nội',
  'Y tế',
  'healthcare',
  '["Tel Data"]',
  '{"Node Tel Data Cat6":"5.000+","FO OM3":"1.000+"}',
  null,
  'large', 1, 11
);

-- #15 EVN Data Center
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'trung-tam-du-lieu-evn',
  'Trung tâm Dữ liệu EVN',
  'Phục vụ cho ứng dụng CNTT cho tập đoàn điện lực Việt Nam tại 11 Cửa Bắc, Ba Đình, Hà Nội.',
  'EVN ICT',
  'Hà Nội',
  'Trung tâm dữ liệu',
  'government',
  '["Tel Data"]',
  '{"Rack Server & Network":"22+","Máng lưới":"Cablofil"}',
  '["Tiêu chuẩn bảo mật dữ liệu quốc gia","Hệ thống cáp chống cháy an toàn"]',
  'large', 1, 15
);

-- #16 Marina IFC
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'toa-nha-marina-ifc',
  'Tòa nhà Marina IFC',
  'Tòa nhà 60 tầng tại khu phức hợp, bao gồm khu căn hộ cao cấp, trung tâm thương mại.',
  'CAPITALAND',
  'TP. Hồ Chí Minh',
  'Tòa nhà văn phòng',
  'office',
  '["Rack","UPS"]',
  '{"Rack":"Toàn bộ tòa nhà","UPS":"Toàn bộ hệ thống ELVs"}',
  '["Hệ thống nguồn UPS Legrand chuẩn Châu Âu","Chống chịu tải cao và ổn định"]',
  'large', 1, 16
);

-- #17 Masterise Ba Son
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'masterise-ba-son-hh4',
  'Tổ hợp Masterise Ba Son HH4',
  'Dự án Masterise BaSon HH4 tọa lạc tại Số 2 Tôn Đức Thắng, Tp. Hồ Chí Minh.',
  'MASTERISE HOMES',
  'TP. Hồ Chí Minh',
  'Chung cư cao cấp',
  'residential',
  '["Tel Data","UPS"]',
  '{"Hạ tầng":"Teldata Cat6 & Fiber Optic","UPS":"Hệ thống ELVs"}',
  '["Thiết bị chuẩn quốc tế Legrand","Đảm bảo vận hành không gián đoạn"]',
  'large', 1, 17
);

-- #22 Hòa Phát Dung Quất
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'hoa-phat-dung-quat-2',
  'Khu liên hợp Gang thép Hòa Phát Dung Quất 2',
  'Khu kinh tế Dung Quất, Tp.Quảng Ngãi.',
  'HÒA PHÁT GROUP',
  'Quảng Ngãi',
  'Nhà máy',
  'industrial',
  '["Tel Data"]',
  '{"Node TelData Cat6":"2.000+","Fiber Optic":"10.000+"}',
  '["Thiết bị chịu được môi trường công nghiệp khắc nghiệt","Độ bền vật lý cao"]',
  'large', 1, 22
);

-- #24 Number One Chu Lai
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'nha-may-number-one-chu-lai',
  'Nhà máy Number One Chu Lai',
  'KCN Hậu cần Cảng Tam Hiệp, Tp.Quảng Nam.',
  'TÂN HIỆP PHÁT',
  'Quảng Nam',
  'Nhà máy',
  'industrial',
  '["Tel Data"]',
  '{"Node TelData Cat6":"500+","Fiber Optic":"5.000+"}',
  '["Hạ tầng mạng công nghiệp ổn định","Đảm bảo hoạt động sản xuất liên tục"]',
  'medium', 1, 24
);

-- #25 Number One Hậu Giang
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'nha-may-number-one-hau-giang',
  'Nhà máy Number One Hậu Giang',
  'Nhà máy NumberOne Tp. Hậu Giang.',
  'TÂN HIỆP PHÁT',
  'Hậu Giang',
  'Nhà máy',
  'industrial',
  '["Tel Data"]',
  '{"Node TelData Cat6":"500+","Fiber Optic":"4.000+"}',
  '["Đường truyền chống nhiễu công nghiệp","Vận hành bền bỉ trong môi trường nhà máy"]',
  'medium', 1, 25
);

-- #26 Proconco Bình Định
INSERT OR IGNORE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_active, sort_order)
VALUES (
  'proconco-binh-dinh',
  'Nhà máy Proconco Bình Định',
  'Nhà máy tại KCN Nhơn Hòa, Tp.Bình Định.',
  'MASAN GROUP',
  'Bình Định',
  'Nhà máy',
  'industrial',
  '["Tel Data","CCTV"]',
  '{"Cáp quang OM3":"5.000m","Node TelData Cat6":"500+","Camera IP":"100+"}',
  '["Giám sát an ninh khu vực sản xuất","Hạ tầng mạng đạt chuẩn công nghiệp"]',
  'medium', 1, 26
);
