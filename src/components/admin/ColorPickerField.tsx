import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Paintbrush } from "lucide-react";

const PRESET_COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#6B7280", // gray
  "#F97316", // orange
  "#14B8A6", // teal
];

interface ColorPickerFieldProps {
  value: string | null | undefined;
  onChange: (color: string | null) => void;
}

export function ColorPickerField({ value, onChange }: ColorPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayValue = value || "";

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

  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(displayValue);

  return (
    <div className="relative" ref={ref}>
      <div className="flex gap-2">
        <Input
          value={displayValue}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v || null);
          }}
          placeholder="#3B82F6"
          className="flex-1 font-mono"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors hover:bg-accent"
          style={
            isValidHex
              ? { backgroundColor: displayValue, borderColor: displayValue }
              : undefined
          }
        >
          {isValidHex ? (
            <span className="sr-only">Chọn màu</span>
          ) : (
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 rounded-lg border bg-popover p-3 shadow-lg">
          <div className="grid grid-cols-5 gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`h-7 w-7 rounded-md border-2 transition-transform hover:scale-110 ${
                  displayValue === c
                    ? "border-foreground ring-1 ring-foreground/20"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="mt-2 w-full rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            Xóa màu (mặc định)
          </button>
        </div>
      )}
    </div>
  );
}
