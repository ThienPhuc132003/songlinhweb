import { cn } from "@/lib/utils";
import { MapPin, Calendar, Building2 } from "lucide-react";

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
 * Full-width hero — clean gradient that lets the cover image shine.
 * Shows category badge + project meta (client, location, year) inline.
 * Uses lighter overlays for a portfolio-quality look.
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
  const metaItems: Array<{ icon: React.ReactNode; text: string }> = [];

  if (clientName) {
    metaItems.push({ icon: <Building2 className="h-3.5 w-3.5" />, text: clientName });
  }
  if (location) {
    metaItems.push({ icon: <MapPin className="h-3.5 w-3.5" />, text: location });
  }
  if (completionYear) {
    metaItems.push({ icon: <Calendar className="h-3.5 w-3.5" />, text: completionYear });
  }

  return (
    <section
      className={cn(
        "relative flex min-h-[360px] items-end overflow-hidden bg-slate-900 md:min-h-[440px]",
        className,
      )}
    >
      {/* Cover image — now more visible */}
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Lighter gradient — shows image details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Content */}
      <div className="container-custom relative z-10 pb-10 pt-24 md:pb-14">
        {category && (
          <span className="mb-3 inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            {category}
          </span>
        )}

        <h1 className="max-w-4xl text-2xl font-bold leading-tight text-white md:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>

        {/* Inline meta: Client • Location • Year */}
        {metaItems.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/75">
            {metaItems.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                {item.icon}
                <span className="font-medium">{item.text}</span>
                {i < metaItems.length - 1 && (
                  <span className="ml-2 text-white/30">•</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
