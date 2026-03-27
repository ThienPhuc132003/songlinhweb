-- Migration: 0007 — Rewrite content_md with structured Markdown
-- Fix text-wall issue: add proper headings, paragraphs, bullet lists

-- ═══════════════════════════════════════════════
-- SOLUTIONS: Structured content_md
-- ═══════════════════════════════════════════════

UPDATE solutions SET content_md = '## Tổng quan

Trong bối cảnh các tòa nhà cao tầng, văn phòng, chung cư ngày càng mở rộng quy mô, nhu cầu đảm bảo an ninh – an toàn cũng trở nên cấp thiết hơn. Giải pháp Camera CCTV tích hợp AI mang đến khả năng giám sát tự động, cảnh báo thông minh và quản lý tập trung, giúp đơn vị vận hành tiết kiệm nhân lực, nâng cao hiệu quả quản lý.

## Tính năng nổi bật

- **AcuSense AI**: Tự động phân biệt người/xe, giảm 90% cảnh báo sai
- **Deep Learning**: Nhận diện khuôn mặt (Face Recognition), phát hiện xâm nhập
- **Smart Tracking**: Camera PTZ tự động bám đối tượng di chuyển
- **H.265+ Compression**: Tiết kiệm bandwidth và dung lượng lưu trữ đến 80%
- **120dB True WDR**: Hình ảnh rõ nét trong mọi điều kiện ánh sáng

## Ứng dụng

- Tòa nhà văn phòng, trung tâm thương mại
- Khu công nghiệp, nhà xưởng sản xuất
- Bệnh viện, trường học, khu dân cư
- Ngân hàng, cơ quan chính phủ

## Thiết bị sử dụng

- **Camera IP Dome**: Hikvision DS-2CD2143G2-I (4MP AcuSense)
- **Camera PTZ**: Hikvision DS-2DE4425IW-DE (25x Zoom DarkFighter)
- **Đầu ghi NVR**: Hikvision DS-7732NI-K4 (32 kênh 4K)
- **Phần mềm**: HikCentral Professional VMS'
WHERE slug = 'he-thong-cctv-camera-quan-sat';

UPDATE solutions SET content_md = '## Tổng quan

Hệ thống Phòng cháy Chữa cháy (PCCC) là yêu cầu bắt buộc theo quy định pháp luật đối với mọi công trình xây dựng. Song Linh Technologies tư vấn, thiết kế và thi công hệ thống PCCC toàn diện theo tiêu chuẩn TCVN và quốc tế, đảm bảo an toàn tối đa cho người và tài sản.

## Tính năng nổi bật

- **Báo cháy địa chỉ (Addressable)**: Xác định chính xác vị trí đầu báo kích hoạt
- **Giao thức CLIP/SLC**: Tương thích hệ thống Honeywell Notifier
- **Chữa cháy tự động**: Sprinkler, khí FM-200, khí Novec 1230
- **Giám sát 24/7**: Trung tâm điều khiển với LCD 80 ký tự

## Ứng dụng

- Tòa nhà cao tầng, trung tâm thương mại
- Nhà máy sản xuất, kho hàng
- Bệnh viện, khách sạn
- Data Center, phòng server

## Tiêu chuẩn áp dụng

- TCVN 5738:2021 — Hệ thống báo cháy tự động
- NFPA 72 — National Fire Alarm Code
- EN 54 — Hệ thống phát hiện và báo cháy
- UL 864 / FM Approved'
WHERE slug = 'he-thong-bao-chay-chua-chay';

UPDATE solutions SET content_md = '## Tổng quan

Hệ thống Âm thanh Thông báo (PA - Public Address) đóng vai trò quan trọng trong việc truyền tải thông tin, phát nhạc nền và đặc biệt là phát thanh khẩn cấp khi có sự cố cháy nổ. Song Linh Technologies thiết kế và thi công hệ thống PA chuyên nghiệp, tích hợp với hệ thống PCCC.

## Tính năng nổi bật

- **Tích hợp PCCC**: Tự động chuyển sang chế độ thông báo khẩn cấp khi báo cháy
- **Phân vùng linh hoạt**: Phát thông báo riêng cho từng khu vực/tầng
- **Chất lượng âm thanh**: Loa ceiling, loa horn, loa wall-mount chuyên dụng
- **Giám sát loa**: Phát hiện lỗi dây loa, loa hỏng tự động

## Ứng dụng

- Tòa nhà văn phòng, TTTM
- Nhà máy, khu công nghiệp
- Trường học, bệnh viện
- Nhà ga, sân bay

## Thiết bị sử dụng

- **Mixer Amplifier**: TOA A-1724 (240W, 5 inputs)
- **Loa trần**: TOA PC-2360 (6W, chống cháy UL)
- **Loa horn**: TOA SC-630M (30W, ngoài trời)
- **Remote Microphone**: TOA RM-200M'
WHERE slug = 'he-thong-am-thanh-thong-bao';

UPDATE solutions SET content_md = '## Tổng quan

Hạ tầng mạng LAN/WAN là xương sống của mọi hệ thống IT hiện đại. Song Linh Technologies thiết kế và triển khai giải pháp mạng doanh nghiệp với hiệu suất cao, bảo mật tốt và khả năng mở rộng linh hoạt, đáp ứng nhu cầu hoạt động 24/7.

## Tính năng nổi bật

- **Structured Cabling**: Hệ thống cáp có cấu trúc theo chuẩn TIA/EIA-568
- **PoE++ Support**: Cấp nguồn qua cáp mạng cho camera, AP, IP Phone
- **SD-Access/SD-WAN**: Quản lý tập trung, tự động hóa mạng
- **WiFi 6/6E**: Tốc độ cao, nhiều kết nối đồng thời

## Ứng dụng

- Văn phòng doanh nghiệp
- Tòa nhà thương mại
- Khu công nghiệp, nhà máy
- Trường học, bệnh viện

## Thiết bị sử dụng

- **Switch**: Cisco Catalyst 9200L-24P-4G (24 port PoE+)
- **Router**: Cisco ISR 1111-8P (SD-WAN)
- **Access Point**: Cisco/Aruba WiFi 6
- **Cáp mạng**: LS Cable Cat.6A FTP'
WHERE slug = 'he-thong-mang-lan-wan';

UPDATE solutions SET content_md = '## Tổng quan

Hệ thống Điện nhẹ (ELV - Extra Low Voltage) bao gồm tất cả các hệ thống kỹ thuật sử dụng điện áp thấp trong tòa nhà: intercom, truyền hình cáp, BMS, điều khiển chiếu sáng, và nhiều hệ thống khác. Song Linh Technologies cung cấp giải pháp ELV tổng thể, tích hợp đồng bộ.

## Tính năng nổi bật

- **Tích hợp BMS**: Quản lý tập trung tất cả hệ thống ELV
- **Intercom/Video Door Phone**: Liên lạc nội bộ tòa nhà
- **Hệ thống thang máy**: Kiểm soát truy cập thang máy theo tầng
- **Điều khiển chiếu sáng**: Tự động sáng/tắt theo lịch, cảm biến

## Ứng dụng

- Tòa nhà phức hợp
- Chung cư cao cấp
- Khách sạn, resort
- Bệnh viện, trường học

## Thiết bị sử dụng

- **Switch module**: Legrand Mosaic
- **Ổ cắm**: Legrand 077213 (16A modular)
- **BMS Controller**: Honeywell/Schneider
- **Intercom**: Aiphone/Commax'
WHERE slug = 'he-thong-dien-nhe';

UPDATE solutions SET content_md = '## Tổng quan

Tổng đài điện thoại IP-PBX là giải pháp truyền thông nội bộ và kết nối tổng đài hiện đại cho doanh nghiệp. Thay thế tổng đài analog truyền thống, IP-PBX mang đến nhiều tính năng vượt trội: hội nghị, ghi âm, IVR, tích hợp CRM.

## Tính năng nổi bật

- **IVR đa cấp**: Hệ thống trả lời tự động, định tuyến cuộc gọi
- **Ghi âm cuộc gọi**: Lưu trữ và playback phục vụ đào tạo, giám sát
- **Conference**: Hội nghị điện thoại lên đến 75 người
- **WebRTC**: Gọi trực tiếp từ trình duyệt web

## Ứng dụng

- Văn phòng doanh nghiệp
- Khách sạn, resort
- Bệnh viện, phòng khám
- Tổng đài chăm sóc khách hàng

## Thiết bị sử dụng

- **IP PBX**: Grandstream UCM6304 (1500 users)
- **IP Phone**: Grandstream GRP2614 (màn hình LCD)
- **Gateway**: Grandstream GXW4216 (16 FXS)
- **Headset**: Jabra Evolve2'
WHERE slug = 'tong-dai-dien-thoai';

UPDATE solutions SET content_md = '## Tổng quan

Hệ thống Kiểm soát Ra vào (Access Control) quản lý quyền truy cập vào các khu vực trong tòa nhà bằng thẻ từ, vân tay, nhận diện khuôn mặt hoặc mã PIN. Kết hợp với chấm công để quản lý nhân sự hiệu quả.

## Tính năng nổi bật

- **Nhận diện khuôn mặt**: Xác thực không chạm, tốc độ < 0.5 giây
- **Đo nhiệt độ**: Tích hợp cảm biến nhiệt (±0.3°C)
- **Anti-Passback**: Chống gian lận ra vào
- **Quản lý thang máy**: Kiểm soát quyền truy cập theo tầng

## Ứng dụng

- Văn phòng doanh nghiệp
- Nhà máy sản xuất
- Tòa nhà chung cư
- Data Center

## Thiết bị sử dụng

- **Controller**: ZKTeco InBio 260 (2 cửa)
- **Terminal**: ZKTeco SpeedFace-V5L[TD] (Face + Nhiệt)
- **Reader**: ZKTeco KR600 (Mifare)
- **Phần mềm**: ZKBioSecurity'
WHERE slug = 'he-thong-kiem-soat-ra-vao';

-- ═══════════════════════════════════════════════
-- PROJECTS: Structured content_md (update existing)
-- ═══════════════════════════════════════════════

-- HDBank Data Center (primary project)
UPDATE projects SET content_md = '## Tổng quan dự án

Trung tâm Dữ liệu HDBANK đặt tại Khu Công Nghệ Cao, Quận 9, TP Thủ Đức là dự án hạ tầng IT quy mô lớn phục vụ vận hành ngân hàng số. Song Linh Technologies được chọn là đơn vị thi công hệ thống Server, Network và hạ tầng Cabling.

## Thách thức

- Tiêu chuẩn Tier 3 yêu cầu uptime 99.982%
- Hệ thống 50 Rack Server cần redundancy hoàn toàn
- Hơn 5,000 node data copper và fiber theo tiêu chuẩn có cấu trúc
- Tích hợp hệ thống camera giám sát an ninh Axis

## Giải pháp triển khai

- **Server & Storage**: 50 Rack Server với hệ thống RAID đủ chuẩn
- **Network**: Cabling & Accessories Legrand, copper và fiber
- **CCTV**: Hệ thống camera giám sát an ninh Axis
- **Nguồn điện**: UPS redundant N+1

## Thông số kỹ thuật

| Hạng mục | Thông số |
|----------|----------|
| Rack Server | 50 racks |
| Data nodes | 5,000+ copper & fiber |
| Tiêu chuẩn | Tier 3 |
| Camera | Axis CCTV system |
| Cabling | Legrand structured cabling |'
WHERE slug LIKE '%hdbank%' OR slug LIKE '%trung-tam-du-lieu%';
