import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Search, ChevronDown, Loader2 } from "lucide-react";

interface Option {
  id: number;
  label: string;
  sublabel?: string;
  image?: string | null;
  icon?: string;
}

interface RelationalMultiSelectProps {
  /** Label for the field */
  label: string;
  /** Currently selected IDs */
  value: number[];
  /** Callback when selection changes */
  onChange: (ids: number[]) => void;
  /** Function to fetch options */
  fetchOptions: () => Promise<Option[]>;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Searchable multi-select component for linking related entities (Solutions, Products).
 * Shows selected items as removable chips and provides a dropdown with search.
 */
export function RelationalMultiSelect({
  label,
  value,
  onChange,
  fetchOptions,
  placeholder = "Tìm kiếm...",
  className,
}: RelationalMultiSelectProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch options on first open
  const loadOptions = useCallback(async () => {
    if (options.length > 0) return;
    setIsLoading(true);
    try {
      const result = await fetchOptions();
      setOptions(result);
    } catch (err) {
      console.error("Failed to load options:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchOptions, options.length]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    loadOptions();
  };

  const toggleOption = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeOption = (id: number) => {
    onChange(value.filter((v) => v !== id));
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.sublabel?.toLowerCase().includes(search.toLowerCase()) ?? false),
  );

  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  return (
    <div ref={containerRef} className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium">{label}</label>

      {/* Selected chips */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 rounded-sm border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {opt.image && (
                <img
                  src={opt.image}
                  alt=""
                  className="h-4 w-4 rounded object-cover"
                />
              )}
              {opt.label}
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-primary/10"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-1 text-sm transition-colors",
          isOpen && "ring-2 ring-primary/30 border-primary",
        )}
      >
        <span className="text-muted-foreground">
          {value.length > 0
            ? `${value.length} đã chọn`
            : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="relative z-50 mt-1 w-full rounded-sm border bg-popover shadow-lg">
          {/* Search input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleOption(opt.id)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                      isSelected && "bg-primary/5",
                    )}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input",
                      )}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                          <path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Image preview */}
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt=""
                        className="h-8 w-8 rounded border object-cover"
                      />
                    )}

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="truncate text-xs text-muted-foreground">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
