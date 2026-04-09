-- Migration: 0006 — Seed B2B ELV Products
-- Professional product data for SLTECH B2B catalog

-- ═══════════════════════════════════════════════
-- CCTV / Camera (Category ID: look up from product_categories)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'camera-giam-sat' LIMIT 1),
  'hikvision-ds-2cd2143g2-i',
  'Camera IP Dome 4MP AcuSense',
  'Camera dome hồng ngoại 4MP với công nghệ AcuSense phân biệt người/xe, hỗ trợ H.265+ tiết kiệm bandwidth lên đến 80%. Phù hợp lắp đặt trong nhà cho văn phòng, ngân hàng, bệnh viện.',
  'Hikvision',
  'DS-2CD2143G2-I',
  NULL,
  '{"Độ phân giải":"4MP (2560×1440)","Ống kính":"2.8mm cố định","Hồng ngoại":"30m EXIR 2.0","Nén video":"H.265+/H.264+","WDR":"120dB True WDR","Khe thẻ nhớ":"MicroSD lên đến 256GB","Nguồn":"PoE (802.3af) / 12VDC","Chuẩn chống nước":"IP67"}',
  '["AcuSense AI","PoE","H.265+","IP67","120dB WDR","ONVIF"]',
  1
),
(
  (SELECT id FROM product_categories WHERE slug = 'camera-giam-sat' LIMIT 1),
  'hikvision-ds-2de4425iw-de',
  'Camera PTZ 4MP 25x Zoom DarkFighter',
  'Camera Speed Dome PTZ 4MP với zoom quang 25x và công nghệ DarkFighter cho hình ảnh màu trong điều kiện ánh sáng cực thấp (0.005 Lux). Phù hợp giám sát ngoài trời khu công nghiệp, bãi đỗ xe.',
  'Hikvision',
  'DS-2DE4425IW-DE(T5)',
  NULL,
  '{"Độ phân giải":"4MP (2560×1440)","Zoom quang":"25x","Hồng ngoại":"100m","DarkFighter":"0.005 Lux màu","Pan/Tilt":"360°/90°","Tốc độ quay":"240°/s","Nguồn":"PoE++ (Hi-PoE) / 24VAC","Chuẩn chống nước":"IP66, IK10"}',
  '["DarkFighter","PTZ 25x Zoom","Smart Tracking","PoE++","IP66","IK10"]',
  2
),
(
  (SELECT id FROM product_categories WHERE slug = 'camera-giam-sat' LIMIT 1),
  'hikvision-ds-7732ni-k4',
  'Đầu ghi hình NVR 32 kênh 4K',
  'Đầu ghi hình mạng 32 kênh hỗ trợ camera lên đến 8MP (4K). 4 khe ổ cứng SATA, băng thông 256Mbps. Phù hợp hệ thống giám sát quy mô lớn cho tòa nhà, khu công nghiệp.',
  'Hikvision',
  'DS-7732NI-K4',
  NULL,
  '{"Số kênh":"32 kênh IP","Độ phân giải tối đa":"8MP (4K)","Ổ cứng":"4x SATA (lên đến 40TB)","Băng thông":"256Mbps","Ngõ ra video":"2x HDMI (4K), 1x VGA","Hỗ trợ RAID":"Không","Nguồn":"100-240VAC"}',
  '["4K Ultra HD","32 kênh","4 HDD SATA","H.265+","ANR","ONVIF"]',
  3
);

-- ═══════════════════════════════════════════════
-- HỆ THỐNG BÁO CHÁY (Fire Alarm)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'bao-chay' LIMIT 1),
  'honeywell-tc810m1109',
  'Đầu báo khói quang Addressable',
  'Đầu báo khói quang địa chỉ với cảm biến photoelectric độ nhạy cao. Giao tiếp qua giao thức CLIP, tương thích trung tâm báo cháy Honeywell Notifier series. Đạt tiêu chuẩn EN 54-7.',
  'Honeywell',
  'TC810M1109',
  NULL,
  '{"Loại":"Đầu báo khói quang (Photoelectric)","Giao thức":"CLIP Addressable","Điện áp":"15-32VDC","Dòng tiêu thụ":"0.3mA standby","Nhiệt độ hoạt động":"-10°C đến 55°C","Kích thước":"Ø102 x 48mm","Tiêu chuẩn":"EN 54-7, UL 268"}',
  '["Addressable","EN 54-7","UL Listed","CLIP Protocol","LED 360°"]',
  1
),
(
  (SELECT id FROM product_categories WHERE slug = 'bao-chay' LIMIT 1),
  'honeywell-nfs2-3030',
  'Trung tâm báo cháy Notifier 1-3 Loop',
  'Trung tâm báo cháy địa chỉ Notifier NFS2-3030, hỗ trợ 1-3 loop SLC với tối đa 318 thiết bị/loop. Màn hình LCD 80 ký tự. Đạt tiêu chuẩn UL/FM. Phù hợp tòa nhà thương mại, bệnh viện, khách sạn.',
  'Honeywell',
  'NFS2-3030',
  NULL,
  '{"Số loop":"1-3 SLC loops","Thiết bị/loop":"318 (159 đầu báo + 159 module)","Vùng chỉ thị":"Lên đến 99 zones","Màn hình":"LCD 80 ký tự","Nguồn":"120/240VAC, 50/60Hz","Pin dự phòng":"2x 12V 18Ah","Tiêu chuẩn":"UL 864, FM"}',
  '["NFPA 72","UL Listed","FM Approved","3 SLC Loops","Network capable","ACS Annunciator"]',
  2
);

-- ═══════════════════════════════════════════════
-- KIỂM SOÁT RA VÀO (Access Control)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'kiem-soat-ra-vao' LIMIT 1),
  'zkteco-inbio-260',
  'Bộ điều khiển Access Control 2 cửa',
  'Bộ điều khiển kiểm soát cửa ra vào 2 cửa InBio 260, hỗ trợ vân tay + thẻ từ. Lưu trữ 20,000 khuôn vân tay và 60,000 thẻ. Kết nối TCP/IP, RS485. Tương thích phần mềm ZKBioSecurity.',
  'ZKTeco',
  'InBio 260',
  NULL,
  '{"Số cửa":"2 cửa (mở rộng 4 reader)","Vân tay":"20,000 templates","Thẻ":"60,000 thẻ","Sự kiện":"100,000 logs","Giao tiếp":"TCP/IP, RS485","Đầu đọc":"Wiegand 26/34","Nguồn":"12VDC 3A","Kích thước":"280×220×36mm"}',
  '["Vân tay + Thẻ","TCP/IP","Anti-Passback","Đa cửa","ZKBioSecurity","Wiegand"]',
  1
),
(
  (SELECT id FROM product_categories WHERE slug = 'kiem-soat-ra-vao' LIMIT 1),
  'zkteco-speedface-v5l-td',
  'Máy chấm công nhận diện khuôn mặt + Đo nhiệt',
  'Máy chấm công kết hợp nhận diện khuôn mặt không chạm và đo nhiệt độ cơ thể. Màn hình 5" cảm ứng, dung lượng 6,000 khuôn mặt. Phù hợp văn phòng, nhà máy, trường học.',
  'ZKTeco',
  'SpeedFace-V5L[TD]',
  NULL,
  '{"Nhận diện":"Khuôn mặt (6,000) + Thẻ","Đo nhiệt":"Có (±0.3°C)","Khoảng cách":"0.3-2m","Tốc độ":"<0.5s","Màn hình":"5\" IPS cảm ứng","Giao tiếp":"TCP/IP, USB, WiFi","Nguồn":"12VDC 2A","Kích thước":"124×259×32mm"}',
  '["Nhận diện khuôn mặt","Đo nhiệt độ","Không chạm","WiFi","5\" Touch","Mask Detection"]',
  2
);

-- ═══════════════════════════════════════════════
-- HẠ TẦNG MẠNG (Networking)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'ha-tang-mang' LIMIT 1),
  'cisco-c9200l-24p-4g',
  'Switch PoE+ Managed 24 cổng',
  'Switch Cisco Catalyst 9200L 24 cổng Gigabit PoE+ với 4 uplink 1G SFP. Budget PoE 370W. Hỗ trợ SD-Access, NETCONF/RESTCONF. Phù hợp access layer cho văn phòng, trường học, bệnh viện.',
  'Cisco',
  'C9200L-24P-4G-E',
  NULL,
  '{"Cổng":"24x 10/100/1000 PoE+","Uplink":"4x 1G SFP","PoE Budget":"370W","Switching":"56 Gbps","MAC":"16K","VLAN":"4094","Stack":"Có (StackWise-160)","Nguồn":"AC 100-240V"}',
  '["PoE+ 370W","Managed L3","SD-Access","DNA License","StackWise","NETCONF"]',
  1
),
(
  (SELECT id FROM product_categories WHERE slug = 'ha-tang-mang' LIMIT 1),
  'cisco-isr-1111-8p',
  'Router Enterprise ISR 1111',
  'Router Cisco ISR 1111 với 8 cổng GE (4 PoE), hỗ trợ SD-WAN, bảo mật tích hợp (Firewall, IPS, VPN). Throughput 300Mbps. Phù hợp chi nhánh doanh nghiệp vừa và nhỏ.',
  'Cisco',
  'ISR1111-8P',
  NULL,
  '{"Cổng WAN":"2x GE (1 SFP)","Cổng LAN":"8x GE (4 PoE)","Throughput":"300Mbps","VPN":"IPsec (100 tunnels)","RAM":"4GB","Flash":"4GB","Nguồn":"AC/PoE input","Kích thước":"1U Rack"}',
  '["SD-WAN","Firewall tích hợp","IPsec VPN","PoE","DNA License","USB 3.0"]',
  2
);

-- ═══════════════════════════════════════════════
-- ÂM THANH THÔNG BÁO (PA System)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'am-thanh-thong-bao' LIMIT 1),
  'toa-a-1724',
  'Mixer Amplifier 240W',
  'Mixer amplifier 240W 5 inputs microphone/line, tích hợp Module giám sát. Đầu ra 70V/100V. Phù hợp hệ thống thông báo cho tòa nhà văn phòng, trường học, bệnh viện lên đến 50 loa.',
  'TOA',
  'A-1724',
  NULL,
  '{"Công suất":"240W","Đầu vào":"5 Mic/Line","Đầu ra":"100V / 70V / 4Ω","THD":"<1% (1kHz)","S/N":"60dB","Chức năng":"Bass/Treble, Chime, Priority","Nguồn":"220VAC","Kích thước":"420×88×332mm"}',
  '["240W","5 inputs","100V/70V","Chime tích hợp","Rack mount 2U","Giám sát loa"]',
  1
),
(
  (SELECT id FROM product_categories WHERE slug = 'am-thanh-thong-bao' LIMIT 1),
  'toa-pc-2360',
  'Loa trần 6W',
  'Loa trần 6W, đường kính 200mm, biến áp 100V với chọn công suất 1W/3W/6W. Thiết kế flush-mount, vỏ kim loại chống cháy. Phù hợp văn phòng, hành lang, phòng họp.',
  'TOA',
  'PC-2360',
  NULL,
  '{"Công suất":"6W (chọn 1W/3W/6W)","Đáp tuyến":"80Hz - 20kHz","SPL":"92dB (1W/1m)","Kích thước loa":"5\" (127mm)","Kích thước đục trần":"Ø175mm","Vật liệu":"Vỏ thép chống cháy","Góc phủ":"150° conical","Tiêu chuẩn":"UL 1480 (chống cháy)"}',
  '["Flush mount","100V Line","Chống cháy UL","Chọn công suất","Spring clamp","Vỏ kim loại"]',
  2
);

-- ═══════════════════════════════════════════════
-- TỔNG ĐÀI ĐIỆN THOẠI (IP PBX)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'tong-dai' LIMIT 1),
  'grandstream-ucm6304',
  'Tổng đài IP PBX 1500 Users',
  'Tổng đài IP PBX Grandstream UCM6304 hỗ trợ lên đến 1500 người dùng, 200 cuộc gọi đồng thời. Tích hợp IVR, ghi âm, hội nghị. Phù hợp doanh nghiệp vừa đến lớn.',
  'Grandstream',
  'UCM6304',
  NULL,
  '{"Users":"1500","Cuộc gọi đồng thời":"200","Cổng FXO":"4","Cổng FXS":"4","Cổng GE":"2 (1 PoE)","Ghi âm":"Có (tích hợp)","Hội nghị":"Có (75 participants)","Nguồn":"100-240VAC"}',
  '["1500 Users","IVR đa cấp","Ghi âm cuộc gọi","Conference 75","Fax-to-Email","WebRTC"]',
  1
);

-- ═══════════════════════════════════════════════
-- THIẾT BỊ ĐIỆN NHẸ (Low Voltage)
-- ═══════════════════════════════════════════════

INSERT OR IGNORE INTO products (category_id, slug, name, description, brand, model_number, image_url, specifications, features, sort_order) VALUES
(
  (SELECT id FROM product_categories WHERE slug = 'thiet-bi-dien-nhe' LIMIT 1),
  'legrand-mosaic-white',
  'Ổ cắm đôi Mosaic 2x2P+E',
  'Ổ cắm đôi Legrand Mosaic 2 chấu + đất, mặt vuông 45x45mm. Dòng 16A/250V. Thiết kế modular, snap-on lắp đặt nhanh. Phù hợp văn phòng, khách sạn, tòa nhà thương mại.',
  'Legrand',
  '077213',
  NULL,
  '{"Loại":"Ổ cắm đôi 2P+E","Dòng":"16A","Điện áp":"250V","Kích thước":"45x45mm (2 module)","Vật liệu":"PC chống cháy","Màu sắc":"Trắng","Tiêu chuẩn":"VDE, CE, NF","Tuổi thọ":"10,000 lần cắm rút"}',
  '["Modular 45x45","Snap-on","16A","Chống cháy","VDE Certified","Quick Connect"]',
  1
);
