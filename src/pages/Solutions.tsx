import { useState } from "react";
import { Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SOLUTIONS } from "@/data/solutions";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";
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
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5">
        {/* Image — zero-gap, full bleed */}
        <div className="relative overflow-hidden">
          {solution.heroImage && !imgError ? (
            <>
              <img
                src={solution.heroImage}
                alt={solution.title}
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <SolutionIconBadge name={solution.icon} size="lg" className="opacity-40" />
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2.5">
            <SolutionIconBadge name={solution.icon} size="sm" />
            <h3 className="text-base font-semibold transition-colors group-hover:text-primary">
              {solution.title}
            </h3>
          </div>
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {solution.description}
          </p>
          <span className="inline-flex items-center text-sm font-medium text-primary">
            Xem chi tiết
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
