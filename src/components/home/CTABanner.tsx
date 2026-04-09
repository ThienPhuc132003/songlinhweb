import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function CTABanner({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-primary relative overflow-hidden py-20 md:py-24",
        className,
      )}
    >
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-10 text-center lg:flex-row lg:text-left"
        >
          <div className="flex-1">
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
              Bắt đầu dự án
            </p>
            <h2 className="mb-4 text-2xl font-extralight tracking-tight text-white md:text-3xl">
              Bạn cần{" "}
              <span className="font-semibold">tư vấn giải pháp?</span>
            </h2>
            <p className="max-w-lg text-[15px] leading-relaxed text-white/60">
              Liên hệ ngay với đội ngũ chuyên gia của {SITE.displayName} để được
              tư vấn giải pháp phù hợp nhất cho dự án của bạn.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            <Button
              asChild
              size="lg"
              className="min-h-11 rounded-none bg-white px-8 font-medium tracking-wide text-[#3C5DAA] shadow-lg hover:bg-white/90"
            >
              <Link to="/lien-he">
                Liên hệ ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-11 rounded-none border-white/30 !bg-transparent px-8 font-medium tracking-wide text-white hover:!bg-white/10"
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
        </motion.div>
      </div>
    </section>
  );
}
