import { motion } from "framer-motion";
import { PARTNERS } from "@/lib/constants";
import { usePartners } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

export function PartnerLogos({ className }: { className?: string }) {
  const { data: apiPartners } = usePartners();

  /* Use API partner names if available, otherwise static strings */
  const partnerNames = apiPartners?.length
    ? apiPartners.map((p) => p.name)
    : [...PARTNERS];

  // Double the array for seamless infinite scroll
  const logos = [...partnerNames, ...partnerNames];

  return (
    <section className={cn("section-padding bg-muted/30", className)}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-14"
        >
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Đối tác chiến lược
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            Hợp tác cùng các thương hiệu hàng đầu thế giới trong lĩnh vực công
            nghệ và an ninh
          </p>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="from-muted/30 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r to-transparent" />
          <div className="from-muted/30 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l to-transparent" />

          <div className="animate-marquee flex items-center gap-12">
            {logos.map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="bg-background flex h-20 min-w-40 items-center justify-center rounded-lg border px-6 shadow-sm"
              >
                <span className="text-foreground/70 text-sm font-semibold whitespace-nowrap">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
