-- ═══════════════════════════════════════════════════════════════════
-- Song Linh Portfolio: Full Project Data Sync
-- Source: Duan_text (mentor-provided canonical data, 26 projects)
-- Strategy:
--   1. Soft-delete ALL existing projects (clean slate)
--   2. Insert all 26 projects in official portfolio order
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. SOFT-DELETE ALL EXISTING PROJECT DATA ───────────────────
UPDATE projects SET deleted_at = datetime('now') WHERE deleted_at IS NULL;

-- ─── 2. INSERT ALL 26 PROJECTS (Official Portfolio Order) ───────

-- #1 Tòa nhà Lotus Tower
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'toa-nha-lotus-tower',
  'Tòa nhà Lotus Tower',
  '3A-3B Tôn Đức Thắng, Tp. Hồ Chí Minh. Ứng dụng công nghệ nhận diện khuôn mặt và trí tuệ nhân tạo (AI).',
  'SSG GROUP',
  'TP. Hồ Chí Minh',
  'Tòa nhà văn phòng',
  'office',
  '["Tel Data","CCTV AI","Access Control","Facial recognition analysis","Face ID Elevator Integration"]',
  '{"Hạ tầng mạng":"100+ node Cat6 & Fiber Optic","CCTV":"300+ Cameras AI + Phần mềm nhận diện khuôn mặt","Access Control":"200 reader + Doors","Kiểm soát khuôn mặt":"Tích hợp bậc cao thang máy tòa nhà"}',
  '["Nhận diện khuôn mặt VIP/Nhân viên, cảnh báo Blacklist","Kiểm soát an ninh 100+ cửa với Reader AI","Turnstile nhận diện khuôn mặt tích hợp AI"]',
  'large', 1, 1, 1
);

-- #2 Tòa nhà Văn phòng – Trung tâm Dữ liệu HDBank
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'trung-tam-du-lieu-hdbank',
  'Tòa nhà Văn phòng – Trung tâm Dữ liệu HDBank',
  'Hạ tầng công nghệ và cung cấp dịch vụ tài chính tại Khu Công Nghệ Cao, TP.Thủ Đức, Tp. Hồ Chí Minh.',
  'NGÂN HÀNG HDBANK',
  'TP. Hồ Chí Minh',
  'Trung tâm dữ liệu',
  'banking',
  '["Rack Server","Rack Network","CCTV","Data Copper & Fiber"]',
  '{"Máng lưới":"Cablofil","Rack Server & Network":"25+","CCTV":"Giám sát Datacenter","Node mạng thoại":"5.000+"}',
  '["Đạt chuẩn Tier 3 Data Center","Đảm bảo Uptime 99.982%","Hệ thống dự phòng N+1"]',
  'large', 1, 1, 2
);

-- #3 Mỹ Đình Pearl
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'large', 0, 1, 3
);

-- #4 Tòa nhà Viettel Complex
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'toa-nha-viettel-complex',
  'Tòa nhà Viettel Complex',
  'Trụ sở điều hành & trung tâm thương mại Viettel tại 285 CMT8, Tp. Hồ Chí Minh.',
  'VIETTEL CORP',
  'TP. Hồ Chí Minh',
  'Tòa nhà văn phòng',
  'office',
  '["Tel Data","CCTV","VMS Central","Access Control"]',
  '{"Camera IP Axis":"300","VMS":"MileStone","Hạ tầng":"Tel Data","Kiểm soát vào ra":"Tòa nhà"}',
  '["Phần mềm quản lý VMS Milestone hàng đầu","Đường truyền quang tốc độ Gigabit"]',
  'large', 1, 1, 4
);

-- #5 Tòa nhà Opal Tower
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'toa-nha-opal-tower',
  'Tòa nhà Opal Tower',
  'Tòa nhà cao 41 tầng bao gồm khu căn hộ cao cấp, khu văn phòng đẳng cấp và shophouse.',
  'SSG GROUP & VIETNAM LAND',
  'TP. Hồ Chí Minh',
  'Chung cư cao cấp',
  'residential',
  '["CCTV"]',
  '{"Hạ tầng":"Network","Camera IP Axis":"250+","VMS":"Axis Camera Station"}',
  '["Giám sát an ninh độ phân giải cao","Lưu trữ dữ liệu dự phòng an toàn"]',
  'large', 0, 1, 5
);

-- #6 Tòa nhà ICT Đà Nẵng
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'toa-nha-ict-da-nang',
  'Tòa nhà ICT Đà Nẵng',
  'Đường Như Nguyệt, phường Thuận Phước, Đà Nẵng. Tổ hợp 3 khối tòa nhà ICT 20 tầng, ICT1 8 tầng và ICT2 8 tầng.',
  'BAN QLDA ĐT XD CT DÂN DỤNG & CN ĐÀ NẴNG',
  'Đà Nẵng',
  'Tòa nhà văn phòng',
  'government',
  '["Tel Data"]',
  '{"Rack":"20+","Node Data Cat6A 10G":"500+","Node Data Cat6":"1.500+","FO OM3 backbone":"1.000+"}',
  null,
  'large', 0, 1, 6
);

-- #7 Gelex Hotel
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'large', 0, 1, 7
);

-- #8 Trường Mầm non & Tiểu học Wellspring Sài Gòn
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'truong-wellspring-sai-gon',
  'Trường Mầm non & Tiểu học Wellspring Sài Gòn',
  'Trường Mầm non và Trường Tiểu học Wellspring Khu Nam Sài Gòn, Tp. Hồ Chí Minh.',
  'SSG GROUP',
  'TP. Hồ Chí Minh',
  'Giáo dục',
  'education',
  '["Tel Data","Wifi","CCTV","Access Control","Car Parking"]',
  '{"TelData":"1.000+ node mạng","AP Wifi":"200+","Camera":"200+","AccessControl":"FaceID + Doors","CarParking":"Ô tô & Xe máy","PA":"300+ loa"}',
  '["Hệ thống UPS lưu trữ điện năng liên tục","Kiểm soát ra vào & bãi xe thông minh","Âm thanh PA 300+ loa phục vụ giảng dạy"]',
  'large', 1, 1, 8
);

-- #9 Trường Quốc tế Edison (Ecopark)
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'truong-edison-ecopark',
  'Trường Quốc tế Edison',
  'Hệ thống trường liên cấp tại khu đô thị Ecopark, Hưng Yên.',
  'EDISON SCHOOLS',
  'Hưng Yên',
  'Giáo dục',
  'education',
  '["Tel Data","CCTV","PA"]',
  '{"Camera IP":"200+","Node Data Tel":"1.000+","Fiber Optic":"2.000+","PA":"250+"}',
  '["Đảm bảo an toàn cho học sinh","Hạ tầng mạng ổn định phục vụ giáo dục"]',
  'large', 0, 1, 9
);

-- #10 Trường Quốc tế Edison An Khánh
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'large', 0, 1, 10
);

-- #11 Bệnh viện Hạnh Phúc
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'benh-vien-hanh-phuc',
  'Bệnh viện Hạnh Phúc',
  'Phường Phương Canh, Nam Từ Liêm, Hà Nội. Dự án y tế trọng điểm thiết kế theo hướng kiến trúc chữa lành.',
  'CÔNG TY CP Y HỌC VĨNH THIỆN (PHENIKAA)',
  'Hà Nội',
  'Y tế',
  'healthcare',
  '["Tel Data"]',
  '{"Node Tel Data Cat6":"5.000+","FO OM3":"1.000+"}',
  null,
  'large', 0, 1, 11
);

-- #12 Văn phòng Trung Ương Đảng
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'van-phong-trung-uong-dang',
  'Văn phòng Trung Ương Đảng',
  'Hệ thống giám sát an ninh toàn diện. Triển khai tại cơ quan trọng yếu. Trụ sở Số 3 Phan Đình Phùng, Ba Đình, Hà Nội.',
  'Văn Phòng Trung Ương Đảng',
  'Hà Nội',
  'Cơ quan nhà nước',
  'government',
  '["CCTV","VMS Central"]',
  '{"Camera IP":"100+","VMS":"Axis Camera Station"}',
  '["Bảo mật thông tin mức độ tối đa","Thiết bị hoạt động bền bỉ, chống xâm nhập"]',
  'medium', 1, 1, 12
);

-- #13 Tòa nhà Pearl 5 Tower
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'toa-nha-pearl-5-tower',
  'Tòa nhà Pearl 5 Tower',
  'Tòa nhà văn phòng hiện đại tại số 5 Lê Quý Đôn, Tp. Hồ Chí Minh.',
  'NGỌC SƠN NAM',
  'TP. Hồ Chí Minh',
  'Tòa nhà văn phòng',
  'office',
  '["Tel Data","CCTV","Access Control","Car Parking"]',
  '{"Camera IP Axis":"100+","Kiểm soát vào ra":"Toàn bộ tòa nhà","Car Parking":"Thông minh"}',
  '["Công nghệ thẻ từ HID bảo mật cao","Vận hành tự động hóa 24/24"]',
  'medium', 0, 1, 13
);

-- #14 Ngân hàng An Bình (ABBANK)
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'ngan-hang-abbank',
  'Ngân hàng An Bình (ABBANK)',
  'Hệ thống giám sát an ninh tập trung cho mạng lưới 165 điểm giao dịch trên toàn quốc.',
  'ABBANK',
  'TP. Hồ Chí Minh',
  'Ngân hàng',
  'banking',
  '["CCTV Central"]',
  '{"Camera IP":"1.300+","VMS":"Central"}',
  '["Hệ thống cảnh báo phá hoại ATM tức thời","Lưu trữ dữ liệu an toàn 24/7"]',
  'large', 0, 1, 14
);

-- #15 Trung tâm Dữ liệu EVN
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'trung-tam-du-lieu-evn',
  'Trung tâm Dữ liệu EVN',
  '11 Cửa Bắc, Ba Đình, Hà Nội. Phục vụ cho ứng dụng CNTT cho tập đoàn điện lực Việt Nam.',
  'EVN ICT',
  'Hà Nội',
  'Trung tâm dữ liệu',
  'government',
  '["Tel Data"]',
  '{"Máng lưới":"Cablofil","Rack Server & Network":"22+"}',
  '["Tiêu chuẩn bảo mật dữ liệu quốc gia","Hệ thống cáp chống cháy an toàn"]',
  'large', 0, 1, 15
);

-- #16 Tòa nhà Marina IFC
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'large', 0, 1, 16
);

-- #17 Tổ hợp Masterise Ba Son HH4
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'large', 0, 1, 17
);

-- #18 Khách sạn Bay
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'khach-san-bay',
  'Khách sạn Bay',
  'Khách sạn 4 sao tại Số 7 Ngô Văn Năm, Tp. Hồ Chí Minh.',
  'BAY HOTEL',
  'TP. Hồ Chí Minh',
  'Khách sạn',
  'hospitality',
  '["Tel Data"]',
  '{"Node TelData Cat6":"500+","Fiber Optic":"1.000+"}',
  '["Đáp ứng tiêu chuẩn khách sạn 4 sao","Băng thông rộng, độ trễ thấp"]',
  'medium', 0, 1, 18
);

-- #19 Cao ốc Doji Tower
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'cao-oc-doji-tower',
  'Cao ốc Doji Tower',
  'Tòa nhà văn phòng tại 214 Phan Đăng Lưu, Tp. Hồ Chí Minh.',
  'DOJI GROUP',
  'TP. Hồ Chí Minh',
  'Tòa nhà văn phòng',
  'office',
  '["Tel Data"]',
  '{"Node TelData":"500+","Fiber Optic":"1.000+"}',
  '["Hạ tầng mạng ổn định cho doanh nghiệp","Thiết bị đạt chuẩn quốc tế"]',
  'medium', 0, 1, 19
);

-- #20 Tòa nhà Nassim Thảo Điền
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'toa-nha-nassim-thao-dien',
  'Tòa nhà Nassim Thảo Điền',
  'Dự án căn hộ cao cấp tại Thảo Điền, Quận 2, Tp. Hồ Chí Minh.',
  'SONKIM LAND',
  'TP. Hồ Chí Minh',
  'Chung cư cao cấp',
  'residential',
  '["Tel Data"]',
  '{"Node TelData":"1.500+","Fiber Optic":"3.000+"}',
  '["Đường truyền cáp quang FTTH tin cậy","Chất lượng dịch vụ cao cấp"]',
  'large', 0, 1, 20
);

-- #21 Khách sạn Marie Curie
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'khach-san-marie-curie',
  'Khách sạn Marie Curie',
  'Tổ hợp khách sạn cao cấp tại 157 Nam Kỳ Khởi Nghĩa, Tp. Hồ Chí Minh.',
  'ARECO',
  'TP. Hồ Chí Minh',
  'Khách sạn',
  'hospitality',
  '["Tel Data"]',
  '{"Node TelData Cat6":"1.000+","Fiber Optic":"3.000+"}',
  '["Đường truyền tốc độ cao cho khách lưu trú","Hạ tầng cáp chống nhiễu"]',
  'medium', 0, 1, 21
);

-- #22 Khu liên hợp Gang thép Hòa Phát Dung Quất 2
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'hoa-phat-dung-quat-2',
  'Khu liên hợp Gang thép Hòa Phát Dung Quất 2',
  'Khu kinh tế Dung Quất, Tp.Quảng Ngãi.',
  'HÒA PHÁT GROUP',
  'Quảng Ngãi',
  'Nhà máy',
  'industrial',
  '["Tel Data"]',
  '{"Tủ Rack & cáp":"Legrand","Node TelData Cat6":"2.000+","Fiber Optic":"10.000+"}',
  '["Thiết bị chịu được môi trường công nghiệp khắc nghiệt","Độ bền vật lý cao"]',
  'large', 1, 1, 22
);

-- #23 Nhà máy AJ Total Việt Nam
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
VALUES (
  'nha-may-aj-total',
  'Nhà máy AJ Total Việt Nam',
  'Nhà máy đặt tại KCN Long Hậu, Tp.Long An, Việt Nam.',
  'AJ TOTAL',
  'Long An',
  'Nhà máy',
  'industrial',
  '["Tel Data","CCTV","PABX"]',
  '{"Tổng đài PABX":"Panasonic","Camera IP":"100+","Node TelData Cat6":"500+","Fiber Optic":"2.000+"}',
  '["Giám sát an ninh nhà máy 24/7","Liên lạc nội bộ thông suốt"]',
  'medium', 0, 1, 23
);

-- #24 Nhà máy Number One Chu Lai
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'medium', 0, 1, 24
);

-- #25 Nhà máy Number One Hậu Giang
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'medium', 0, 1, 25
);

-- #26 Nhà máy Proconco Bình Định
INSERT OR REPLACE INTO projects (slug, title, description, client_name, location, category, client_industry, system_types, key_metrics, outcomes, project_scale, is_featured, is_active, sort_order)
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
  'medium', 0, 1, 26
);
