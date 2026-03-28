import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống chỉ dẫn bãi đậu xe.webp";

export const parkingGuide: SolutionData = {
  slug: "he-thong-chi-dan-bai-dau-xe",
  title: "Hệ thống chỉ dẫn bãi đậu xe",
  subtitle: "Tối ưu trải nghiệm đậu xe — Cảm biến slot, biển LED, app tìm xe tự động",
  icon: "Navigation",
  heroImage,
  description: "Hệ thống chỉ dẫn bãi đậu xe (Parking Guidance System) giúp tối ưu hóa quản lý và trải nghiệm người dùng bằng cảm biến slot, biển LED chỉ dẫn và app tìm xe.",

  capabilities: [
    { icon: "Radio", title: "Cảm biến Ultrasonic", description: "Phát hiện slot trống/đầy bằng cảm biến siêu âm, độ chính xác > 99%" },
    { icon: "MonitorSpeaker", title: "Biển LED chỉ dẫn", description: "Biển LED hiển thị số slot trống theo tầng/khu vực, dẫn hướng tự động" },
    { icon: "MapPin", title: "Tìm xe thông minh", description: "App di động hoặc kiosk giúp tìm vị trí xe chỉ bằng biển số" },
    { icon: "PieChart", title: "Phân tích occupancy", description: "Thống kê mật độ sử dụng theo giờ/ngày, tối ưu dòng xe lưu thông" },
    { icon: "Palette", title: "LED đèn trạng thái", description: "Đèn LED đỏ/xanh trên mỗi slot, dễ nhận biết từ xa" },
    { icon: "Cloud", title: "Cloud Dashboard", description: "Dashboard quản lý từ xa qua web, theo dõi real-time mọi tầng hầm" },
  ],

  architecture: {
    title: "Kiến trúc chỉ dẫn bãi xe",
    description: "Cảm biến slot → Node Controller → Server trung tâm → Biển LED + App. Mỗi controller quản lý 40-60 slot, kết nối qua RS-485 / TCP/IP.",
    integrations: ["Car Parking", "CCTV", "BMS", "Mobile App"],
  },

  specs: [
    { label: "Loại cảm biến", value: "Ultrasonic / Camera-based", category: "Sensor" },
    { label: "Số slot/controller", value: "40-60 slots", category: "Sensor" },
    { label: "Biển LED", value: "7-segment, P10 matrix", category: "Display" },
    { label: "Đèn trạng thái", value: "LED RGB (đỏ/xanh/vàng)", category: "Display" },
    { label: "App tìm xe", value: "iOS / Android / Kiosk", category: "Phần mềm" },
    { label: "Kết nối", value: "RS-485 / TCP/IP", category: "Hạ tầng" },
    { label: "Nguồn", value: "DC 12V/24V, PoE optional", category: "Hạ tầng" },
    { label: "Chứng nhận", value: "CE, FCC, IP44", category: "Tiêu chuẩn" },
  ],

  brands: ["KEYTOP", "Quercus", "PARKSOL", "Hikvision"],
  relatedProjectSlugs: [],
};
