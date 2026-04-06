import { motion } from "framer-motion";

interface MasonryImage {
  id: number;
  url: string;
  caption?: string | null;
}

interface MasonryGridProps {
  images: MasonryImage[];
  onImageClick: (index: number) => void;
}

export function MasonryGrid({ images, onImageClick }: MasonryGridProps) {
  return (
    <div
      className="masonry-grid"
      style={{
        columnCount: 3,
        columnGap: "12px",
      }}
    >
      {images.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
          className="mb-3 break-inside-avoid"
        >
          <div
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-slate-800/50 ring-1 ring-white/5 hover:ring-cyan-400/30 transition-all duration-300"
            onClick={() => onImageClick(i)}
          >
            <img
              src={img.url}
              alt={img.caption ?? ""}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Zoom icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="rounded-full bg-white/10 backdrop-blur-sm p-3 border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
              {/* Caption */}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-white/90 font-medium line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .masonry-grid { column-count: 2 !important; }
        }
        @media (max-width: 640px) {
          .masonry-grid { column-count: 1 !important; }
        }
      `}</style>
    </div>
  );
}
