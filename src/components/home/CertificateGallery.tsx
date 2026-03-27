import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

// Import certificate images
import certHikvision from "@/assets/Image/Certificate/Certificate_Hikvision.jpg";
import certAxis from "@/assets/Image/Certificate/Certificate_Axis_SilverPartner.jpg";
import certHanwha from "@/assets/Image/Certificate/Certificate_HanwhaTechwin.jpg";
import certLsCable from "@/assets/Image/Certificate/Certificate_LsCable.jpg";
import certLegrand from "@/assets/Image/Certificate/Certificate_legrand.jpg";
import certAxisTop from "@/assets/Image/Certificate/Top 1 Axis Camera Station Seller for 2024.jpg";

const CERTIFICATES = [
  { title: "Hikvision Authorized Partner", src: certHikvision },
  { title: "Axis Silver Partner", src: certAxis },
  { title: "Top 1 Axis Camera Station Seller 2024", src: certAxisTop },
  { title: "Hanwha Techwin Authorized Distributor", src: certHanwha },
  { title: "LS Cable & System Certified Partner", src: certLsCable },
  { title: "Legrand Certified Partner", src: certLegrand },
];

export function CertificateGallery({ className }: { className?: string }) {
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <section className={cn("section-padding", className)}>
        <div className="container-custom">
          <div ref={headingRef} className="reveal mb-10 text-center md:mb-14">
            <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
              Chứng nhận & Giải thưởng
            </h2>
            <p className="text-muted-foreground mx-auto max-w-lg">
              Đối tác được ủy quyền chính thức từ các thương hiệu công nghệ hàng
              đầu thế giới
            </p>
          </div>

          <div
            ref={gridRef}
            className="reveal-stagger grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6"
          >
            {CERTIFICATES.map((cert, i) => (
              <button
                key={cert.title}
                onClick={() => setLightbox(i)}
                className="reveal-item group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg"
              >
                <img
                  src={cert.src}
                  alt={cert.title}
                  className="aspect-[3/4] w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-xs font-medium text-white/90 line-clamp-2">
                    {cert.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-[90vh] max-w-3xl">
            <img
              src={CERTIFICATES[lightbox].src}
              alt={CERTIFICATES[lightbox].title}
              className="max-h-[85vh] rounded-lg object-contain"
            />
            <p className="mt-2 text-center text-sm text-white/80">
              {CERTIFICATES[lightbox].title}
            </p>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/40"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
