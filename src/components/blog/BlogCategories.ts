// ═══════════════════════════════════════════════════════════════════════════════
// ─── BLOG CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const CATEGORIES: Record<string, string> = {
  general: "Tổng hợp",
  technology: "Công nghệ",
  "project-update": "Dự án",
  "industry-news": "Tin ngành",
  tutorial: "Hướng dẫn",
};

export function getCategoryLabel(value: string) {
  return CATEGORIES[value] || value;
}
