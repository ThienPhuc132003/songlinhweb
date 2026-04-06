import { Link } from "react-router";
import { SOLUTIONS } from "@/data/solutions";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface SolutionCardsProps {
  limit?: number;
  className?: string;
}

export function SolutionCards({ limit, className }: SolutionCardsProps) {
  const solutions = limit ? SOLUTIONS.slice(0, limit) : SOLUTIONS;
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal();

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-custom">
        <div ref={headingRef} className="reveal mb-10 text-center md:mb-14">
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Giải pháp của chúng tôi
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Cung cấp đa dạng giải pháp công nghệ, hệ thống M&E và cơ điện cho
            mọi quy mô dự án
          </p>
        </div>

        <div
          ref={gridRef}
          className="reveal-stagger grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.slug}
              slug={solution.slug}
              title={solution.title}
              icon={solution.icon}
              description={solution.description}
              image={solution.heroImage}
            />
          ))}
        </div>

        {limit && limit < SOLUTIONS.length && (
          <div className="mt-8 text-center">
            <Link
              to="/giai-phap"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
            >
              Xem tất cả giải pháp →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function SolutionCard({
  slug,
  title,
  icon,
  description,
  image,
}: {
  slug: string;
  title: string;
  icon: string;
  description?: string;
  image?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/giai-phap/${slug}`}
      className="reveal-item bg-card group flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Image — fixed aspect, zero-gap */}
      <div className="relative shrink-0 overflow-hidden">
        {image && !imgError ? (
          <>
            <img
              src={image}
              alt={title}
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
            title={title}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <SolutionIconBadge name={icon} size="sm" />
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>
        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {/* CTA — always visible, pinned to bottom */}
        <span className="mt-auto inline-flex items-center pt-3 text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
          Xem chi tiết
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

