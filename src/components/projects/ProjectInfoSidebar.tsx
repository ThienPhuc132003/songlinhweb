import { cn } from "@/lib/utils";

interface ProjectInfoSidebarProps {
  clientName?: string | null;
  location?: string | null;
  clientIndustry?: string | null;
  systemTypes?: string[];
  className?: string;
}

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
 * Sticky sidebar — two clean white cards:
 *   1. HỆ THỐNG ELV & ICT — bulleted list of system_types
 *   2. CHỦ ĐẦU TƯ — client name + industry
 */
export function ProjectInfoSidebar({
  clientName,
  location,
  clientIndustry,
  systemTypes = [],
  className,
}: ProjectInfoSidebarProps) {
  const hasSystems = systemTypes.length > 0;
  const hasClient = !!clientName;

  if (!hasSystems && !hasClient) return null;

  return (
    <div className={cn("space-y-5", className)}>
      {/* ─── Card 1: Systems ─── */}
      {hasSystems && (
        <div className="rounded-xl border border-primary/15 bg-white dark:bg-slate-900 shadow-sm p-5">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Hệ thống ELV & ICT
          </h3>
          <ul className="space-y-2.5">
            {systemTypes.map((sys) => (
              <li key={sys} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-sm bg-primary" />
                {sys}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Card 2: Client ─── */}
      {hasClient && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Chủ đầu tư
          </h3>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">{clientName}</p>
          {clientIndustry && (
            <p className="mt-1 text-xs text-muted-foreground">
              {INDUSTRY_LABELS[clientIndustry] ?? clientIndustry}
            </p>
          )}
          {location && (
            <p className="mt-1 text-xs text-muted-foreground">{location}</p>
          )}
        </div>
      )}
    </div>
  );
}
