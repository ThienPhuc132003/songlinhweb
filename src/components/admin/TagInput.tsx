import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  label?: string;
}

const DEFAULT_SUGGESTIONS = [
  "camera", "cctv", "an-ninh", "doanh-nghiep", "pccc", "bms",
  "iot", "smart-building", "mang", "access-control", "huong-dan",
  "so-sanh", "xu-huong", "cong-nghe", "du-an", "tin-tuc",
];

export function TagInput({
  value,
  onChange,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Nhập tag...",
  maxTags = 10,
  label = "Tags",
}: TagInputProps) {
  // Defensive: ensure value is always an array
  const safeValue: string[] = Array.isArray(value) ? value : (() => { try { return JSON.parse(value as unknown as string); } catch { return []; } })();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (tag: string) => {
      const normalized = tag.trim().toLowerCase().replace(/\s+/g, "-");
      if (!normalized) return;
      if (safeValue.includes(normalized)) return;
      if (safeValue.length >= maxTags) return;
      onChange([...safeValue, normalized]);
      setInputValue("");
    },
    [safeValue, onChange, maxTags],
  );

  const removeTag = (tag: string) => {
    onChange(safeValue.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && safeValue.length > 0) {
      removeTag(safeValue[safeValue.length - 1]);
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = suggestions
    .filter(
      (s) =>
        s.includes(inputValue.toLowerCase()) && !safeValue.includes(s),
    )
    .slice(0, 8);

  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-xs font-medium">{label}</Label>
      )}

      {/* Tag pills */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-sm border bg-background p-1.5 min-h-[36px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
        {safeValue.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={safeValue.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-xs px-1 py-0.5"
          disabled={safeValue.length >= maxTags}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="rounded-sm border bg-popover p-1 shadow-md">
          <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase">
            Gợi ý
          </p>
          <div className="flex flex-wrap gap-1 px-1 pb-1">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="rounded-sm border border-input px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {safeValue.length >= maxTags && (
        <p className="text-[10px] text-muted-foreground">
          Đã đạt tối đa {maxTags} tags
        </p>
      )}
    </div>
  );
}
