import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
} from "lucide-react";

interface LightboxImage {
  url: string;
  caption?: string | null;
  albumTitle?: string;
}

interface GalleryLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

export function GalleryLightbox({
  images,
  initialIndex,
  open,
  onClose,
}: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Reset on open
  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open, initialIndex]);

  // Keyboard handling
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (zoom > 1) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          } else {
            onClose();
          }
          break;
        case "ArrowLeft":
          navigate(-1);
          break;
        case "ArrowRight":
          navigate(1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "+":
        case "=":
          handleZoom(0.5);
          break;
        case "-":
          handleZoom(-0.5);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, zoom, index, images.length]);

  // Scroll zoom
  useEffect(() => {
    if (!open) return;
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY > 0 ? -0.2 : 0.2);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, zoom]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigate = useCallback(
    (dir: number) => {
      setIndex((i) => {
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
      setZoom(1);
      setPan({ x: 0, y: 0 });
    },
    [images.length],
  );

  const handleZoom = useCallback((delta: number) => {
    setZoom((z) => Math.min(4, Math.max(1, z + delta)));
    if (zoom + delta <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Pan handling (dragging when zoomed)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      isDragging.current = true;
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    },
    [zoom, pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || zoom <= 1) return;
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    },
    [zoom],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (!open || images.length === 0) return null;

  const current = images[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex flex-col bg-black/95 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* ─── Top Bar ─── */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            {/* Left: Counter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-white/60">
                {index + 1} / {images.length}
              </span>
              {current.albumTitle && (
                <span className="text-xs text-white/40 hidden sm:inline">
                  {current.albumTitle}
                </span>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleZoom(-0.5)}
                disabled={zoom <= 1}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                title="Thu nhỏ (−)"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs text-white/50 w-12 text-center font-mono">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.5)}
                disabled={zoom >= 4}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                title="Phóng to (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button
                onClick={toggleFullscreen}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                title="Toàn màn hình (F)"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors ml-1"
                title="Đóng (ESC)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ─── Main Image Area ─── */}
          <div
            className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? (isDragging.current ? "grabbing" : "grab") : "default" }}
          >
            {/* Prev/Next buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                  }}
                  className="absolute left-2 sm:left-4 z-10 rounded-full bg-white/5 hover:bg-white/15 p-2 sm:p-3 text-white/70 hover:text-white transition-all backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(1);
                  }}
                  className="absolute right-2 sm:right-4 z-10 rounded-full bg-white/5 hover:bg-white/15 p-2 sm:p-3 text-white/70 hover:text-white transition-all backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="max-w-[90vw] max-h-[calc(100vh-140px)]"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  transformOrigin: "center center",
                  transition: isDragging.current ? "none" : "transform 0.2s ease-out",
                }}
              >
                <img
                  src={current.url}
                  alt={current.caption ?? ""}
                  className="max-w-full max-h-[calc(100vh-140px)] object-contain rounded-sm"
                  draggable={false}
                  onDoubleClick={() => {
                    if (zoom > 1) {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    } else {
                      setZoom(2);
                    }
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Bottom: Caption ─── */}
          {current.caption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 text-center px-4 py-3"
            >
              <p className="text-sm text-white/80">{current.caption}</p>
            </motion.div>
          )}

          {/* ─── Thumbnail Strip ─── */}
          {images.length > 1 && (
            <div className="shrink-0 px-4 py-2 overflow-x-auto">
              <div className="flex items-center justify-center gap-1.5">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIndex(i);
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                      i === index
                        ? "ring-2 ring-cyan-400 w-12 h-9 opacity-100"
                        : "ring-1 ring-white/10 w-10 h-7 opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
