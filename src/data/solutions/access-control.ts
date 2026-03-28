import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống Kiểm soát Ra vào (Access Control).webp";

export const accessControl: SolutionData = {
  slug: "he-thong-access-control",
  title: "Hệ thống Kiểm soát Ra vào",
  subtitle: "Quản lý truy cập thông minh — Thẻ từ, vân tay, nhận diện khuôn mặt, kiểm soát thang máy",
  icon: "ShieldCheck",
  heroImage,
  description: "Hệ thống Access Control quản lý quyền truy cập khu vực bằng thẻ từ, vân tay, nhận diện khuôn mặt hoặc mã PIN. Kết hợp chấm công, kiểm soát thang máy, barrier và cổng turnstile.",

  capabilities: [
    { icon: "ScanFace", title: "Nhận diện khuôn mặt", description: "Xác thực không chạm với tốc độ < 0.5 giây, độ chính xác > 99.5%" },
    { icon: "Thermometer", title: "Đo nhiệt độ tích hợp", description: "Cảm biến nhiệt độ ±0.3°C, tự động cảnh báo khi phát hiện sốt" },
    { icon: "ShieldAlert", title: "Anti-Passback", description: "Chống gian lận ra vào, đảm bảo mỗi người chỉ quẹt 1 lần" },
    { icon: "Building2", title: "Kiểm soát thang máy", description: "Giới hạn quyền truy cập theo tầng, tích hợp reader trong cabin" },
    { icon: "Clock", title: "Chấm công tích hợp", description: "Kết hợp chấm công nhân sự, export báo cáo Excel/PDF tự động" },
    { icon: "Smartphone", title: "Mobile Credential", description: "Mở cửa bằng smartphone qua Bluetooth/NFC, không cần thẻ vật lý" },
  ],

  architecture: {
    title: "Kiến trúc hệ thống kiểm soát",
    description: "Hệ thống Access Control gồm: Controller trung tâm → Reader (thẻ từ/vân tay/khuôn mặt) → Khóa điện từ/Barrier → Phần mềm quản lý. Tất cả kết nối qua mạng TCP/IP, hỗ trợ quản lý tập trung multi-site.",
    integrations: ["CCTV", "Fire Alarm", "Elevator", "BMS", "HR System"],
  },

  specs: [
    { label: "Loại xác thực", value: "Thẻ / Vân tay / Khuôn mặt / PIN", category: "Reader" },
    { label: "Dung lượng", value: "50,000 thẻ — 10,000 khuôn mặt", category: "Reader" },
    { label: "Tốc độ xác thực", value: "< 0.5 giây", category: "Reader" },
    { label: "Controller", value: "2/4 cửa, TCP/IP, RS-485", category: "Controller" },
    { label: "Khóa điện từ", value: "Fail-safe (280kg) / Fail-secure", category: "Phần cứng" },
    { label: "Nguồn backup", value: "UPS 12V/7Ah, 4-8 giờ", category: "Phần cứng" },
    { label: "Giao thức", value: "Wiegand 26/34, OSDP v2", category: "Tiêu chuẩn" },
    { label: "Chứng nhận", value: "CE, FCC, IP65, IK08", category: "Tiêu chuẩn" },
  ],

  brands: ["ZKTeco", "HID Global", "Suprema", "Hikvision"],
  relatedProjectSlugs: [],
  metaTitle: "Hệ thống Kiểm soát Ra vào Access Control | Song Linh Technologies",
  metaDescription: "Giải pháp Access Control chuyên nghiệp: thẻ từ, vân tay, nhận diện khuôn mặt, kiểm soát thang máy cho tòa nhà và doanh nghiệp.",
};
