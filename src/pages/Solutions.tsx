import { Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useSolutions } from "@/hooks/useApi";
import { SOLUTIONS_DATA } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import {
  Camera,
  Flame,
  Volume2,
  Network,
  Zap,
  Phone,
  ShieldCheck,
  Bell,
  Server,
  Building2,
  FileCheck,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  Flame,
  Volume2,
  Network,
  Zap,
  Phone,
  ShieldCheck,
  Bell,
  Server,
  Building2,
  FileCheck,
};

export default function Solutions() {
  const { data: solutions, isLoading } = useSolutions();
  const items = solutions ?? SOLUTIONS_DATA;

  return (
    <>
      <SEO
        title="Giải pháp"
        description="Các giải pháp công nghệ từ SLTECH: CCTV, PCCC, âm thanh, mạng LAN, điện nhẹ, BMS và nhiều hơn."
        url="/giai-phap"
      />

      <PageHero
        title="Giải pháp"
        subtitle="Chúng tôi cung cấp các giải pháp công nghệ toàn diện cho doanh nghiệp"
        breadcrumbs={[{ label: "Giải pháp" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-lg border p-5">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))
              : items.map((solution, i) => {
                  const IconComp = ICON_MAP[solution.icon];
                  return (
                    <motion.div
                      key={solution.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link to={`/giai-phap/${solution.slug}`} className="block h-full">
                        <Card className="hover:border-primary/30 group h-full transition-all hover:shadow-lg">
                          <CardHeader className="pb-3">
                            {IconComp && (
                              <div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                                <IconComp className="h-6 w-6" />
                              </div>
                            )}
                            <CardTitle className="text-lg">
                              {solution.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                              {solution.description}
                            </p>
                            <Button
                              variant="link"
                              className="text-primary h-auto p-0 text-sm"
                            >
                              Xem chi tiết
                              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>
    </>
  );
}
