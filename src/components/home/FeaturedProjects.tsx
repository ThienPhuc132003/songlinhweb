import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { FEATURED_PROJECTS, SITE } from "@/lib/constants";
import { useProjects } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

function ProjectCard({
  slug,
  title,
  category,
  image,
}: {
  slug: string;
  title: string;
  category: string;
  image: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/du-an/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Image — consistent aspect-video */}
      <div className="relative shrink-0 overflow-hidden">
        {imgError ? (
          <ImagePlaceholder
            className="aspect-video"
            variant="project"
            title={title}
          />
        ) : (
          <img
            src={image}
            alt={title}
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-primary mb-1 block text-xs font-medium">
          {category}
        </span>
        <h3 className="group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors">
          {title}
        </h3>
        {/* CTA — pinned to bottom */}
        <span className="mt-auto inline-flex items-center pt-3 text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
          Xem chi tiết
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function FeaturedProjects({ className }: { className?: string }) {
  const { data: apiData } = useProjects({ featured: true });

  const projects = apiData?.items?.length
    ? apiData.items.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        image: p.thumbnail_url ?? `/images/projects/${p.slug}.jpg`,
      }))
    : FEATURED_PROJECTS;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const headingRef = useScrollReveal();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-custom">
        <div
          ref={headingRef}
          className="reveal mb-10 flex flex-col items-start justify-between gap-4 md:mb-14 md:flex-row md:items-end"
        >
          <div>
            <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
              Dự án tiêu biểu
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Những dự án được {SITE.displayName} tư vấn, thiết kế và thi công
              thành công
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Dự án trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Dự án sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-4 flex">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/du-an">
              Xem tất cả dự án
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
