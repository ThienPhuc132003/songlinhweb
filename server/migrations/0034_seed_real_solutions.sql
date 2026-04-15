-- Migration: 0034 — Seed 11 real solutions from legacy content
-- Source: src/assets/Image/DataXample/GiaiPhap_text

INSERT OR REPLACE INTO solutions (slug, title, description, excerpt, content_md, icon, features, applications, hero_image_url, sort_order, is_active, meta_title, meta_description)
VALUES
-- 1. CCTV
('he-thong-cctv-camera-quan-sat',
 'Hệ thống giám sát an ninh AI',
 'Thiết kế, lắp đặt hệ thống camera quan sát CCTV tích hợp AI cho tòa nhà, văn phòng, nhà xưởng, khu công nghiệp. Sử dụng công nghệ AcuSense, Deep Learning và Smart Tracking từ các thương hiệu hàng đầu.',
 'Giám sát thông minh 24/7 — Phát hiện xâm nhập bằng Deep Learning, giảm 90% cảnh báo sai',
 '## Kiến trúc hệ thống

Camera IP → Switch PoE → NVR/Server → VMS. Tất cả kết nối qua hạ tầng mạng structured cabling, hỗ trợ redundancy và failover tự động.

**Tích hợp:** Access Control, Fire Alarm, BMS, Intercom, Parking System.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Độ phân giải | 2MP / 4MP / 8MP (4K) |
| Ống kính | 2.8mm–12mm Varifocal |
| Tầm xa hồng ngoại | 30m–100m (DarkFighter) |
| Chuẩn nén | H.265+ / H.264+ |
| Giao thức | ONVIF Profile S/T/G |
| Nguồn cấp | PoE (IEEE 802.3af/at) |
| Lưu trữ | HDD RAID / NAS / Cloud |
| Chứng nhận | CE, FCC, UL, NDAA Compliant |

## Thương hiệu đối tác

Hikvision, Dahua, Hanwha Techwin, Axis Communications.',
 'camera',
 '[{"icon":"brain","title":"AcuSense AI","description":"Tự động phân biệt người/xe, giảm 90% cảnh báo sai so với cảm biến truyền thống."},{"icon":"scan-face","title":"Deep Learning Recognition","description":"Nhận diện khuôn mặt (Face Recognition) với cơ sở dữ liệu lên đến 100,000 gương mặt."},{"icon":"target","title":"Smart Tracking","description":"Camera PTZ tự động bám và theo dõi đối tượng di chuyển trong phạm vi quan sát."},{"icon":"hard-drive","title":"H.265+ Compression","description":"Tiết kiệm bandwidth và dung lượng lưu trữ đến 80% so với H.264 truyền thống."},{"icon":"sun","title":"120dB True WDR","description":"Hình ảnh rõ nét trong mọi điều kiện ánh sáng, kể cả ngược sáng mạnh."},{"icon":"globe","title":"Remote Monitoring","description":"Giám sát từ xa qua app mobile, web browser mọi lúc mọi nơi."}]',
 '["Tòa nhà văn phòng","Nhà xưởng, khu công nghiệp","Trung tâm thương mại","Khu dân cư, chung cư","Trường học, bệnh viện","Ngân hàng, kho bãi"]',
 NULL, 1, 1,
 'Hệ thống giám sát an ninh AI (CCTV) | Song Linh Technologies',
 'Thiết kế, lắp đặt hệ thống camera quan sát CCTV tích hợp AI — AcuSense, Deep Learning, Smart Tracking. Giảm 90% cảnh báo sai.'),

-- 2. Access Control
('he-thong-access-control',
 'Hệ thống Kiểm soát Ra vào',
 'Hệ thống Access Control quản lý quyền truy cập khu vực bằng thẻ từ, vân tay, nhận diện khuôn mặt hoặc mã PIN. Kết hợp chấm công, kiểm soát thang máy, barrier và cổng turnstile.',
 'Quản lý truy cập thông minh — Thẻ từ, vân tay, nhận diện khuôn mặt, kiểm soát thang máy',
 '## Kiến trúc hệ thống

Controller trung tâm → Reader (thẻ từ/vân tay/khuôn mặt) → Khóa điện từ/Barrier → Phần mềm quản lý. Tất cả kết nối qua mạng TCP/IP, hỗ trợ quản lý tập trung multi-site.

**Tích hợp:** CCTV, Fire Alarm, Elevator, BMS, HR System.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Loại xác thực | Thẻ / Vân tay / Khuôn mặt / PIN |
| Dung lượng | 50,000 thẻ — 10,000 khuôn mặt |
| Tốc độ xác thực | < 0.5 giây |
| Controller | 2/4 cửa, TCP/IP, RS-485 |
| Khóa điện từ | Fail-safe (280kg) / Fail-secure |
| Nguồn backup | UPS 12V/7Ah, 4-8 giờ |
| Giao thức | Wiegand 26/34, OSDP v2 |
| Chứng nhận | CE, FCC, IP65, IK08 |

## Thương hiệu đối tác

ZKTeco, HID Global, Suprema, Hikvision.',
 'shield-check',
 '[{"icon":"scan-face","title":"Nhận diện khuôn mặt","description":"Xác thực không chạm với tốc độ < 0.5 giây, độ chính xác > 99.5%."},{"icon":"thermometer","title":"Đo nhiệt độ tích hợp","description":"Cảm biến nhiệt độ ±0.3°C, tự động cảnh báo khi phát hiện sốt."},{"icon":"shield","title":"Anti-Passback","description":"Chống gian lận ra vào, đảm bảo mỗi người chỉ quẹt 1 lần."},{"icon":"layers","title":"Kiểm soát thang máy","description":"Giới hạn quyền truy cập theo tầng, tích hợp reader trong cabin."},{"icon":"clock","title":"Chấm công tích hợp","description":"Kết hợp chấm công nhân sự, export báo cáo Excel/PDF tự động."},{"icon":"smartphone","title":"Mobile Credential","description":"Mở cửa bằng smartphone qua Bluetooth/NFC, không cần thẻ vật lý."}]',
 '["Tòa nhà văn phòng","Chung cư cao tầng","Nhà máy, khu công nghiệp","Trường học, bệnh viện","Khách sạn, resort","Data Center"]',
 NULL, 2, 1,
 'Hệ thống Kiểm soát Ra vào (Access Control) | Song Linh Technologies',
 'Hệ thống Access Control quản lý truy cập bằng thẻ từ, vân tay, khuôn mặt. Tích hợp chấm công, thang máy, barrier.'),

-- 3. Face ID
('he-thong-cong-an-ninh-nhan-dien-khuon-mat',
 'Hệ thống an ninh nhận diện khuôn mặt Face ID',
 'Hệ thống cổng an ninh tích hợp nhận diện khuôn mặt AI cho tòa nhà cao tầng. Kết hợp đo nhiệt, chấm công nhân sự và quản lý visitor trong một thiết bị duy nhất.',
 'Xác thực sinh trắc học không chạm — Tích hợp đo thân nhiệt, chấm công, quản lý khách',
 '## Kiến trúc hệ thống

Terminal Face ID → Bộ xử lý AI Edge → Server DB → Dashboard quản lý. Hỗ trợ cluster multi-entrance với database đồng bộ real-time qua mạng LAN/WAN.

**Tích hợp:** Access Control, CCTV, Fire Alarm, Elevator, Turnstile.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Nhận diện | 3D Structured Light / Dual Camera |
| Dung lượng khuôn mặt | 50,000 faces |
| Tốc độ | < 0.3 giây |
| Khoảng cách | 0.3m – 3m |
| Đo nhiệt | ±0.3°C (34°C–42°C) |
| Màn hình | 7" / 10" IPS Touch |
| Kết nối | TCP/IP, WiFi, RS-485 |
| Chứng nhận | CE, FCC, IP65, FDA 510(k) |

## Thương hiệu đối tác

ZKTeco, Hikvision, Dahua, Suprema.',
 'scan-face',
 '[{"icon":"box","title":"3D Face Recognition","description":"Nhận diện khuôn mặt 3D chống giả mạo bằng ảnh hoặc video, hoạt động trong điều kiện thiếu sáng."},{"icon":"thermometer","title":"Đo thân nhiệt AI","description":"Cảm biến hồng ngoại đo nhiệt ±0.3°C, cảnh báo sốt tự động và ghi log."},{"icon":"users","title":"Visitor Management","description":"Đăng ký khách trước qua app, nhận diện tự động khi đến, in badge tạm thời."},{"icon":"hard-drive","title":"Database 50K+","description":"Lưu trữ lên đến 50,000 khuôn mặt, tốc độ so khớp < 0.3 giây."},{"icon":"shield-check","title":"Anti-Spoofing","description":"Chống giả mạo bằng ảnh chụp, video replay, mặt nạ 3D."},{"icon":"bar-chart-3","title":"Analytics Dashboard","description":"Thống kê lượng người ra vào, thời gian peak, báo cáo xuất Excel."}]',
 '["Tòa nhà cao tầng","Chung cư","Nhà máy, xí nghiệp","Ngân hàng","Bệnh viện","Cơ quan nhà nước"]',
 NULL, 3, 1,
 'Hệ thống nhận diện khuôn mặt Face ID | Song Linh Technologies',
 'Hệ thống cổng an ninh tích hợp nhận diện khuôn mặt AI, đo thân nhiệt, chấm công và quản lý visitor.'),

-- 4. Car Parking
('he-thong-car-parking',
 'Hệ thống CAR PARKING thông minh',
 'Hệ thống quản lý bãi giữ xe ô tô thông minh tích hợp camera nhận diện biển số (LPR), barrier tự động, thanh toán điện tử và phần mềm quản lý doanh thu.',
 'Quản lý bãi xe tự động — Nhận diện biển số, thanh toán không tiền mặt, báo cáo doanh thu real-time',
 '## Kiến trúc hệ thống

Camera LPR → Server nhận diện → Controller barrier → Phần mềm quản lý trung tâm. Hỗ trợ multi-entrance/exit, đồng bộ data cloud.

**Tích hợp:** CCTV, Access Control, BMS, Parking Guidance, Payment Gateway.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Nhận diện biển số | AI LPR > 99% accuracy |
| Thời gian xử lý | < 1 giây |
| Barrier | 1.5s mở, chống va chạm IR |
| Loại vé | Vé tháng / Vé lượt / VIP |
| Thanh toán | Tiền mặt / VNPAY / MoMo / ZaloPay |
| Báo cáo | Real-time dashboard, export Excel |
| Kết nối | TCP/IP, RS-485, Cloud sync |
| Chứng nhận | CE, FCC, IP55 |

## Thương hiệu đối tác

IDTECK, HikVision, ZKTeco, NICE.',
 'car',
 '[{"icon":"camera","title":"LPR - Nhận diện biển số","description":"Camera AI nhận diện biển số chính xác > 99%, hoạt động ngày/đêm, mưa/nắng."},{"icon":"credit-card","title":"Thanh toán tự động","description":"Tích hợp VNPAY, MoMo, ZaloPay — thanh toán không tiền mặt qua QR code."},{"icon":"bar-chart-3","title":"Dashboard doanh thu","description":"Báo cáo doanh thu real-time, thống kê lượt xe ra vào, doanh thu theo ca."},{"icon":"zap","title":"Barrier tự động","description":"Thời gian mở < 1.5 giây, chống va chạm bằng cảm biến hồng ngoại."},{"icon":"ticket","title":"Vé tháng/vé lượt","description":"Quản lý vé tháng cư dân, vé lượt khách vãng lai, ưu tiên VIP."},{"icon":"smartphone","title":"App cư dân","description":"Kiểm tra slot trống, thanh toán vé tháng, mở barrier qua app di động."}]',
 '["Tòa nhà văn phòng","Trung tâm thương mại","Chung cư cao tầng","Bệnh viện","Sân bay","Khu du lịch"]',
 NULL, 4, 1,
 'Hệ thống CAR PARKING thông minh | Song Linh Technologies',
 'Quản lý bãi giữ xe thông minh tích hợp LPR, barrier tự động, thanh toán VNPAY/MoMo và báo cáo doanh thu.'),

-- 5. VMS
('he-thong-phan-mem-quan-ly-trung-tam',
 'Phần mềm quản lý trung tâm',
 'Phần mềm quản lý trung tâm (Central Management Software / VMS) tích hợp giám sát toàn bộ hệ thống: CCTV, Access Control, Fire Alarm, Parking, BMS trên một nền tảng thống nhất.',
 'Giám sát & điều hành tập trung — Dashboard real-time, tích hợp toàn bộ hệ thống ELV',
 '## Kiến trúc hệ thống

Các subsystem (CCTV, AC, FA, Parking) → API Gateway → Central Server → Web Dashboard / Mobile App. Hỗ trợ failover server và database replication.

**Tích hợp:** CCTV/VMS, Access Control, Fire Alarm, Parking, BMS, Elevator.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Camera support | Lên đến 10,000 channels |
| Devices | Unlimited endpoints |
| Storage | SAN/NAS, 30-90 ngày |
| Client | Web / Desktop / Mobile (iOS + Android) |
| Database | SQL Server / PostgreSQL |
| Protocol | ONVIF, RTSP, OSDP, Modbus, BACnet |
| API | RESTful, WebSocket, MQTT |
| Chứng nhận | ISO 27001, SOC 2 |

## Thương hiệu đối tác

HikCentral, Milestone, Genetec, C-CURE 9000.',
 'layout-dashboard',
 '[{"icon":"layout-dashboard","title":"Unified Dashboard","description":"Tổng hợp camera, access control, alarm, parking trên 1 màn hình duy nhất."},{"icon":"map","title":"E-Map Interactive","description":"Bản đồ tương tác hiển thị vị trí thiết bị, trạng thái real-time, zoom multi-level."},{"icon":"bell","title":"Event Management","description":"Quản lý sự kiện tập trung, phân loại ưu tiên, SOP xử lý từng loại alarm."},{"icon":"users","title":"Multi-User Multi-Site","description":"Phân quyền người dùng chi tiết, quản lý nhiều site từ trung tâm."},{"icon":"file-text","title":"Report Automation","description":"Tự động tạo báo cáo theo lịch, export PDF/Excel, gửi email tự động."},{"icon":"code","title":"Open API","description":"REST API cho tích hợp với hệ thống ERP, CRM, BMS bên thứ ba."}]',
 '["Trung tâm điều hành (Control Room)","Tòa nhà thương mại","Khu công nghiệp","Bệnh viện","Trường đại học","Chuỗi cửa hàng bán lẻ"]',
 NULL, 5, 1,
 'Phần mềm quản lý trung tâm (VMS) | Song Linh Technologies',
 'VMS tích hợp giám sát CCTV, Access Control, Fire Alarm, Parking, BMS trên một dashboard thống nhất.'),

-- 6. Parking Guidance
('he-thong-chi-dan-bai-dau-xe',
 'Hệ thống chỉ dẫn bãi đậu xe',
 'Hệ thống chỉ dẫn bãi đậu xe (Parking Guidance System) giúp tối ưu hóa quản lý và trải nghiệm người dùng bằng cảm biến slot, biển LED chỉ dẫn và app tìm xe.',
 'Tối ưu trải nghiệm đậu xe — Cảm biến slot, biển LED, app tìm xe tự động',
 '## Kiến trúc hệ thống

Cảm biến slot → Node Controller → Server trung tâm → Biển LED + App. Mỗi controller quản lý 40-60 slot, kết nối qua RS-485 / TCP/IP.

**Tích hợp:** Car Parking, CCTV, BMS, Mobile App.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Loại cảm biến | Ultrasonic / Camera-based |
| Số slot/controller | 40-60 slots |
| Biển LED | 7-segment, P10 matrix |
| Đèn trạng thái | LED RGB (đỏ/xanh/vàng) |
| App tìm xe | iOS / Android / Kiosk |
| Kết nối | RS-485 / TCP/IP |
| Nguồn | DC 12V/24V, PoE optional |
| Chứng nhận | CE, FCC, IP44 |

## Thương hiệu đối tác

KEYTOP, Quercus, PARKSOL, Hikvision.',
 'navigation',
 '[{"icon":"radar","title":"Cảm biến Ultrasonic","description":"Phát hiện slot trống/đầy bằng cảm biến siêu âm, độ chính xác > 99%."},{"icon":"signpost","title":"Biển LED chỉ dẫn","description":"Biển LED hiển thị số slot trống theo tầng/khu vực, dẫn hướng tự động."},{"icon":"search","title":"Tìm xe thông minh","description":"App di động hoặc kiosk giúp tìm vị trí xe chỉ bằng biển số."},{"icon":"bar-chart-3","title":"Phân tích occupancy","description":"Thống kê mật độ sử dụng theo giờ/ngày, tối ưu dòng xe lưu thông."},{"icon":"lightbulb","title":"LED đèn trạng thái","description":"Đèn LED đỏ/xanh trên mỗi slot, dễ nhận biết từ xa."},{"icon":"globe","title":"Cloud Dashboard","description":"Dashboard quản lý từ xa qua web, theo dõi real-time mọi tầng hầm."}]',
 '["Tòa nhà văn phòng","Trung tâm thương mại","Bệnh viện","Sân bay","Khách sạn","Khu đô thị"]',
 NULL, 6, 1,
 'Hệ thống chỉ dẫn bãi đậu xe | Song Linh Technologies',
 'Hệ thống Parking Guidance với cảm biến slot, biển LED chỉ dẫn và app tìm xe thông minh.'),

-- 7. Turnstile
('he-thong-phan-lan-tu-dong',
 'Hệ thống phân làn tự động Turnstile',
 'Hệ thống cổng phân làn tự động (Turnstile) kiểm soát dòng người ra vào hiệu quả cho tòa nhà văn phòng, nhà máy, trung tâm thương mại. Tích hợp thẻ từ, vân tay, Face ID.',
 'Kiểm soát dòng người chuyên nghiệp — Speed Gate, Tripod, Flap Barrier tích hợp AI',
 '## Kiến trúc hệ thống

Reader → Controller → Turnstile Motor → Phần mềm quản lý. Kết nối với hệ thống Access Control, CCTV và Fire Alarm qua relay/IP.

**Tích hợp:** Access Control, CCTV, Fire Alarm, Face ID, Visitor Management.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Loại cổng | Speed Gate / Flap / Tripod / Full Height |
| Thông lượng | 25-40 người/phút |
| Tốc độ | < 0.5 giây mở/đóng |
| Chiều rộng làn | 550mm (standard) / 900mm (ADA) |
| Cảm biến | IR đa tia anti-tailgating |
| Vật liệu | SUS 304/316 Stainless Steel |
| Kết nối | Wiegand / RS-485 / TCP/IP |
| Chứng nhận | CE, FCC, IP54 |

## Thương hiệu đối tác

ZKTeco, Gunnebo, Dormakaba, IDTECK.',
 'door-open',
 '[{"icon":"zap","title":"Speed Gate","description":"Cửa kính trượt mở/đóng trong < 0.5 giây, thông lượng 30 người/phút."},{"icon":"shield","title":"Anti-Tailgating","description":"Phát hiện tailgating bằng cảm biến hồng ngoại đa tia, chống đi kèm."},{"icon":"fingerprint","title":"Multi-Auth Integration","description":"Tích hợp thẻ từ, vân tay, Face ID — xác thực đa yếu tố."},{"icon":"accessibility","title":"ADA Compliant","description":"Làn rộng cho xe lăn, cáng y tế, hàng hóa — tuân thủ tiêu chuẩn ADA."},{"icon":"flame","title":"Fire Alarm Link","description":"Tự động mở khi báo cháy, đảm bảo thoát hiểm nhanh chóng."},{"icon":"users","title":"People Counter","description":"Đếm người ra vào real-time, thống kê lưu lượng theo giờ/ngày."}]',
 '["Tòa nhà văn phòng","Nhà máy","Trung tâm thương mại","Ga metro","Sân vận động","Khu vui chơi giải trí"]',
 NULL, 7, 1,
 'Hệ thống phân làn tự động Turnstile | Song Linh Technologies',
 'Cổng Turnstile kiểm soát dòng người: Speed Gate, Flap Barrier tích hợp thẻ từ, vân tay, Face ID.'),

-- 8. Video Wall
('he-thong-man-hinh-ghep',
 'Hệ thống màn hình ghép Video Wall',
 'Hệ thống màn hình ghép (Video Wall) hiển thị nội dung chuyên nghiệp cho phòng điều hành, trung tâm giám sát, lobby tòa nhà. Công nghệ LCD/LED bezel siêu mỏng, hỗ trợ 4K/8K.',
 'Hiển thị chuyên nghiệp quy mô lớn — LCD/LED Video Wall, bezel siêu mỏng 0.88mm',
 '## Kiến trúc hệ thống

Nguồn video (CCTV/PC/Media Player) → Video Wall Processor → Display Matrix (LCD/LED). Controller hỗ trợ input HDMI/DVI/DP, output custom layout.

**Tích hợp:** CCTV/VMS, BMS Dashboard, Digital Signage, Presentation System.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Công nghệ | LCD IPS / Direct-view LED |
| Kích thước panel | 46" / 49" / 55" |
| Bezel | 0.88mm – 3.5mm |
| Độ sáng | 500-700 nit (LCD) / 1000+ nit (LED) |
| Độ phân giải | 1920×1080 per panel, 4K/8K tổng |
| Tuổi thọ | > 60,000 giờ |
| Controller | HDMI/DVI/DP, up to 128 outputs |
| Chứng nhận | CE, FCC, EnergyStar |

## Thương hiệu đối tác

Samsung, LG, Hikvision, Dahua.',
 'monitor',
 '[{"icon":"maximize","title":"Bezel siêu mỏng","description":"Viền ghép 0.88mm cho hình ảnh liền mạch, trải nghiệm immersive."},{"icon":"monitor","title":"4K/8K Resolution","description":"Độ phân giải 4K/8K tùy cấu hình, chất lượng hình ảnh sắc nét."},{"icon":"layout-grid","title":"Multi-Source Display","description":"Hiển thị đa nguồn: CCTV, Dashboard, Presentation, Digital Signage cùng lúc."},{"icon":"cpu","title":"Video Wall Controller","description":"Controller chuyên dụng hỗ trợ tách/ghép màn hình linh hoạt, PIP/POP."},{"icon":"clock","title":"24/7 Operation","description":"Thiết kế cho hoạt động liên tục 24/7, tuổi thọ > 60,000 giờ."},{"icon":"palette","title":"Auto Calibration","description":"Tự động hiệu chỉnh màu sắc giữa các tấm, đảm bảo đồng nhất."}]',
 '["Phòng điều hành (Control Room)","Trung tâm giám sát","Lobby tòa nhà","Phòng họp","Showroom","Sân bay, ga tàu"]',
 NULL, 8, 1,
 'Hệ thống màn hình ghép Video Wall | Song Linh Technologies',
 'Video Wall LCD/LED bezel siêu mỏng 0.88mm cho phòng điều hành, trung tâm giám sát. Hỗ trợ 4K/8K.'),

-- 9. Video Intercom
('he-thong-video-intercom',
 'Hệ thống Video Intercom',
 'Hệ thống Video Intercom (chuông cửa hình) cho tòa nhà, chung cư, biệt thự. Hỗ trợ video call HD, mở cửa/cổng từ xa, tích hợp app mobile và hệ thống an ninh.',
 'Liên lạc nội bộ thông minh — Video call HD, mở cửa từ xa, tích hợp smartphone',
 '## Kiến trúc hệ thống

Outdoor Station → Switch PoE → Indoor Monitor (mỗi căn hộ) → Lobby Station (lễ tân). Kết nối SIP/IP, hỗ trợ cloud relay cho remote access.

**Tích hợp:** Access Control, CCTV, Elevator, Smart Home, SIP PBX.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Camera | 2MP Wide Angle 170° |
| Màn hình | 7" / 10" IPS Touch |
| Audio | Full-duplex, noise cancellation |
| Kết nối | 2-wire / Cat5e / WiFi / SIP |
| Số căn hộ | Lên đến 9,999 căn |
| Nguồn | PoE / DC 12V |
| Vật liệu outdoor | Nhôm đúc, IP65, IK07 |
| Chứng nhận | CE, FCC, SIP RFC 3261 |

## Thương hiệu đối tác

Hikvision, Dahua, Aiphone, Commax.',
 'phone',
 '[{"icon":"video","title":"Video Call HD","description":"Hình ảnh Full HD 1080p, góc rộng 170°, night vision có LED hồng ngoại."},{"icon":"lock","title":"Mở cửa từ xa","description":"Mở khóa điện từ, barrier, cổng tự động qua màn hình indoor hoặc app."},{"icon":"smartphone","title":"App Integration","description":"Nhận cuộc gọi intercom trên smartphone (iOS/Android), mở cửa từ mọi nơi."},{"icon":"building-2","title":"Multi-Tenant","description":"Hỗ trợ nhiều căn hộ/phòng, lobby station, quản lý trung tâm cho chung cư."},{"icon":"siren","title":"SOS Emergency","description":"Nút SOS khẩn cấp, gọi bảo vệ/quản lý tự động khi có sự cố."},{"icon":"key","title":"Access Integration","description":"Tích hợp thẻ từ Mifare, mã PIN, nhận diện khuôn mặt tại outdoor station."}]',
 '["Chung cư cao tầng","Biệt thự, villa","Tòa nhà văn phòng","Khách sạn","Bệnh viện","Trường học"]',
 NULL, 9, 1,
 'Hệ thống Video Intercom | Song Linh Technologies',
 'Video Intercom cho chung cư, biệt thự: Video call HD, mở cửa từ xa, tích hợp smartphone.'),

-- 10. UPS
('he-thong-luu-dien',
 'Hệ thống lưu điện UPS',
 'Hệ thống UPS (Uninterruptible Power Supply) bảo vệ nguồn cho hạ tầng CNTT, hệ thống camera, phòng server, data center. Đảm bảo uptime 99.99% với công nghệ Online Double Conversion.',
 'Bảo vệ nguồn điện liên tục — Online Double Conversion, thời gian chuyển mạch 0ms',
 '## Kiến trúc hệ thống

Nguồn lưới → ATS/STS → UPS Online → PDU → Tải. Ắc quy VRLA/Li-ion được giám sát bởi BMS tích hợp, cảnh báo sớm khi dung lượng suy giảm.

**Tích hợp:** BMS, Generator, PDU, SNMP/NMS, Fire Alarm.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Topology | Online Double Conversion (VFI) |
| Công suất | 1kVA – 800kVA |
| Chuyển mạch | 0ms |
| Hiệu suất | 93-96% (Normal) / 99% (ECO) |
| Ắc quy | VRLA / Lithium-Ion |
| Runtime | 30 phút – 8 giờ (mở rộng) |
| Giám sát | SNMP / Modbus / Dry Contact |
| Chứng nhận | CE, UL, IEC 62040-3 |

## Thương hiệu đối tác

APC (Schneider), Vertiv (Emerson), Eaton, CyberPower.',
 'zap',
 '[{"icon":"zap","title":"Online Double Conversion","description":"Chuyển mạch 0ms, nguồn sạch sin wave thuần, bảo vệ tuyệt đối cho thiết bị nhạy cảm."},{"icon":"battery-charging","title":"Extended Runtime","description":"Bank ắc quy mở rộng, duy trì hoạt động từ 30 phút đến 8 giờ tùy cấu hình."},{"icon":"refresh-cw","title":"Hot-Swap Batteries","description":"Thay ắc quy không tắt máy, không gián đoạn hoạt động (hot-swappable)."},{"icon":"wifi","title":"SNMP Monitoring","description":"Giám sát từ xa qua SNMP card, tích hợp NMS và BMS, cảnh báo email/SMS."},{"icon":"layers","title":"Parallel Redundancy","description":"Kết nối song song N+1 cho capacity và redundancy, tự động load sharing."},{"icon":"leaf","title":"Eco Mode","description":"Chế độ ECO tiết kiệm năng lượng, hiệu suất lên đến 99% khi lưới điện ổn định."}]',
 '["Data Center","Phòng server","Hệ thống camera/an ninh","Bệnh viện","Ngân hàng","Nhà máy sản xuất"]',
 NULL, 10, 1,
 'Hệ thống lưu điện UPS | Song Linh Technologies',
 'UPS Online Double Conversion bảo vệ nguồn cho Data Center, phòng server. Chuyển mạch 0ms, uptime 99.99%.'),

-- 11. Data Center
('giai-phap-ha-tang-mang-data-center',
 'Giải pháp hạ tầng mạng Data Center',
 'Giải pháp thiết kế và thi công hạ tầng Data Center toàn diện: hệ thống cáp có cấu trúc (Structured Cabling), Server Rack, Network Switch/Router, và UPS/Power Distribution.',
 'Hạ tầng Tier 3+ — Structured Cabling, Server Rack, Network, Power cho Data Center chuyên nghiệp',
 '## Kiến trúc hệ thống

Spine-Leaf network topology → ATS/UPS → PDU → Server Racks → Structured Cabling (MDA/HDA/ZD). Thiết kế theo TIA-942 Rated-3, hỗ trợ concurrent maintainability.

**Tích hợp:** UPS/Power, HVAC/Cooling, BMS, Fire Suppression, Access Control, CCTV.

## Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Cáp đồng | Cat.6A F/UTP / Cat.8 |
| Cáp quang | OM4 (multimode) / OS2 (singlemode) |
| Rack | 42U/47U, 600×1070mm |
| UPS | Online 10-800kVA, N+1 redundancy |
| Cooling | InRow / Perimeter, PUE < 1.5 |
| Tier Level | Rated-3 (99.982% uptime) |
| Fire Suppression | FM-200 / Novec 1230 (Clean Agent) |
| Chứng nhận | TIA-942, Uptime Institute, ISO 27001 |

## Thương hiệu đối tác

Cisco, Legrand, APC (Schneider), Panduit, CommScope.',
 'server',
 '[{"icon":"cable","title":"Structured Cabling","description":"Hệ thống cáp copper Cat.6A/Cat.8 và fiber OM4/OS2 theo chuẩn TIA-942."},{"icon":"server","title":"Server & Storage","description":"Lắp đặt rack server, NAS/SAN, hệ thống backup tự động."},{"icon":"network","title":"Core Networking","description":"Switch/Router enterprise: Cisco, Aruba, Juniper — redundant fabric."},{"icon":"thermometer","title":"Cooling System","description":"Hệ thống làm mát precision cooling, hot/cold aisle containment."},{"icon":"shield","title":"Physical Security","description":"Kiểm soát ra vào, CCTV, hệ thống chữa cháy FM-200/Novec 1230."},{"icon":"monitor","title":"DCIM Monitoring","description":"Data Center Infrastructure Management — giám sát power, cooling, capacity."}]',
 '["Data Center doanh nghiệp","Colocation facility","Phòng server","Trung tâm dữ liệu tài chính","Cơ quan chính phủ","Viễn thông"]',
 NULL, 11, 1,
 'Giải pháp hạ tầng mạng Data Center | Song Linh Technologies',
 'Thiết kế và thi công Data Center Tier 3+: Structured Cabling, Server Rack, Network, UPS theo TIA-942.');
