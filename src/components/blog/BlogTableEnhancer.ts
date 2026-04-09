// ═══════════════════════════════════════════════════════════════════════════════
// ─── TECHNICAL TABLE ENHANCEMENT
// Wraps plain <table> into professional striped tables with header bg
// ═══════════════════════════════════════════════════════════════════════════════

export function enhanceTables(html: string): string {
  return html.replace(
    /<table>/g,
    `<div class="not-prose my-8 overflow-x-auto rounded-xl border border-border shadow-sm">
      <table class="w-full text-sm">`,
  ).replace(
    /<\/table>/g,
    `</table></div>`,
  ).replace(
    /<thead>/g,
    `<thead class="bg-muted/60 dark:bg-muted/30">`,
  ).replace(
    /<th>/g,
    `<th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground/70 border-b-2 border-border">`,
  ).replace(
    /<td>/g,
    `<td class="px-4 py-3 border-b border-border/50 text-foreground/80">`,
  ).replace(
    /<tr>/g,
    `<tr class="transition-colors hover:bg-muted/30 even:bg-muted/10">`,
  );
}
