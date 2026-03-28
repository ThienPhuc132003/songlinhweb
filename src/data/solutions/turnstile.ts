import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống phân làn tự động (Turnstile).webp";

export const turnstile: SolutionData = {
  slug: "he-thong-phan-lan-tu-dong",
  title: "Hệ thống phân làn tự động Turnstile",
  subtitle: "Kiểm soát dòng người chuyên nghiệp — Speed Gate, Tripod, Flap Barrier tích hợp AI",
  icon: "DoorOpen",
  heroImage,
  description: "Hệ thống cổng phân làn tự động (Turnstile) kiểm soát dòng người ra vào hiệu quả cho tòa nhà văn phòng, nhà máy, trung tâm thương mại. Tích hợp thẻ từ, vân tay, Face ID.",

  capabilities: [
    { icon: "DoorOpen", title: "Speed Gate", description: "Cửa kính trượt mở/đóng trong < 0.5 giây, thông lượng 30 người/phút" },
    { icon: "Shield", title: "Anti-Tailgating", description: "Phát hiện tailgating bằng cảm biến hồng ngoại đa tia, chống đi kèm" },
    { icon: "ScanFace", title: "Multi-Auth Integration", description: "Tích hợp thẻ từ, vân tay, Face ID — xác thực đa yếu tố" },
    { icon: "Accessibility", title: "ADA Compliant", description: "Làn rộng cho xe lăn, cáng y tế, hàng hóa — tuân thủ tiêu chuẩn ADA" },
    { icon: "Flame", title: "Fire Alarm Link", description: "Tự động mở khi báo cháy, đảm bảo thoát hiểm nhanh chóng" },
    { icon: "BarChart3", title: "People Counter", description: "Đếm người ra vào real-time, thống kê lưu lượng theo giờ/ngày" },
  ],

  architecture: {
    title: "Kiến trúc phân làn",
    description: "Reader → Controller → Turnstile Motor → Phần mềm quản lý. Kết nối với hệ thống Access Control, CCTV và Fire Alarm qua relay/IP.",
    integrations: ["Access Control", "CCTV", "Fire Alarm", "Face ID", "Visitor Management"],
  },

  specs: [
    { label: "Loại cổng", value: "Speed Gate / Flap / Tripod / Full Height", category: "Phần cứng" },
    { label: "Thông lượng", value: "25-40 người/phút", category: "Hiệu năng" },
    { label: "Tốc độ", value: "< 0.5 giây mở/đóng", category: "Hiệu năng" },
    { label: "Chiều rộng làn", value: "550mm (standard) / 900mm (ADA)", category: "Phần cứng" },
    { label: "Cảm biến", value: "IR đa tia anti-tailgating", category: "An ninh" },
    { label: "Vật liệu", value: "SUS 304/316 Stainless Steel", category: "Phần cứng" },
    { label: "Kết nối", value: "Wiegand / RS-485 / TCP/IP", category: "Tiêu chuẩn" },
    { label: "Chứng nhận", value: "CE, FCC, IP54", category: "Tiêu chuẩn" },
  ],

  brands: ["ZKTeco", "Gunnebo", "Dormakaba", "IDTECK"],
  relatedProjectSlugs: [],
};
