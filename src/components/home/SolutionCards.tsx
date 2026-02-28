import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Camera,
  Flame,
  Volume2,
  Network,
  Zap,
  Phone,
  ShieldCheck,
  Bell,
  Server,
  Building2,
  FileCheck,
  type LucideIcon,
} from "lucide-react";
import { SOLUTIONS_DATA } from "@/lib/constants";
import { useSolutions } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Camera,
  Flame,
  Volume2,
  Network,
  Zap,
  Phone,
  ShieldCheck,
  Bell,
  Server,
  Building2,
  FileCheck,
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface SolutionCardsProps {
  /** Show all or limit the grid */
  limit?: number;
  className?: string;
}

export function SolutionCards({ limit, className }: SolutionCardsProps) {
  const { data: apiSolutions } = useSolutions();
  const allSolutions = apiSolutions ?? SOLUTIONS_DATA;
  const solutions = limit ? allSolutions.slice(0, limit) : allSolutions;

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-custom">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Giải pháp của chúng tôi
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Cung cấp đa dạng giải pháp công nghệ, hệ thống M&E và cơ điện cho
            mọi quy mô dự án
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          {solutions.map((solution) => {
            const Icon = ICON_MAP[solution.icon] || Camera;
            return (
              <motion.div key={solution.slug} variants={item}>
                <Link
                  to={`/giai-phap/${solution.slug}`}
                  className="bg-card hover:border-primary/30 group flex flex-col items-center rounded-xl border p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="group-hover:text-primary text-sm font-semibold transition-colors">
                    {solution.title}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {limit && limit < allSolutions.length && (
          <div className="mt-8 text-center">
            <Link
              to="/giai-phap"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
            >
              Xem tất cả giải pháp →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
