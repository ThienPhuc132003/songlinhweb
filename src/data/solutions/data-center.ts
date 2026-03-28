import type { SolutionData } from "./types";
import heroImage from "@/assets/Image/GiaiPhapPage/Giải pháp hạ tầng mạng Data Center.webp";

export const dataCenter: SolutionData = {
  slug: "giai-phap-ha-tang-mang-data-center",
  title: "Giải pháp hạ tầng mạng Data Center",
  subtitle: "Hạ tầng Tier 3+ — Structured Cabling, Server Rack, Network, Power cho Data Center chuyên nghiệp",
  icon: "Server",
  heroImage,
  description: "Giải pháp thiết kế và thi công hạ tầng Data Center toàn diện: hệ thống cáp có cấu trúc (Structured Cabling), Server Rack, Network Switch/Router, và UPS/Power Distribution.",

  capabilities: [
    { icon: "Cable", title: "Structured Cabling", description: "Hệ thống cáp copper Cat.6A/Cat.8 và fiber OM4/OS2 theo chuẩn TIA-942" },
    { icon: "Server", title: "Server & Storage", description: "Lắp đặt rack server, NAS/SAN, hệ thống backup tự động" },
    { icon: "Network", title: "Core Networking", description: "Switch/Router enterprise: Cisco, Aruba, Juniper — redundant fabric" },
    { icon: "Snowflake", title: "Cooling System", description: "Hệ thống làm mát precision cooling, hot/cold aisle containment" },
    { icon: "ShieldCheck", title: "Physical Security", description: "Kiểm soát ra vào, CCTV, hệ thống chữa cháy FM-200/Novec 1230" },
    { icon: "Activity", title: "DCIM Monitoring", description: "Data Center Infrastructure Management — giám sát power, cooling, capacity" },
  ],

  architecture: {
    title: "Kiến trúc Data Center",
    description: "Spine-Leaf network topology → ATS/UPS → PDU → Server Racks → Structured Cabling (MDA/HDA/ZD). Thiết kế theo TIA-942 Rated-3, hỗ trợ concurrent maintainability.",
    integrations: ["UPS/Power", "HVAC/Cooling", "BMS", "Fire Suppression", "Access Control", "CCTV"],
  },

  specs: [
    { label: "Cáp đồng", value: "Cat.6A F/UTP / Cat.8", category: "Cabling" },
    { label: "Cáp quang", value: "OM4 (multimode) / OS2 (singlemode)", category: "Cabling" },
    { label: "Rack", value: "42U/47U, 600×1070mm", category: "Hạ tầng" },
    { label: "UPS", value: "Online 10-800kVA, N+1 redundancy", category: "Power" },
    { label: "Cooling", value: "InRow / Perimeter, PUE < 1.5", category: "Cooling" },
    { label: "Tier Level", value: "Rated-3 (99.982% uptime)", category: "Tiêu chuẩn" },
    { label: "Fire Suppression", value: "FM-200 / Novec 1230 (Clean Agent)", category: "An toàn" },
    { label: "Chứng nhận", value: "TIA-942, Uptime Institute, ISO 27001", category: "Tiêu chuẩn" },
  ],

  brands: ["Cisco", "Legrand", "APC (Schneider)", "Panduit", "CommScope"],
  relatedProjectSlugs: ["trung-tam-du-lieu-ngan-hang-hdbank-khu-cong-nghe-cao-tp-thu-duc-tphcm"],
  metaTitle: "Giải pháp hạ tầng Data Center | Song Linh Technologies",
  metaDescription: "Thiết kế và thi công Data Center Tier 3: Structured Cabling, Server Rack, Network, Power Distribution cho doanh nghiệp.",
};
