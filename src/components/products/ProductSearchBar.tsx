import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSearchBarProps {
  className?: string;
}

export function ProductSearchBar({ className }: ProductSearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  // Sync URL → local state
  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  // Debounced search
  const updateSearch = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value.trim()) {
        next.set("search", value.trim());
      } else {
        next.delete("search");
      }
      next.delete("page");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(query);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm theo tên, SKU, thương hiệu..."
        className="h-10 w-full rounded-sm border bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
