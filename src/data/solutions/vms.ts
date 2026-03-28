import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Phần mềm quản lý trung tâm.webp";

export const vms: SolutionData = {
  slug: "he-thong-phan-mem-quan-ly-trung-tam",
  title: "Phần mềm quản lý trung tâm",
  subtitle: "Giám sát & điều hành tập trung — Dashboard real-time, tích hợp toàn bộ hệ thống ELV",
  icon: "LayoutDashboard",
  heroImage,
  description: "Phần mềm quản lý trung tâm (Central Management Software / VMS) tích hợp giám sát toàn bộ hệ thống: CCTV, Access Control, Fire Alarm, Parking, BMS trên một nền tảng thống nhất.",

  capabilities: [
    { icon: "LayoutDashboard", title: "Unified Dashboard", description: "Tổng hợp camera, access control, alarm, parking trên 1 màn hình duy nhất" },
    { icon: "Map", title: "E-Map Interactive", description: "Bản đồ tương tác hiển thị vị trí thiết bị, trạng thái real-time, zoom multi-level" },
    { icon: "Bell", title: "Event Management", description: "Quản lý sự kiện tập trung, phân loại ưu tiên, SOP xử lý từng loại alarm" },
    { icon: "Users", title: "Multi-User Multi-Site", description: "Phân quyền người dùng chi tiết, quản lý nhiều site từ trung tâm" },
    { icon: "FileText", title: "Report Automation", description: "Tự động tạo báo cáo theo lịch, export PDF/Excel, gửi email tự động" },
    { icon: "Code", title: "Open API", description: "REST API cho tích hợp với hệ thống ERP, CRM, BMS bên thứ ba" },
  ],

  architecture: {
    title: "Kiến trúc tích hợp",
    description: "Các subsystem (CCTV, AC, FA, Parking) → API Gateway → Central Server → Web Dashboard / Mobile App. Hỗ trợ failover server và database replication.",
    integrations: ["CCTV/VMS", "Access Control", "Fire Alarm", "Parking", "BMS", "Elevator"],
  },

  specs: [
    { label: "Camera support", value: "Lên đến 10,000 channels", category: "Capacity" },
    { label: "Devices", value: "Unlimited endpoints", category: "Capacity" },
    { label: "Storage", value: "SAN/NAS, 30-90 ngày", category: "Lưu trữ" },
    { label: "Client", value: "Web / Desktop / Mobile (iOS + Android)", category: "Nền tảng" },
    { label: "Database", value: "SQL Server / PostgreSQL", category: "Backend" },
    { label: "Protocol", value: "ONVIF, RTSP, OSDP, Modbus, BACnet", category: "Tích hợp" },
    { label: "API", value: "RESTful, WebSocket, MQTT", category: "Tích hợp" },
    { label: "Chứng nhận", value: "ISO 27001, SOC 2", category: "Tiêu chuẩn" },
  ],

  brands: ["HikCentral", "Milestone", "Genetec", "C-CURE 9000"],
  relatedProjectSlugs: [],
};
