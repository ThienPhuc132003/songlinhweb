import { cn } from "@/lib/utils";

interface MetricItem {
  label: string;
  value: string | number;
}

const METRIC_LABELS: Record<string, string> = {
  cameras: "Camera",
  access_points: "Access Points",
  floors: "Tầng",
  racks: "Tủ rack",
  endpoints: "Điểm cuối",
  speakers: "Loa",
  controllers: "Bộ điều khiển",
  nodes: "Nodes",
};

interface ProjectMetricsBarProps {
  metrics: Record<string, string | number>;
  areaSqm?: number | null;
  durationMonths?: number | null;
  className?: string;
}

/**
 * PDF-style metrics bar with accent border and monospace values.
 * Renders horizontally with subtle separators.
 */
export function ProjectMetricsBar({
  metrics,
  areaSqm,
  durationMonths,
  className,
}: ProjectMetricsBarProps) {
  const items: MetricItem[] = [];

  if (areaSqm) {
    items.push({ label: "Diện tích", value: `${areaSqm.toLocaleString()} m²` });
  }
  if (durationMonths) {
    items.push({ label: "Thời gian", value: `${durationMonths} tháng` });
  }

  for (const [key, val] of Object.entries(metrics)) {
    if (val && val !== 0) {
      items.push({ label: METRIC_LABELS[key] ?? key, value: val });
    }
  }

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-l-4 border-l-primary border bg-muted/20 px-6 py-5",
        className,
      )}
    >
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        Implementation Scale
      </p>
      <div className="flex flex-wrap gap-6 md:gap-8">
        {items.map((item, i) => (
          <div key={i} className="min-w-[80px]">
            <div className="font-mono text-xl font-bold text-primary tabular-nums">
              {item.value}
            </div>
            <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
