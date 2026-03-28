import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống lưu điện (UPS).webp";

export const ups: SolutionData = {
  slug: "he-thong-luu-dien",
  title: "Hệ thống lưu điện UPS",
  subtitle: "Bảo vệ nguồn điện liên tục — Online Double Conversion, thời gian chuyển mạch 0ms",
  icon: "Zap",
  heroImage,
  description: "Hệ thống UPS (Uninterruptible Power Supply) bảo vệ nguồn cho hạ tầng CNTT, hệ thống camera, phòng server, data center. Đảm bảo uptime 99.99% với công nghệ Online Double Conversion.",

  capabilities: [
    { icon: "Zap", title: "Online Double Conversion", description: "Chuyển mạch 0ms, nguồn sạch sin wave thuần, bảo vệ tuyệt đối cho thiết bị nhạy cảm" },
    { icon: "Battery", title: "Extended Runtime", description: "Bank ắc quy mở rộng, duy trì hoạt động từ 30 phút đến 8 giờ tùy cấu hình" },
    { icon: "Activity", title: "Hot-Swap Batteries", description: "Thay ắc quy không tắt máy, không gián đoạn hoạt động (hot-swappable)" },
    { icon: "BarChart3", title: "SNMP Monitoring", description: "Giám sát từ xa qua SNMP card, tích hợp NMS và BMS, cảnh báo email/SMS" },
    { icon: "Layers", title: "Parallel Redundancy", description: "Kết nối song song N+1 cho capacity và redundancy, tự động load sharing" },
    { icon: "Leaf", title: "Eco Mode", description: "Chế độ ECO tiết kiệm năng lượng, hiệu suất lên đến 99% khi lưới điện ổn định" },
  ],

  architecture: {
    title: "Kiến trúc hệ thống UPS",
    description: "Nguồn lưới → ATS/STS → UPS Online → PDU → Tải. Ắc quy VRLA/Li-ion được giám sát bởi BMS tích hợp, cảnh báo sớm khi dung lượng suy giảm.",
    integrations: ["BMS", "Generator", "PDU", "SNMP/NMS", "Fire Alarm"],
  },

  specs: [
    { label: "Topology", value: "Online Double Conversion (VFI)", category: "Kỹ thuật" },
    { label: "Công suất", value: "1kVA – 800kVA", category: "Kỹ thuật" },
    { label: "Chuyển mạch", value: "0ms", category: "Kỹ thuật" },
    { label: "Hiệu suất", value: "93-96% (Normal) / 99% (ECO)", category: "Hiệu năng" },
    { label: "Ắc quy", value: "VRLA / Lithium-Ion", category: "Pin" },
    { label: "Runtime", value: "30 phút – 8 giờ (mở rộng)", category: "Pin" },
    { label: "Giám sát", value: "SNMP / Modbus / Dry Contact", category: "Quản lý" },
    { label: "Chứng nhận", value: "CE, UL, IEC 62040-3", category: "Tiêu chuẩn" },
  ],

  brands: ["APC (Schneider)", "Vertiv (Emerson)", "Eaton", "CyberPower"],
  relatedProjectSlugs: ["trung-tam-du-lieu-ngan-hang-hdbank-khu-cong-nghe-cao-tp-thu-duc-tphcm"],
};
