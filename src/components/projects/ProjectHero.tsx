import { cn } from "@/lib/utils";

interface ProjectHeroProps {
  title: string;
  coverImage?: string | null;
  category?: string;
  clientName?: string | null;
  location?: string | null;
  completionYear?: string | null;
  statusLabel?: string | null;
  className?: string;
}

/**
 * Full-width Cover Image with a subtle gradient overlay.
 * Project Title and Client Name in massive white typography over the image.
 */
export function ProjectHero({
  title,
  coverImage,
  category,
  clientName,
  location,
  completionYear,
  statusLabel,
  className,
}: ProjectHeroProps) {
  const metaRows: Array<{ label: string; value: string }> = [];
  if (clientName) metaRows.push({ label: "Chủ đầu tư", value: clientName });
  if (location) metaRows.push({ label: "Vị trí", value: location });
  if (completionYear) metaRows.push({ label: "Hoàn thành", value: completionYear });

  return (
    <section className={cn("relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-end", className)}>
      {/* Background Image */}
      <div className="absolute inset-0 bg-slate-950">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23fff' stroke-width='.1'/%3E%3C/svg%3E\")",
              opacity: 0.1,
            }}
          />
        )}
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* Content Container positioned at the bottom */}
      <div className="container-custom relative z-10 pb-12 pt-24 md:pb-16 flex flex-col items-start w-full">
        {/* Category + Status badges */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {category && (
            <p className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white">
              {category}
            </p>
          )}
          {statusLabel && (
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm border",
              statusLabel === "Hoàn thành"
                ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200"
                : "bg-amber-500/20 border-amber-400/30 text-amber-200"
            )}>
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                statusLabel === "Hoàn thành" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
              )} />
              {statusLabel}
            </span>
          )}
        </div>

        {/* Title — massive weight */}
        <h1 className="text-3xl font-extralight leading-tight tracking-tight text-white md:text-5xl lg:text-6xl max-w-5xl">
          {title}
        </h1>

        {/* Meta rows — horizontal layout under title */}
        {metaRows.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6">
            {metaRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {row.label}
                </span>
                <span className="text-sm md:text-base font-medium text-white/90">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
