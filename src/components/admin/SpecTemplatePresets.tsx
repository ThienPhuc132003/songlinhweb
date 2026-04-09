import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";

interface SpecTemplatePresetsProps {
  /** Current category slug — used for auto-suggest */
  categorySlug?: string;
  /** Current spec entries */
  currentEntries: [string, string][];
  /** Called when a template is applied */
  onApply: (entries: [string, string][]) => void;
}

export function SpecTemplatePresets({
  categorySlug,
  currentEntries,
  onApply,
}: SpecTemplatePresetsProps) {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "spec-templates"],
    queryFn: adminApi.products.getSpecTemplates,
    staleTime: 5 * 60 * 1000,
  });

  const templates = data?.templates ?? {};
  const mapping = data?.mapping ?? {};
  const templateKeys = Object.keys(templates);

  // Suggest template based on category slug
  const suggestedKey = categorySlug ? mapping[categorySlug] : undefined;

  const handleApply = (key: string, mode: "replace" | "merge") => {
    const labels = templates[key] || [];
    if (mode === "replace") {
      onApply(labels.map((l) => [l, ""] as [string, string]));
    } else {
      // Merge: keep existing, add missing labels
      const existingKeys = new Set(currentEntries.map(([k]) => k.trim().toLowerCase()));
      const newEntries: [string, string][] = [...currentEntries];
      for (const label of labels) {
        if (!existingKeys.has(label.toLowerCase())) {
          newEntries.push([label, ""]);
        }
      }
      onApply(newEntries);
    }
    setOpen(false);
  };

  if (templateKeys.length === 0) return null;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs h-7"
        onClick={() => setOpen(!open)}
      >
        <Sparkles className="h-3 w-3 text-amber-500" />
        Mẫu thông số
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-lg border bg-popover p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Chọn mẫu thông số
            </p>

            {templateKeys.map((key) => {
              const labels = templates[key];
              const isSuggested = key === suggestedKey;
              return (
                <div
                  key={key}
                  className={`rounded-md px-2 py-1.5 ${isSuggested ? "bg-primary/5 border border-primary/20" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium capitalize">
                      {key.replace(/_/g, " ")}
                      {isSuggested && (
                        <span className="ml-1.5 text-[10px] text-primary font-semibold">
                          ★ Gợi ý
                        </span>
                      )}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleApply(key, "replace")}
                        className="text-[10px] font-medium text-primary hover:underline"
                      >
                        Thay thế
                      </button>
                      <span className="text-muted-foreground text-[10px]">|</span>
                      <button
                        type="button"
                        onClick={() => handleApply(key, "merge")}
                        className="text-[10px] font-medium text-primary hover:underline"
                      >
                        Gộp thêm
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {labels.slice(0, 4).join(", ")}
                    {labels.length > 4 && ` +${labels.length - 4}`}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
