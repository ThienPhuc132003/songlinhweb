import { useState } from "react";
import { Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SOLUTIONS } from "@/data/solutions";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ArrowRight } from "lucide-react";

export default function Solutions() {
  const gridRef = useScrollReveal();

  return (
    <>
      <SEO
        title="Giải pháp"
        description="Các giải pháp công nghệ từ Song Linh Technologies: CCTV, Access Control, Parking, Video Wall, Data Center và nhiều hơn."
        url="/giai-phap"
      />

      <PageHero
        title="Giải pháp"
        subtitle="Chúng tôi cung cấp các giải pháp công nghệ toàn diện cho doanh nghiệp"
        breadcrumbs={[{ label: "Giải pháp" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div
            ref={gridRef}
            className="reveal-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {SOLUTIONS.map((solution) => (
              <SolutionPageCard key={solution.slug} solution={solution} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SolutionPageCard({ solution }: { solution: (typeof SOLUTIONS)[number] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/giai-phap/${solution.slug}`} className="reveal-item block h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5">
        {/* Image — fixed aspect, zero-gap */}
        <div className="relative shrink-0 overflow-hidden">
          {solution.heroImage && !imgError ? (
            <>
              <img
                src={solution.heroImage}
                alt={solution.title}
                className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          ) : (
            <ImagePlaceholder
              className="aspect-video"
              variant="solution"
              title={solution.title}
            />
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-2.5">
            <SolutionIconBadge name={solution.icon} size="sm" />
            <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
              {solution.title}
            </h3>
          </div>
          <p className="mb-3 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-muted-foreground">
            {solution.description}
          </p>
          {/* CTA — pinned to bottom */}
          <span className="mt-auto inline-flex items-center pt-3 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            Xem chi tiết
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

