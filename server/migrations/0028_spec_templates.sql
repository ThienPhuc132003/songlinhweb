-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 0028: Spec Templates for Industrial Intelligence Catalog
-- Seeds reusable specification templates per ELV product category
-- ═══════════════════════════════════════════════════════════════════════════════

-- Seed spec templates in site_config (JSON: category_key → array of spec labels)
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('spec_templates', '{
    "cctv": ["Độ phân giải", "Ống kính", "Tầm hồng ngoại", "Chuẩn nén video", "WDR", "Chuẩn chống nước/bụi", "Nguồn điện", "Nhiệt độ hoạt động", "Kích thước", "Trọng lượng"],
    "access_control": ["Dung lượng vân tay", "Dung lượng thẻ", "Dung lượng khuôn mặt", "Màn hình", "Giao tiếp", "Giao thức", "Nguồn điện", "Nhiệt độ hoạt động"],
    "networking": ["Số cổng", "Tốc độ cổng", "Switching Capacity", "Bảng MAC", "VLAN", "PoE Budget", "Quản lý", "Nguồn điện", "Kích thước"],
    "fire_alarm": ["Loại đầu báo", "Tiêu chuẩn", "Số vùng/zone", "Số loop", "Nguồn chính", "Pin backup", "Nhiệt độ hoạt động", "Kích thước"],
    "pa_system": ["Công suất", "Trở kháng", "Tần số đáp ứng", "SPL (dB)", "Nguồn điện", "Kích thước", "Trọng lượng"],
    "ups": ["Công suất (VA/W)", "Dạng sóng", "Thời gian lưu điện", "Số ổ cắm", "Giao tiếp", "Kích thước", "Trọng lượng"],
    "general": ["Model", "Nguồn điện", "Nhiệt độ hoạt động", "Kích thước", "Trọng lượng", "Chứng nhận"]
  }', 'Dynamic specification templates for product categories. Keys map to category slugs.');

-- Map category slugs to template keys (for auto-select)
INSERT OR IGNORE INTO site_config (key, value, description) VALUES
  ('spec_template_mapping', '{
    "camera-ip": "cctv",
    "camera-analog": "cctv",
    "camera-ptz": "cctv",
    "dau-ghi-hinh": "cctv",
    "kiem-soat-ra-vao": "access_control",
    "cham-cong": "access_control",
    "thiet-bi-mang": "networking",
    "switch": "networking",
    "router": "networking",
    "pccc": "fire_alarm",
    "dau-bao-chay": "fire_alarm",
    "am-thanh": "pa_system",
    "loa": "pa_system",
    "ups": "ups",
    "nguon-dien": "ups"
  }', 'Maps product category slugs to spec template keys for auto-selection.');
