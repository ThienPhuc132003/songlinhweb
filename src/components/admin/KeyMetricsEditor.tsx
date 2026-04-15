import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Sparkles } from "lucide-react";

interface MetricRow {
  key: string;
  value: string;
}

interface KeyMetricsEditorProps {
  /** JSON string: '{"cameras": 120, "nodes": 300}' */
  value: string;
  onChange: (json: string) => void;
  className?: string;
}

const METRIC_PRESETS: MetricRow[] = [
  { key: "Quy mô triển khai", value: "" },
  { key: "Camera", value: "" },
  { key: "Access Points", value: "" },
  { key: "Tầng", value: "" },
  { key: "Nodes", value: "" },
  { key: "Tủ rack", value: "" },
  { key: "Điểm cuối mạng", value: "" },
  { key: "Loa PA", value: "" },
];

/**
 * Visual key-value editor for project Key Metrics.
 * Replaces raw JSON textarea with add/remove row interface.
 */
export function KeyMetricsEditor({
  value,
  onChange,
  className,
}: KeyMetricsEditorProps) {
  const [rows, setRows] = useState<MetricRow[]>([]);

  // Parse JSON on mount / value change
  useEffect(() => {
    try {
      const parsed = JSON.parse(value || "{}");
      const entries = Object.entries(parsed);
      if (entries.length > 0) {
        setRows(entries.map(([k, v]) => ({ key: k, value: String(v) })));
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    }
  }, []); // Only on mount — controlled externally via onChange

  // Serialize rows to JSON and call onChange
  const emitChange = (newRows: MetricRow[]) => {
    setRows(newRows);
    const obj: Record<string, string | number> = {};
    for (const row of newRows) {
      if (row.key.trim()) {
        const numVal = Number(row.value);
        obj[row.key.trim()] = isNaN(numVal) || row.value === "" ? row.value : numVal;
      }
    }
    onChange(JSON.stringify(obj));
  };

  const addRow = () => {
    emitChange([...rows, { key: "", value: "" }]);
  };

  const removeRow = (index: number) => {
    emitChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: "key" | "value", val: string) => {
    const updated = rows.map((row, i) =>
      i === index ? { ...row, [field]: val } : row,
    );
    emitChange(updated);
  };

  const insertPreset = (preset: MetricRow) => {
    // Don't add duplicate keys
    if (rows.some((r) => r.key === preset.key)) return;
    emitChange([...rows, { ...preset }]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Key Metrics</label>
        <div className="flex items-center gap-1">
          {/* Preset dropdown */}
          <div className="relative group">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
            >
              <Sparkles className="h-3 w-3" />
              Mẫu có sẵn
            </Button>
            <div className="absolute right-0 top-full z-50 mt-1 hidden w-48 rounded-sm border bg-popover py-1 shadow-lg group-hover:block">
              {METRIC_PRESETS.map((preset) => {
                const exists = rows.some((r) => r.key === preset.key);
                return (
                  <button
                    key={preset.key}
                    type="button"
                    disabled={exists}
                    onClick={() => insertPreset(preset)}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-xs transition-colors",
                      exists
                        ? "text-muted-foreground cursor-not-allowed"
                        : "hover:bg-accent cursor-pointer",
                    )}
                  >
                    {preset.key} {exists && "✓"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Table header */}
      {rows.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_40px] gap-2 px-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Tên chỉ số
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Giá trị
          </span>
          <span />
        </div>
      )}

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center">
          <Input
            value={row.key}
            onChange={(e) => updateRow(i, "key", e.target.value)}
            placeholder="Quy mô, Camera, Tầng..."
            className="h-8 text-sm"
          />
          <Input
            value={row.value}
            onChange={(e) => updateRow(i, "value", e.target.value)}
            placeholder="300+ Nodes, 120 pcs..."
            className="h-8 text-sm font-mono"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeRow(i)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      {/* Add row button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="w-full gap-1 border-dashed text-xs"
      >
        <Plus className="h-3 w-3" />
        Thêm metric
      </Button>

      {/* Row count */}
      {rows.length > 0 && (
        <p className="text-[10px] text-muted-foreground text-right">
          {rows.filter((r) => r.key.trim()).length} metrics
        </p>
      )}
    </div>
  );
}
