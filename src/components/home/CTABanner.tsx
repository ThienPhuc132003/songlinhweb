import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function CTABanner({ className }: { className?: string }) {
  const ref = useScrollReveal();

  return (
    <section
      className={cn(
        "bg-primary relative overflow-hidden py-16 md:py-20",
        className,
      )}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

      <div className="container-custom relative z-10">
        <div
          ref={ref}
          className="reveal flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left"
        >
          <div className="flex-1">
            <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              Bạn cần tư vấn giải pháp?
            </h2>
            <p className="max-w-lg text-base text-white/80">
              Liên hệ ngay với đội ngũ chuyên gia của {SITE.displayName} để được
              tư vấn giải pháp phù hợp nhất cho dự án của bạn.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            <Button
              asChild
              size="lg"
              className="min-h-11 bg-white font-semibold text-[#3C5DAA] shadow-lg hover:bg-white/90"
            >
              <Link to="/lien-he">Liên hệ ngay</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-11 !bg-transparent border-white/40 font-semibold text-white hover:!bg-white/10"
            >
              <a
                href={SITE.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hồ sơ năng lực
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
