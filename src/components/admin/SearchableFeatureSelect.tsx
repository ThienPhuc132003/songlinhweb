import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FeatureBadge } from "@/components/ui/FeatureBadge";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import type { ProductFeature } from "@/lib/admin-api";

interface SearchableFeatureSelectProps {
  features: ProductFeature[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function SearchableFeatureSelect({
  features,
  selectedIds,
  onChange,
}: SearchableFeatureSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Group features by group_name
  const featureGroups = useMemo(() => {
    const groups: Record<string, ProductFeature[]> = {};
    const q = search.toLowerCase();
    for (const f of features) {
      // Filter by search
      if (q && !f.name.toLowerCase().includes(q) && !f.slug.toLowerCase().includes(q)) {
        continue;
      }
      const group = f.group_name || "Khác";
      if (!groups[group]) groups[group] = [];
      groups[group].push(f);
    }
    return groups;
  }, [features, search]);

  const selectedFeatures = useMemo(
    () => features.filter((f) => selectedIds.includes(f.id)),
    [features, selectedIds],
  );

  const toggleFeature = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((fid) => fid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  return (
    <div className="rounded-sm border p-4 space-y-3" ref={ref}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tính năng
        </p>
        <span className="text-xs text-muted-foreground">
          {selectedIds.length} đã chọn
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tính năng..."
          className="h-8 pl-8 text-xs"
          onFocus={() => setOpen(true)}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Selected badges */}
      {selectedFeatures.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedFeatures.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleFeature(f.id)}
              className="group inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <FeatureBadge name={f.name} color={f.color} icon={f.icon} size="sm" />
              <X className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {/* Grouped feature list */}
      {(open || search) && (
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-sm border bg-muted/10 p-2">
          {Object.keys(featureGroups).length === 0 ? (
            <p className="py-3 text-center text-xs text-muted-foreground">
              {search ? `Không tìm thấy "${search}"` : "Chưa có tính năng nào"}
            </p>
          ) : (
            Object.entries(featureGroups).map(([group, groupFeatures]) => {
              const isCollapsed = collapsedGroups.has(group);
              return (
                <div key={group}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="flex w-full items-center gap-1 rounded px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                    {group}
                    <span className="ml-auto text-[10px] font-normal">
                      {groupFeatures.length}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <div className="flex flex-wrap gap-1.5 pl-4 pb-2">
                      {groupFeatures.map((f) => {
                        const isSelected = selectedIds.includes(f.id);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => toggleFeature(f.id)}
                            className={`inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                                : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <span
                              className={`h-3 w-3 rounded border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-primary-foreground bg-primary-foreground/20"
                                  : "border-slate-300"
                              }`}
                            >
                              {isSelected && (
                                <span className="text-[8px] leading-none">✓</span>
                              )}
                            </span>
                            {f.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Empty state when closed */}
      {!open && !search && selectedIds.length === 0 && features.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-sm border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent"
        >
          Nhấn để chọn tính năng...
        </button>
      )}

      {features.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Chưa có tính năng nào. Vui lòng tạo tính năng trong menu Sản phẩm → Tính năng.
        </p>
      )}
    </div>
  );
}
