import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Certificate images
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

// ─── Lightbox with keyboard navigation ────────────────────────────────────────

function CertLightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const cert = CERTIFICATES[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] max-w-4xl flex-col items-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={cert.src}
          alt={cert.title}
          className="max-h-[80vh] rounded-sm object-contain shadow-sm"
        />

        {/* Caption */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-white/90">{cert.title}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {index + 1} / {CERTIFICATES.length}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Sau"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ─── CertificateGallery ───────────────────────────────────────────────────────

export function CertificateGallery({ className }: { className?: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setLightbox((prev) =>
      prev !== null
        ? (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length
        : null,
    );
  }, []);

  const handleNext = useCallback(() => {
    setLightbox((prev) =>
      prev !== null ? (prev + 1) % CERTIFICATES.length : null,
    );
  }, []);

  return (
    <>
      <section
        className={cn(
          "relative overflow-hidden border-y border-slate-200 bg-[#F8FAFC] py-24 dark:border-border dark:bg-muted/10 md:py-32",
          className,
        )}
      >
        {/* Watermark background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025]" aria-hidden>
          <span className="select-none whitespace-nowrap font-mono text-[8rem] font-bold uppercase tracking-[0.2em] text-slate-900 md:text-[12rem]">
            VERIFIED
          </span>
        </div>

        <div className="container-custom relative z-10">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
              Chứng nhận &{" "}
              <span className="font-semibold">Giải thưởng</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
              Đối tác được ủy quyền chính thức từ các thương hiệu công nghệ
              hàng đầu thế giới
            </p>
          </motion.div>

          {/* Grid — Consistent aspect ratios */}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6">
            {CERTIFICATES.map((cert, i) => (
              <motion.button
                key={cert.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => setLightbox(i)}
                className="group relative overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:border-[#3C5DAA]/40 hover:shadow-md dark:border-border dark:bg-card"
              >
                <img
                  src={cert.src}
                  alt={cert.title}
                  className="aspect-[3/4] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-4">
                  <span className="text-[11px] font-medium leading-tight text-white/90 line-clamp-2">
                    {cert.title}
                  </span>
                </div>
                {/* Hover accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[#3C5DAA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <CertLightbox
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
