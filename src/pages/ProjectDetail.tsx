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
import { InfographicStats, buildStatItems } from "@/components/projects/InfographicStats";
import { ArrowLeft, ChevronRight } from "lucide-react";

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

/**
 * Build a display list from ALL key_metrics entries (including text-only values).
 * Used for the "Quy mô triển khai" section in the left column.
 */
function buildImplementationItems(metrics: Record<string, string | number>): Array<{ key: string; value: string }> {
  return Object.entries(metrics)
    .filter(([, v]) => v && v !== 0)
    .map(([key, val]) => ({
      key,
      value: String(val),
    }));
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
        <div className="bg-white py-14 border-b">
          <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        </div>
        <section className="section-padding">
          <div className="container-custom max-w-7xl mx-auto grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-72 w-full rounded-xl" />
            </div>
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

  // Outcomes (Highlights)
  let outcomesList: string[] = [];
  try {
    const parsed = JSON.parse(project.outcomes || "[]");
    if (Array.isArray(parsed)) outcomesList = parsed.map(String);
  } catch {
    if (project.outcomes) outcomesList = [project.outcomes];
  }

  // ALL key_metrics for the "Quy mô triển khai" section (no cap, includes text values)
  const implementationItems = buildImplementationItems(keyMetrics);

  // Stat items from buildStatItems (for checking if hero bar has items beyond 4)
  const allStatItems = buildStatItems(keyMetrics, project.area_sqm, project.duration_months);
  const hasExtraStats = allStatItems.length > 4;
  // Items 5+ that didn't make it into the hero bar — show in implementation list
  void hasExtraStats; // used for reference; implementationItems covers all

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

      {/* ═══ 2. INFOGRAPHIC STATS — White bg, blue numbers, max 4 ═══ */}
      <InfographicStats
        metrics={keyMetrics}
        areaSqm={project.area_sqm}
        durationMonths={project.duration_months}
      />

      {/* ═══ 3. BREADCRUMBS ═══ */}
      <div className="border-b bg-muted/30">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/du-an" className="hover:text-foreground transition-colors">Dự án</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* ═══ 4. MAIN CONTENT — 12-Column Grid ═══ */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-12">

            {/* ── LEFT COLUMN (col-span-8) ── */}
            <div className="min-w-0 space-y-10 lg:col-span-8">

              {/* Section 1: Description */}
              {project.description && (
                <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                  {project.description}
                </p>
              )}

              {/* Section 2: Highlights / Outcomes — blue left border card */}
              {outcomesList.length > 0 && (
                <div className="border-l-4 border-l-[#3C5DAA] bg-[#F8FAFC] rounded-r-lg p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#3C5DAA]">
                    Điểm nổi bật
                  </h3>
                  <ul className="space-y-2.5">
                    {outcomesList.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-700">
                        <svg className="mt-1 h-4 w-4 shrink-0 text-[#3C5DAA]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 3: Quy mô triển khai — ALL metrics as labeled list */}
              {implementationItems.length > 0 && (
                <div>
                  <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-[#3C5DAA]">
                    Quy mô triển khai
                  </h3>
                  <ul className="space-y-2">
                    {implementationItems.map(({ key, value }, idx) => (
                      <li key={idx} className="flex items-baseline gap-2 text-[15px] leading-relaxed text-slate-700">
                        <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#3C5DAA]" />
                        <span>
                          <strong className="font-semibold text-slate-900">{key}:</strong>{" "}
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 4: Markdown body content */}
              {contentHtml && (
                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>
              )}

              {/* Challenges callout */}
              {project.challenges && (
                <div className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10 p-5">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Thách thức
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">{project.challenges}</p>
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

            {/* ── RIGHT COLUMN — Sticky Sidebar (col-span-4) ── */}
            <div className="lg:col-span-4 lg:order-last">
              <div className="sticky top-24 space-y-5">
                <ProjectInfoSidebar
                  clientName={project.client_name}
                  location={project.location}
                  clientIndustry={project.client_industry}
                  systemTypes={systemTypes}
                />
                <div className="space-y-3">
                  <Button asChild className="w-full bg-[#3C5DAA] hover:bg-[#2E4A8A]">
                    <Link to="/lien-he">Yêu cầu Khảo sát Mặt bằng</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-[#3C5DAA]/30 text-[#3C5DAA] hover:bg-[#3C5DAA]/5">
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

      {/* ═══ 6. PRODUCTS USED ═══ */}
      {linkedProducts.length > 0 && (
        <section className="section-padding border-t">
          <div className="container-custom">
            <ProjectUsedEquipment products={linkedProducts} />
          </div>
        </section>
      )}

      {/* ═══ 7. CTA — Editorial ═══ */}
      <section className="border-t bg-slate-950 py-16 md:py-20">
        <div className="container-custom max-w-2xl text-center">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
            Tiếp theo
          </p>
          <h2 className="text-3xl font-extralight tracking-tight text-white md:text-4xl">
            Bạn có dự án <span className="font-semibold">tương tự?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Đội ngũ kỹ sư Song Linh Technologies sẵn sàng khảo sát, tư vấn và triển khai
            giải pháp kỹ thuật toàn diện cho dự án của bạn.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-none px-8 bg-[#3C5DAA] hover:bg-[#2E4A8A]">
              <Link to="/lien-he">Thảo luận dự án</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none border-white/20 px-8 text-white hover:bg-white/10 hover:text-white">
              <Link to="/lien-he">Nhận báo giá kỹ thuật</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
