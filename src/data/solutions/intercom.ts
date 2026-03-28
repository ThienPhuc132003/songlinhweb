import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống video intercom.webp";

export const intercom: SolutionData = {
  slug: "he-thong-video-intercom",
  title: "Hệ thống Video Intercom",
  subtitle: "Liên lạc nội bộ thông minh — Video call HD, mở cửa từ xa, tích hợp smartphone",
  icon: "Phone",
  heroImage,
  description: "Hệ thống Video Intercom (chuông cửa hình) cho tòa nhà, chung cư, biệt thự. Hỗ trợ video call HD, mở cửa/cổng từ xa, tích hợp app mobile và hệ thống an ninh.",

  capabilities: [
    { icon: "Video", title: "Video Call HD", description: "Hình ảnh Full HD 1080p, góc rộng 170°, night vision có LED hồng ngoại" },
    { icon: "DoorOpen", title: "Mở cửa từ xa", description: "Mở khóa điện từ, barrier, cổng tự động qua màn hình indoor hoặc app" },
    { icon: "Smartphone", title: "App Integration", description: "Nhận cuộc gọi intercom trên smartphone (iOS/Android), mở cửa từ mọi nơi" },
    { icon: "Building2", title: "Multi-Tenant", description: "Hỗ trợ nhiều căn hộ/phòng, lobby station, quản lý trung tâm cho chung cư" },
    { icon: "Bell", title: "SOS Emergency", description: "Nút SOS khẩn cấp, gọi bảo vệ/quản lý tự động khi có sự cố" },
    { icon: "Lock", title: "Access Integration", description: "Tích hợp thẻ từ Mifare, mã PIN, nhận diện khuôn mặt tại outdoor station" },
  ],

  architecture: {
    title: "Kiến trúc Video Intercom",
    description: "Outdoor Station → Switch PoE → Indoor Monitor (mỗi căn hộ) → Lobby Station (lễ tân). Kết nối SIP/IP, hỗ trợ cloud relay cho remote access.",
    integrations: ["Access Control", "CCTV", "Elevator", "Smart Home", "SIP PBX"],
  },

  specs: [
    { label: "Camera", value: "2MP Wide Angle 170°", category: "Outdoor" },
    { label: "Màn hình", value: "7\" / 10\" IPS Touch", category: "Indoor" },
    { label: "Audio", value: "Full-duplex, noise cancellation", category: "Âm thanh" },
    { label: "Kết nối", value: "2-wire / Cat5e / WiFi / SIP", category: "Mạng" },
    { label: "Số căn hộ", value: "Lên đến 9,999 căn", category: "Capacity" },
    { label: "Nguồn", value: "PoE / DC 12V", category: "Phần cứng" },
    { label: "Vật liệu outdoor", value: "Nhôm đúc, IP65, IK07", category: "Phần cứng" },
    { label: "Chứng nhận", value: "CE, FCC, SIP RFC 3261", category: "Tiêu chuẩn" },
  ],

  brands: ["Hikvision", "Dahua", "Aiphone", "Commax"],
  relatedProjectSlugs: [],
};
