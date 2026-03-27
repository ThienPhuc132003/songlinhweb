import { cn } from "@/lib/utils";

interface ProjectComplianceBadgesProps {
  standards: string[];
  className?: string;
}

export function ProjectComplianceBadges({
  standards,
  className,
}: ProjectComplianceBadgesProps) {
  if (standards.length === 0) return null;

  return (
    <div className={cn("", className)}>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tiêu chuẩn tuân thủ
      </h4>
      <div className="flex flex-wrap gap-2">
        {standards.map((standard) => (
          <span
            key={standard}
            className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          >
            <span className="text-green-500">✓</span>
            {standard}
          </span>
        ))}
      </div>
    </div>
  );
}
