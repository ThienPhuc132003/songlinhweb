import { useState } from "react";
import { useCompare } from "@/contexts/CompareContext";
import { X, GitCompareArrows, Package } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CompareTable } from "./CompareTable";

export function CompareDrawer() {
  const { items, remove, clear } = useCompare();
  const [showTable, setShowTable] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 px-4 py-3 shadow-sm backdrop-blur-lg"
        >
          <div className="container-custom flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <GitCompareArrows className="h-5 w-5" />
              <span>So sánh ({items.length}/3)</span>
            </div>

            <div className="flex flex-1 items-center gap-3 overflow-x-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex shrink-0 items-center gap-2 rounded-sm border bg-card px-3 py-1.5"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="max-w-[120px] truncate text-xs font-medium">
                    {item.name}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={clear}
                className="rounded-sm px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setShowTable(true)}
                disabled={items.length < 2}
                className="rounded-sm bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                So sánh ngay
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {showTable && (
        <CompareTable onClose={() => setShowTable(false)} />
      )}
    </>
  );
}
