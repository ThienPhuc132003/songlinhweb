export const SITE = {
  name: "Công ty trách nhiệm hữu hạn thương mại công nghệ Song Linh",
  shortName: "Song Linh Technologies",
  displayName: "Song Linh Technologies",
  tagline: "Giải pháp tối ưu – Chất lượng vượt trội",
  phone: "0968.811.911",
  phoneRaw: "0968811911",
  email: "songlinh@sltech.vn",
  address: "19 Linh Đông, Khu phố 7, P. Hiệp Bình, TP.HCM",
  workingHours: "08:00 - 17:00",
  taxId: "0313573739",
  portfolioUrl:
    "https://drive.google.com/file/d/1LHydrrvieLHC8r00LcXttNmu_qWVb_Hj/view?usp=drive_link",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d244.9094457682887!2d106.74570923737366!3d10.845622055489056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527c70d800a51%3A0x4cba4827ef2e6ee9!2zQ8O0bmcgdHkgVE5ISCB0aMawxqFuZyBt4bqhaSBjw7RuZyBuZ2jhu4cgU29uZyBMaW5o!5e0!3m2!1svi!2sus!4v1774952529188!5m2!1svi!2sus",
} as const;

export const NAV_LINKS = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Giải pháp", href: "/giai-phap" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Dự án", href: "/du-an" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Thư viện", href: "/thu-vien" },
] as const;

// SOLUTIONS_DATA removed — solutions are now served from /api/solutions

export const COMPANY_ACTIVITIES = [
  "Tư vấn giải pháp, thiết kế hệ thống Công nghệ thông tin",
  "Lắp đặt thi công các Hệ thống M&E và Cơ điện",
  "Phân phối thiết bị, vật tư bảo trì – bảo dưỡng hệ thống",
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
    title: "Giải pháp Công nghệ",
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

/** @deprecated Fallback only — real data comes from /api/projects?featured=true. Remove once FeaturedProjects.tsx uses API exclusively. */
export const FEATURED_PROJECTS = [
  {
    slug: "toa-nha-lotus-tower",
    title: "Tòa nhà Lotus Tower",
    category: "Tòa nhà văn phòng",
    image: "/images/projects/toa-nha-lotus-tower.jpg",
  },
  {
    slug: "trung-tam-du-lieu-hdbank",
    title: "Tòa nhà VP – TT Dữ liệu HDBank",
    category: "Trung tâm dữ liệu",
    image: "/images/projects/trung-tam-du-lieu-hdbank.jpg",
  },
  {
    slug: "toa-nha-viettel-complex",
    title: "Tòa nhà Viettel Complex",
    category: "Tòa nhà văn phòng",
    image: "/images/projects/toa-nha-viettel-complex.jpg",
  },
  {
    slug: "truong-wellspring-sai-gon",
    title: "Trường Wellspring Sài Gòn",
    category: "Giáo dục",
    image: "/images/projects/truong-wellspring-sai-gon.jpg",
  },
  {
    slug: "van-phong-trung-uong-dang",
    title: "Văn phòng Trung Ương Đảng",
    category: "Cơ quan nhà nước",
    image: "/images/projects/van-phong-trung-uong-dang.jpg",
  },
  {
    slug: "hoa-phat-dung-quat-2",
    title: "Gang thép Hòa Phát Dung Quất 2",
    category: "Nhà máy",
    image: "/images/projects/hoa-phat-dung-quat-2.jpg",
  },
] as const;

/** @deprecated Fallback only — real data comes from /api/posts. Remove once Blog.tsx and BlogPost.tsx use API exclusively. */
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
