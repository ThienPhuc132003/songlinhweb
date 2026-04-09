// ═══════════════════════════════════════════════════════════════════════════════
// ─── CALLOUT BOX SUPPORT
// Transforms GitHub-style > [!NOTE], > [!WARNING], > [!TIP], > [!INFO]
// into beautiful styled alert cards
// ═══════════════════════════════════════════════════════════════════════════════

export const CALLOUT_CONFIG = {
  NOTE: {
    bg: "bg-primary/5 dark:bg-primary/10",
    border: "border-l-4 border-l-primary border border-primary/20 dark:border-primary/30",
    iconColor: "text-primary dark:text-primary",
    title: "Lưu ý kỹ thuật",
    svgPath: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  },
  INFO: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-l-4 border-l-sky-500 border border-sky-200 dark:border-sky-800",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Thông tin",
    svgPath: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  },
  WARNING: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-l-4 border-l-amber-500 border border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Cảnh báo",
    svgPath: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  },
  TIP: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-l-4 border-l-emerald-500 border border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "Mẹo chuyên gia",
    svgPath: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  },
} as const;

export type CalloutType = keyof typeof CALLOUT_CONFIG;

export function transformCallouts(html: string): string {
  // Pattern 1: with <br>
  html = html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|WARNING|INFO|TIP)\]\s*<br\s*\/?>\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type: string, content: string) => buildCalloutHtml(type, content),
  );
  // Pattern 2: without <br> (newline variant)
  html = html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|WARNING|INFO|TIP)\]\s*\n([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type: string, content: string) => buildCalloutHtml(type, content),
  );
  return html;
}

export function buildCalloutHtml(type: string, content: string): string {
  const key = type.toUpperCase() as CalloutType;
  const cfg = CALLOUT_CONFIG[key];
  if (!cfg) return content;
  return `<div class="callout-box callout-${key.toLowerCase()} ${cfg.bg} ${cfg.border} rounded-xl p-5 my-8 not-prose shadow-sm">
    <div class="flex items-start gap-3">
      <span class="callout-icon ${cfg.iconColor} mt-0.5 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${cfg.svgPath}</svg>
      </span>
      <div class="flex-1">
        <p class="text-sm font-bold mb-1.5 ${cfg.iconColor}">${cfg.title}</p>
        <div class="text-sm leading-relaxed text-foreground/80">${content.trim()}</div>
      </div>
    </div>
  </div>`;
}
