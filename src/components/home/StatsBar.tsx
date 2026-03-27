import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COMPANY_STATS } from "@/lib/constants";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
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
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-mono text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
      {count}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="bg-primary relative overflow-hidden py-12 md:py-16">
      {/* Subtle pattern overlay */}
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

      <motion.div
        className="container-custom relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COMPANY_STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="text-center text-white"
            >
              <CountUp target={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-medium text-white/70 md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
