import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** Title text to show subtly inside the placeholder */
  title?: string;
  /** Additional classNames for the root container — MUST include aspect-ratio class */
  className?: string;
  /** Visual variant */
  variant?: "product" | "project" | "solution";
}

/**
 * Branded image placeholder used across all card types when images are unavailable.
 * Shows the SLTECH "SL" monogram on a professional gradient background.
 */
export function ImagePlaceholder({
  title,
  className,
  variant = "product",
}: ImagePlaceholderProps) {
  const gradients: Record<string, string> = {
    product: "from-slate-100 via-blue-50/40 to-slate-100",
    project: "from-slate-100 via-slate-50 to-blue-50/30",
    solution: "from-primary/[0.06] via-blue-50/30 to-slate-50",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradients[variant],
        className,
      )}
    >
      {/* Subtle grid pattern bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Company monogram */}
      <div className="relative flex flex-col items-center gap-1.5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/10 bg-white/60 shadow-sm backdrop-blur-sm">
          <span className="text-lg font-bold tracking-tight text-primary/30">
            SL
          </span>
        </div>
        {title && (
          <span className="max-w-[80%] text-center text-[10px] font-medium leading-tight text-muted-foreground/40 line-clamp-1">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
