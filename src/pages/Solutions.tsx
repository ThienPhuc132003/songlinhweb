import { useState } from "react";
import { Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useSolutions } from "@/hooks/useApi";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SOLUTION_IMAGES } from "@/lib/solutionImages";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import type { Solution } from "@/types";

export default function Solutions() {
  const { data, isLoading } = useSolutions();
  const solutions = data?.items ?? [];

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

      <section className="py-24 md:py-32">
        <div className="container-custom">
          {/* Editorial heading */}
          <motion.div {...fadeUp()} className="mb-16 text-center">
            <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
              Tất cả{" "}
              <span className="font-semibold">giải pháp</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
              Cung cấp đa dạng giải pháp công nghệ, hệ thống M&E và cơ điện cho
              mọi quy mô dự án
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#3C5DAA]/60" />
            </div>
          )}

          {/* Solutions grid */}
          {!isLoading && solutions.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {solutions.map((solution, i) => (
                <motion.div
                  key={solution.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <SolutionCard solution={solution} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && solutions.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p>Chưa có giải pháp nào.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * SolutionCard — Uses API data with solutionImages.ts as fallback for cover images
 */
function SolutionCard({ solution }: { solution: Solution }) {
  const [imgError, setImgError] = useState(false);

  // Priority: API hero_image_url → static fallback by slug
  const imageUrl = solution.hero_image_url || SOLUTION_IMAGES[solution.slug];
  const displayText = solution.excerpt || solution.description;

  return (
    <Link
      to={`/giai-phap/${solution.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:border-[#3C5DAA]/50 hover:shadow-md dark:border-border dark:bg-card"
    >
      {/* Brand accent line — top, visible on hover */}
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#3C5DAA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image — fixed aspect, zoom on hover */}
      <div className="relative shrink-0 overflow-hidden">
        {imageUrl && !imgError ? (
          <>
            <img
              src={imageUrl}
              alt={solution.title}
              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <ImagePlaceholder
            className="aspect-video"
            variant="solution"
            title={solution.title}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <SolutionIconBadge name={solution.icon} size="sm" />
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#3C5DAA]">
            {solution.title}
          </h3>
        </div>
        {displayText && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-muted-foreground">
            {displayText}
          </p>
        )}
        {/* CTA — pinned to bottom */}
        <span className="mt-auto inline-flex items-center pt-3 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#3C5DAA] transition-colors group-hover:text-[#3C5DAA]/70">
          Xem chi tiết
          <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
