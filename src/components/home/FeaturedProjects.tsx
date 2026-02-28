import { Link } from "react-router";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { FEATURED_PROJECTS } from "@/lib/constants";
import { useProjects } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeaturedProjects({ className }: { className?: string }) {
  const { data: apiData } = useProjects();

  /* Use API projects if available, otherwise fall back to static constants */
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-14 md:flex-row md:items-end"
        >
          <div>
            <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
              Dự án tiêu biểu
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Những dự án được SLTECH tư vấn, thiết kế và thi công thành công
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
        </motion.div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-4 flex">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Link
                  to={`/du-an/${project.slug}`}
                  className="group block overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="bg-muted relative aspect-4/3 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback placeholder if image missing
                        const target = e.currentTarget;
                        target.src = "";
                        target.style.display = "none";
                        target.parentElement!.classList.add(
                          "flex",
                          "items-center",
                          "justify-center",
                        );
                        const span = document.createElement("span");
                        span.className =
                          "text-muted-foreground text-sm text-center px-4";
                        span.textContent = project.title;
                        target.parentElement!.appendChild(span);
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <span className="text-primary mb-1 text-xs font-medium">
                      {project.category}
                    </span>
                    <h3 className="group-hover:text-primary text-sm font-semibold transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
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
