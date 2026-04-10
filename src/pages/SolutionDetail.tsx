import { useParams, Navigate } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { getSolutionBySlug } from "@/data/solutions";
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { TechExcellenceGrid } from "@/components/solutions/TechExcellenceGrid";
import { SystemArchitecture } from "@/components/solutions/SystemArchitecture";
import { TechSpecsTable } from "@/components/solutions/TechSpecsTable";
import { ImplementationWorkflow } from "@/components/solutions/ImplementationWorkflow";
import { RelatedProjects } from "@/components/solutions/RelatedProjects";
import { ConsultCTAInline } from "@/components/solutions/ConsultCTA";
import { Badge } from "@/components/ui/badge";

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const solution = getSolutionBySlug(slug ?? "");

  if (!solution) {
    return <Navigate to="/giai-phap" replace />;
  }

  return (
    <>
      <SEO
        title={solution.metaTitle || solution.title}
        description={solution.metaDescription || solution.description}
        url={`/giai-phap/${solution.slug}`}
      />

      {/* ─── 1. Hero Section ─── */}
      <SolutionHero
        title={solution.title}
        subtitle={solution.subtitle}
        heroImage={solution.heroImage}
      />

      {/* ─── Description ─── */}
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

      {/* ─── 2. Key Capabilities — Bento Grid ─── */}
      <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TechExcellenceGrid capabilities={solution.capabilities} />
          </motion.div>
        </div>
      </section>

      {/* ─── 3. System Architecture ─── */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30 lg:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SystemArchitecture architecture={solution.architecture} />
          </motion.div>
        </div>
      </section>

      {/* ─── 4. Technical Specs Table ─── */}
      <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TechSpecsTable specs={solution.specs} />
          </motion.div>
        </div>
      </section>

      {/* ─── Brands & Partners ─── */}
      {solution.brands.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30 lg:py-24">
          <div className="container-custom">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
              Thương hiệu & Đối tác
            </p>
            <h2 className="mb-8 text-3xl font-bold">Đối tác chiến lược</h2>
            <div className="flex flex-wrap gap-3">
              {solution.brands.map((brand) => (
                <Badge key={brand} variant="outline" className="px-4 py-2 text-sm font-medium">
                  {brand}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 5. Implementation Workflow ─── */}
      <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
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

      {/* ─── 6. Related Projects ─── */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30 lg:py-24">
        <div className="container-custom">
          <RelatedProjects projectSlugs={solution.relatedProjectSlugs} />
        </div>
      </section>

      {/* ─── 7. Inline CTA Banner ─── */}
      <section className="border-t border-slate-200 py-16 dark:border-slate-800 lg:py-24">
        <div className="container-custom">
          <ConsultCTAInline />
        </div>
      </section>
    </>
  );
}
