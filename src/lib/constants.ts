export const SITE = {
  name: "CÔNG TY TNHH TM CÔNG NGHỆ SONG LINH",
  shortName: "SLTECH",
  displayName: "Song Linh Technologies",
  tagline: "Giải pháp tối ưu – Chất lượng vượt trội",
  phone: "0968.811.911",
  phoneRaw: "0968811911",
  email: "songlinh@sltech.vn",
  address: "19 Linh Đông, Khu phố 7, P. Hiệp Bình, TP.HCM",
  workingHours: "08:00 - 17:00",
  taxId: "0313573739",
  portfolioUrl:
    "https://drive.google.com/file/d/1gY6VKUJDvS5NJT4mzvWCJDbOvZ3sUAEE/view",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7838.984098498011!2d106.727975!3d10.841553!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317152b4b2936f47%3A0x364e9e91a8e9e50d!2zQ8O0bmcgVHkgVE5ISCBU4bqhaSBDw7RuZyBOZ2jhu4cgU29uZyBMaW5o!5e0!3m2!1svi!2sus!4v1741182137095!5m2!1svi!2sus",
} as const;

export const NAV_LINKS = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Giải pháp", href: "/giai-phap" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Dự án", href: "/du-an" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Thư viện", href: "/thu-vien" },
] as const;

export const SOLUTIONS_DATA = [
  {
    slug: "he-thong-cctv-camera-quan-sat",
    title: "Hệ thống CCTV Camera quan sát",
    icon: "Camera",
    description:
      "Thiết kế, lắp đặt hệ thống camera quan sát CCTV chuyên nghiệp cho nhà xưởng, văn phòng, chung cư, trường học. Sử dụng các thương hiệu hàng đầu: Hikvision, Dahua, Hanwha Techwin.",
  },
  {
    slug: "he-thong-bao-chay-chua-chay",
    title: "Hệ thống Báo cháy – Chữa cháy",
    icon: "Flame",
    description:
      "Tư vấn, thiết kế và thi công hệ thống PCCC theo tiêu chuẩn TCVN. Bao gồm báo cháy tự động, chữa cháy bằng khí, sprinkler, và hệ thống quản lý PCCC.",
  },
  {
    slug: "he-thong-am-thanh-thong-bao",
    title: "Hệ thống Âm thanh thông báo",
    icon: "Volume2",
    description:
      "Hệ thống PA (Public Address) cho tòa nhà, trung tâm thương mại, nhà máy. Tích hợp với hệ thống báo cháy, phát thanh khẩn cấp.",
  },
  {
    slug: "he-thong-mang-lan-wan",
    title: "Hệ thống Mạng LAN/WAN",
    icon: "Network",
    description:
      "Thiết kế hạ tầng mạng LAN/WAN, WiFi doanh nghiệp, hệ thống cáp quang, cáp đồng có cấu trúc cho tòa nhà và khu công nghiệp.",
  },
  {
    slug: "he-thong-dien-nhe",
    title: "Hệ thống Điện nhẹ",
    icon: "Zap",
    description:
      "Thi công hệ thống điện nhẹ (ELV) bao gồm: điện thoại, intercom, truyền hình cáp, BMS, và các hệ thống điều khiển tự động.",
  },
  {
    slug: "tong-dai-dien-thoai",
    title: "Tổng đài Điện thoại",
    icon: "Phone",
    description:
      "Cung cấp và lắp đặt tổng đài điện thoại IP-PBX, tổng đài analog cho văn phòng, khách sạn. Hỗ trợ tích hợp VoIP.",
  },
  {
    slug: "he-thong-kiem-soat-ra-vao",
    title: "Hệ thống Kiểm soát ra vào",
    icon: "ShieldCheck",
    description:
      "Hệ thống Access Control bằng thẻ từ, vân tay, nhận diện khuôn mặt. Quản lý chấm công, kiểm soát thang máy, barrier.",
  },
  {
    slug: "he-thong-bao-trom",
    title: "Hệ thống Báo trộm",
    icon: "Bell",
    description:
      "Lắp đặt hệ thống báo trộm chống đột nhập cho nhà ở, cửa hàng, kho bãi. Báo động qua app, SMS, và trung tâm giám sát.",
  },
  {
    slug: "server-luu-tru",
    title: "Server – Lưu trữ",
    icon: "Server",
    description:
      "Cung cấp giải pháp Server, NAS, SAN và hệ thống lưu trữ dữ liệu cho doanh nghiệp. Tư vấn giải pháp backup và phục hồi dữ liệu.",
  },
  {
    slug: "he-thong-quan-ly-toa-nha-bms",
    title: "Hệ thống quản lý tòa nhà (BMS)",
    icon: "Building2",
    description:
      "Tích hợp và quản lý tất cả hệ thống kỹ thuật trong tòa nhà: HVAC, chiếu sáng, an ninh, PCCC trên một nền tảng BMS thống nhất.",
  },
  {
    slug: "tu-van-thiet-ke-du-an",
    title: "Tư vấn – Thiết kế dự án",
    icon: "FileCheck",
    description:
      "Dịch vụ tư vấn, khảo sát và thiết kế hệ thống M&E toàn diện. Lập dự toán, bản vẽ shop drawing và hồ sơ hoàn công.",
  },
] as const;

export const COMPANY_ACTIVITIES = [
  "Tư vấn giải pháp, thiết kế hệ thống Công nghệ thông tin",
  "Lắp đặt thi công các Hệ thống M&E và Cơ điện",
  "Phân phối thiết bị, vật tư bảo trì – bảo dưỡng hệ thống",
] as const;

export const PARTNERS = [
  "Hikvision",
  "Dahua",
  "Hanwha Techwin",
  "Honeywell",
  "Bosch",
  "TOA",
  "Axis",
  "ZKTeco",
  "LS Cable & System",
  "Legrand",
] as const;

/** Partner certificates — images will be added by user */
export const PARTNER_CERTIFICATES = [
  {
    title: "Axis Silver Partner",
    partner: "Axis Communications",
    image: "/images/certificates/axis-silver-partner.jpg",
    year: "2021",
  },
  {
    title: "Top 1 Axis Camera Station Seller 2024",
    partner: "Axis Communications",
    image: "/images/certificates/axis-top1-seller-2024.jpg",
    year: "2024",
  },
  {
    title: "Hikvision Authorized Partner",
    partner: "Hikvision",
    image: "/images/certificates/hikvision-project-partner.jpg",
    year: "",
  },
  {
    title: "LS Cable & System Partner",
    partner: "LS Cable & System",
    image: "/images/certificates/ls-cable-partner.jpg",
    year: "2021",
  },
  {
    title: "Hanwha Techwin Authorized Distributor",
    partner: "Hanwha Techwin",
    image: "/images/certificates/hanwha-techwin-gold.jpg",
    year: "2020",
  },
  {
    title: "Legrand Authorized Distributor",
    partner: "Legrand",
    image: "/images/certificates/legrand-distributor.jpg",
    year: "2024–2025",
  },
] as const;

/** Hero slider data — static for now, will come from API later */
export { default as heroGiaiPhap } from "@/assets/Image/HomePage/Hero GiaiPhap.webp";
export { default as heroCCTV } from "@/assets/Image/HomePage/Hero CCTV.webp";
export { default as heroME } from "@/assets/Image/HomePage/Hero M&E.webp";

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Giải pháp Công nghệ Tối ưu",
    subtitle:
      "Chuyên tư vấn, thiết kế, cung cấp và thi công lắp đặt các hệ thống công nghệ thông tin",
    cta: { label: "Xem giải pháp", href: "/giai-phap" },
    ctaSecondary: { label: "Liên hệ ngay", href: "/lien-he" },
    imageKey: "giaiphap" as const,
  },
  {
    id: 2,
    title: "Hệ thống CCTV & An ninh",
    subtitle:
      "Camera quan sát, kiểm soát ra vào, báo trộm — giải pháp an ninh toàn diện cho doanh nghiệp",
    cta: {
      label: "Khám phá",
      href: "/giai-phap/he-thong-cctv-camera-quan-sat",
    },
    ctaSecondary: { label: "Dự án tiêu biểu", href: "/du-an" },
    imageKey: "cctv" as const,
  },
  {
    id: 3,
    title: "Hệ thống M&E & Cơ điện",
    subtitle:
      "Thi công hệ thống điện nhẹ, PCCC, âm thanh thông báo, mạng LAN/WAN chuyên nghiệp",
    cta: { label: "Xem dịch vụ", href: "/giai-phap/he-thong-dien-nhe" },
    ctaSecondary: { label: "Hồ sơ năng lực", href: SITE.portfolioUrl },
    imageKey: "me" as const,
  },
];

/** Company stats for the homepage */
export const COMPANY_STATS = [
  { value: 10, suffix: "+", label: "Năm kinh nghiệm" },
  { value: 500, suffix: "+", label: "Dự án hoàn thành" },
  { value: 50, suffix: "+", label: "Đối tác tin cậy" },
  { value: 100, suffix: "%", label: "Khách hàng hài lòng" },
] as const;

/** Featured projects — static placeholder, will come from API */
export const FEATURED_PROJECTS = [
  {
    slug: "saigon-centre",
    title: "Takashimaya Saigon Centre",
    category: "Thương mại",
    image: "/images/projects/saigon-centre.jpg",
  },
  {
    slug: "toa-nha-republic-plaza",
    title: "Tòa nhà Republic Plaza",
    category: "Văn phòng",
    image: "/images/projects/republic-plaza.jpg",
  },
  {
    slug: "khach-san-new-world",
    title: "Khách sạn New World",
    category: "Khách sạn",
    image: "/images/projects/new-world.jpg",
  },
  {
    slug: "benh-vien-trieu-an",
    title: "Bệnh viện Triều An",
    category: "Y tế",
    image: "/images/projects/benh-vien-trieu-an.jpg",
  },
  {
    slug: "chung-cu-vinhomes",
    title: "Chung cư Vinhomes",
    category: "Dân cư",
    image: "/images/projects/vinhomes.jpg",
  },
  {
    slug: "nha-may-vsip",
    title: "Nhà máy VSIP",
    category: "Công nghiệp",
    image: "/images/projects/vsip.jpg",
  },
] as const;

/** Product categories — static placeholder */
export const PRODUCT_CATEGORIES = [
  {
    slug: "camera-quan-sat",
    name: "Camera quan sát",
    description: "Camera IP, camera analog, camera PTZ, camera AI",
    productCount: 12,
  },
  {
    slug: "thiet-bi-mang",
    name: "Thiết bị mạng",
    description: "Switch, Router, Access Point, cáp mạng",
    productCount: 8,
  },
  {
    slug: "bao-chay",
    name: "Thiết bị báo cháy",
    description: "Đầu báo khói, báo nhiệt, tủ trung tâm PCCC",
    productCount: 6,
  },
  {
    slug: "kiem-soat-ra-vao",
    name: "Kiểm soát ra vào",
    description: "Máy chấm công, đầu đọc thẻ, barrier, cổng xoay",
    productCount: 10,
  },
  {
    slug: "am-thanh",
    name: "Âm thanh thông báo",
    description: "Loa, ampli, mixer, micro hệ thống PA",
    productCount: 5,
  },
  {
    slug: "server-luu-tru",
    name: "Server & Lưu trữ",
    description: "Server, NAS, UPS, tủ rack",
    productCount: 7,
  },
  {
    slug: "tong-dai",
    name: "Tổng đài điện thoại",
    description: "Tổng đài IP, điện thoại VoIP, phụ kiện",
    productCount: 4,
  },
] as const;

/** Blog posts — static placeholder */
export const BLOG_POSTS = [
  {
    slug: "5-loi-ich-lap-dat-camera-doanh-nghiep",
    title: "5 Lợi ích khi lắp đặt camera quan sát cho doanh nghiệp",
    excerpt:
      "Hệ thống camera giám sát không chỉ đảm bảo an ninh mà còn giúp quản lý hiệu quả, giảm thất thoát và nâng cao năng suất lao động.",
    thumbnail: "/images/blog/camera-doanh-nghiep.jpg",
    author: "Song Linh Technologies",
    publishedAt: "2026-01-15",
    tags: ["camera", "an-ninh", "doanh-nghiep"],
  },
  {
    slug: "quy-dinh-pccc-toa-nha-2026",
    title: "Quy định PCCC cho tòa nhà năm 2026 — Những điều cần biết",
    excerpt:
      "Tổng hợp các quy định mới nhất về phòng cháy chữa cháy cho tòa nhà cao tầng, khu công nghiệp và trung tâm thương mại.",
    thumbnail: "/images/blog/pccc-toa-nha.jpg",
    author: "Song Linh Technologies",
    publishedAt: "2025-12-20",
    tags: ["pccc", "quy-dinh", "toa-nha"],
  },
  {
    slug: "xu-huong-smart-building-2026",
    title: "Xu hướng Smart Building 2026 — BMS và IoT",
    excerpt:
      "Tìm hiểu về xu hướng tòa nhà thông minh, hệ thống BMS tích hợp IoT giúp tối ưu năng lượng và quản lý vận hành.",
    thumbnail: "/images/blog/smart-building.jpg",
    author: "Song Linh Technologies",
    publishedAt: "2025-11-10",
    tags: ["bms", "iot", "smart-building"],
  },
  {
    slug: "so-sanh-camera-ip-va-analog",
    title: "So sánh Camera IP và Camera Analog — Nên chọn loại nào?",
    excerpt:
      "Phân tích ưu nhược điểm của camera IP so với camera analog, giúp bạn lựa chọn giải pháp phù hợp với nhu cầu và ngân sách.",
    thumbnail: "/images/blog/camera-ip-analog.jpg",
    author: "Song Linh Technologies",
    publishedAt: "2025-10-05",
    tags: ["camera", "so-sanh", "huong-dan"],
  },
] as const;

/** Gallery albums — static placeholder */
export const GALLERY_ALBUMS = [
  {
    slug: "du-an-saigon-centre",
    title: "Dự án Saigon Centre",
    coverImage: "/images/gallery/saigon-centre-cover.jpg",
    imageCount: 12,
  },
  {
    slug: "du-an-republic-plaza",
    title: "Dự án Republic Plaza",
    coverImage: "/images/gallery/republic-plaza-cover.jpg",
    imageCount: 8,
  },
  {
    slug: "du-an-benh-vien-trieu-an",
    title: "Dự án Bệnh viện Triều An",
    coverImage: "/images/gallery/trieu-an-cover.jpg",
    imageCount: 15,
  },
  {
    slug: "thi-cong-he-thong-pccc",
    title: "Thi công hệ thống PCCC",
    coverImage: "/images/gallery/pccc-cover.jpg",
    imageCount: 10,
  },
  {
    slug: "lap-dat-camera-nha-xuong",
    title: "Lắp đặt camera nhà xưởng",
    coverImage: "/images/gallery/camera-nha-xuong-cover.jpg",
    imageCount: 6,
  },
] as const;

/** Sample B2B ELV products — client-side fallback when API is empty */
export const SAMPLE_PRODUCTS = [
  // CCTV
  {
    slug: "hikvision-ds-2cd2143g2-i",
    name: "Camera IP Dome 4MP AcuSense",
    brand: "Hikvision",
    model_number: "DS-2CD2143G2-I",
    category_slug: "camera-giam-sat",
    category_name: "Camera giám sát",
    description: "Camera dome hồng ngoại 4MP với công nghệ AcuSense phân biệt người/xe, hỗ trợ H.265+.",
    features: ["AcuSense AI", "PoE", "H.265+", "IP67", "120dB WDR"],
  },
  {
    slug: "hikvision-ds-2de4425iw-de",
    name: "Camera PTZ 4MP 25x Zoom DarkFighter",
    brand: "Hikvision",
    model_number: "DS-2DE4425IW-DE(T5)",
    category_slug: "camera-giam-sat",
    category_name: "Camera giám sát",
    description: "Camera Speed Dome PTZ 4MP với zoom quang 25x và DarkFighter cho ánh sáng cực thấp.",
    features: ["DarkFighter", "PTZ 25x", "Smart Tracking", "IP66"],
  },
  {
    slug: "hikvision-ds-7732ni-k4",
    name: "Đầu ghi hình NVR 32 kênh 4K",
    brand: "Hikvision",
    model_number: "DS-7732NI-K4",
    category_slug: "camera-giam-sat",
    category_name: "Camera giám sát",
    description: "Đầu ghi hình mạng 32 kênh 4K, 4 khe ổ cứng SATA, băng thông 256Mbps.",
    features: ["4K Ultra HD", "32 kênh", "4 HDD SATA", "H.265+"],
  },
  // Fire Alarm
  {
    slug: "honeywell-tc810m1109",
    name: "Đầu báo khói quang Addressable",
    brand: "Honeywell",
    model_number: "TC810M1109",
    category_slug: "bao-chay",
    category_name: "Báo cháy",
    description: "Đầu báo khói quang địa chỉ CLIP, cảm biến photoelectric độ nhạy cao. EN 54-7.",
    features: ["Addressable", "EN 54-7", "UL Listed", "LED 360°"],
  },
  {
    slug: "honeywell-nfs2-3030",
    name: "Trung tâm báo cháy Notifier 1-3 Loop",
    brand: "Honeywell",
    model_number: "NFS2-3030",
    category_slug: "bao-chay",
    category_name: "Báo cháy",
    description: "Trung tâm báo cháy địa chỉ Notifier, 1-3 SLC loops, tối đa 318 thiết bị/loop.",
    features: ["UL Listed", "FM Approved", "3 SLC Loops", "Network"],
  },
  // Access Control
  {
    slug: "zkteco-inbio-260",
    name: "Bộ điều khiển Access Control 2 cửa",
    brand: "ZKTeco",
    model_number: "InBio 260",
    category_slug: "kiem-soat-ra-vao",
    category_name: "Kiểm soát ra vào",
    description: "Bộ điều khiển 2 cửa, hỗ trợ 20,000 vân tay và 60,000 thẻ, TCP/IP.",
    features: ["Vân tay + Thẻ", "TCP/IP", "Anti-Passback", "Wiegand"],
  },
  {
    slug: "zkteco-speedface-v5l-td",
    name: "Máy chấm công nhận diện khuôn mặt + Đo nhiệt",
    brand: "ZKTeco",
    model_number: "SpeedFace-V5L[TD]",
    category_slug: "kiem-soat-ra-vao",
    category_name: "Kiểm soát ra vào",
    description: "Nhận diện khuôn mặt không chạm + đo nhiệt độ, màn hình 5\" cảm ứng.",
    features: ["Face Recognition", "Đo nhiệt", "WiFi", "Mask Detection"],
  },
  // Networking
  {
    slug: "cisco-c9200l-24p-4g",
    name: "Switch PoE+ Managed 24 cổng",
    brand: "Cisco",
    model_number: "C9200L-24P-4G-E",
    category_slug: "ha-tang-mang",
    category_name: "Hạ tầng mạng",
    description: "Switch Catalyst 9200L 24 cổng Gigabit PoE+ với 4 uplink 1G SFP. PoE 370W.",
    features: ["PoE+ 370W", "Managed L3", "SD-Access", "StackWise"],
  },
  {
    slug: "cisco-isr-1111-8p",
    name: "Router Enterprise ISR 1111",
    brand: "Cisco",
    model_number: "ISR1111-8P",
    category_slug: "ha-tang-mang",
    category_name: "Hạ tầng mạng",
    description: "Router ISR 1111 với 8 GE (4 PoE), SD-WAN, bảo mật tích hợp Firewall/IPS/VPN.",
    features: ["SD-WAN", "Firewall", "IPsec VPN", "PoE"],
  },
  // PA System
  {
    slug: "toa-a-1724",
    name: "Mixer Amplifier 240W",
    brand: "TOA",
    model_number: "A-1724",
    category_slug: "am-thanh-thong-bao",
    category_name: "Âm thanh thông báo",
    description: "Mixer amplifier 240W, 5 inputs, đầu ra 70V/100V. Phù hợp tòa nhà, trường học.",
    features: ["240W", "5 inputs", "100V/70V", "Rack mount 2U"],
  },
  {
    slug: "toa-pc-2360",
    name: "Loa trần 6W",
    brand: "TOA",
    model_number: "PC-2360",
    category_slug: "am-thanh-thong-bao",
    category_name: "Âm thanh thông báo",
    description: "Loa trần 6W, đường kính 200mm, flush-mount, vỏ kim loại chống cháy UL 1480.",
    features: ["Flush mount", "100V Line", "Chống cháy UL", "Vỏ kim loại"],
  },
  // IP PBX
  {
    slug: "grandstream-ucm6304",
    name: "Tổng đài IP PBX 1500 Users",
    brand: "Grandstream",
    model_number: "UCM6304",
    category_slug: "tong-dai",
    category_name: "Tổng đài",
    description: "Tổng đài IP PBX 1500 users, 200 cuộc gọi đồng thời, IVR, ghi âm, hội nghị.",
    features: ["1500 Users", "IVR", "Ghi âm", "Conference 75"],
  },
  // Low Voltage
  {
    slug: "legrand-mosaic-white",
    name: "Ổ cắm đôi Mosaic 2x2P+E",
    brand: "Legrand",
    model_number: "077213",
    category_slug: "thiet-bi-dien-nhe",
    category_name: "Thiết bị điện nhẹ",
    description: "Ổ cắm đôi Legrand Mosaic 16A/250V, modular 45x45mm, snap-on lắp đặt nhanh.",
    features: ["Modular 45x45", "16A", "Chống cháy", "VDE Certified"],
  },
] as const;

