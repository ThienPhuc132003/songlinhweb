import { Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { usePosts } from "@/hooks/useApi";
import { BLOG_POSTS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, User, FileText } from "lucide-react";

export default function Blog() {
  const { data, isLoading } = usePosts();
  const posts =
    data?.items ??
    BLOG_POSTS.map((p, i) => ({
      id: i + 1,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content_md: null,
      thumbnail_url: p.thumbnail,
      author: p.author,
      tags: p.tags as unknown as string[],
      is_published: 1 as const,
      published_at: p.publishedAt,
      created_at: p.publishedAt,
      updated_at: p.publishedAt,
    }));

  return (
    <>
      <SEO
        title="Tin tức"
        description="Tin tức, kiến thức và xu hướng công nghệ từ Song Linh Technologies."
        url="/tin-tuc"
      />

      <PageHero
        title="Tin tức"
        subtitle="Cập nhật kiến thức, xu hướng công nghệ và hoạt động của Song Linh Technologies"
        breadcrumbs={[{ label: "Tin tức" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="text-muted-foreground/30 mx-auto mb-4 h-16 w-16" />
              <p className="text-muted-foreground text-lg">
                Chưa có bài viết nào.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link to={`/tin-tuc/${post.slug}`} className="group block h-full">
                    <Card className="hover:border-primary/30 h-full overflow-hidden transition-all hover:shadow-lg">
                      {/* Thumbnail */}
                      <div className="bg-muted aspect-video overflow-hidden">
                        {post.thumbnail_url ? (
                          <img
                            src={post.thumbnail_url}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FileText className="text-muted-foreground/30 h-10 w-10" />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <h2 className="group-hover:text-primary mb-2 line-clamp-2 text-base font-semibold transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                          {post.excerpt}
                        </p>

                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                post.published_at ?? post.created_at,
                              ).toLocaleDateString("vi-VN")}
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
        </div>
      </section>
    </>
  );
}
