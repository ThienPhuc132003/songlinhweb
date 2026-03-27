import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useGalleryAlbums } from "@/hooks/useApi";
import { GALLERY_ALBUMS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery() {
  const { data: apiAlbums, isLoading } = useGalleryAlbums();
  const albums =
    apiAlbums ??
    GALLERY_ALBUMS.map((a, i) => ({
      id: i + 1,
      slug: a.slug,
      title: a.title,
      cover_url: a.coverImage,
      sort_order: i,
      is_active: 1 as const,
      image_count: a.imageCount,
    }));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  function openLightbox(idx: number) {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function prev() {
    setLightboxIdx((i) => (i === 0 ? albums.length - 1 : i - 1));
  }

  function next() {
    setLightboxIdx((i) => (i === albums.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      <SEO
        title="Thư viện hình ảnh"
        description="Hình ảnh các dự án thi công hệ thống công nghệ của Song Linh Technologies."
        url="/thu-vien"
      />

      <PageHero
        title="Thư viện hình ảnh"
        subtitle="Hình ảnh tiêu biểu từ các dự án của Song Linh Technologies"
        breadcrumbs={[{ label: "Thư viện hình ảnh" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-xl" />
              ))}
            </div>
          ) : albums.length === 0 ? (
            <div className="py-20 text-center">
              <ImageIcon className="text-muted-foreground/30 mx-auto mb-4 h-16 w-16" />
              <p className="text-muted-foreground text-lg">
                Chưa có album nào.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <motion.div
                  key={album.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                    onClick={() => openLightbox(i)}
                  >
                    <div className="bg-muted relative aspect-video overflow-hidden">
                      {album.cover_url ? (
                        <img
                          src={album.cover_url}
                          alt={album.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground/30 h-12 w-12" />
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                        <ImageIcon className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="group-hover:text-primary font-semibold transition-colors">
                        {album.title}
                      </h3>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {album.image_count ?? 0} ảnh
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxOpen && albums[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Prev/Next */}
            {albums.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {albums[lightboxIdx].cover_url ? (
                <img
                  src={albums[lightboxIdx].cover_url!}
                  alt={albums[lightboxIdx].title}
                  className="max-h-[80vh] rounded-lg object-contain"
                />
              ) : (
                <div className="flex h-64 w-96 items-center justify-center rounded-lg bg-white/10">
                  <ImageIcon className="h-16 w-16 text-white/50" />
                </div>
              )}
              <p className="mt-3 text-center text-sm text-white/80">
                {albums[lightboxIdx].title}
                <span className="ml-2 text-white/50">
                  ({lightboxIdx + 1} / {albums.length})
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
