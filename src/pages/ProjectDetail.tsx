import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProject } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Building2, Phone, ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug ?? "");

  if (isLoading) {
    return (
      <>
        <PageHero
          title=""
          breadcrumbs={[
            { label: "Dự án", href: "/du-an" },
            { label: "..." },
          ]}
          compact
        />
        <section className="section-padding">
          <div className="container-custom max-w-4xl space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <PageHero
          title="Không tìm thấy dự án"
          breadcrumbs={[
            { label: "Dự án", href: "/du-an" },
            { label: "404" },
          ]}
        />
        <section className="section-padding">
          <div className="container-custom text-center">
            <p className="text-muted-foreground mb-4">
              Dự án bạn tìm kiếm không tồn tại.
            </p>
            <Button asChild>
              <Link to="/du-an">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title={project.title}
        description={project.description}
        url={`/du-an/${slug}`}
        image={project.thumbnail_url ?? undefined}
      />

      <PageHero
        title={project.title}
        breadcrumbs={[
          { label: "Dự án", href: "/du-an" },
          { label: project.title },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Project thumbnail */}
            {project.thumbnail_url && (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="mb-8 aspect-video w-full rounded-xl border object-cover"
              />
            )}

            {/* Meta info */}
            <div className="mb-8 flex flex-wrap gap-4">
              {project.category && (
                <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
                  <Building2 className="h-3.5 w-3.5" />
                  {project.category}
                </span>
              )}
              {project.location && (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </span>
              )}
              {project.year && (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {project.year}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {project.content_md ? (
                <div dangerouslySetInnerHTML={{ __html: project.content_md }} />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            {/* Project images gallery */}
            {project.images && project.images.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">Hình ảnh dự án</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt={img.caption ?? project.title}
                      className="rounded-lg border object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-muted mt-10 rounded-xl p-6 text-center">
              <h3 className="mb-2 text-lg font-semibold">
                Bạn có dự án tương tự?
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Liên hệ SLTECH để được tư vấn giải pháp phù hợp
              </p>
              <Button asChild>
                <Link to="/lien-he">
                  <Phone className="mr-2 h-4 w-4" />
                  Liên hệ tư vấn
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
