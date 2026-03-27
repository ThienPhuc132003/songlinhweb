import { useMemo } from "react";
import { marked } from "marked";

// Configure marked for clean HTML output
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true,    // GitHub Flavored Markdown
});

/**
 * Parse a markdown string to HTML.
 * Returns memoized result to avoid re-parsing on every render.
 */
export function useMarkdown(content: string | null | undefined): string {
  return useMemo(() => {
    if (!content) return "";

    // If content already contains HTML tags, return as-is
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }

    // Parse markdown to HTML
    const html = marked.parse(content, { async: false }) as string;
    return html;
  }, [content]);
}
