import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked for clean HTML output
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true,    // GitHub Flavored Markdown
});

/**
 * Parse a markdown string to sanitized HTML.
 * All output is sanitized via DOMPurify to prevent XSS from database content.
 * Returns memoized result to avoid re-parsing on every render.
 */
export function useMarkdown(content: string | null | undefined): string {
  return useMemo(() => {
    if (!content) return "";

    // If content already contains HTML tags, sanitize and return
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return DOMPurify.sanitize(content);
    }

    // Parse markdown to HTML, then sanitize
    const html = marked.parse(content, { async: false }) as string;
    return DOMPurify.sanitize(html);
  }, [content]);
}
