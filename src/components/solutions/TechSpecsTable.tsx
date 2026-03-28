import type { SolutionSpec } from "@/data/solutions/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TechSpecsTableProps {
  specs: SolutionSpec[];
}

export function TechSpecsTable({ specs }: TechSpecsTableProps) {
  // Group specs by category
  const categories = specs.reduce<Record<string, SolutionSpec[]>>((acc, spec) => {
    const cat = spec.category || "Chung";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(spec);
    return acc;
  }, {});

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Thông số kỹ thuật</h2>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900">
              <TableHead className="w-[200px] font-semibold">Thông số</TableHead>
              <TableHead className="font-semibold">Giá trị</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(categories).map(([category, items]) => (
              <>
                {/* Category header */}
                <TableRow key={`cat-${category}`} className="bg-primary/5">
                  <TableCell
                    colSpan={2}
                    className="text-xs font-semibold uppercase tracking-wider text-primary"
                  >
                    {category}
                  </TableCell>
                </TableRow>
                {/* Spec rows */}
                {items.map((spec, i) => (
                  <TableRow key={`${category}-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="text-sm text-muted-foreground">
                      {spec.label}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      {spec.value}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
