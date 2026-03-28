import { Badge } from "@/components/ui/badge";
import type { SolutionArchitecture as ArchType } from "@/data/solutions/types";
import { Network } from "lucide-react";

interface SystemArchitectureProps {
  architecture: ArchType;
}

export function SystemArchitecture({ architecture }: SystemArchitectureProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">{architecture.title}</h2>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Diagram placeholder */}
          <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 lg:w-1/2">
            <div className="text-center">
              <Network className="mx-auto mb-2 h-12 w-12 text-primary/40" />
              <p className="text-sm text-muted-foreground">System Architecture Diagram</p>
            </div>
          </div>

          {/* Description + Integrations */}
          <div className="flex-1 space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              {architecture.description}
            </p>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
