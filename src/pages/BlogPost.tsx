import { useState, useEffect, useMemo, useRef } from "react";
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
  ChevronRight,
  Eye,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

// Decomposed sub-components
import {
  processContent,
  extractImageSrcs,
  extractToc,
  TableOfContents,
  ReadingProgress,
  Lightbox,
  ShareButtons,
  CTABox,
  ReferenceSection,
  CATEGORIES,
  getCategoryLabel,
} from "@/components/blog";
import type { ReferenceItem } from "@/components/blog";

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

  // Pipeline: process all transforms
  const contentHtml = useMemo(
    () => processContent(rawHtml, references.length),
    [rawHtml, references.length],
  );

  // Extract data from processed HTML
  const tocItems = useMemo(() => extractToc(contentHtml), [contentHtml]);
  const articleImages = useMemo(() => extractImageSrcs(contentHtml), [contentHtml]);

  // Active heading tracking (scrollspy)
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
                      <RefreshCw className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary font-medium">
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
