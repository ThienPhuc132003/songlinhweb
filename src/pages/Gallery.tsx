import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useGalleryAlbums, useGalleryAlbum } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  Image as ImageIcon,
  Layers,
  ArrowLeft,
  Calendar,
} from "lucide-react";

/* ═══ Category Tabs ═══ */
const CATEGORY_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "du-an", label: "Dự án" },
  { key: "ky-thuat", label: "Kỹ thuật thi công" },
  { key: "hoat-dong", label: "Hoạt động" },
] as const;

export default function Gallery() {
  const { data: apiAlbums, isLoading } = useGalleryAlbums();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedAlbumSlug, setSelectedAlbumSlug] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Fetch selected album detail — only when slug is set
  const { data: albumDetail, isLoading: isLoadingDetail } = useGalleryAlbum(
    selectedAlbumSlug ?? "",
  );

  const albums = apiAlbums ?? [];

  // Filter by category
  const filteredAlbums = useMemo(() => {
    if (activeCategory === "all") return albums;
    return albums.filter((a) => a.category === activeCategory);
  }, [albums, activeCategory]);

  // Get images for lightbox from selected album
  const lightboxImages = useMemo(() => {
    if (!albumDetail || !("images" in albumDetail)) return [];
    return (albumDetail as { images: Array<{ id: number; image_url: string; caption: string | null }> }).images.map((img) => ({
      url: img.image_url,
      caption: img.caption,
      albumTitle: albumDetail.title,
    }));
  }, [albumDetail]);

  const masonryImages = useMemo(() => {
    if (!albumDetail || !("images" in albumDetail)) return [];
    return (albumDetail as { images: Array<{ id: number; image_url: string; caption: string | null }> }).images.map((img) => ({
      id: img.id,
      url: img.image_url,
      caption: img.caption,
    }));
  }, [albumDetail]);

  return (
    <ErrorBoundary>
      <SEO
        title="Thư viện hình ảnh"
        description="Hình ảnh các dự án thi công hệ thống công nghệ của Song Linh Technologies."
        url="/thu-vien"
      />

      <PageHero
        title="Thư viện hình ảnh"
        subtitle="Portfolio thi công và hoạt động của Song Linh Technologies"
        breadcrumbs={[
          ...(selectedAlbumSlug
            ? [
                { label: "Thư viện", href: "/thu-vien" },
                { label: albumDetail?.title ?? "" },
              ]
            : [{ label: "Thư viện hình ảnh" }]),
        ]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* ═══ Filter Tabs — Professional underline style ═══ */}
          {!selectedAlbumSlug && (
            <div className="relative mb-10">
              <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto pb-0">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveCategory(tab.key)}
                      className={`relative pb-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                        isActive
                          ? "text-[#3C5DAA]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="gallery-tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3C5DAA] rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ Back Button (when viewing album) ═══ */}
          {selectedAlbumSlug && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedAlbumSlug(null)}
              className="group flex items-center gap-2 mb-8 text-sm text-slate-500 hover:text-[#3C5DAA] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại tất cả album
            </motion.button>
          )}

          {/* ═══ Album Grid — Editorial white cards ═══ */}
          {!selectedAlbumSlug && (
            <>
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] w-full rounded-md" />
                  ))}
                </div>
              ) : filteredAlbums.length === 0 ? (
                <div className="py-20 text-center">
                  <ImageIcon className="text-slate-300 mx-auto mb-4 h-16 w-16" />
                  <p className="text-slate-500 text-lg">
                    Chưa có album nào trong danh mục này.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="wait">
                    {filteredAlbums.map((album, i) => (
                      <motion.div
                        key={album.slug}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                      >
                        <div
                          className="group relative cursor-pointer overflow-hidden rounded-md bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-300"
                          onClick={() => setSelectedAlbumSlug(album.slug)}
                        >
                          {/* Cover Image */}
                          <div className="relative aspect-video overflow-hidden bg-slate-100">
                            {album.cover_url ? (
                              <img
                                src={album.cover_url}
                                alt={album.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                <ImageIcon className="h-12 w-12 text-slate-300" />
                              </div>
                            )}

                            {/* Subtle gradient overlay at bottom for text readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                            {/* Category badge — outline editorial */}
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center rounded border border-[#3C5DAA]/30 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold text-[#3C5DAA]">
                                {CATEGORY_TABS.find((t) => t.key === album.category)?.label ??
                                  album.category}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center gap-1 rounded bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[11px] text-white/90 font-medium">
                                <Layers className="h-3 w-3" />
                                {album.image_count ?? 0}
                              </span>
                            </div>
                          </div>

                          {/* Content area — clean white */}
                          <div className="px-4 py-3.5">
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#3C5DAA] transition-colors duration-300 line-clamp-1">
                              {album.title}
                            </h3>
                            {album.description && (
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {album.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                              <span className="text-xs text-slate-400 font-medium">
                                Xem chi tiết
                              </span>
                              <svg className="h-4 w-4 text-slate-400 group-hover:text-[#3C5DAA] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {/* ═══ Album Detail — Editorial Header + Masonry ═══ */}
          {selectedAlbumSlug && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Editorial Album Header */}
              {albumDetail && (
                <div className="mb-10 pb-8 border-b border-slate-200">
                  {/* Meta line */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center rounded border border-[#3C5DAA]/30 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#3C5DAA]">
                      {CATEGORY_TABS.find((t) => t.key === albumDetail.category)?.label ??
                        albumDetail.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-400">
                      <Layers className="h-3.5 w-3.5" />
                      {masonryImages.length} ảnh
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      Portfolio
                    </span>
                  </div>

                  {/* Title — editorial massive */}
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    {albumDetail.title}
                  </h2>

                  {/* Description */}
                  {albumDetail.description && (
                    <p className="text-lg text-slate-600 mt-3 max-w-3xl leading-relaxed">
                      {albumDetail.description}
                    </p>
                  )}
                </div>
              )}

              {/* Masonry Grid */}
              {isLoadingDetail ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-full rounded-lg"
                      style={{ height: `${200 + (i % 3) * 80}px` }}
                    />
                  ))}
                </div>
              ) : masonryImages.length === 0 ? (
                <div className="py-20 text-center">
                  <ImageIcon className="text-slate-300 mx-auto mb-4 h-16 w-16" />
                  <p className="text-slate-500 text-lg">
                    Album chưa có ảnh nào.
                  </p>
                </div>
              ) : (
                <MasonryGrid
                  images={masonryImages}
                  onImageClick={(idx) => {
                    setLightboxIdx(idx);
                    setLightboxOpen(true);
                  }}
                />
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ Professional Lightbox ═══ */}
      <GalleryLightbox
        images={lightboxImages}
        initialIndex={lightboxIdx}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </ErrorBoundary>
  );
}
