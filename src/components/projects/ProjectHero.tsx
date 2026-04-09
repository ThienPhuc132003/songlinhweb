import { cn } from "@/lib/utils";

interface ProjectHeroProps {
  title: string;
  coverImage?: string | null;
  category?: string;
  clientName?: string | null;
  location?: string | null;
  completionYear?: string | null;
  className?: string;
}

/**
 * Split-layout hero: 60% cover image / 40% dark overview panel.
 * Editorial style — no decorative icons, clean typography hierarchy.
 * Stacks on mobile (image on top, info below).
 */
export function ProjectHero({
  title,
  coverImage,
  category,
  clientName,
  location,
  completionYear,
  className,
}: ProjectHeroProps) {
  const metaRows: Array<{ label: string; value: string }> = [];
  if (clientName) metaRows.push({ label: "Chủ đầu tư", value: clientName });
  if (location) metaRows.push({ label: "Vị trí", value: location });
  if (completionYear) metaRows.push({ label: "Hoàn thành", value: completionYear });

  return (
    <section className={cn("grid md:grid-cols-[3fr_2fr]", className)}>
      {/* Left: Full-height cover image — clean crop, no overlay */}
      <div className="relative min-h-[300px] bg-slate-900 md:min-h-[480px]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* Subtle grid texture fallback */
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%23fff' stroke-width='.3'/%3E%3C/svg%3E\")",
              opacity: 0.06,
            }}
          />
        )}
        {/* Thin bottom edge gradient for mobile stacking */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-900 to-transparent md:hidden" />
      </div>

      {/* Right: Dark overview panel */}
      <div className="flex flex-col justify-center bg-slate-900 px-8 py-12 md:px-12 md:py-16">
        {/* Category badge */}
        {category && (
          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
            {category}
          </p>
        )}

        {/* Title — editorial thin weight  */}
        <h1 className="text-2xl font-extralight leading-[1.15] tracking-tight text-white md:text-3xl lg:text-4xl">
          {title}
        </h1>

        {/* Divider */}
        <div className="my-6 h-px w-12 bg-white/15" />

        {/* Meta rows — clean mono labels */}
        {metaRows.length > 0 && (
          <dl className="space-y-3">
            {metaRows.map((row) => (
              <div key={row.label} className="flex items-baseline gap-4">
                <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 w-24">
                  {row.label}
                </dt>
                <dd className="text-sm font-medium text-white/80">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
