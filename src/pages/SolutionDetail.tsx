import { useParams, Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { getSolutionBySlug, SOLUTIONS } from "@/data/solutions";
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { TechExcellenceGrid } from "@/components/solutions/TechExcellenceGrid";
import { SystemArchitecture } from "@/components/solutions/SystemArchitecture";
import { TechSpecsTable } from "@/components/solutions/TechSpecsTable";
import { ImplementationWorkflow } from "@/components/solutions/ImplementationWorkflow";
import { RelatedProjects } from "@/components/solutions/RelatedProjects";
import { ConsultCTA } from "@/components/solutions/ConsultCTA";
import { ArrowRight } from "lucide-react";
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

      {/* ─── Hero Section ─── */}
      <SolutionHero
        title={solution.title}
        subtitle={solution.subtitle}
        heroImage={solution.heroImage}
      />

      {/* ─── Main Content ─── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* Left column — Content sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Description */}
              <div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {solution.description}
                </p>
              </div>

              {/* 1. Technical Excellence Grid */}
              <TechExcellenceGrid capabilities={solution.capabilities} />

              {/* 2. System Architecture */}
              <SystemArchitecture architecture={solution.architecture} />

              {/* 3. Technical Specs Table */}
              <TechSpecsTable specs={solution.specs} />

              {/* Brands */}
              {solution.brands.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-bold">Thương hiệu & Đối tác</h2>
                  <div className="flex flex-wrap gap-2">
                    {solution.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="px-3 py-1.5 text-sm">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* 4. Implementation Workflow */}
              <ImplementationWorkflow />

              {/* 5. Related Projects */}
              <RelatedProjects projectSlugs={solution.relatedProjectSlugs} />

              {/* Other solutions */}
              <section>
                <h2 className="mb-4 text-2xl font-bold">Giải pháp khác</h2>
                <ul className="space-y-2">
                  {SOLUTIONS.filter((s) => s.slug !== solution.slug)
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
              </section>
            </motion.div>

            {/* Right column — Sticky CTA sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ConsultCTA />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
