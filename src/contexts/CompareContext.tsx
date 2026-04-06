import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CompareProduct {
  id: number;
  slug: string;
  name: string;
  image_url: string | null;
  brand_name?: string | null;
}

interface CompareContextType {
  items: CompareProduct[];
  add: (product: CompareProduct) => void;
  remove: (id: number) => void;
  clear: () => void;
  isInCompare: (id: number) => boolean;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareProduct[]>([]);

  const add = useCallback((product: CompareProduct) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCompare = useCallback(
    (id: number) => items.some((p) => p.id === id),
    [items],
  );

  return (
    <CompareContext.Provider
      value={{ items, add, remove, clear, isInCompare, isFull: items.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
