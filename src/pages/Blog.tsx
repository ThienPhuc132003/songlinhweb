import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { usePosts } from "@/hooks/useApi";
import { BLOG_POSTS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ArrowRight,
  User,
  FileText,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Category Tabs ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "technology", label: "Công nghệ" },
  { value: "project-update", label: "Dự án" },
  { value: "industry-news", label: "Tin ngành" },
  { value: "tutorial", label: "Hướng dẫn" },
  { value: "general", label: "Tổng hợp" },
];

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

const ITEMS_PER_PAGE = 9;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = usePosts();

  const posts = useMemo(() => {
    const apiPosts =
      data?.items?.map((p) => ({
        ...p,
        category: p.category || "general",
        reading_time_min: p.reading_time_min || Math.ceil((p.excerpt?.length || 100) / 200),
        view_count: p.view_count || 0,
        is_featured: p.is_featured || 0,
      })) ?? [];

    if (apiPosts.length > 0) return apiPosts;

    // Fallback to static data
    return BLOG_POSTS.map((p, i) => ({
      id: i + 1,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content_md: null as string | null,
      thumbnail_url: p.thumbnail,
      author: p.author,
      tags: p.tags as unknown as string[],
      is_published: 1 as const,
      published_at: p.publishedAt,
      created_at: p.publishedAt,
      updated_at: p.publishedAt,
      category: "general",
      reading_time_min: 3,
      view_count: 0,
      is_featured: i === 0 ? 1 : 0,
      status: "published" as string,
      meta_title: null as string | null,
      meta_description: null as string | null,
    }));
  }, [data]);

  // Filter by category
  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  // Featured post (first featured or first post)
  const featuredPost = useMemo(
    () => filteredPosts.find((p) => p.is_featured) || filteredPosts[0],
    [filteredPosts],
  );

  // Other posts (exclude featured)
  const otherPosts = useMemo(
    () => filteredPosts.filter((p) => p.id !== featuredPost?.id),
    [filteredPosts, featuredPost],
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(otherPosts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedPosts = otherPosts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  // Reset page on category change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <>
      <SEO
        title="Tin tức"
        description="Tin tức, kiến thức và xu hướng công nghệ từ Song Linh Technologies."
        url="/tin-tuc"
      />

      <PageHero
        title="Tin tức & Kiến thức"
        subtitle="Cập nhật kiến thức, xu hướng công nghệ và hoạt động của Song Linh Technologies"
        breadcrumbs={[{ label: "Tin tức" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* ─── Category Tabs ─── */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {/* Featured skeleton */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="aspect-video w-full rounded-sm" />
                <div className="space-y-3 py-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              {/* Grid skeleton */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-sm border p-4">
                    <Skeleton className="aspect-video w-full rounded-sm" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="text-muted-foreground/30 mx-auto mb-4 h-16 w-16" />
              <p className="text-muted-foreground text-lg">
                Chưa có tin tức nào trong danh mục này.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-10"
              >
                {/* ─── Featured Post (Hero Card) ─── */}
                {featuredPost && (
                  <Link to={`/tin-tuc/${featuredPost.slug}`} className="group block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative overflow-hidden rounded-sm border bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="grid gap-0 lg:grid-cols-2">
                        {/* Image */}
                        <div className="bg-muted aspect-video overflow-hidden lg:aspect-auto lg:min-h-[320px]">
                          {featuredPost.thumbnail_url ? (
                            <img
                              src={featuredPost.thumbnail_url}
                              alt={featuredPost.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FileText className="text-muted-foreground/20 h-16 w-16" />
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex flex-col justify-center p-6 lg:p-8">
                          <div className="flex items-center gap-2 mb-3">
                            {featuredPost.is_featured ? (
                              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
                                <Star className="mr-1 h-3 w-3 fill-current" />
                                Nổi bật
                              </Badge>
                            ) : null}
                            <Badge variant="secondary" className="text-[10px]">
                              {getCategoryLabel(featuredPost.category)}
                            </Badge>
                          </div>
                          <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors lg:text-2xl">
                            {featuredPost.title}
                          </h2>
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {featuredPost.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(
                                featuredPost.published_at ?? featuredPost.created_at,
                              ).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {featuredPost.reading_time_min} phút đọc
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )}

                {/* ─── Post Grid ─── */}
                {pagedPosts.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pagedPosts.map((post, i) => (
                      <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link
                          to={`/tin-tuc/${post.slug}`}
                          className="group block h-full"
                        >
                          <Card className="hover:border-primary/30 h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-b-2 border-b-transparent hover:border-b-primary">
                            {/* Thumbnail */}
                            <div className="bg-muted aspect-video overflow-hidden relative">
                              {post.thumbnail_url ? (
                                <img
                                  src={post.thumbnail_url}
                                  alt={post.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <FileText className="text-muted-foreground/30 h-10 w-10" />
                                </div>
                              )}
                              {/* Category badge overlay */}
                              <div className="absolute top-3 left-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-background/80 backdrop-blur-sm text-[10px] shadow-sm"
                                >
                                  {getCategoryLabel(post.category)}
                                </Badge>
                              </div>
                            </div>

                            <CardContent className="p-5">
                              {/* Tags */}
                              {post.tags && post.tags.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-1">
                                  {(Array.isArray(post.tags) ? post.tags : [])
                                    .slice(0, 2)
                                    .map((tag) => (
                                      <Badge
                                        key={String(tag)}
                                        variant="outline"
                                        className="text-[10px] font-normal"
                                      >
                                        #{String(tag)}
                                      </Badge>
                                    ))}
                                </div>
                              )}

                              <h2 className="group-hover:text-primary mb-2 line-clamp-2 text-base font-semibold transition-colors leading-tight">
                                {post.title}
                              </h2>

                              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                                {post.excerpt}
                              </p>

                              <div className="text-muted-foreground flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      post.published_at ?? post.created_at,
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {post.reading_time_min}m
                                  </span>
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ─── Pagination ─── */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={page === safePage ? "default" : "outline"}
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
