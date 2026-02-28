import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "bg-primary text-primary-foreground relative overflow-hidden",
        className,
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="container-custom relative py-12 md:py-16 lg:py-20">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-primary-foreground/80 mt-3 max-w-2xl text-base md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
