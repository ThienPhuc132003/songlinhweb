import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, FileText } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CTABanner({ className }: { className?: string }) {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left"
        >
          <div className="flex-1">
            <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              Bạn cần tư vấn giải pháp?
            </h2>
            <p className="max-w-lg text-base text-white/80">
              Liên hệ ngay với đội ngũ chuyên gia của SLTECH để được tư vấn giải
              pháp phù hợp nhất cho dự án của bạn.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            <Button
              asChild
              size="lg"
              className="bg-white text-(--color-primary) hover:bg-white/90"
            >
              <Link to="/lien-he">
                <Phone className="mr-2 h-4 w-4" />
                Liên hệ ngay
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <a
                href={SITE.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Hồ sơ năng lực
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
