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
};

interface ProjectMetricsBarProps {
  metrics: Record<string, number>;
  areaSqm?: number | null;
  durationMonths?: number | null;
  className?: string;
}

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
    if (val > 0) {
      items.push({ label: METRIC_LABELS[key] ?? key, value: val });
    }
  }

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 rounded-xl border bg-muted/30 p-5 sm:grid-cols-3 md:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="text-center">
          <div className="text-primary text-2xl font-bold">{item.value}</div>
          <div className="text-muted-foreground mt-0.5 text-xs">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
