// ═══════════════════════════════════════════════════════════════════════════════
// ─── IN-TEXT CITATIONS
// Transforms [1], [2] etc. into superscript links to #ref-N
// ═══════════════════════════════════════════════════════════════════════════════

export interface ReferenceItem {
  title: string;
  url: string;
  type: 'law' | 'standard' | 'news' | 'vendor';
}

export function transformCitations(html: string, refCount: number): string {
  if (refCount === 0) return html;
  // Match [N] patterns that are NOT inside href attributes or already transformed
  // Only match digits 1-99 that correspond to actual reference indices
  return html.replace(
    /(?<!href="[^"]*?)(?<!id="[^"]*?)(?!<a[^>]*>)\[(\d{1,2})\](?!<\/a>)/g,
    (match, num) => {
      const idx = parseInt(num, 10);
      if (idx < 1 || idx > refCount) return match;
      return `<sup class="citation-ref"><a href="#ref-${idx}" class="citation-link text-primary hover:text-primary/80 no-underline font-semibold text-[11px] transition-colors" title="Xem tài liệu tham khảo [${idx}]">[${idx}]</a></sup>`;
    },
  );
}
