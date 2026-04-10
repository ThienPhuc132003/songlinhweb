import { motion } from "framer-motion";
import type { SolutionCapability } from "@/data/solutions/types";
import { SolutionIcon } from "@/components/ui/SolutionIcon";

interface TechExcellenceGridProps {
  capabilities: SolutionCapability[];
}

export function TechExcellenceGrid({ capabilities }: TechExcellenceGridProps) {
  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
        Tính năng nổi bật
      </p>
      <h2 className="mb-8 text-3xl font-bold">Năng lực kỹ thuật</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:border-[#3C5DAA]/30 hover:shadow-lg"
          >
            <div className="mb-3 flex items-center gap-3">
              <SolutionIcon name={cap.icon} size="lg" className="shrink-0 text-[#3C5DAA]" />
              <h3 className="text-sm font-semibold">{cap.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {cap.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
