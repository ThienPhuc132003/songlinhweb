import { cn } from "@/lib/utils";
import {
  Ruler,
  Briefcase,
  Clock,
  Layers,
  Shield,
  Cpu,
} from "lucide-react";

// ─── System icon mapping ──────────────────────────────────────────────────────

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  "CCTV": <Shield className="h-3 w-3" />,
  "CCTV AI": <Shield className="h-3 w-3" />,
  "Access Control": <Cpu className="h-3 w-3" />,
  "PCCC": <Shield className="h-3 w-3" />,
  "LAN/WAN": <Cpu className="h-3 w-3" />,
  "BMS": <Cpu className="h-3 w-3" />,
  "PA System": <Cpu className="h-3 w-3" />,
  "ICT": <Cpu className="h-3 w-3" />,
  "ELV": <Cpu className="h-3 w-3" />,
};

interface ProjectInfoSidebarProps {
  clientName?: string | null;
  location?: string | null;
  completionYear?: string | null;
  year?: number | null;
  projectScale?: string | null;
  clientIndustry?: string | null;
  areaSqm?: number | null;
  durationMonths?: number | null;
  /** JSON-parsed arrays */
  systemTypes?: string[];
  brandsUsed?: string[];
  className?: string;
}

const SCALE_LABELS: Record<string, string> = {
  small: "Nhỏ (<500m²)",
  medium: "Vừa (500–5.000m²)",
  large: "Lớn (>5.000m²)",
};

const INDUSTRY_LABELS: Record<string, string> = {
  banking: "Ngân hàng / Tài chính",
  hospitality: "Khách sạn / Du lịch",
  government: "Chính phủ / Công",
  industrial: "Khu công nghiệp",
  education: "Giáo dục",
  healthcare: "Y tế",
  retail: "Bán lẻ / TTTM",
  office: "Văn phòng / Cao ốc",
  residential: "Chung cư / Dân cư",
};

/**
 * "Project Specs" — PDF-style sidebar card.
 * Sections: Specs → Systems Implemented → Brands Used.
 * No duplicate info from hero (client/location/year omitted).
 */
export function ProjectInfoSidebar({
  projectScale,
  clientIndustry,
  areaSqm,
  durationMonths,
  systemTypes = [],
  brandsUsed = [],
  className,
}: ProjectInfoSidebarProps) {
  const specItems: Array<{ icon: React.ReactNode; label: string; value: string }> = [];

  if (areaSqm) {
    specItems.push({
      icon: <Ruler className="h-4 w-4" />,
      label: "Diện tích", value: `${areaSqm.toLocaleString()} m²`,
    });
  }
  if (projectScale) {
    specItems.push({
      icon: <Layers className="h-4 w-4" />,
      label: "Quy mô", value: SCALE_LABELS[projectScale] ?? projectScale,
    });
  }
  if (clientIndustry) {
    specItems.push({
      icon: <Briefcase className="h-4 w-4" />,
      label: "Ngành", value: INDUSTRY_LABELS[clientIndustry] ?? clientIndustry,
    });
  }
  if (durationMonths) {
    specItems.push({
      icon: <Clock className="h-4 w-4" />,
      label: "Thời gian", value: `${durationMonths} tháng`,
    });
  }

  const hasSpecs = specItems.length > 0;
  const hasSystems = systemTypes.length > 0;
  const hasBrands = brandsUsed.length > 0;

  if (!hasSpecs && !hasSystems && !hasBrands) return null;

  return (
    <div className={cn("rounded-xl border bg-card shadow-sm divide-y", className)}>
      {/* ─── Project Specs ─── */}
      {hasSpecs && (
        <div className="p-5">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Project Specs
          </h3>
          <div className="space-y-3.5">
            {specItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Systems Implemented ─── */}
      {hasSystems && (
        <div className="p-5">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Systems Implemented
          </h3>
          <div className="flex flex-wrap gap-2">
            {systemTypes.map((sys) => (
              <span
                key={sys}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {SYSTEM_ICONS[sys] ?? <Cpu className="h-3 w-3" />}
                {sys}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Brands Used ─── */}
      {hasBrands && (
        <div className="p-5">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Brands Used
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {brandsUsed.map((brand) => (
              <span
                key={brand}
                className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground/80"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
