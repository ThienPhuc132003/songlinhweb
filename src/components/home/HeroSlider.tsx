import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES, heroGiaiPhap, heroCCTV, heroME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

/** Map imageKey → imported asset */
const HERO_IMAGES: Record<string, string> = {
  giaiphap: heroGiaiPhap,
  cctv: heroCCTV,
  me: heroME,
};

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {HERO_SLIDES.map((slide, index) => {
            const imgSrc = HERO_IMAGES[slide.imageKey];
            return (
              <div
                key={slide.id}
                className="relative min-w-0 flex-[0_0_100%]"
              >
                {/* ── Background image ── */}
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                )}

                {/* ── Multi-layer overlay for text readability ── */}
                {/* Strong left-side gradient so text pops */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/65 to-transparent" />
                {/* Subtle bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-[#0a1628]/20" />
                {/* Blue tint accent */}
                <div className="absolute inset-0 bg-[var(--color-primary)]/15 mix-blend-overlay" />

                {/* ── Content ── */}
                <div className="container-custom relative z-10 flex min-h-[28rem] flex-col justify-center py-16 md:min-h-[32rem] md:py-24 lg:min-h-[36rem]">
                  <div className="max-w-2xl">
                    {/* Thin accent line */}
                    <div
                      className={cn(
                        "mb-5 h-1 w-16 rounded-full bg-white/80 transition-all duration-700",
                        selectedIndex === index
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-6 opacity-0",
                      )}
                    />

                    <h1
                      className={cn(
                        "mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] transition-all duration-700 md:text-4xl lg:text-5xl xl:text-[3.5rem]",
                        selectedIndex === index
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0",
                      )}
                    >
                      {slide.title}
                    </h1>
                    <p
                      className={cn(
                        "mb-8 max-w-lg text-base leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,.3)] transition-all delay-100 duration-700 md:text-lg",
                        selectedIndex === index
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0",
                      )}
                    >
                      {slide.subtitle}
                    </p>
                    <div
                      className={cn(
                        "flex flex-wrap gap-3 transition-all delay-200 duration-700",
                        selectedIndex === index
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0",
                      )}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="min-h-11 bg-white !text-[var(--color-primary)] shadow-lg hover:bg-white/90"
                      >
                        <Link to={slide.cta.href}>
                          {slide.cta.label}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      {slide.ctaSecondary && (
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="min-h-11 border-white/30 bg-transparent !text-white hover:bg-white/10"
                        >
                          {slide.ctaSecondary.href.startsWith("http") ? (
                            <a
                              href={slide.ctaSecondary.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {slide.ctaSecondary.label}
                            </a>
                          ) : (
                            <Link to={slide.ctaSecondary.href}>
                              {slide.ctaSecondary.label}
                            </Link>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute top-1/2 left-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/25 md:flex"
        aria-label="Slide trước"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute top-1/2 right-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/25 md:flex"
        aria-label="Slide sau"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              selectedIndex === i
                ? "w-8 bg-white"
                : "w-2.5 bg-white/40 hover:bg-white/60",
            )}
            aria-label={`Đi đến slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
