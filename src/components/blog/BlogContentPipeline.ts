// ═══════════════════════════════════════════════════════════════════════════════
// ─── CONTENT PIPELINE
// Orchestrates all HTML transforms in the correct order
// ═══════════════════════════════════════════════════════════════════════════════

import { transformCallouts } from './BlogCallout';
import { enhanceTables } from './BlogTableEnhancer';
import { enhanceImages } from './BlogImageEnhancer';
import { transformCitations } from './BlogCitations';

/** Add IDs to headings that don't already have them */
export function addIdsToHeadings(html: string): string {
  let idx = 0;
  return html.replace(/<h([2-3])([^>]*)>/gi, (match, level, attrs) => {
    if (/id="/.test(attrs)) return match;
    const id = `heading-${idx++}`;
    return `<h${level}${attrs} id="${id}">`;
  });
}

/**
 * Full content processing pipeline:
 * 1. Add IDs to headings (for ToC)
 * 2. Transform callout blockquotes
 * 3. Enhance tables with professional styling
 * 4. Enhance images with lightbox support
 * 5. Transform citation references
 */
export function processContent(rawHtml: string, refCount: number): string {
  let html = addIdsToHeadings(rawHtml);
  html = transformCallouts(html);
  html = enhanceTables(html);
  html = enhanceImages(html);
  html = transformCitations(html, refCount);
  return html;
}
