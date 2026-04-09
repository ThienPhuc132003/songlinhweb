import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/hooks/useApi";
import { COMPANY_STATS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon?: string;
}

interface StatsGridProps {
  /** "card" = About page style, "banner" = Home StatsBar style */
  variant?: "card" | "banner";
  className?: string;
}

// ─── CountUp Animation ────────────────────────────────────────────────────────

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// ─── StatsGrid Component ──────────────────────────────────────────────────────

export function StatsGrid({ variant = "card", className }: StatsGridProps) {
  const { data: config } = useSiteConfig();

  const stats: StatItem[] = useMemo(() => {
    if (config?.company_stats) {
      try {
        const parsed = JSON.parse(config.company_stats) as StatItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* fall through */ }
    }
    // Fallback to hardcoded constants
    return COMPANY_STATS.map((s) => ({
      value: s.value,
      suffix: s.suffix,
      label: s.label,
    }));
  }, [config]);

  if (variant === "banner") {
    return (
      <section className={cn("bg-primary relative overflow-hidden py-14 md:py-20", className)}>
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
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center text-white">
                <span className="font-mono text-4xl font-extralight tracking-tight md:text-5xl">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </span>
                <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-white/60 md:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Card variant (About page)
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Card
            className={cn(
              "text-center h-full",
              i === 0 && "border-primary/30 bg-primary/5",
            )}
          >
            <CardContent className="p-5">
              <div className="text-primary text-3xl font-bold">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
