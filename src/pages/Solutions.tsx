import { Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useSolutions } from "@/hooks/useApi";
import { SOLUTIONS_DATA } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";
import { ArrowRight } from "lucide-react";

export default function Solutions() {
  const { data: solutions, isLoading } = useSolutions();
  const items = solutions ?? SOLUTIONS_DATA;
  const gridRef = useScrollReveal();

  return (
    <>
      <SEO
        title="Giải pháp"
        description="Các giải pháp công nghệ từ Song Linh Technologies: CCTV, PCCC, âm thanh, mạng LAN, điện nhẹ, BMS và nhiều hơn."
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
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-lg border p-5">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))
              : items.map((solution) => (
                  <Link
                    key={solution.slug}
                    to={`/giai-phap/${solution.slug}`}
                    className="reveal-item block h-full"
                  >
                    <Card className="hover:border-primary/30 group h-full transition-all hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <SolutionIconBadge name={solution.icon} size="lg" className="mb-2" />
                        <CardTitle className="group-hover:text-primary text-lg transition-colors">
                          {solution.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                          {solution.description}
                        </p>
                        <span className="text-primary inline-flex items-center text-sm font-medium">
                          Xem chi tiết
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
