// Solution image mapping — maps solution slug to WebP image in GiaiPhapPage folder
// These static imports are processed by Vite for optimal bundling

import imgGiamSat from "@/assets/Image/GiaiPhapPage/Hệ thống giám sát an ninh AI.webp";
import imgKiemSoat from "@/assets/Image/GiaiPhapPage/Hệ thống Kiểm soát Ra vào (Access Control).webp";
import imgFaceId from "@/assets/Image/GiaiPhapPage/Face ID nhận diện khuôn mặt.webp";
import imgParking from "@/assets/Image/GiaiPhapPage/Hệ thống CAR PARKING thông minh.webp";
import imgParkingGuide from "@/assets/Image/GiaiPhapPage/Hệ thống chỉ dẫn bãi đậu xe.webp";
import imgUps from "@/assets/Image/GiaiPhapPage/Hệ thống lưu điện (UPS).webp";
import imgVideoWall from "@/assets/Image/GiaiPhapPage/Hệ thống màn hình ghép (Video Wall).webp";
import imgTurnstile from "@/assets/Image/GiaiPhapPage/Hệ thống phân làn tự động (Turnstile).webp";
import imgIntercom from "@/assets/Image/GiaiPhapPage/Hệ thống video intercom.webp";
import imgVms from "@/assets/Image/GiaiPhapPage/Phần mềm quản lý trung tâm.webp";
import imgDataCenter from "@/assets/Image/GiaiPhapPage/Giải pháp hạ tầng mạng Data Center.webp";

/**
 * Maps solution slug → imported image.
 * Covers both constants SOLUTIONS_DATA slugs and actual API solution slugs.
 */
export const SOLUTION_IMAGES: Record<string, string> = {
  // ─── API Solution slugs (from live database) ───
  "he-thong-cctv-camera-quan-sat": imgGiamSat,
  "he-thong-access-control": imgKiemSoat,
  "he-thong-cong-an-ninh-nhan-dien-khuon-mat": imgFaceId,
  "he-thong-car-parking": imgParking,
  "he-thong-phan-mem-quan-ly-trung-tam": imgVms,
  "he-thong-chi-dan-bai-dau-xe": imgParkingGuide,
  "he-thong-phan-lan-tu-dong": imgTurnstile,
  "he-thong-man-hinh-ghep": imgVideoWall,
  "he-thong-video-intercom": imgIntercom,
  "he-thong-luu-dien": imgUps,
  "giai-phap-ha-tang-mang-data-center": imgDataCenter,

  // ─── Constants SOLUTIONS_DATA slugs (fallback) ───
  "he-thong-bao-chay-chua-chay": imgGiamSat,
  "he-thong-am-thanh-thong-bao": imgVms,
  "he-thong-mang-lan-wan": imgDataCenter,
  "he-thong-dien-nhe": imgUps,
  "tong-dai-dien-thoai": imgIntercom,
  "he-thong-kiem-soat-ra-vao": imgKiemSoat,
  "he-thong-bao-trom": imgGiamSat,
  "server-luu-tru": imgDataCenter,
  "he-thong-quan-ly-toa-nha-bms": imgVms,
  "tu-van-thiet-ke-du-an": imgDataCenter,
};
