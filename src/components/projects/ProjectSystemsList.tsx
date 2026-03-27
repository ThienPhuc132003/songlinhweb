import { cn } from "@/lib/utils";

interface ProjectSystemsListProps {
  systemTypes: string[];
  brandsUsed: string[];
  className?: string;
}

export function ProjectSystemsList({
  systemTypes,
  brandsUsed,
  className,
}: ProjectSystemsListProps) {
  if (systemTypes.length === 0 && brandsUsed.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {systemTypes.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hệ thống triển khai
          </h4>
          <div className="flex flex-wrap gap-2">
            {systemTypes.map((system) => (
              <span
                key={system}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {system}
              </span>
            ))}
          </div>
        </div>
      )}
      {brandsUsed.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Thương hiệu sử dụng
          </h4>
          <div className="flex flex-wrap gap-2">
            {brandsUsed.map((brand) => (
              <span
                key={brand}
                className="rounded-full border px-3 py-1 text-xs font-medium"
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
