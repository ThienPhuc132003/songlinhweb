import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";
import { Search, X } from "lucide-react";

/** Curated ELV-domain icons shown first */
const SUGGESTED_ICONS = [
  "wifi", "camera", "shield", "plug-zap", "radio",
  "network", "server", "lock", "eye", "flame",
  "thermometer", "speaker", "monitor", "fingerprint",
  "scan-face", "router", "cable", "hard-drive",
  "signal", "zap", "cpu", "globe", "key", "video",
];

/** Get all Lucide icon names (lowercase kebab-case) */
function getAllIconNames(): string[] {
  return Object.keys(LucideIcons)
    .filter((key) => {
      // Only get component exports (PascalCase starting with uppercase)
      if (key[0] !== key[0].toUpperCase()) return false;
      if (key === "default" || key === "createLucideIcon" || key === "icons") return false;
      if (typeof (LucideIcons as Record<string, unknown>)[key] !== "function") return false;
      return true;
    })
    .map((key) =>
      // Convert PascalCase to kebab-case
      key.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, ""),
    );
}

/** Convert kebab-case to PascalCase for Lucide lookup */
function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

interface IconPickerFieldProps {
  value: string | null | undefined;
  onChange: (icon: string | null) => void;
}

export function IconPickerField({ value, onChange }: IconPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const allIcons = useMemo(() => getAllIconNames(), []);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      // Show suggested first, then alphabetical
      const suggestedSet = new Set(SUGGESTED_ICONS);
      const remaining = allIcons.filter((n) => !suggestedSet.has(n)).slice(0, 30);
      return [...SUGGESTED_ICONS, ...remaining];
    }
    const q = search.toLowerCase();
    return allIcons.filter((name) => name.includes(q)).slice(0, 48);
  }, [allIcons, search]);

  // Get current icon component
  const CurrentIcon = useMemo(() => {
    if (!value) return null;
    const pascal = toPascalCase(value);
    const icon = (LucideIcons as Record<string, unknown>)[pascal];
    return typeof icon === "function" ? (icon as React.ComponentType<{ className?: string }>) : null;
  }, [value]);

  return (
    <div className="relative" ref={ref}>
      <div className="flex gap-2">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="wifi, camera, shield..."
          className="flex-1 font-mono"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors hover:bg-accent"
        >
          {CurrentIcon ? (
            <CurrentIcon className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border bg-popover p-3 shadow-lg">
          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm icon..."
              className="h-8 pl-7 text-xs"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Icon Grid */}
          <div className="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto">
            {filteredIcons.map((name) => {
              const pascal = toPascalCase(name);
              const Icon = (LucideIcons as Record<string, unknown>)[pascal] as
                | React.ComponentType<{ className?: string }>
                | undefined;
              if (!Icon || typeof Icon !== "function") return null;
              const isSelected = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                  title={name}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="mt-2 w-full rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            Xóa icon (mặc định)
          </button>
        </div>
      )}
    </div>
  );
}
