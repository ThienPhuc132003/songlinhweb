import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useSolution } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Phone } from "lucide-react";
import { SOLUTIONS_DATA } from "@/lib/constants";

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: solution, isLoading } = useSolution(slug ?? "");

  // Fallback to static data
  const staticSolution = SOLUTIONS_DATA.find((s) => s.slug === slug);
  const title = solution?.title ?? staticSolution?.title ?? "Giải pháp";
  const description = solution?.description ?? staticSolution?.description ?? "";
  const content = solution?.content_md ?? null;

  if (isLoading) {
    return (
      <>
        <PageHero
          title=""
          breadcrumbs={[
            { label: "Giải pháp", href: "/giai-phap" },
            { label: "..." },
          ]}
          compact
        />
        <section className="section-padding">
          <div className="container-custom max-w-4xl space-y-4">
            <Skeleton className="h-8 w-2/3" />
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
        title={title}
        description={description}
        url={`/giai-phap/${slug}`}
      />

      <PageHero
        title={title}
        subtitle={description}
        breadcrumbs={[
          { label: "Giải pháp", href: "/giai-phap" },
          { label: title },
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {content ? (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {description}
                  </p>
                  <p className="text-muted-foreground">
                    Liên hệ SLTECH để được tư vấn chi tiết về giải pháp {title.toLowerCase()} phù hợp với nhu cầu doanh nghiệp của bạn.
                  </p>
                </div>
              )}

              {/* Solution images */}
              {solution?.images && solution.images.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
              <div className="bg-primary rounded-xl p-6 text-white">
                <h3 className="mb-2 text-lg font-semibold">
                  Cần tư vấn giải pháp?
                </h3>
                <p className="mb-4 text-sm text-white/80">
                  Đội ngũ chuyên gia SLTECH sẵn sàng hỗ trợ bạn
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
