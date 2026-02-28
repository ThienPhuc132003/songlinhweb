import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-primary relative min-w-0 flex-[0_0_100%]"
            >
              {/* Background gradient overlay */}
              <div className="via-primary/90 to-primary/70 absolute inset-0 bg-linear-to-r from-(--color-primary)" />

              <div className="container-custom relative z-10 flex min-h-120 flex-col justify-center py-16 md:min-h-140 md:py-24 lg:min-h-160">
                <div className="max-w-2xl">
                  <h1
                    className={cn(
                      "mb-4 text-3xl font-bold text-white transition-all duration-700 md:text-4xl lg:text-5xl xl:text-6xl",
                      selectedIndex === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0",
                    )}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={cn(
                      "mb-8 max-w-lg text-base text-white/80 transition-all delay-100 duration-700 md:text-lg lg:text-xl",
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
                      className="bg-white text-(--color-primary) hover:bg-white/90"
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
                        className="border-white/40 text-white hover:bg-white/10"
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
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute top-1/2 left-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:flex"
        aria-label="Slide trước"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute top-1/2 right-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:flex"
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
                : "w-2.5 bg-white/50 hover:bg-white/70",
            )}
            aria-label={`Đi đến slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
