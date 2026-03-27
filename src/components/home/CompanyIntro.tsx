import { useEffect, useRef, useState } from "react";
import { COMPANY_STATS, COMPANY_ACTIVITIES, SITE } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

/** Animated counter hook */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
}

function StatItem({
  value,
  suffix,
  label,
  started,
}: {
  value: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const count = useCounter(value, 2000, started);

  return (
    <div className="text-center">
      <div className="text-primary text-3xl font-bold md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="text-muted-foreground mt-1 text-sm">{label}</div>
    </div>
  );
}

export function CompanyIntro({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const leftRef = useScrollReveal();
  const rightRef = useScrollReveal();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={cn("section-padding bg-muted/30", className)}>
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — text content */}
          <div ref={leftRef} className="reveal">
            <h2 className="text-primary mb-4 text-2xl font-bold md:text-3xl">
              Về {SITE.displayName}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {SITE.name} chuyên cung cấp giải pháp và dịch vụ trọn gói trong
              lĩnh vực Công nghệ thông tin, Hệ thống M&E và Cơ điện. Với đội ngũ
              kỹ sư giàu kinh nghiệm, chúng tôi cam kết mang đến chất lượng dịch
              vụ tốt nhất cho khách hàng.
            </p>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Lĩnh vực hoạt động
              </h3>
              {COMPANY_ACTIVITIES.map((activity, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stats grid */}
          <div
            ref={(el) => {
              // Merge refs
              (rightRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            className="reveal grid grid-cols-2 gap-6 md:gap-8"
          >
            {COMPANY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-background rounded-xl border p-6 shadow-sm"
              >
                <StatItem
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  started={started}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
