import { useParams, Navigate, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { useSolution } from "@/hooks/useApi";
import { useMarkdown } from "@/hooks/useMarkdown";
import { SOLUTION_IMAGES } from "@/lib/solutionImages";
import { SolutionIcon } from "@/components/ui/SolutionIcon";
import { ConsultCTAInline } from "@/components/solutions/ConsultCTA";
import { ImplementationWorkflow } from "@/components/solutions/ImplementationWorkflow";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import type { SolutionFeature } from "@/types";

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: solution, isLoading, error } = useSolution(slug ?? "");

  // Parse JSON fields
  const features: SolutionFeature[] = (() => {
    try {
      const arr = JSON.parse(solution?.features || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  })();

  const applications: string[] = (() => {
    try {
      const arr = JSON.parse(solution?.applications || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  })();

  // Markdown content
  const contentHtml = useMarkdown(solution?.content_md ?? null);

  // Cover image — API URL with static fallback
  const coverImage = solution?.hero_image_url || (slug ? SOLUTION_IMAGES[slug] : undefined);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3C5DAA]/60" />
      </div>
    );
  }

  if (error || !solution) {
    return <Navigate to="/giai-phap" replace />;
  }

  return (
    <>
      <SEO
        title={solution.meta_title || solution.title}
        description={solution.meta_description || solution.excerpt || solution.description}
        url={`/giai-phap/${solution.slug}`}
      />

      {/* ─── 1. Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={solution.title}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>

        <div className="container-custom relative z-10 pb-16 pt-28 lg:pb-24 lg:pt-36">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="transition-colors hover:text-white">Trang chủ</Link>
            <span>/</span>
            <Link to="/giai-phap" className="transition-colors hover:text-white">Giải pháp</Link>
            <span>/</span>
            <span className="text-white/90">{solution.title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-4 h-1 w-16 rounded bg-[#3C5DAA]" />
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white drop-shadow-lg lg:text-4xl xl:text-5xl">
              {solution.title}
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80 lg:text-xl">
              {solution.excerpt || solution.description}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Link to="/lien-he">
                Yêu cầu khảo sát kỹ thuật
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Description ─── */}
      {solution.description && (
        <section className="py-16 lg:py-20">
          <div className="container-custom">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground lg:text-xl"
            >
              {solution.description}
            </motion.p>
          </div>
        </section>
      )}

      {/* ─── 2. Features Grid (from JSON) ─── */}
      {features.length > 0 && (
        <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
                Tính năng nổi bật
              </p>
              <h2 className="mb-8 text-3xl font-bold">Năng lực kỹ thuật</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="group rounded-sm border bg-card p-5 transition-all duration-300 hover:border-[#3C5DAA]/30 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <SolutionIcon
                        name={feat.icon}
                        size="lg"
                        className="shrink-0 text-[#3C5DAA]"
                      />
                      <h3 className="text-sm font-semibold">{feat.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feat.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 3. Markdown Content ─── */}
      {contentHtml && (
        <section className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30 lg:py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="prose prose-lg dark:prose-invert mx-auto max-w-4xl
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3 dark:prose-h2:border-slate-700
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:leading-[1.8] prose-p:text-slate-600 dark:prose-p:text-slate-300
                  prose-li:leading-[1.7] prose-li:text-slate-600 dark:prose-li:text-slate-300
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-blockquote:border-l-[#3C5DAA] prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4 dark:prose-blockquote:bg-blue-950/20
                  prose-code:bg-slate-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 dark:prose-code:bg-slate-800
                  prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-700
                  prose-th:bg-slate-100 prose-th:p-3 dark:prose-th:bg-slate-800
                  prose-td:p-3
                  prose-a:text-[#3C5DAA] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 4. Applications List ─── */}
      {applications.length > 0 && (
        <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-3xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
                Phạm vi ứng dụng
              </p>
              <h2 className="mb-8 text-3xl font-bold">Ứng dụng tiêu biểu</h2>
              <ul className="space-y-3">
                {applications.map((app, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3C5DAA]" />
                    <span className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {app}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── 5. Implementation Workflow ─── */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30 lg:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ImplementationWorkflow />
          </motion.div>
        </div>
      </section>

      {/* ─── 6. Inline CTA Banner ─── */}
      <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
        <div className="container-custom">
          <ConsultCTAInline />
        </div>
      </section>
    </>
  );
}
