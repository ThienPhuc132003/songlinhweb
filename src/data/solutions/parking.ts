import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống CAR PARKING thông minh.webp";

export const parking: SolutionData = {
  slug: "he-thong-car-parking",
  title: "Hệ thống CAR PARKING thông minh",
  subtitle: "Quản lý bãi xe tự động — Nhận diện biển số, thanh toán không tiền mặt, báo cáo doanh thu real-time",
  icon: "Car",
  heroImage,
  description: "Hệ thống quản lý bãi giữ xe ô tô thông minh tích hợp camera nhận diện biển số (LPR), barrier tự động, thanh toán điện tử và phần mềm quản lý doanh thu.",

  capabilities: [
    { icon: "Camera", title: "LPR - Nhận diện biển số", description: "Camera AI nhận diện biển số chính xác > 99%, hoạt động ngày/đêm, mưa/nắng" },
    { icon: "CreditCard", title: "Thanh toán tự động", description: "Tích hợp VNPAY, MoMo, ZaloPay — thanh toán không tiền mặt qua QR code" },
    { icon: "BarChart3", title: "Dashboard doanh thu", description: "Báo cáo doanh thu real-time, thống kê lượt xe ra vào, doanh thu theo ca" },
    { icon: "Timer", title: "Barrier tự động", description: "Thời gian mở < 1.5 giây, chống va chạm bằng cảm biến hồng ngoại" },
    { icon: "Ticket", title: "Vé tháng/vé lượt", description: "Quản lý vé tháng cư dân, vé lượt khách vãng lai, ưu tiên VIP" },
    { icon: "Smartphone", title: "App cư dân", description: "Kiểm tra slot trống, thanh toán vé tháng, mở barrier qua app di động" },
  ],

  architecture: {
    title: "Kiến trúc bãi xe thông minh",
    description: "Camera LPR → Server nhận diện → Controller barrier → Phần mềm quản lý trung tâm. Hỗ trợ multi-entrance/exit, đồng bộ data cloud.",
    integrations: ["CCTV", "Access Control", "BMS", "Parking Guidance", "Payment Gateway"],
  },

  specs: [
    { label: "Nhận diện biển số", value: "AI LPR > 99% accuracy", category: "Camera" },
    { label: "Thời gian xử lý", value: "< 1 giây", category: "Camera" },
    { label: "Barrier", value: "1.5s mở, chống va chạm IR", category: "Phần cứng" },
    { label: "Loại vé", value: "Vé tháng / Vé lượt / VIP", category: "Phần mềm" },
    { label: "Thanh toán", value: "Tiền mặt / VNPAY / MoMo / ZaloPay", category: "Phần mềm" },
    { label: "Báo cáo", value: "Real-time dashboard, export Excel", category: "Phần mềm" },
    { label: "Kết nối", value: "TCP/IP, RS-485, Cloud sync", category: "Tiêu chuẩn" },
    { label: "Chứng nhận", value: "CE, FCC, IP55", category: "Tiêu chuẩn" },
  ],

  brands: ["IDTECK", "HikVision", "ZKTeco", "NICE"],
  relatedProjectSlugs: [],
};
