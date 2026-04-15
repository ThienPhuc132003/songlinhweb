import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DynamicField {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "icon";
  placeholder?: string;
  /** Width class (e.g., "w-20") */
  widthClass?: string;
}

export interface DynamicListEditorProps<T extends Record<string, string | number> = Record<string, string | number>> {
  /** Label for the section */
  label: string;
  /** Description text */
  description?: string;
  /** Field definitions */
  fields: DynamicField[];
  /** Current items */
  items: T[];
  /** Callback when items change */
  onChange: (items: T[]) => void;
  /** Factory for creating a new empty item */
  createEmpty: () => T;
  /** Max number of items */
  maxItems?: number;
}

// ─── Common Lucide icon options for the picker ────────────────────────────────

const ICON_OPTIONS = [
  "Shield", "Users", "Award", "Heart", "Star", "Zap",
  "GraduationCap", "HeadsetIcon", "Layers", "ShieldCheck",
  "Calendar", "FolderCheck", "Handshake", "Building2",
  "Target", "Eye", "CheckCircle2", "Cpu", "Wifi",
  "Lock", "Settings", "Wrench", "Clock", "Globe",
];

// ─── Generic Object-List Editor ───────────────────────────────────────────────

export function DynamicListEditor<T extends Record<string, string | number>>({
  label,
  description,
  fields,
  items,
  onChange,
  createEmpty,
  maxItems = 10,
}: DynamicListEditorProps<T>) {
  const addItem = useCallback(() => {
    if (items.length >= maxItems) return;
    onChange([...items, createEmpty()]);
  }, [items, maxItems, createEmpty, onChange]);

  const removeItem = useCallback(
    (idx: number) => {
      onChange(items.filter((_, i) => i !== idx));
    },
    [items, onChange],
  );

  const updateItem = useCallback(
    (idx: number, key: string, value: string | number) => {
      const next = [...items];
      next[idx] = { ...next[idx], [key]: value };
      onChange(next);
    },
    [items, onChange],
  );

  const moveItem = useCallback(
    (idx: number, direction: "up" | "down") => {
      const next = [...items];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return;
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      onChange(next);
    },
    [items, onChange],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={items.length >= maxItems}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm
        </Button>
      </div>

      {items.length === 0 && (
        <div className="rounded-sm border border-dashed p-6 text-center text-sm text-muted-foreground">
          Chưa có mục nào. Nhấn "Thêm" để bắt đầu.
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-start gap-2 rounded-sm border bg-slate-50 dark:bg-slate-900/50 p-3 transition-colors hover:border-primary/30"
          >
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => moveItem(idx, "up")}
                disabled={idx === 0}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40" />
              <button
                type="button"
                onClick={() => moveItem(idx, "down")}
                disabled={idx === items.length - 1}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 grid gap-2 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={field.widthClass || (field.type === "textarea" ? "sm:col-span-2" : "")}
                >
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  {field.type === "icon" ? (
                    <select
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">— Chọn icon —</option>
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={2}
                      className="text-sm"
                    />
                  ) : field.type === "number" ? (
                    <Input
                      type="number"
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(idx, field.key, Number(e.target.value) || 0)}
                      placeholder={field.placeholder}
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      type="text"
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="rounded-full p-1.5 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-4"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Simple String-List Editor ────────────────────────────────────────────────

interface StringListEditorProps {
  /** JSON string: '["Item 1", "Item 2"]' */
  value: string;
  onChange: (json: string) => void;
  className?: string;
  placeholder?: string;
  label: string;
}

/**
 * Visual list editor for string arrays (e.g. Highlights, Challenges).
 * Replaces raw JSON textarea with add/remove row interface.
 */
export function StringListEditor({
  value,
  onChange,
  className,
  placeholder = "Thêm nội dung...",
  label,
}: StringListEditorProps) {
  const [items, setItems] = useState<string[]>([]);

  // Parse JSON on mount
  useEffect(() => {
    try {
      const parsed = JSON.parse(value || "[]");
      if (Array.isArray(parsed)) {
        setItems(parsed.map(String));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, []);

  // Serialize items to JSON and call onChange
  const emitChange = (newItems: string[]) => {
    setItems(newItems);
    const validItems = newItems.filter((item) => item.trim() !== "");
    onChange(JSON.stringify(validItems));
  };

  const addItem = () => {
    emitChange([...items, ""]);
  };

  const removeItem = (index: number) => {
    emitChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, val: string) => {
    const updated = items.map((item, i) => (i === index ? val : item));
    emitChange(updated);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium">{label}</label>

      {/* Items */}
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => removeItem(i)}
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
        onClick={addItem}
        className="w-full gap-1 border-dashed text-xs"
      >
        <Plus className="h-3 w-3" />
        Thêm dòng
      </Button>

      {/* Item count */}
      {items.length > 0 && (
        <p className="text-[10px] text-muted-foreground text-right">
          {items.filter(i => i.trim()).length} mục
        </p>
      )}
    </div>
  );
}
