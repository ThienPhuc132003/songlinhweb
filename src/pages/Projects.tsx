import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProjects } from "@/hooks/useApi";
import { FEATURED_PROJECTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const CATEGORIES = ["Tất cả", "Thương mại", "Văn phòng", "Khách sạn", "Y tế", "Dân cư", "Công nghiệp", "Giáo dục", "Công trình"];

export default function Projects() {
  const [category, setCategory] = useState<string>();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProjects({ page, category });

  const projects = data?.items?.length
    ? data.items.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        image: p.thumbnail_url ?? `/images/projects/${p.slug}.jpg`,
        description: p.description || "",
      }))
    : FEATURED_PROJECTS.map((p) => ({ ...p, description: "" }));

  return (
    <>
      <SEO
        title="Dự án tiêu biểu"
        description="Những dự án tích hợp hệ thống được Song Linh Technologies tư vấn, thiết kế và thi công."
        url="/du-an"
      />

      <PageHero
        title="Dự án tiêu biểu"
        subtitle="Những dự án được Song Linh Technologies tư vấn, thiết kế và thi công thành công"
        breadcrumbs={[{ label: "Dự án" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = cat === "Tất cả" ? !category : category === cat;
              return (
                <Button
                  key={cat}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-200"
                  onClick={() => {
                    setCategory(cat === "Tất cả" ? undefined : cat);
                    setPage(1);
                  }}
                >
                  {cat}
                </Button>
              );
            })}
          </div>

          {/* Projects grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            key={category ?? "all"}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border">
                    <Skeleton className="aspect-video w-full" />
                    <div className="space-y-2 p-5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              : projects.map((project) => (
                  <ProjectCard key={project.slug} {...project} />
                ))}
          </motion.div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProjectCard({
  slug,
  title,
  category,
  image,
  description,
}: {
  slug: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div variants={fadeInUp}>
      <Link
        to={`/du-an/${slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5"
      >
        {/* Image — shrunk from aspect-4/3 → aspect-video */}
        <div className="relative shrink-0 overflow-hidden">
          {imgError ? (
            <ImagePlaceholder
              className="aspect-video"
              variant="project"
              title={title}
            />
          ) : (
            <img
              src={image}
              alt={title}
              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-5">
          <span className="text-primary mb-1 block text-xs font-medium">
            {category}
          </span>
          <h3 className="group-hover:text-primary line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors">
            {title}
          </h3>
          {description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {/* CTA — pinned to bottom */}
          <span className="mt-auto inline-flex items-center pt-3 text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
            Xem chi tiết
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

