import { Cpu } from "lucide-react";

interface ProductSpecTableProps {
  specEntries: [string, string][];
}

/**
 * Technical specifications table for product detail pages.
 * Extracted from ProductDetail.tsx to reduce page complexity.
 */
export function ProductSpecTable({ specEntries }: ProductSpecTableProps) {
  if (specEntries.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Thông số kỹ thuật</h2>
        </div>
        <span className="rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {specEntries.length} thông số
        </span>
      </div>
      <div className="overflow-x-auto -mx-1 px-1 rounded-sm border">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-muted/70">
              <th className="w-2/5 px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Thông số
              </th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Giá trị
              </th>
            </tr>
          </thead>
          <tbody>
            {specEntries.map(([key, value], i) => (
              <tr
                key={key}
                className={`border-t transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "bg-muted/20" : "bg-background"}`}
              >
                <td className="px-5 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                  {key}
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
