import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống màn hình ghép (Video Wall).webp";

export const videoWall: SolutionData = {
  slug: "he-thong-man-hinh-ghep",
  title: "Hệ thống màn hình ghép Video Wall",
  subtitle: "Hiển thị chuyên nghiệp quy mô lớn — LCD/LED Video Wall, bezel siêu mỏng 0.88mm",
  icon: "Monitor",
  heroImage,
  description: "Hệ thống màn hình ghép (Video Wall) hiển thị nội dung chuyên nghiệp cho phòng điều hành, trung tâm giám sát, lobby tòa nhà. Công nghệ LCD/LED bezel siêu mỏng, hỗ trợ 4K/8K.",

  capabilities: [
    { icon: "Monitor", title: "Bezel siêu mỏng", description: "Viền ghép 0.88mm cho hình ảnh liền mạch, trải nghiệm immersive" },
    { icon: "Tv2", title: "4K/8K Resolution", description: "Độ phân giải 4K/8K tùy cấu hình, chất lượng hình ảnh sắc nét" },
    { icon: "LayoutGrid", title: "Multi-Source Display", description: "Hiển thị đa nguồn: CCTV, Dashboard, Presentation, Digital Signage cùng lúc" },
    { icon: "Settings", title: "Video Wall Controller", description: "Controller chuyên dụng hỗ trợ tách/ghép màn hình linh hoạt, PIP/POP" },
    { icon: "Clock", title: "24/7 Operation", description: "Thiết kế cho hoạt động liên tục 24/7, tuổi thọ > 60,000 giờ" },
    { icon: "Palette", title: "Auto Calibration", description: "Tự động hiệu chỉnh màu sắc giữa các tấm, đảm bảo đồng nhất" },
  ],

  architecture: {
    title: "Kiến trúc Video Wall",
    description: "Nguồn video (CCTV/PC/Media Player) → Video Wall Processor → Display Matrix (LCD/LED). Controller hỗ trợ input HDMI/DVI/DP, output custom layout.",
    integrations: ["CCTV/VMS", "BMS Dashboard", "Digital Signage", "Presentation System"],
  },

  specs: [
    { label: "Công nghệ", value: "LCD IPS / Direct-view LED", category: "Display" },
    { label: "Kích thước panel", value: "46\" / 49\" / 55\"", category: "Display" },
    { label: "Bezel", value: "0.88mm – 3.5mm", category: "Display" },
    { label: "Độ sáng", value: "500-700 nit (LCD) / 1000+ nit (LED)", category: "Display" },
    { label: "Độ phân giải", value: "1920×1080 per panel, 4K/8K tổng", category: "Hiệu năng" },
    { label: "Tuổi thọ", value: "> 60,000 giờ", category: "Hiệu năng" },
    { label: "Controller", value: "HDMI/DVI/DP, up to 128 outputs", category: "Xử lý" },
    { label: "Chứng nhận", value: "CE, FCC, EnergyStar", category: "Tiêu chuẩn" },
  ],

  brands: ["Samsung", "LG", "Hikvision", "Dahua"],
  relatedProjectSlugs: [],
};
