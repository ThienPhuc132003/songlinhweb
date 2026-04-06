import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

interface InfographicStatsProps {
  metrics: Record<string, string | number>;
  areaSqm?: number | null;
  durationMonths?: number | null;
  className?: string;
}

const METRIC_LABELS: Record<string, string> = {
  cameras: "Camera", access_points: "Access Points",
  floors: "Tầng", racks: "Tủ rack", endpoints: "Điểm cuối",
  speakers: "Loa", controllers: "Bộ điều khiển", nodes: "Nodes",
};

function parseStatValue(raw: string | number): { num: number; suffix: string } {
  if (typeof raw === "number") return { num: raw, suffix: "" };
  const match = raw.match(/^([\d,]+)\+?\s*(.*)/);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ""), 10);
    const rest = raw.includes("+") ? "+" : "";
    return { num: isNaN(num) ? 0 : num, suffix: rest + (match[2] ? " " + match[2] : "") };
  }
  return { num: 0, suffix: raw };
}

/** Animated count-up hook */
function useCountUp(target: number, duration = 1500, enabled = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || target === 0) { setCount(target); return; }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, enabled]);

  return count;
}

function StatCard({ value, suffix, label, index, visible }: StatItem & { index: number; visible: boolean }) {
  const count = useCountUp(value, 1500 + index * 200, visible);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-7 backdrop-blur-md transition-all duration-500"
      style={{ transitionDelay: `${index * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />

      <div className="relative">
        <span className="block text-center font-mono text-4xl font-black tabular-nums tracking-tight text-white md:text-5xl">
          {count.toLocaleString()}{suffix}
        </span>
        <span className="mt-2 block text-center text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/70">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Infographic-style stats section — glassmorphic cards on navy gradient.
 * Renders 3-4 big numbers with animated count-up on scroll.
 */
export function InfographicStats({ metrics, areaSqm, durationMonths, className }: InfographicStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items: StatItem[] = [];
  if (areaSqm) items.push({ value: areaSqm, label: "Diện tích (m²)" });
  if (durationMonths) items.push({ value: durationMonths, suffix: " tháng", label: "Thời gian" });

  for (const [key, val] of Object.entries(metrics)) {
    if (val && val !== 0) {
      const parsed = parseStatValue(val);
      items.push({
        value: parsed.num,
        suffix: parsed.suffix,
        label: METRIC_LABELS[key] ?? key,
      });
    }
  }

  if (items.length === 0) return null;

  // Show max 4 stats
  const displayItems = items.slice(0, 4);

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 md:py-16",
        className,
      )}
    >
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23fff' stroke-width='.5'/%3E%3C/svg%3E\")" }}
      />

      <div className="container-custom relative">
        <div className={cn(
          "grid gap-4",
          displayItems.length <= 2 ? "grid-cols-2" :
          displayItems.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4",
        )}>
          {displayItems.map((item, i) => (
            <StatCard key={i} {...item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
