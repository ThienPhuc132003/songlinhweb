import { cn } from "@/lib/utils";

interface ProjectInfoSidebarProps {
  clientName?: string | null;
  location?: string | null;
  clientIndustry?: string | null;
  systemTypes?: string[];
  brandsUsed?: string[];
  complianceStandards?: string[];
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
  brandsUsed = [],
  complianceStandards = [],
  className,
}: ProjectInfoSidebarProps) {
  const hasSystems = systemTypes.length > 0;
  const hasBrands = brandsUsed.length > 0;
  const hasStandards = complianceStandards.length > 0;
  const hasClient = !!clientName;

  if (!hasSystems && !hasClient && !hasBrands && !hasStandards) return null;

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white shadow-sm p-6 dark:border-slate-800 dark:bg-slate-950", className)}>
      <div className="space-y-6">
        {/* ─── Block 1: Client ─── */}
        {hasClient && (
          <div>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Chủ Đầu Tư
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

        {/* ─── Divider ─── */}
        {hasSystems && hasClient && <div className="h-px bg-slate-100 dark:bg-slate-800" />}

        {/* ─── Block 2: Systems ─── */}
        {hasSystems && (
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Hệ Thống Tích Hợp
            </h3>
            <div className="flex flex-wrap gap-2">
              {systemTypes.map((sys) => (
                <span key={sys} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-300 dark:bg-slate-900/50 dark:border-slate-800">
                  {sys}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── Block 3: Brands ─── */}
        {hasBrands && (
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Thương hiệu
            </h3>
            <div className="flex flex-wrap gap-2">
              {brandsUsed.map((brand) => (
                <span key={brand} className="inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── Block 4: Standards ─── */}
        {hasStandards && (
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Tiêu chuẩn tuân thủ
            </h3>
            <div className="flex flex-col gap-1.5 mt-2">
              {complianceStandards.map((std) => (
                <div key={std} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{std}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
