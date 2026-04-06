import { useState, useCallback, useRef } from "react";
import { Star, Trash2, GripVertical, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@/lib/admin-api";

interface GalleryImageGridProps {
  images: GalleryImage[];
  onSetCover: (imageUrl: string) => void;
  onDeleteImage: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onReorder: (items: Array<{ id: number; sort_order: number }>) => void;
  onUpdateCaption: (id: number, caption: string) => void;
  coverUrl: string | null;
}

export function GalleryImageGrid({
  images,
  onSetCover,
  onDeleteImage,
  onBulkDelete,
  onReorder,
  onUpdateCaption,
  coverUrl,
}: GalleryImageGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [captionValue, setCaptionValue] = useState("");
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((i) => i.id)));
    }
  };

  const startEditCaption = (img: GalleryImage) => {
    setEditingCaption(img.id);
    setCaptionValue(img.caption ?? "");
  };

  const saveCaption = () => {
    if (editingCaption !== null) {
      onUpdateCaption(editingCaption, captionValue);
      setEditingCaption(null);
    }
  };

  // ─── Drag & Drop (HTML5 native) ─────
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragItem(index);
    e.dataTransfer.effectAllowed = "move";
    // Ghost element
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "0.4";
  }, []);

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.opacity = "1";

      if (dragItem !== null && dragOverItem !== null && dragItem !== dragOverItem) {
        // Reorder
        const reordered = [...images];
        const [movedItem] = reordered.splice(dragItem, 1);
        reordered.splice(dragOverItem, 0, movedItem);

        // Emit new sort orders
        onReorder(
          reordered.map((img, i) => ({ id: img.id, sort_order: i })),
        );
      }

      setDragItem(null);
      setDragOverItem(null);
    },
    [dragItem, dragOverItem, images, onReorder],
  );

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(index);
  }, []);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-slate-800 p-4 mb-3">
          <Star className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm text-slate-400">Chưa có ảnh nào trong album</p>
        <p className="text-xs text-slate-500 mt-1">Upload ảnh bằng dropzone phía trên</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={selectAll}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            {selectedIds.size === images.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
          <span className="text-xs text-slate-500">{images.length} ảnh</span>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200">
            <span className="text-xs text-cyan-400 font-medium">
              {selectedIds.size} đã chọn
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-red-800 text-red-400 hover:bg-red-950/50"
              onClick={() => {
                onBulkDelete(Array.from(selectedIds));
                setSelectedIds(new Set());
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Xóa đã chọn
            </Button>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
      >
        {images.map((img, index) => {
          const isCover = img.image_url === coverUrl;
          const isSelected = selectedIds.has(img.id);
          const isDragTarget = dragOverItem === index && dragItem !== index;

          return (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              className={`group relative aspect-square rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 ${
                isDragTarget
                  ? "ring-2 ring-cyan-400 scale-105"
                  : isSelected
                    ? "ring-2 ring-cyan-500"
                    : isCover
                      ? "ring-2 ring-amber-400"
                      : "ring-1 ring-slate-700 hover:ring-slate-500"
              }`}
            >
              <img
                src={img.image_url}
                alt={img.caption ?? ""}
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {/* Grip Handle */}
              <div className="absolute top-1 left-1 rounded bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3.5 w-3.5 text-white/70" />
              </div>

              {/* Cover Badge */}
              {isCover && (
                <div className="absolute top-1 right-1 rounded bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold text-black">
                  COVER
                </div>
              )}

              {/* Selection Checkbox */}
              <div
                className={`absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isSelected ? "!opacity-100" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(img.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 rounded border-2 border-white/50 bg-black/40 cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Action Overlay (on hover) */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Caption */}
                {editingCaption === img.id ? (
                  <div className="flex items-center gap-1 mb-1">
                    <input
                      type="text"
                      value={captionValue}
                      onChange={(e) => setCaptionValue(e.target.value)}
                      className="flex-1 rounded bg-black/50 border border-slate-600 px-1.5 py-0.5 text-[10px] text-white"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveCaption();
                        if (e.key === "Escape") setEditingCaption(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={saveCaption} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="h-3 w-3" />
                    </button>
                    <button onClick={() => setEditingCaption(null)} className="text-slate-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <p
                    className="text-[10px] text-slate-300 truncate mb-1 cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditCaption(img);
                    }}
                  >
                    {img.caption || (
                      <span className="text-slate-500 italic">+ caption</span>
                    )}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  {!isCover && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetCover(img.image_url);
                      }}
                      className="rounded bg-amber-600/80 hover:bg-amber-500 px-1.5 py-0.5 text-[10px] text-white font-medium transition-colors"
                      title="Đặt làm ảnh bìa"
                    >
                      <Star className="h-3 w-3 inline mr-0.5" />
                      Cover
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditCaption(img);
                    }}
                    className="rounded bg-slate-600/80 hover:bg-slate-500 p-1 text-white transition-colors"
                    title="Sửa caption"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    className="rounded bg-red-600/80 hover:bg-red-500 p-1 text-white transition-colors ml-auto"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
