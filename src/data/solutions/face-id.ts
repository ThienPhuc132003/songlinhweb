import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Face ID nhận diện khuôn mặt.webp";

export const faceId: SolutionData = {
  slug: "he-thong-cong-an-ninh-nhan-dien-khuon-mat",
  title: "Hệ thống an ninh nhận diện khuôn mặt Face ID",
  subtitle: "Xác thực sinh trắc học không chạm — Tích hợp đo thân nhiệt, chấm công, quản lý khách",
  icon: "ScanFace",
  heroImage,
  description: "Hệ thống cổng an ninh tích hợp nhận diện khuôn mặt AI cho tòa nhà cao tầng. Kết hợp đo nhiệt, chấm công nhân sự và quản lý visitor trong một thiết bị duy nhất.",

  capabilities: [
    { icon: "ScanFace", title: "3D Face Recognition", description: "Nhận diện khuôn mặt 3D chống giả mạo bằng ảnh hoặc video, hoạt động trong điều kiện thiếu sáng" },
    { icon: "Thermometer", title: "Đo thân nhiệt AI", description: "Cảm biến hồng ngoại đo nhiệt ±0.3°C, cảnh báo sốt tự động và ghi log" },
    { icon: "Users", title: "Visitor Management", description: "Đăng ký khách trước qua app, nhận diện tự động khi đến, in badge tạm thời" },
    { icon: "Database", title: "Database 50K+", description: "Lưu trữ lên đến 50,000 khuôn mặt, tốc độ so khớp < 0.3 giây" },
    { icon: "Shield", title: "Anti-Spoofing", description: "Chống giả mạo bằng ảnh chụp, video replay, mặt nạ 3D" },
    { icon: "BarChart3", title: "Analytics Dashboard", description: "Thống kê lượng người ra vào, thời gian peak, báo cáo xuất Excel" },
  ],

  architecture: {
    title: "Kiến trúc nhận diện khuôn mặt",
    description: "Terminal Face ID → Bộ xử lý AI Edge → Server DB → Dashboard quản lý. Hỗ trợ cluster multi-entrance với database đồng bộ real-time qua mạng LAN/WAN.",
    integrations: ["Access Control", "CCTV", "Fire Alarm", "Elevator", "Turnstile"],
  },

  specs: [
    { label: "Nhận diện", value: "3D Structured Light / Dual Camera", category: "Sensor" },
    { label: "Dung lượng khuôn mặt", value: "50,000 faces", category: "Sensor" },
    { label: "Tốc độ", value: "< 0.3 giây", category: "Hiệu năng" },
    { label: "Khoảng cách", value: "0.3m – 3m", category: "Hiệu năng" },
    { label: "Đo nhiệt", value: "±0.3°C (34°C–42°C)", category: "Tính năng" },
    { label: "Màn hình", value: "7\" / 10\" IPS Touch", category: "Phần cứng" },
    { label: "Kết nối", value: "TCP/IP, WiFi, RS-485", category: "Phần cứng" },
    { label: "Chứng nhận", value: "CE, FCC, IP65, FDA 510(k)", category: "Tiêu chuẩn" },
  ],

  brands: ["ZKTeco", "Hikvision", "Dahua", "Suprema"],
  relatedProjectSlugs: [],
};
