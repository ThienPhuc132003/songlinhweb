import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryImage {
  id: number;
  image_url: string;
  caption?: string | null;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  projectTitle: string;
  className?: string;
}

/**
 * Masonry gallery with lightbox.
 * Uses CSS columns for true masonry layout (no JS library).
 */
export function ProjectGallery({
  images,
  projectTitle,
  className,
}: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null,
    );
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null,
    );
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [closeLightbox, goNext, goPrev],
  );

  if (images.length === 0) return null;

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <h2 className="text-xl font-semibold">Hình ảnh dự án</h2>

        {/* Masonry layout using CSS columns */}
        <div
          className={cn(
            "gap-3",
            images.length === 1
              ? "columns-1"
              : images.length === 2
                ? "columns-2"
                : "columns-2 md:columns-3",
          )}
          style={{ columnGap: "0.75rem" }}
        >
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group relative mb-3 block w-full overflow-hidden rounded-lg border bg-muted break-inside-avoid focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={img.image_url}
                alt={img.caption ?? `${projectTitle} - ${index + 1}`}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                <ZoomIn className="h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Caption */}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-xs text-white">{img.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image lightbox"
        >
          <button
            type="button" onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <img
            src={images[lightboxIndex].image_url}
            alt={images[lightboxIndex].caption ?? `${projectTitle} - ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {images[lightboxIndex].caption && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {images[lightboxIndex].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}
