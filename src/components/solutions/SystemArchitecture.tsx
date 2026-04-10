import { Badge } from "@/components/ui/badge";
import type { SolutionArchitecture as ArchType } from "@/data/solutions/types";
import { Network } from "lucide-react";

interface SystemArchitectureProps {
  architecture: ArchType;
}

export function SystemArchitecture({ architecture }: SystemArchitectureProps) {
  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
        Kiến trúc hệ thống
      </p>
      <h2 className="mb-8 text-3xl font-bold">{architecture.title}</h2>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Diagram placeholder */}
          <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 lg:w-1/2">
            <div className="text-center">
              <Network className="mx-auto mb-2 h-12 w-12 text-[#3C5DAA]/30" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">System Architecture Diagram</p>
            </div>
          </div>

          {/* Description + Integrations */}
          <div className="flex-1 space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              {architecture.description}
            </p>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
                Tích hợp hệ thống
              </h4>
              <div className="flex flex-wrap gap-2">
                {architecture.integrations.map((integration) => (
                  <Badge key={integration} variant="secondary" className="text-xs">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
