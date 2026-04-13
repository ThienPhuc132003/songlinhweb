import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

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
    <div className="gallery-masonry group/masonry">
      {images.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
          className="gallery-masonry-item mb-3 break-inside-avoid"
        >
          <div
            className="group/card relative cursor-pointer overflow-hidden rounded-lg bg-slate-50 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300"
            onClick={() => onImageClick(i)}
          >
            <img
              src={img.url}
              alt={img.caption ?? ""}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover/card:scale-105"
            />

            {/* Hover overlay — subtle dim + zoom icon */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              {/* Zoom icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 border border-white/30 scale-75 group-hover/card:scale-100 transition-transform duration-300">
                  <ZoomIn className="h-5 w-5 text-white" />
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

      {/* Masonry layout + hover dim siblings */}
      <style>{`
        .gallery-masonry {
          column-count: 3;
          column-gap: 12px;
        }

        /* Dim siblings when hovering a card */
        .gallery-masonry:hover .gallery-masonry-item {
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        .gallery-masonry .gallery-masonry-item:hover {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .gallery-masonry { column-count: 2; }
        }
        @media (max-width: 640px) {
          .gallery-masonry { column-count: 1; }
        }
      `}</style>
    </div>
  );
}
