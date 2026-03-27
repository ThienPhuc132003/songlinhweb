-- Migration: 0003 — Enrich seed data with full content
-- Purpose: Pre-populate all entities with sample content so frontend displays properly
-- All content can be edited later via Admin panel

-- ═══════════════════════════════════════════════
-- SOLUTIONS: Thêm content_md chi tiết
-- ═══════════════════════════════════════════════

-- Align slugs: DB dùng khác frontend constants → DELETE cũ, INSERT mới khớp
DELETE FROM solutions;

INSERT INTO solutions (slug, title, description, content_md, icon, sort_order, is_active) VALUES
  ('he-thong-cctv-camera-quan-sat',
   'Hệ thống CCTV Camera quan sát',
   'Thiết kế, lắp đặt hệ thống camera quan sát CCTV chuyên nghiệp cho nhà xưởng, văn phòng, chung cư, trường học.',
   '## Tổng quan

SLTECH cung cấp giải pháp camera giám sát toàn diện từ thiết kế, lắp đặt đến bảo trì hệ thống CCTV cho mọi quy mô dự án.

### Tính năng nổi bật

- **Camera IP/Analog**: Đa dạng lựa chọn từ 2MP đến 8MP
- **Hồng ngoại ban đêm**: Tầm nhìn tối đa 80m
- **AI Analytics**: Nhận diện khuôn mặt, phát hiện xâm nhập
- **Lưu trữ đám mây**: Xem lại camera mọi lúc mọi nơi
- **App điện thoại**: Giám sát trực tiếp trên smartphone

### Thương hiệu sử dụng

Hikvision, Dahua, Hanwha Techwin, Axis Communications

### Ứng dụng

Nhà xưởng, văn phòng, trung tâm thương mại, chung cư, trường học, bệnh viện.',
   'Camera', 1, 1),

  ('he-thong-bao-chay-chua-chay',
   'Hệ thống Báo cháy – Chữa cháy',
   'Tư vấn, thiết kế và thi công hệ thống PCCC theo tiêu chuẩn TCVN.',
   '## Tổng quan

Hệ thống phòng cháy chữa cháy (PCCC) tự động theo tiêu chuẩn Việt Nam TCVN, đảm bảo an toàn tối đa cho công trình.

### Giải pháp cung cấp

- **Báo cháy tự động**: Đầu báo khói, báo nhiệt, nút ấn báo cháy
- **Chữa cháy tự động**: Sprinkler, hệ thống khí FM200/Novec
- **Hệ thống quản lý**: Tủ trung tâm báo cháy, phần mềm giám sát
- **Tích hợp**: Kết nối với BMS, PA, access control

### Tiêu chuẩn áp dụng

TCVN 5738, TCVN 7336, NFPA 72, EN 54',
   'Flame', 2, 1),

  ('he-thong-am-thanh-thong-bao',
   'Hệ thống Âm thanh thông báo',
   'Hệ thống PA (Public Address) cho tòa nhà, trung tâm thương mại, nhà máy.',
   '## Tổng quan

Hệ thống âm thanh thông báo (PA — Public Address) cho tòa nhà, trung tâm thương mại, nhà máy. Tích hợp phát thanh khẩn cấp khi có sự cố cháy.

### Tính năng

- Phát thanh thông báo đa vùng
- Tích hợp hệ thống báo cháy
- Phát nhạc nền cho khu thương mại
- Hỗ trợ microphone không dây

### Thương hiệu

TOA, Bosch, Inter-M, Amperes',
   'Volume2', 3, 1),

  ('he-thong-mang-lan-wan',
   'Hệ thống Mạng LAN/WAN',
   'Thiết kế hạ tầng mạng LAN/WAN, WiFi doanh nghiệp, hệ thống cáp quang, cáp đồng.',
   '## Tổng quan

Thiết kế và triển khai hạ tầng mạng có cấu trúc (Structured Cabling) cho tòa nhà văn phòng và khu công nghiệp.

### Dịch vụ

- **Cáp đồng**: Cat5e, Cat6, Cat6A theo chuẩn TIA/EIA
- **Cáp quang**: Single mode, Multi mode, FTTH
- **WiFi Enterprise**: Cisco, Aruba, Ruckus, UniFi
- **Network Security**: Firewall, VPN, VLAN

### Cam kết

Bảo hành hệ thống cáp 25 năm, thi công theo chuẩn quốc tế.',
   'Network', 4, 1),

  ('he-thong-dien-nhe',
   'Hệ thống Điện nhẹ',
   'Thi công hệ thống điện nhẹ (ELV) bao gồm: điện thoại, intercom, truyền hình cáp, BMS.',
   '## Tổng quan

Hệ thống điện nhẹ (ELV — Extra Low Voltage) bao gồm tất cả các hệ thống kỹ thuật sử dụng điện áp thấp trong tòa nhà.

### Hệ thống bao gồm

- Hệ thống điện thoại / Intercom
- Truyền hình cáp CATV/IPTV
- Hệ thống BMS (Building Management)
- Hệ thống chiếu sáng thông minh
- Hệ thống quản lý năng lượng',
   'Zap', 5, 1),

  ('tong-dai-dien-thoai',
   'Tổng đài Điện thoại',
   'Cung cấp và lắp đặt tổng đài điện thoại IP-PBX, tổng đài analog cho văn phòng, khách sạn.',
   '## Tổng quan

Giải pháp tổng đài điện thoại hiện đại cho doanh nghiệp, văn phòng, khách sạn — từ analog truyền thống đến IP-PBX.

### Sản phẩm & Dịch vụ

- **Tổng đài IP-PBX**: Grandstream, Yealink, Panasonic
- **Điện thoại VoIP**: Đa dạng model desktop và wireless
- **Tích hợp VoIP**: Kết nối SIP trunk, giảm chi phí cuộc gọi
- **Hotel PBX**: Giải pháp chuyên biệt cho khách sạn',
   'Phone', 6, 1),

  ('he-thong-kiem-soat-ra-vao',
   'Hệ thống Kiểm soát ra vào',
   'Hệ thống Access Control bằng thẻ từ, vân tay, nhận diện khuôn mặt.',
   '## Tổng quan

Hệ thống kiểm soát ra vào (Access Control) giúp quản lý an ninh, chấm công và phân quyền truy cập cho doanh nghiệp.

### Công nghệ

- **Thẻ từ RFID**: HID, Mifare, ProxCard
- **Vân tay**: Cảm biến optical, capacitive
- **Khuôn mặt**: AI Face Recognition
- **Mobile Access**: Mở cửa bằng điện thoại (BLE/NFC)

### Ứng dụng mở rộng

- Kiểm soát thang máy
- Quản lý chấm công
- Barrier, cổng xoay, flap gate',
   'ShieldCheck', 7, 1),

  ('he-thong-bao-trom',
   'Hệ thống Báo trộm',
   'Lắp đặt hệ thống báo trộm chống đột nhập cho nhà ở, cửa hàng, kho bãi.',
   '## Tổng quan

Hệ thống báo trộm giúp phát hiện và cảnh báo khi có xâm nhập trái phép vào khu vực được bảo vệ.

### Thiết bị

- Đầu dò hồng ngoại PIR
- Cảm biến cửa từ (magnetic contact)
- Đầu dò rung (vibration sensor)
- Còi báo động ngoài trời
- Tủ trung tâm báo trộm

### Tính năng

- Báo động qua app điện thoại
- Gửi SMS/Email cảnh báo
- Kết nối trung tâm giám sát 24/7',
   'Bell', 8, 1),

  ('server-luu-tru',
   'Server – Lưu trữ',
   'Cung cấp giải pháp Server, NAS, SAN và hệ thống lưu trữ dữ liệu cho doanh nghiệp.',
   '## Tổng quan

Giải pháp server và lưu trữ dữ liệu an toàn cho doanh nghiệp — từ SMB đến Enterprise.

### Sản phẩm

- **Server**: Dell, HP, Supermicro (Tower, Rack, Blade)
- **NAS**: Synology, QNAP, TrueNAS
- **SAN**: iSCSI, Fibre Channel
- **UPS**: APC, Legrand, Eaton

### Dịch vụ

- Tư vấn thiết kế Server Room / Data Center
- Lắp đặt tủ rack, hệ thống cáp, cooling
- Backup & Disaster Recovery',
   'Server', 9, 1),

  ('he-thong-quan-ly-toa-nha-bms',
   'Hệ thống quản lý tòa nhà (BMS)',
   'Tích hợp và quản lý tất cả hệ thống kỹ thuật trong tòa nhà: HVAC, chiếu sáng, an ninh, PCCC.',
   '## Tổng quan

BMS (Building Management System) là hệ thống tự động hóa giúp quản lý toàn bộ kỹ thuật tòa nhà trên một nền tảng thống nhất.

### Hệ thống tích hợp

- HVAC (Điều hòa không khí)
- Chiếu sáng thông minh
- Hệ thống an ninh (CCTV, Access)
- PCCC (báo cháy, chữa cháy)
- Thang máy, thang cuốn
- Hệ thống cấp thoát nước

### Lợi ích

- Tiết kiệm 20-30% chi phí năng lượng
- Giám sát 24/7 từ xa
- Bảo trì dự phòng thông minh',
   'Building2', 10, 1),

  ('tu-van-thiet-ke-du-an',
   'Tư vấn – Thiết kế dự án',
   'Dịch vụ tư vấn, khảo sát và thiết kế hệ thống M&E toàn diện.',
   '## Tổng quan

SLTECH cung cấp dịch vụ tư vấn và thiết kế hệ thống M&E (Mechanical & Electrical) chuyên nghiệp cho các dự án từ nhỏ đến lớn.

### Quy trình

1. **Khảo sát hiện trạng** — Đánh giá chi tiết
2. **Lập phương án thiết kế** — Bản vẽ CAD/BIM
3. **Dự toán chi phí** — BOQ chi tiết
4. **Phê duyệt** — Review với khách hàng
5. **Bàn giao hồ sơ** — Shop drawing + As-built

### Hồ sơ bàn giao

- Bản vẽ thiết kế thi công (shop drawing)
- Bảng khối lượng & dự toán (BOQ)
- Hồ sơ hoàn công (as-built drawing)',
   'FileCheck', 11, 1);


-- ═══════════════════════════════════════════════
-- DỰ ÁN (Projects) — Align với frontend constants + thêm content
-- ═══════════════════════════════════════════════
DELETE FROM projects;

INSERT INTO projects (slug, title, description, content_md, location, client_name, category, year, is_featured, sort_order, is_active) VALUES
  ('saigon-centre',
   'Takashimaya Saigon Centre',
   'Triển khai hệ thống giám sát an ninh toàn diện gồm 200+ camera AI, kiểm soát ra vào, và Video Wall cho khu phức hợp thương mại cao cấp.',
   '## Thông tin dự án

**Takashimaya Saigon Centre** là khu phức hợp thương mại cao cấp tại trung tâm Quận 1, TP.HCM.

### Hạng mục triển khai

- **200+ camera IP** (Hanwha Techwin) — giám sát AI, phân tích hành vi
- **Hệ thống kiểm soát ra vào** — 50 cửa, tích hợp thang máy
- **Video Wall** 3x4 LCD 55" — trung tâm điều hành an ninh
- **Hệ thống PA** — Âm thanh thông báo toàn tòa nhà

### Kết quả

- Giảm 60% sự cố an ninh sau 6 tháng vận hành
- Tích hợp thành công với hệ thống BMS hiện hữu',
   'Quận 1, TP. HCM', 'Takashimaya', 'Thương mại', 2024, 1, 1, 1),

  ('toa-nha-republic-plaza',
   'Tòa nhà Republic Plaza',
   'Lắp đặt hệ thống mạng LAN, WiFi doanh nghiệp và hệ thống điện nhẹ cho tòa nhà văn phòng hạng A 18 tầng.',
   '## Thông tin dự án

**Republic Plaza** là tòa nhà văn phòng hạng A 18 tầng tại quận Tân Bình, TP.HCM.

### Hạng mục triển khai

- **Hạ tầng cáp mạng** Cat6A toàn tòa nhà (Legrand)
- **WiFi Enterprise** — 150+ Access Point (Ruckus)
- **Hệ thống VoIP** — 500 máy nhánh
- **Tủ rack 42U** — 2 phòng server

### Kết quả

- Tốc độ mạng đạt 10Gbps backbone
- Bảo hành hệ thống cáp 25 năm',
   'Tân Bình, TP. HCM', NULL, 'Văn phòng', 2024, 1, 2, 1),

  ('khach-san-new-world',
   'Khách sạn New World',
   'Triển khai hệ thống IPTV, tổng đài VoIP, và hệ thống PA cho khách sạn 5 sao 533 phòng.',
   '## Thông tin dự án

**New World Saigon Hotel** — Khách sạn 5 sao, 533 phòng tại quận 1, TP.HCM.

### Hạng mục triển khai

- **Hệ thống IPTV** 533 phòng — nội dung đa ngôn ngữ
- **Tổng đài VoIP** — 600 máy nhánh (Grandstream)
- **Hệ thống PA** — Âm thanh nền + thông báo (TOA)
- **WiFi** — Phủ sóng toàn khách sạn

### Kết quả

- Tích hợp với PMS (Property Management System) khách sạn
- Vận hành ổn định 24/7',
   'Quận 1, TP. HCM', 'New World Hotel', 'Khách sạn', 2023, 1, 3, 1),

  ('benh-vien-trieu-an',
   'Bệnh viện Triều An',
   'Thiết kế và thi công hệ thống báo cháy tự động, CCTV và kiểm soát ra vào cho bệnh viện 300 giường.',
   '## Thông tin dự án

**Bệnh viện Triều An** — Bệnh viện đa khoa 300 giường tại quận Bình Tân, TP.HCM.

### Hạng mục triển khai

- **PCCC tự động** — 1000+ đầu báo khói/nhiệt (Honeywell)
- **Sprinkler** — Phủ toàn bộ 8 tầng
- **CCTV** — 80 camera IP (Dahua)
- **Access Control** — 20 cửa, tích hợp chấm công

### Tiêu chuẩn

- Đạt TCVN 5738, TCVN 7336
- Nghiệm thu PCCC lần đầu đạt yêu cầu',
   'Bình Tân, TP. HCM', 'Bệnh viện Triều An', 'Y tế', 2023, 1, 4, 1),

  ('chung-cu-vinhomes',
   'Chung cư Vinhomes',
   'Lắp đặt hệ thống intercom IP, kiểm soát ra vào barrier, và camera giám sát cho khu căn hộ 500 căn.',
   '## Thông tin dự án

**Vinhomes Central Park** — Khu căn hộ cao cấp 500 căn tại quận Bình Thạnh, TP.HCM.

### Hạng mục triển khai

- **Video Intercom** IP — 500 căn hộ (Hikvision)
- **Barrier tự động** — 8 barrier (nhận diện biển số)
- **CCTV** — 150 camera AI, lưu trữ 30 ngày
- **Access Control** — Thẻ từ + Face Recognition

### Kết quả

- Tích hợp App cư dân — mở cửa, nhận thông báo
- Giám sát tập trung phòng bảo vệ',
   'Bình Thạnh, TP. HCM', 'Vingroup', 'Dân cư', 2024, 1, 5, 1),

  ('nha-may-vsip',
   'Nhà máy VSIP',
   'Triển khai hệ thống BMS, PCCC, access control và camera giám sát cho nhà máy sản xuất 20.000m².',
   '## Thông tin dự án

**Nhà máy VSIP** — Khu công nghiệp VSIP Bình Dương, diện tích 20.000m².

### Hạng mục triển khai

- **BMS** — Quản lý HVAC, chiếu sáng, năng lượng
- **PCCC** — Báo cháy + chữa cháy tự động khu sản xuất
- **CCTV** — 100 camera kháng bụi IP67
- **Access Control** — Barrier + cổng xoay

### Kết quả

- Tiết kiệm 25% chi phí điện năng qua BMS
- An toàn sản xuất 100% — không sự cố cháy',
   'Bình Dương', 'VSIP', 'Công nghiệp', 2023, 1, 6, 1);


-- ═══════════════════════════════════════════════
-- ĐỐI TÁC — Cập nhật đầy đủ khớp với frontend
-- ═══════════════════════════════════════════════
DELETE FROM partners;

INSERT INTO partners (name, website_url, sort_order, is_active) VALUES
  ('Hikvision',         'https://www.hikvision.com',         1, 1),
  ('Dahua',             'https://www.dahuasecurity.com',     2, 1),
  ('Hanwha Techwin',    'https://www.hanwha-security.com',   3, 1),
  ('Honeywell',         'https://www.honeywell.com',         4, 1),
  ('Bosch',             'https://www.boschsecurity.com',     5, 1),
  ('TOA',               'https://www.toa.jp',                6, 1),
  ('Axis Communications','https://www.axis.com',             7, 1),
  ('ZKTeco',            'https://www.zkteco.com',            8, 1),
  ('Legrand',           'https://www.legrand.com',           9, 1),
  ('CommScope',         'https://www.commscope.com',        10, 1),
  ('HID Global',        'https://www.hidglobal.com',        11, 1);


-- ═══════════════════════════════════════════════
-- TIN TỨC (Posts) — Thêm bài + content_md
-- ═══════════════════════════════════════════════
DELETE FROM posts;

INSERT INTO posts (slug, title, excerpt, content_md, author, tags, is_published, published_at) VALUES
  ('5-loi-ich-lap-dat-camera-doanh-nghiep',
   '5 Lợi ích khi lắp đặt camera quan sát cho doanh nghiệp',
   'Hệ thống camera giám sát không chỉ đảm bảo an ninh mà còn giúp quản lý hiệu quả, giảm thất thoát.',
   '## 5 Lợi ích khi lắp đặt Camera quan sát cho doanh nghiệp

### 1. Đảm bảo an ninh
Camera giám sát giúp phòng ngừa trộm cắp, theo dõi khu vực nhạy cảm 24/7.

### 2. Quản lý nhân sự
Giám sát hoạt động sản xuất, kiểm tra giờ giấc làm việc, đảm bảo tuân thủ quy trình.

### 3. Giảm thất thoát
Camera AI nhận diện hành vi bất thường, cảnh báo khi có sự cố.

### 4. Bằng chứng pháp lý
Hình ảnh ghi lại là bằng chứng quan trọng khi xảy ra tranh chấp.

### 5. Quản lý từ xa
Xem camera trực tiếp trên điện thoại, máy tính ở bất cứ đâu.

---

**Liên hệ SLTECH để được tư vấn hệ thống camera phù hợp cho doanh nghiệp: 0968.811.911**',
   'SLTECH', '["camera","an-ninh","doanh-nghiep"]', 1, datetime('now', '-7 days')),

  ('quy-dinh-pccc-toa-nha-2026',
   'Quy định PCCC cho tòa nhà năm 2026 — Những điều cần biết',
   'Tổng hợp các quy định mới nhất về phòng cháy chữa cháy cho tòa nhà cao tầng.',
   '## Quy định PCCC cho tòa nhà năm 2026

### Các yêu cầu chính

1. **Hệ thống báo cháy tự động** — Bắt buộc cho tòa nhà từ 5 tầng
2. **Hệ thống chữa cháy** — Sprinkler, vòi chữa cháy theo TCVN 7336
3. **Lối thoát hiểm** — Đèn chiếu sáng sự cố, biển báo
4. **Kiểm tra định kỳ** — 6 tháng/lần, có biên bản nghiệm thu

### Tiêu chuẩn áp dụng

- TCVN 5738:2021 về hệ thống báo cháy tự động
- TCVN 7336:2021 về PCCC cho nhà và công trình
- Nghị định 136/2020/NĐ-CP

### Lời khuyên từ SLTECH

Hãy chủ động kiểm tra và bảo trì hệ thống PCCC định kỳ. SLTECH cung cấp dịch vụ kiểm tra, bảo trì và nâng cấp hệ thống PCCC theo tiêu chuẩn mới nhất.

**Hotline tư vấn: 0968.811.911**',
   'SLTECH', '["pccc","quy-dinh","toa-nha"]', 1, datetime('now', '-14 days')),

  ('xu-huong-smart-building-2026',
   'Xu hướng Smart Building 2026 — BMS và IoT',
   'Tìm hiểu về xu hướng tòa nhà thông minh, hệ thống BMS tích hợp IoT giúp tối ưu năng lượng.',
   '## Xu hướng Smart Building 2026

### BMS thế hệ mới

Hệ thống BMS hiện đại không chỉ kiểm soát HVAC mà còn tích hợp:
- **IoT Sensors** — Cảm biến nhiệt độ, độ ẩm, CO2, ánh sáng
- **AI Analytics** — Tối ưu năng lượng tự động
- **Digital Twin** — Mô phỏng 3D tòa nhà
- **Predictive Maintenance** — Bảo trì dự đoán

### Lợi ích

- Tiết kiệm 30-40% chi phí năng lượng
- Giảm 50% thời gian bảo trì
- Tăng tuổi thọ thiết bị

### Giải pháp từ SLTECH

SLTECH cung cấp dịch vụ tư vấn, thiết kế và thi công hệ thống BMS cho tòa nhà mọi quy mô.

**Liên hệ tư vấn: 0968.811.911**',
   'SLTECH', '["bms","iot","smart-building"]', 1, datetime('now', '-21 days')),

  ('so-sanh-camera-ip-va-analog',
   'So sánh Camera IP và Camera Analog — Nên chọn loại nào?',
   'Phân tích ưu nhược điểm của camera IP so với camera analog.',
   '## Camera IP vs Camera Analog

### Camera Analog

| Ưu điểm | Nhược điểm |
|----------|------------|
| Giá thành rẻ | Độ phân giải thấp (max 2MP) |
| Lắp đặt đơn giản | Không hỗ trợ AI |
| Ổn định | Khó mở rộng |

### Camera IP

| Ưu điểm | Nhược điểm |
|----------|------------|
| Độ phân giải cao (4K+) | Chi phí ban đầu cao hơn |
| Tích hợp AI analytics | Cần hạ tầng mạng tốt |
| Xem từ xa qua internet | Phức tạp hơn khi lắp đặt |
| Dễ mở rộng | — |

### Khuyến nghị

- **Doanh nghiệp nhỏ**: Camera IP 2MP — cân bằng giá/chất lượng
- **Văn phòng**: Camera IP 4MP — AI face recognition
- **Nhà máy**: Camera IP 8K — giám sát quy trình sản xuất

**SLTECH tư vấn miễn phí — 0968.811.911**',
   'SLTECH', '["camera","so-sanh","huong-dan"]', 1, datetime('now', '-30 days'));


-- ═══════════════════════════════════════════════
-- THƯ VIỆN HÌNH ẢNH (Gallery) — Albums mẫu
-- ═══════════════════════════════════════════════
INSERT INTO gallery_albums (slug, title, sort_order, is_active) VALUES
  ('du-an-saigon-centre',        'Dự án Saigon Centre',              1, 1),
  ('du-an-republic-plaza',       'Dự án Republic Plaza',             2, 1),
  ('du-an-benh-vien-trieu-an',   'Dự án Bệnh viện Triều An',        3, 1),
  ('thi-cong-he-thong-pccc',     'Thi công hệ thống PCCC',          4, 1),
  ('lap-dat-camera-nha-xuong',   'Lắp đặt camera nhà xưởng',       5, 1);


-- ═══════════════════════════════════════════════
-- CẬP NHẬT SITE CONFIG — Thông tin chính xác
-- ═══════════════════════════════════════════════
UPDATE site_config SET value = '0968.811.911' WHERE key = 'phone';
UPDATE site_config SET value = 'songlinh@sltech.vn' WHERE key = 'email';
UPDATE site_config SET value = '19 Linh Đông, Khu phố 7, P. Hiệp Bình, TP.HCM' WHERE key = 'address';
