import { useParams, Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { useProject } from "@/hooks/useApi";
import { useMarkdown } from "@/hooks/useMarkdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectInfoSidebar } from "@/components/projects/ProjectInfoSidebar";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectUsedEquipment } from "@/components/projects/ProjectUsedEquipment";
import { ProjectMetricsBar } from "@/components/projects/ProjectMetricsBar";
import { InfographicStats } from "@/components/projects/InfographicStats";
import { TestimonialBlock } from "@/components/projects/TestimonialBlock";
import { QualityAssuranceBadge } from "@/components/projects/QualityAssuranceBadge";
import { ArrowLeft, ChevronRight, Home, MessageSquare } from "lucide-react";

/** Safely parse JSON or return fallback */
function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

/** Extract YouTube video ID for embed */
function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug ?? "");
  const contentHtml = useMarkdown(project?.content_md ?? null);

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <div className="relative flex min-h-[360px] items-end bg-slate-900 md:min-h-[440px]">
          <div className="container-custom relative z-10 pb-10 pt-24">
            <Skeleton className="mb-3 h-5 w-24 rounded-full bg-white/10" />
            <Skeleton className="h-10 w-2/3 bg-white/10" />
            <Skeleton className="mt-4 h-4 w-1/3 bg-white/10" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-14">
          <div className="container-custom grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl bg-white/5" />)}
          </div>
        </div>
        <section className="section-padding">
          <div className="container-custom grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        </section>
      </>
    );
  }

  // ─── 404 ────────────────────────────────────────────────────────────────────
  if (!project) {
    return (
      <>
        <div className="relative flex min-h-[280px] items-end bg-slate-900">
          <div className="container-custom relative z-10 pb-10 pt-20">
            <h1 className="text-2xl font-bold text-white">Không tìm thấy dự án</h1>
          </div>
        </div>
        <section className="section-padding">
          <div className="container-custom text-center">
            <p className="text-muted-foreground mb-4">Dự án không tồn tại hoặc đã bị xóa.</p>
            <Button asChild>
              <Link to="/du-an"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  // ─── Parse data ──────────────────────────────────────────────────────────────
  const systemTypes = parseJson<string[]>(project.system_types, []);
  const brandsUsed = parseJson<string[]>(project.brands_used, []);
  const keyMetrics = parseJson<Record<string, string | number>>(project.key_metrics, {});
  const galleryImages = project.images ?? [];
  const linkedProducts = project.linked_products ?? [];
  const videoEmbed = project.video_url ? getYouTubeEmbedUrl(project.video_url) : null;

  return (
    <>
      <SEO
        title={project.meta_title || project.title}
        description={project.meta_description || project.description}
        url={`/du-an/${slug}`}
        image={project.thumbnail_url ?? undefined}
      />

      {/* ═══ 1. HERO ═══ */}
      <ProjectHero
        title={project.title}
        coverImage={project.thumbnail_url}
        category={project.category}
        clientName={project.client_name}
        location={project.location}
        completionYear={project.completion_year || (project.year ? String(project.year) : null)}
      />

      {/* ═══ 2. INFOGRAPHIC STATS ═══ */}
      <InfographicStats
        metrics={keyMetrics}
        areaSqm={project.area_sqm}
        durationMonths={project.duration_months}
      />

      {/* ═══ 3. BREADCRUMBS ═══ */}
      <div className="border-b bg-muted/30">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3 w-3" /> Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/du-an" className="hover:text-foreground transition-colors">Dự án</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* ═══ 4. MAIN CONTENT — 2 Column ═══ */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Left: Content Flow */}
            <div className="min-w-0 space-y-8">
              {/* Overview */}
              {project.description && (
                <p className="text-base leading-relaxed text-muted-foreground">{project.description}</p>
              )}

              {/* PDF-style metrics */}
              <ProjectMetricsBar
                metrics={keyMetrics}
                areaSqm={project.area_sqm}
                durationMonths={project.duration_months}
              />

              {/* Markdown content */}
              {contentHtml && (
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-p:leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>
              )}

              {/* Challenges section */}
              {project.challenges && (
                <div className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10 p-5">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Thách thức
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">{project.challenges}</p>
                </div>
              )}

              {/* Outcomes section */}
              {project.outcomes && (
                <div className="rounded-xl border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10 p-5">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Kết quả đạt được
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">{project.outcomes}</p>
                </div>
              )}

              {/* Video embed */}
              {videoEmbed && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Video dự án</h3>
                  <div className="relative overflow-hidden rounded-xl border" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={videoEmbed}
                      title="Project video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sticky Sidebar */}
            <div className="lg:order-last">
              <div className="sticky top-24 space-y-6">
                <ProjectInfoSidebar
                  projectScale={project.project_scale}
                  clientIndustry={project.client_industry}
                  areaSqm={project.area_sqm}
                  durationMonths={project.duration_months}
                  systemTypes={systemTypes}
                  brandsUsed={brandsUsed}
                />
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/lien-he">Yêu cầu Khảo sát Mặt bằng</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/lien-he">Nhận Báo giá Kỹ thuật</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. GALLERY — Masonry ═══ */}
      {galleryImages.length > 0 && (
        <section className="section-padding border-t bg-muted/10">
          <div className="container-custom">
            <ProjectGallery images={galleryImages} projectTitle={project.title} />
          </div>
        </section>
      )}

      {/* ═══ 6. TESTIMONIAL ═══ */}
      {project.testimonial_content && project.testimonial_name && (
        <section className="section-padding border-t">
          <div className="container-custom max-w-3xl">
            <TestimonialBlock
              name={project.testimonial_name}
              content={project.testimonial_content}
            />
          </div>
        </section>
      )}

      {/* ═══ 7. PRODUCTS USED ═══ */}
      {linkedProducts.length > 0 && (
        <section className="section-padding border-t">
          <div className="container-custom">
            <ProjectUsedEquipment products={linkedProducts} />
          </div>
        </section>
      )}

      {/* ═══ 8. QA BADGE ═══ */}
      <section className="section-padding border-t bg-muted/5">
        <div className="container-custom max-w-4xl">
          <QualityAssuranceBadge />
        </div>
      </section>

      {/* ═══ 9. CTA — "DISCUSS A SIMILAR PROJECT" ═══ */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-background to-blue-50/30 dark:to-blue-950/10 py-16">
        <div className="container-custom max-w-2xl text-center">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary/60" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold mb-2">Bạn có dự án tương tự?</h2>
          <p className="text-muted-foreground mb-6">
            Đội ngũ kỹ sư Song Linh Technologies sẵn sàng khảo sát, tư vấn và triển khai
            giải pháp kỹ thuật toàn diện cho dự án của bạn.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/lien-he">Thảo luận dự án</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/lien-he">Nhận báo giá kỹ thuật</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
