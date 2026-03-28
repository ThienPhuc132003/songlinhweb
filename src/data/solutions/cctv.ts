import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Hệ thống giám sát an ninh AI.webp";

export const cctv: SolutionData = {
  slug: "he-thong-cctv-camera-quan-sat",
  title: "Hệ thống giám sát an ninh AI",
  subtitle: "Giám sát thông minh 24/7 — Phát hiện xâm nhập bằng Deep Learning, giảm 90% cảnh báo sai",
  icon: "Camera",
  heroImage,
  description: "Thiết kế, lắp đặt hệ thống camera quan sát CCTV tích hợp AI cho tòa nhà, văn phòng, nhà xưởng, khu công nghiệp. Sử dụng công nghệ AcuSense, Deep Learning và Smart Tracking từ các thương hiệu hàng đầu.",

  capabilities: [
    { icon: "Brain", title: "AcuSense AI", description: "Tự động phân biệt người/xe, giảm 90% cảnh báo sai so với cảm biến truyền thống" },
    { icon: "ScanFace", title: "Deep Learning Recognition", description: "Nhận diện khuôn mặt (Face Recognition) với cơ sở dữ liệu lên đến 100,000 gương mặt" },
    { icon: "Target", title: "Smart Tracking", description: "Camera PTZ tự động bám và theo dõi đối tượng di chuyển trong phạm vi quan sát" },
    { icon: "HardDrive", title: "H.265+ Compression", description: "Tiết kiệm bandwidth và dung lượng lưu trữ đến 80% so với H.264 truyền thống" },
    { icon: "Sun", title: "120dB True WDR", description: "Hình ảnh rõ nét trong mọi điều kiện ánh sáng, kể cả ngược sáng mạnh" },
    { icon: "Wifi", title: "Remote Monitoring", description: "Giám sát từ xa qua app mobile, web browser mọi lúc mọi nơi" },
  ],

  architecture: {
    title: "Kiến trúc hệ thống giám sát",
    description: "Hệ thống CCTV được thiết kế theo mô hình phân tầng: Camera IP → Switch PoE → NVR/Server → VMS. Tất cả kết nối qua hạ tầng mạng structured cabling, hỗ trợ redundancy và failover tự động.",
    integrations: ["Access Control", "Fire Alarm", "BMS", "Intercom", "Parking System"],
  },

  specs: [
    { label: "Độ phân giải", value: "2MP / 4MP / 8MP (4K)", category: "Camera" },
    { label: "Ống kính", value: "2.8mm–12mm Varifocal", category: "Camera" },
    { label: "Tầm xa hồng ngoại", value: "30m–100m (DarkFighter)", category: "Camera" },
    { label: "Chuẩn nén", value: "H.265+ / H.264+", category: "Encoding" },
    { label: "Giao thức", value: "ONVIF Profile S/T/G", category: "Encoding" },
    { label: "Nguồn cấp", value: "PoE (IEEE 802.3af/at)", category: "Hạ tầng" },
    { label: "Lưu trữ", value: "HDD RAID / NAS / Cloud", category: "Hạ tầng" },
    { label: "Chứng nhận", value: "CE, FCC, UL, NDAA Compliant", category: "Tiêu chuẩn" },
  ],

  brands: ["Hikvision", "Dahua", "Hanwha Techwin", "Axis Communications"],
  relatedProjectSlugs: ["trung-tam-du-lieu-ngan-hang-hdbank-khu-cong-nghe-cao-tp-thu-duc-tphcm"],
  metaTitle: "Hệ thống Camera CCTV AI | Song Linh Technologies",
  metaDescription: "Giải pháp camera giám sát an ninh tích hợp AI — AcuSense, nhận diện khuôn mặt, smart tracking cho tòa nhà và khu công nghiệp.",
};
