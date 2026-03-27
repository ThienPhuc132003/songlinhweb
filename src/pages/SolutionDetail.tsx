import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { useSolution } from "@/hooks/useApi";
import { useMarkdown } from "@/hooks/useMarkdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import { SOLUTIONS_DATA } from "@/lib/constants";

/** Parse markdown content_md into sections based on ## headings */
function parseSections(md: string): { title: string; body: string }[] {
  const sections: { title: string; body: string }[] = [];
  const parts = md.split(/^## /m);

  // First part before any ## heading
  if (parts[0].trim()) {
    sections.push({ title: "", body: parts[0].trim() });
  }

  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split("\n");
    const title = lines[0].trim();
    const body = lines.slice(1).join("\n").trim();
    sections.push({ title, body });
  }

  return sections;
}

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: solution, isLoading } = useSolution(slug ?? "");

  const staticSolution = SOLUTIONS_DATA.find((s) => s.slug === slug);
  const title = solution?.title ?? staticSolution?.title ?? "Giải pháp";
  const description = solution?.description ?? staticSolution?.description ?? "";
  const content = solution?.content_md ?? null;
  const heroImage = solution?.hero_image_url ?? null;
  const metaTitle = solution?.meta_title ?? null;
  const metaDesc = solution?.meta_description ?? null;

  const sections = content ? parseSections(content) : [];
  const introSection = sections.find((s) => !s.title);
  const featureSections = sections.filter((s) => s.title);

  // Parse intro + section bodies through markdown
  const introHtml = useMarkdown(introSection?.body ?? null);
  const sectionHtmls = featureSections.map((s) => useMarkdown(s.body));

  if (isLoading) {
    return (
      <>
        <div className="relative h-[320px] bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="container-custom flex h-full items-end pb-10">
            <div className="space-y-3">
              <Skeleton className="h-4 w-48 bg-white/20" />
              <Skeleton className="h-9 w-80 bg-white/20" />
              <Skeleton className="h-5 w-96 bg-white/20" />
            </div>
          </div>
        </div>
        <section className="section-padding">
          <div className="container-custom space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title={metaTitle || title}
        description={metaDesc || description}
        url={`/giai-phap/${slug}`}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt={title}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800" />
          )}
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>

        <div className="container-custom relative z-10 pb-14 pt-28 lg:pb-20 lg:pt-36">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/giai-phap" className="hover:text-white transition-colors">Giải pháp</Link>
            <span>/</span>
            <span className="text-white/90">{title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-4 h-1 w-16 rounded bg-primary" />
            <h1 className="mb-4 text-3xl font-bold text-white drop-shadow-lg lg:text-4xl xl:text-5xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-white/80 lg:text-xl">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-10"
            >
              {/* Intro prose */}
              {introHtml && (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
              )}

              {/* Feature grid — if we have heading sections */}
              {featureSections.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {featureSections.map((section, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 * i }}
                      className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold">{section.title}</h3>
                      </div>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: sectionHtmls[i] }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Fallback for solutions with no structured content */}
              {!content && (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {description}
                  </p>
                  <p className="text-muted-foreground">
                    Liên hệ Song Linh Technologies để được tư vấn chi tiết về giải pháp{" "}
                    {title.toLowerCase()} phù hợp với nhu cầu doanh nghiệp của bạn.
                  </p>
                </div>
              )}

              {/* Gallery */}
              {solution?.images && solution.images.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {solution.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt={img.caption ?? title}
                      className="rounded-lg border object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* CTA */}
              <div className="bg-primary rounded-xl p-6 text-white">
                <h3 className="mb-2 text-lg font-semibold">
                  Cần tư vấn giải pháp?
                </h3>
                <p className="mb-4 text-sm text-white/80">
                  Đội ngũ chuyên gia Song Linh Technologies sẵn sàng hỗ trợ bạn
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white !text-[var(--color-primary)] hover:bg-white/90"
                >
                  <Link to="/lien-he">
                    <Phone className="mr-2 h-4 w-4" />
                    Liên hệ ngay
                  </Link>
                </Button>
              </div>

              {/* Related Solutions */}
              <div className="rounded-xl border p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
                  Giải pháp khác
                </h3>
                <ul className="space-y-2">
                  {SOLUTIONS_DATA.filter((s) => s.slug !== slug)
                    .slice(0, 5)
                    .map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/giai-phap/${s.slug}`}
                          className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}
