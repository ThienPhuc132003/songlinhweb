import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FeatureBadge } from "@/components/ui/FeatureBadge";
import { useProductFeatures } from "@/hooks/useApi";

interface GroupedFeatureFilterProps {
  className?: string;
}

export function GroupedFeatureFilter({ className }: GroupedFeatureFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: features = [] } = useProductFeatures();
  const selectedTags = searchParams.getAll("tag");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Group features by group_name
  const featureGroups = useMemo(() => {
    const groups: Record<string, typeof features> = {};
    for (const f of features) {
      const group = f.group_name || "Khác";
      if (!groups[group]) groups[group] = [];
      groups[group].push(f);
    }
    return groups;
  }, [features]);

  const toggleTag = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll("tag");
    next.delete("tag");
    if (current.includes(slug)) {
      current.filter((t) => t !== slug).forEach((t) => next.append("tag", t));
    } else {
      [...current, slug].forEach((t) => next.append("tag", t));
    }
    next.set("page", "1");
    setSearchParams(next);
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

  if (features.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tính năng
      </h3>

      <div className="space-y-2">
        {Object.entries(featureGroups).map(([group, groupFeatures]) => {
          const isCollapsed = collapsedGroups.has(group);
          const hasSelected = groupFeatures.some((f) =>
            selectedTags.includes(f.slug),
          );

          return (
            <div key={group}>
              <button
                onClick={() => toggleGroup(group)}
                className="flex w-full items-center gap-1 rounded px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-600"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                <span className="flex-1 text-left">{group}</span>
                {hasSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>

              {!isCollapsed && (
                <div className="flex flex-wrap gap-1.5 pl-4 pb-1">
                  {groupFeatures.map((feature) => {
                    const isActive = selectedTags.includes(feature.slug);
                    return (
                      <button
                        key={feature.slug}
                        onClick={() => toggleTag(feature.slug)}
                        className={`transition-all ${
                          isActive
                            ? "ring-2 ring-primary/30 rounded-full"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <FeatureBadge
                          name={feature.name}
                          color={isActive ? feature.color : undefined}
                          icon={feature.icon}
                          size="sm"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
