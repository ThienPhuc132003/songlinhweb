import { useParams, Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProject } from "@/hooks/useApi";
import { useMarkdown } from "@/hooks/useMarkdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectMetricsBar } from "@/components/projects/ProjectMetricsBar";
import { ProjectSystemsList } from "@/components/projects/ProjectSystemsList";
import { ProjectComplianceBadges } from "@/components/projects/ProjectComplianceBadges";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MapPin, Calendar, Building2, ArrowLeft } from "lucide-react";

/** Safely parse JSON or return fallback */
function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug ?? "");
  const contentRef = useScrollReveal();

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

  // Parse JSON fields (backward compatible — old data returns fallbacks)
  const systemTypes = parseJson<string[]>(project.system_types, []);
  const brandsUsed = parseJson<string[]>(project.brands_used, []);
  const keyMetrics = parseJson<Record<string, number>>(project.key_metrics, {});
  const complianceStandards = parseJson<string[]>(project.compliance_standards, []);

  // Parse markdown content
  const contentHtml = useMarkdown(project.content_md);

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
          <div ref={contentRef} className="reveal">
            {/* Meta info bar */}
            <div className="mb-6 flex flex-wrap gap-3">
              {project.category && (
                <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
                  {project.category}
                </span>
              )}
              {project.client_industry && (
                <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium capitalize">
                  {project.client_industry}
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
              {project.project_scale && (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                  <Building2 className="h-3.5 w-3.5" />
                  {project.project_scale === "large"
                    ? "Quy mô lớn"
                    : project.project_scale === "medium"
                      ? "Quy mô vừa"
                      : "Quy mô nhỏ"}
                </span>
              )}
            </div>

            {/* Project thumbnail */}
            {project.thumbnail_url && (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="mb-8 aspect-video w-full rounded-xl border object-cover"
              />
            )}

            {/* Key Metrics Bar — the #1 trust signal for Technical Directors */}
            <ProjectMetricsBar
              metrics={keyMetrics}
              areaSqm={project.area_sqm}
              durationMonths={project.duration_months}
              className="mb-8"
            />

            {/* Systems & Brands tags */}
            <ProjectSystemsList
              systemTypes={systemTypes}
              brandsUsed={brandsUsed}
              className="mb-8"
            />

            {/* Compliance Badges */}
            <ProjectComplianceBadges
              standards={complianceStandards}
              className="mb-8"
            />

            {/* Description / Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
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
                  {project.images.map((img: { id: number; image_url: string; caption?: string | null }) => (
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

            {/* Contextual CTAs — B2B optimized */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-primary/5 p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold">
                  Bạn có dự án tương tự?
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Đội ngũ kỹ sư Song Linh Technologies sẵn sàng khảo sát và tư vấn
                </p>
                <Button asChild>
                  <Link to="/lien-he">Yêu cầu Khảo sát Mặt bằng</Link>
                </Button>
              </div>
              <div className="rounded-xl border bg-muted/30 p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold">
                  Cần báo giá kỹ thuật?
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Nhận đề xuất giải pháp và báo giá chi tiết cho dự án của bạn
                </p>
                <Button asChild variant="outline">
                  <Link to="/lien-he">Nhận Báo giá Kỹ thuật</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
