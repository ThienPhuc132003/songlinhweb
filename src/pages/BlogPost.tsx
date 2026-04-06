import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { usePost } from "@/hooks/useApi";
import { useMarkdown } from "@/hooks/useMarkdown";
import { BLOG_POSTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Link2,
  List,
  ChevronRight,
  ChevronLeft,
  Eye,
  Info,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Phone,
  X,
  ZoomIn,
  RefreshCw,
  ShieldCheck,
  Scale,
  Cog,
  Globe,
  Building2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CALLOUT BOX SUPPORT
// Transforms GitHub-style > [!NOTE], > [!WARNING], > [!TIP], > [!INFO]
// into beautiful styled alert cards
// ═══════════════════════════════════════════════════════════════════════════════

const CALLOUT_CONFIG = {
  NOTE: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-l-4 border-l-blue-500 border border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
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

type CalloutType = keyof typeof CALLOUT_CONFIG;

function transformCallouts(html: string): string {
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

function buildCalloutHtml(type: string, content: string): string {
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TECHNICAL TABLE ENHANCEMENT
// Wraps plain <table> into professional striped tables with header bg
// ═══════════════════════════════════════════════════════════════════════════════

function enhanceTables(html: string): string {
  // Wrap all <table> in a scrollable container with professional styling
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── IMAGE ENHANCEMENT
// Makes all images clickable for lightbox, adds zoom icon overlay
// ═══════════════════════════════════════════════════════════════════════════════

function enhanceImages(html: string): string {
  let imgIndex = 0;
  return html.replace(
    /<img([^>]*)src="([^"]*)"([^>]*)>/gi,
    (_, before, src, after) => {
      const idx = imgIndex++;
      return `<figure class="article-image-figure my-8 cursor-pointer group" data-lightbox-idx="${idx}" data-lightbox-src="${src}">
        <div class="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/10">
          <img${before}src="${src}"${after} class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy">
          <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
            <span class="rounded-full bg-white/90 p-2.5 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
            </span>
          </div>
        </div>
      </figure>`;
    },
  );
}

/** Extract all image srcs from enhanced HTML */
function extractImageSrcs(html: string): string[] {
  const srcs: string[] = [];
  const re = /data-lightbox-src="([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) srcs.push(m[1]);
  return srcs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── IN-TEXT CITATIONS
// Transforms [1], [2] etc. into superscript links to #ref-N
// ═══════════════════════════════════════════════════════════════════════════════

interface ReferenceItem {
  title: string;
  url: string;
  type: 'law' | 'standard' | 'news' | 'vendor';
}

function transformCitations(html: string, refCount: number): string {
  if (refCount === 0) return html;
  // Match [N] patterns that are NOT inside href attributes or already transformed
  // Only match digits 1-99 that correspond to actual reference indices
  return html.replace(
    /(?<!href="[^"]*?)(?<!id="[^"]*?)(?<!<a[^>]*>)\[(\d{1,2})\](?!<\/a>)/g,
    (match, num) => {
      const idx = parseInt(num, 10);
      if (idx < 1 || idx > refCount) return match;
      return `<sup class="citation-ref"><a href="#ref-${idx}" class="citation-link text-primary hover:text-primary/80 no-underline font-semibold text-[11px] transition-colors" title="Xem tài liệu tham khảo [${idx}]">[${idx}]</a></sup>`;
    },
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── REFERENCE SECTION
// Professional footer with categorized icons for legal/technical citations
// ═══════════════════════════════════════════════════════════════════════════════

const REF_TYPE_CONFIG = {
  law: {
    icon: Scale,
    label: 'Pháp lý',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
  standard: {
    icon: Cog,
    label: 'Tiêu chuẩn',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
  },
  news: {
    icon: Globe,
    label: 'Tin tức',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  vendor: {
    icon: Building2,
    label: 'Nhà cung cấp',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
  },
} as const;

function ReferenceSection({ references }: { references: ReferenceItem[] }) {
  if (!references || references.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-14 pt-10 border-t-2 border-border/60"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            Tài liệu tham khảo & Căn cứ pháp lý
          </h3>
          <p className="text-xs text-muted-foreground">
            {references.length} nguồn tham khảo được sử dụng trong bài viết này
          </p>
        </div>
      </div>

      {/* Reference List */}
      <div className="space-y-3">
        {references.map((ref, idx) => {
          const config = REF_TYPE_CONFIG[ref.type] || REF_TYPE_CONFIG.standard;
          const IconComp = config.icon;
          return (
            <div
              key={idx}
              id={`ref-${idx + 1}`}
              className={`flex items-start gap-4 p-4 rounded-xl border ${config.border} ${config.bg} transition-all duration-200 hover:shadow-sm scroll-mt-24`}
            >
              {/* Number + Icon */}
              <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                  [{idx + 1}]
                </span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${config.bg} border ${config.border}`}>
                  <IconComp className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {ref.title}
                    </p>
                    <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-medium uppercase tracking-wider ${config.color}`}>
                      <IconComp className="h-2.5 w-2.5" />
                      {config.label}
                    </span>
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors rounded-lg px-3 py-1.5 bg-background border border-border hover:border-primary/30"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="hidden sm:inline">Xem nguồn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(html: string): TocItem[] {
  const regex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  const items: TocItem[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ""),
    });
  }
  if (items.length === 0) {
    const regex2 = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
    let idx = 0;
    while ((match = regex2.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]+>/g, "");
      const id = `heading-${idx++}`;
      items.push({ level: parseInt(match[1]), id, text });
    }
  }
  return items;
}

function addIdsToHeadings(html: string): string {
  let idx = 0;
  return html.replace(/<h([2-3])([^>]*)>/gi, (match, level, attrs) => {
    if (/id="/.test(attrs)) return match;
    const id = `heading-${idx++}`;
    return `<h${level}${attrs} id="${id}">`;
  });
}

function TableOfContents({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
      <nav>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <List className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">
            Mục lục
          </span>
        </div>
        <div className="space-y-0.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`block py-2 px-3 text-[13px] leading-snug transition-all duration-200 rounded-lg ${
                item.level === 3 ? "ml-4" : ""
              } ${
                activeId === item.id
                  ? "text-primary font-semibold bg-primary/8 border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border-l-2 border-transparent"
              }`}
            >
              {item.text}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── READING PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════════

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── LIGHTBOX
// ═══════════════════════════════════════════════════════════════════════════════

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 text-white hover:bg-white/20 h-12 w-12"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 text-white hover:bg-white/20 h-12 w-12"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt=""
          className="max-h-[80vh] rounded-lg object-contain shadow-2xl"
        />
        {images.length > 1 && (
          <p className="mt-3 text-center text-sm text-white/70">
            {index + 1} / {images.length}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── SHARE BUTTONS
// ═══════════════════════════════════════════════════════════════════════════════

function ShareButtons({ title, url }: { title: string; url: string }) {
  const fullUrl =
    typeof window !== "undefined" ? window.location.origin + url : url;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Đã sao chép liên kết!");
    } catch {
      toast.error("Không thể sao chép");
    }
  }, [fullUrl]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Chia sẻ:</span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyLink} title="Sao chép liên kết">
        <Link2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" asChild title="Facebook">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`} target="_blank" rel="noopener noreferrer">
          <Share2 className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CTA BOX (Conversion)
// ═══════════════════════════════════════════════════════════════════════════════

function CTABox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-8 md:p-10"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Bạn cần tư vấn giải pháp kỹ thuật?
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            Đội ngũ kỹ sư của Song Linh Technologies sẵn sàng tư vấn và thiết kế
            giải pháp phù hợp cho dự án của bạn. Liên hệ ngay để được hỗ trợ miễn phí.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button asChild variant="outline" className="gap-2">
            <a href="tel:0968811911">
              <Phone className="h-4 w-4" />
              Gọi ngay
            </a>
          </Button>
          <Button asChild className="gap-2 shadow-lg shadow-primary/20">
            <Link to="/lien-he">
              <MessageSquare className="h-4 w-4" />
              Liên hệ chuyên gia
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CATEGORY LABEL
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIES: Record<string, string> = {
  general: "Tổng hợp",
  technology: "Công nghệ",
  "project-update": "Dự án",
  "industry-news": "Tin ngành",
  tutorial: "Hướng dẫn",
};

function getCategoryLabel(value: string) {
  return CATEGORIES[value] || value;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePost(slug ?? "");

  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);

  // ─── Derive ALL state + call ALL hooks BEFORE any early return ───
  const title = post?.title ?? staticPost?.title ?? "Bài viết";
  const excerpt = post?.excerpt ?? staticPost?.excerpt ?? "";
  const author = post?.author ?? staticPost?.author ?? "Song Linh Technologies";
  const publishedAt = post?.published_at ?? post?.created_at ?? staticPost?.publishedAt ?? "";
  const lastUpdatedAt = post?.last_updated_at ?? null;
  const reviewedBy = post?.reviewed_by ?? null;
  const thumbnail = post?.thumbnail_url ?? staticPost?.thumbnail ?? null;
  const rawTags = post?.tags ?? (staticPost?.tags as unknown as string[]) ?? [];
  const tags: string[] = Array.isArray(rawTags) ? rawTags : (() => { try { return JSON.parse(rawTags as string); } catch { return []; } })();
  const content = post?.content_md ?? null;
  const category = post?.category || "general";
  const readingTime =
    post?.reading_time_min || Math.ceil((content?.split(/\s+/).length || 100) / 200);
  const viewCount = post?.view_count || 0;
  const relatedPosts = post?.related ?? [];

  // Parse references
  const references: ReferenceItem[] = useMemo(() => {
    try {
      const raw = post?.references;
      if (!raw) return [];
      if (typeof raw === 'string') return JSON.parse(raw);
      if (Array.isArray(raw)) return raw;
      return [];
    } catch { return []; }
  }, [post?.references]);

  const rawHtml = useMarkdown(content);

  // Pipeline: add IDs → callouts → tables → images → citations
  const contentHtml = useMemo(() => {
    let html = addIdsToHeadings(rawHtml);
    html = transformCallouts(html);
    html = enhanceTables(html);
    html = enhanceImages(html);
    html = transformCitations(html, references.length);
    return html;
  }, [rawHtml, references.length]);

  // Extract data from processed HTML
  const tocItems = useMemo(() => extractToc(contentHtml), [contentHtml]);
  const articleImages = useMemo(() => extractImageSrcs(contentHtml), [contentHtml]);

  // Active heading tracking
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    if (tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Click handler for images in article
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleClick = (e: MouseEvent) => {
      const figure = (e.target as HTMLElement).closest("[data-lightbox-idx]");
      if (figure) {
        const idx = parseInt(figure.getAttribute("data-lightbox-idx") || "0", 10);
        setLightboxIdx(idx);
        setLightboxOpen(true);
      }
    };
    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [contentHtml]);

  // ─── LOADING STATE ───
  if (isLoading) {
    return (
      <>
        <PageHero
          title=""
          breadcrumbs={[{ label: "Tin tức", href: "/tin-tuc" }, { label: "..." }]}
          compact
        />
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
              <div className="max-w-3xl space-y-6">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="space-y-4 pt-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? "w-5/6" : "w-full"}`} />
                  ))}
                </div>
              </div>
              <div className="hidden lg:block space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ─── RENDERED PAGE ───
  return (
    <>
      <ReadingProgress />

      <SEO
        title={title}
        description={excerpt}
        url={`/tin-tuc/${slug}`}
        image={thumbnail ?? undefined}
        type="article"
      />

      <PageHero
        title={title}
        breadcrumbs={[{ label: "Tin tức", href: "/tin-tuc" }, { label: title }]}
        compact
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Always show 2-column layout: Content | Sidebar */}
          <div className="grid grid-cols-1 gap-10 lg:gap-14 lg:grid-cols-[1fr_280px]">
            {/* ═══ MAIN CONTENT ═══ */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl min-w-0"
            >
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-5"
              >
                <Badge
                  className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  {getCategoryLabel(category)}
                </Badge>
              </motion.div>

              {/* Meta Info Bar — Authority Enhanced */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mb-8 border-b border-border pb-6"
              >
                {/* Row 1: Dates + Reviewer */}
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-primary/60" />
                    <span className="font-medium text-foreground/80">{author}</span>
                  </span>
                  {publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      {new Date(publishedAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {lastUpdatedAt && (
                    <span className="flex items-center gap-1.5 text-xs">
                      <RefreshCw className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        Cập nhật: {new Date(lastUpdatedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </span>
                  )}
                </div>

                {/* Row 2: Reading time, views, reviewer */}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary/60" />
                    {readingTime} phút đọc
                  </span>
                  {viewCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-primary/60" />
                      {viewCount.toLocaleString()} lượt xem
                    </span>
                  )}
                  {reviewedBy && (
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                        Kiểm duyệt: {reviewedBy}
                      </span>
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Tags */}
              {tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 flex flex-wrap gap-2"
                >
                  {tags.map((tag) => (
                    <Badge key={String(tag)} variant="outline" className="text-xs">
                      #{String(tag)}
                    </Badge>
                  ))}
                </motion.div>
              )}

              {/* Thumbnail */}
              {thumbnail && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="mb-12 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/10"
                >
                  <img src={thumbnail} alt={title} className="w-full object-cover" />
                </motion.div>
              )}

              {/* ═══ ARTICLE CONTENT — Professional Typography ═══ */}
              {contentHtml ? (
                <motion.div
                  ref={contentRef}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div
                    className="
                      article-content
                      prose prose-lg dark:prose-invert max-w-none

                      /* ── Heading hierarchy ── */
                      prose-headings:scroll-mt-24
                      prose-headings:font-bold
                      prose-headings:tracking-tight
                      prose-headings:text-foreground

                      prose-h2:text-[1.65rem]
                      prose-h2:mt-14
                      prose-h2:mb-6
                      prose-h2:pb-3
                      prose-h2:border-b
                      prose-h2:border-border/60
                      prose-h2:text-primary/90

                      prose-h3:text-xl
                      prose-h3:mt-10
                      prose-h3:mb-4
                      prose-h3:text-foreground/90

                      prose-h4:text-lg
                      prose-h4:mt-8
                      prose-h4:mb-3
                      prose-h4:font-semibold

                      /* ── Reading experience ── */
                      prose-p:leading-[1.85]
                      prose-p:mb-6
                      prose-p:text-foreground/80

                      prose-li:leading-[1.8]
                      prose-li:mb-1.5
                      prose-li:text-foreground/80

                      prose-ul:my-6
                      prose-ol:my-6

                      /* ── Visual elements ── */
                      prose-img:rounded-2xl
                      prose-img:shadow-lg
                      prose-img:mx-auto
                      prose-img:my-10

                      prose-figure:text-center
                      prose-figcaption:text-sm
                      prose-figcaption:text-muted-foreground
                      prose-figcaption:mt-3
                      prose-figcaption:italic

                      /* ── Blockquotes ── */
                      prose-blockquote:border-l-[3px]
                      prose-blockquote:border-l-primary
                      prose-blockquote:bg-muted/30
                      prose-blockquote:rounded-r-xl
                      prose-blockquote:py-4
                      prose-blockquote:px-6
                      prose-blockquote:my-8
                      prose-blockquote:text-foreground/75
                      prose-blockquote:not-italic
                      prose-blockquote:font-normal

                      /* ── Code ── */
                      prose-code:bg-muted
                      prose-code:rounded-md
                      prose-code:px-1.5
                      prose-code:py-0.5
                      prose-code:text-sm
                      prose-code:font-normal
                      prose-code:before:content-none
                      prose-code:after:content-none
                      prose-pre:bg-[#1e1e2e]
                      prose-pre:rounded-xl
                      prose-pre:shadow-xl
                      prose-pre:my-8

                      /* ── Links ── */
                      prose-a:text-primary
                      prose-a:no-underline
                      prose-a:font-medium
                      hover:prose-a:underline

                      /* ── Misc ── */
                      prose-strong:text-foreground
                      prose-strong:font-semibold
                      prose-hr:my-12
                      prose-hr:border-border/50
                    "
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </motion.div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-foreground/80">{excerpt}</p>
                  <p className="text-muted-foreground mt-4 italic">
                    Nội dung chi tiết đang được cập nhật. Vui lòng quay lại sau.
                  </p>
                </div>
              )}

              {/* ═══ REFERENCE SECTION ═══ */}
              <ReferenceSection references={references} />

              {/* Share + Back */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-14 border-t pt-8 flex items-center justify-between"
              >
                <Button variant="outline" asChild>
                  <Link to="/tin-tuc">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại tin tức
                  </Link>
                </Button>
                <ShareButtons title={title} url={`/tin-tuc/${slug}`} />
              </motion.div>

              {/* ═══ CTA BOX ═══ */}
              <div>
                <CTABox />
              </div>

              {/* ═══ RELATED POSTS ═══ */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mt-14 pt-10 border-t"
                >
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <ChevronRight className="h-5 w-5 text-primary" />
                    Bài viết liên quan
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((related, i) => (
                      <motion.div
                        key={related.slug}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                      >
                        <Link to={`/tin-tuc/${related.slug}`} className="group block">
                          <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30 border-b-2 border-b-transparent hover:border-b-primary">
                            {related.thumbnail_url && (
                              <div className="aspect-video overflow-hidden bg-muted">
                                <img
                                  src={related.thumbnail_url}
                                  alt={related.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <CardContent className="p-5">
                              <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                {related.title}
                              </h4>
                              {related.excerpt && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {related.excerpt}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {related.reading_time_min ?? 3} phút đọc
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.article>

            {/* ═══ RIGHT SIDEBAR — Always Visible ═══ */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                {/* ToC — if headings exist */}
                {tocItems.length > 0 && (
                  <TableOfContents items={tocItems} activeId={activeHeading} />
                )}

                {/* Author Card */}
                <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Chuyên gia phụ trách
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{author}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Song Linh Technologies
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact CTA in sidebar */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <p className="text-xs font-bold text-foreground mb-2">
                    Cần tư vấn kỹ thuật?
                  </p>
                  <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
                    Liên hệ đội ngũ chuyên gia để được hỗ trợ giải pháp.
                  </p>
                  <Button asChild size="sm" className="w-full gap-2 text-xs shadow-sm">
                    <Link to="/lien-he">
                      <Phone className="h-3.5 w-3.5" />
                      Liên hệ ngay
                    </Link>
                  </Button>
                </div>

                {/* Category list */}
                <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Chuyên mục
                  </p>
                  <div className="space-y-1">
                    {Object.entries(CATEGORIES).map(([key, label]) => (
                      <Link
                        key={key}
                        to={`/tin-tuc?category=${key}`}
                        className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${
                          category === key
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══ IMAGE LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxOpen && articleImages.length > 0 && (
          <Lightbox
            images={articleImages}
            index={lightboxIdx}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => setLightboxIdx((i) => (i === 0 ? articleImages.length - 1 : i - 1))}
            onNext={() => setLightboxIdx((i) => (i === articleImages.length - 1 ? 0 : i + 1))}
          />
        )}
      </AnimatePresence>
    </>
  );
}
