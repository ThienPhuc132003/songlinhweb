import { motion } from "framer-motion";
import type { SolutionCapability } from "@/data/solutions/types";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";

interface TechExcellenceGridProps {
  capabilities: SolutionCapability[];
}

export function TechExcellenceGrid({ capabilities }: TechExcellenceGridProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Tính năng nổi bật</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-3">
              <SolutionIconBadge name={cap.icon} size="md" />
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
