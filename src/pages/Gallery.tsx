import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useGalleryAlbums, useGalleryAlbum } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  Image as ImageIcon,
  Layers,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

/* ═══ Category Tabs ═══ */
const CATEGORY_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "du-an", label: "Dự án" },
  { key: "ky-thuat", label: "Kỹ thuật thi công" },
  { key: "hoat-dong", label: "Hoạt động" },
] as const;

const categoryAccent = (cat: string) => {
  switch (cat) {
    case "du-an": return "from-blue-500 to-indigo-600";
    case "ky-thuat": return "from-emerald-500 to-teal-600";
    case "hoat-dong": return "from-purple-500 to-pink-600";
    default: return "from-cyan-500 to-blue-600";
  }
};

export default function Gallery() {
  const { data: apiAlbums, isLoading } = useGalleryAlbums();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedAlbumSlug, setSelectedAlbumSlug] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Fetch selected album detail
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
    <>
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
          {/* ═══ Category Tabs ═══ */}
          {!selectedAlbumSlug && (
            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="gallery-tab-bg"
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${categoryAccent(tab.key)}`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ═══ Back Button (when viewing album) ═══ */}
          {selectedAlbumSlug && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedAlbumSlug(null)}
              className="group flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại tất cả album
            </motion.button>
          )}

          {/* ═══ Album Grid (when no album selected) ═══ */}
          {!selectedAlbumSlug && (
            <>
              {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
                  ))}
                </div>
              ) : filteredAlbums.length === 0 ? (
                <div className="py-20 text-center">
                  <ImageIcon className="text-muted-foreground/20 mx-auto mb-4 h-16 w-16" />
                  <p className="text-muted-foreground text-lg">
                    Chưa có album nào trong danh mục này.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredAlbums.map((album, i) => (
                      <motion.div
                        key={album.slug}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                      >
                        <div
                          className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-900/50 dark:bg-slate-900/80 ring-1 ring-white/5 hover:ring-cyan-400/20 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5"
                          onClick={() => setSelectedAlbumSlug(album.slug)}
                        >
                          {/* Cover Image */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                            {album.cover_url ? (
                              <img
                                src={album.cover_url}
                                alt={album.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <div className={`rounded-full bg-gradient-to-br ${categoryAccent(album.category)} p-4 opacity-20`}>
                                  <ImageIcon className="h-10 w-10 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Category badge */}
                            <div className="absolute top-3 left-3">
                              <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${categoryAccent(album.category)} px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-lg`}>
                                {CATEGORY_TABS.find((t) => t.key === album.category)?.label ??
                                  album.category}
                              </span>
                            </div>

                            {/* Image count */}
                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[11px] text-white/80 font-medium">
                                <Layers className="h-3 w-3" />
                                {album.image_count ?? 0}
                              </span>
                            </div>

                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                                {album.title}
                              </h3>
                              {album.description && (
                                <p className="text-xs text-white/60 mt-1 line-clamp-2">
                                  {album.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Bottom bar with CTA */}
                          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 dark:bg-slate-950/80">
                            <span className="text-xs text-slate-400 font-medium">
                              Xem chi tiết
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {/* ═══ Album Detail: Masonry Images ═══ */}
          {selectedAlbumSlug && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Album Header */}
              {albumDetail && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${categoryAccent(albumDetail.category)} px-2.5 py-0.5 text-[11px] font-semibold text-white`}>
                      {CATEGORY_TABS.find((t) => t.key === albumDetail.category)?.label ??
                        albumDetail.category}
                    </span>
                    <span className="text-sm text-slate-400">
                      {masonryImages.length} ảnh
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {albumDetail.title}
                  </h2>
                  {albumDetail.description && (
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                      {albumDetail.description}
                    </p>
                  )}
                </div>
              )}

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
                  <ImageIcon className="text-muted-foreground/20 mx-auto mb-4 h-16 w-16" />
                  <p className="text-muted-foreground text-lg">
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
    </>
  );
}
