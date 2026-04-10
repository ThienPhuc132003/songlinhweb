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

/**
 * Parse raw metric value into numeric + suffix.
 * Returns null for purely textual values (no leading digits).
 */
export function parseStatValue(raw: string | number): { num: number; suffix: string } | null {
  if (typeof raw === "number") return { num: raw, suffix: "" };
  const match = raw.match(/^([\d.,]+)\+?\s*(.*)/);
  if (match) {
    const numStr = match[1].replace(/[.,]/g, "");
    const num = parseInt(numStr, 10);
    if (isNaN(num) || num === 0) return null;
    const suffix = raw.includes("+") ? "+" : "";
    return { num, suffix: suffix + (match[2] ? " " + match[2] : "") };
  }
  return null;
}

/**
 * Build the full list of StatItems from metrics + area/duration.
 * Exported so ProjectDetail can also use the full list for the "Quy mô triển khai" section.
 */
export function buildStatItems(
  metrics: Record<string, string | number>,
  areaSqm?: number | null,
  durationMonths?: number | null,
): StatItem[] {
  const items: StatItem[] = [];
  if (areaSqm) items.push({ value: areaSqm, label: "Diện tích (m²)" });
  if (durationMonths) items.push({ value: durationMonths, suffix: " tháng", label: "Thời gian" });

  for (const [key, val] of Object.entries(metrics)) {
    if (val && val !== 0) {
      const parsed = parseStatValue(val);
      if (parsed) {
        items.push({
          value: parsed.num,
          suffix: parsed.suffix,
          label: METRIC_LABELS[key] ?? key,
        });
      }
    }
  }
  return items;
}

/** Animated count-up hook with cubic ease-out */
function useCountUp(target: number, duration = 1500, enabled = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || target === 0) { setCount(target); return; }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, enabled]);

  return count;
}

function StatColumn({ value, suffix, label, index, visible }: StatItem & { index: number; visible: boolean }) {
  const count = useCountUp(value, 1500 + index * 200, visible);

  return (
    <div
      className="text-center transition-all duration-600"
      style={{
        transitionDelay: `${index * 80}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <span className="block font-mono text-5xl font-extralight tabular-nums tracking-tighter text-[#3C5DAA] md:text-6xl lg:text-7xl">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="mt-3 block font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
        {label}
      </span>
    </div>
  );
}

/**
 * Hero infographic stats — white background, brand-blue numbers.
 * Capped at 4 items for visual balance. Remaining items render
 * in the "Quy mô triển khai" list on the detail page.
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

  const allItems = buildStatItems(metrics, areaSqm, durationMonths);
  if (allItems.length === 0) return null;

  // Hero bar: max 4 items for clean visual balance
  const displayItems = allItems.slice(0, 4);

  return (
    <section
      ref={ref}
      className={cn("bg-white border-b border-slate-200 py-10 md:py-16", className)}
    >
      <div className="container-custom">
        <div className={cn(
          "grid gap-10",
          displayItems.length <= 2 ? "grid-cols-2" :
          displayItems.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4",
        )}>
          {displayItems.map((item, i) => (
            <StatColumn key={i} {...item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
