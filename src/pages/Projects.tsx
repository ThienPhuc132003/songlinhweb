import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProjects } from "@/hooks/useApi";
import { FEATURED_PROJECTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const CATEGORIES = ["Tất cả", "Thương mại", "Văn phòng", "Khách sạn", "Y tế", "Dân cư", "Công nghiệp"];

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
        description: p.description,
      }))
    : FEATURED_PROJECTS.map((p) => ({ ...p, description: "" }));

  return (
    <>
      <SEO
        title="Dự án tiêu biểu"
        description="Những dự án tích hợp hệ thống được SLTECH tư vấn, thiết kế và thi công."
        url="/du-an"
      />

      <PageHero
        title="Dự án tiêu biểu"
        subtitle="Những dự án được SLTECH tư vấn, thiết kế và thi công thành công"
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
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border">
                    <Skeleton className="aspect-4/3 w-full" />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-3/4" />
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
        className="group block overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="bg-muted relative aspect-4/3 overflow-hidden">
          {imgError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
              <Building2 className="text-muted-foreground/40 h-12 w-12" />
              <span className="text-muted-foreground text-center text-sm font-medium">
                {title}
              </span>
            </div>
          ) : (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="p-4">
          <span className="text-primary mb-1 block text-xs font-medium">
            {category}
          </span>
          <h3 className="group-hover:text-primary font-semibold transition-colors">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
