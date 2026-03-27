import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { usePost } from "@/hooks/useApi";
import { BLOG_POSTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePost(slug ?? "");

  // Fallback to constants if API not available
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);

  if (isLoading) {
    return (
      <>
        <PageHero
          title=""
          breadcrumbs={[
            { label: "Tin tức", href: "/tin-tuc" },
            { label: "..." },
          ]}
          compact
        />
        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            <Skeleton className="mb-4 h-8 w-3/4" />
            <Skeleton className="mb-6 h-4 w-1/2" />
            <Skeleton className="aspect-video mb-8 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </section>
      </>
    );
  }

  const title = post?.title ?? staticPost?.title ?? "Bài viết";
  const excerpt = post?.excerpt ?? staticPost?.excerpt ?? "";
  const author = post?.author ?? staticPost?.author ?? "Song Linh Technologies";
  const publishedAt =
    post?.published_at ?? post?.created_at ?? staticPost?.publishedAt ?? "";
  const thumbnail = post?.thumbnail_url ?? staticPost?.thumbnail ?? null;
  const tags = post?.tags ?? (staticPost?.tags as unknown as string[]) ?? [];
  const content = post?.content_md ?? null;

  return (
    <>
      <SEO
        title={title}
        description={excerpt}
        url={`/tin-tuc/${slug}`}
        image={thumbnail ?? undefined}
        type="article"
      />

      <PageHero
        title={title}
        breadcrumbs={[
          { label: "Tin tức", href: "/tin-tuc" },
          { label: title },
        ]}
        compact
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Meta */}
            <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {author}
              </span>
              {publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(publishedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Thumbnail */}
            {thumbnail && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            {content ? (
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">{excerpt}</p>
                <p className="text-muted-foreground mt-4 italic">
                  Nội dung chi tiết đang được cập nhật. Vui lòng quay lại sau.
                </p>
              </div>
            )}

            {/* Back button */}
            <div className="mt-10 border-t pt-6">
              <Button variant="outline" asChild>
                <Link to="/tin-tuc">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại tin tức
                </Link>
              </Button>
            </div>
          </motion.article>
        </div>
      </section>
    </>
  );
}
