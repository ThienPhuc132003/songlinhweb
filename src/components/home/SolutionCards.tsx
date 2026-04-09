import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { SOLUTIONS } from "@/data/solutions";
import { cn } from "@/lib/utils";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";

interface SolutionCardsProps {
  limit?: number;
  className?: string;
}


export function SolutionCards({ limit, className }: SolutionCardsProps) {
  const solutions = limit ? SOLUTIONS.slice(0, limit) : SOLUTIONS;

  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container-custom">
        {/* Editorial heading */}
        <motion.div {...fadeUp()} className="mb-16 text-center">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
            Năng lực giải pháp
          </p>
          <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
            Giải pháp{" "}
            <span className="font-semibold">của chúng tôi</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
            Cung cấp đa dạng giải pháp công nghệ, hệ thống M&E và cơ điện cho
            mọi quy mô dự án
          </p>
        </motion.div>

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
              <SolutionCard
                slug={solution.slug}
                title={solution.title}
                icon={solution.icon}
                description={solution.description}
                image={solution.heroImage}
              />
            </motion.div>
          ))}
        </div>

        {limit && limit < SOLUTIONS.length && (
          <motion.div {...fadeUp(0.2)} className="mt-10 text-center">
            <Link
              to="/giai-phap"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#3C5DAA] transition-colors hover:text-[#3C5DAA]/70"
            >
              Xem tất cả giải pháp
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
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
      className="group relative flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:border-[#3C5DAA]/50 hover:shadow-lg dark:border-border dark:bg-card"
    >
      {/* Brand accent line — top, visible on hover */}
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#3C5DAA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image — fixed aspect, zoom on hover */}
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#3C5DAA]">
            {title}
          </h3>
        </div>
        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-muted-foreground">
            {description}
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
