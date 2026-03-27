import { Link } from "react-router";
import { SOLUTIONS_DATA } from "@/lib/constants";
import { useSolutions } from "@/hooks/useApi";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";

interface SolutionCardsProps {
  limit?: number;
  className?: string;
}

export function SolutionCards({ limit, className }: SolutionCardsProps) {
  const { data: apiSolutions } = useSolutions();
  const allSolutions = apiSolutions ?? SOLUTIONS_DATA;
  const solutions = limit ? allSolutions.slice(0, limit) : allSolutions;
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
          className="reveal-stagger grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        >
          {solutions.map((solution) => (
            <Link
              key={solution.slug}
              to={`/giai-phap/${solution.slug}`}
              className="reveal-item bg-card hover:border-primary/30 group flex flex-col rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <SolutionIconBadge name={solution.icon} size="md" />
                <h3 className="group-hover:text-primary text-sm font-semibold transition-colors">
                  {solution.title}
                </h3>
              </div>
              {"description" in solution && (
                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {(solution as { description: string }).description}
                </p>
              )}
              <span className="text-primary mt-auto pt-3 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                Xem chi tiết →
              </span>
            </Link>
          ))}
        </div>

        {limit && limit < allSolutions.length && (
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
