import { Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  compact?: boolean;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  className,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "bg-primary/5 border-b",
        compact ? "py-6 md:py-8" : "py-10 md:py-14",
        className,
      )}
    >
      <div className="container-custom">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span className="sr-only">Trang chủ</span>
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1
          className={cn(
            "text-primary font-bold tracking-tight",
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-2 max-w-2xl text-base md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
