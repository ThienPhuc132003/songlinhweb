import { Package } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
}

interface ProductImageGalleryProps {
  productName: string;
  displayImage: string | null | undefined;
  primaryImageUrl: string | null | undefined;
  galleryImages: GalleryImage[];
  imgError: boolean;
  onImgError: () => void;
  onSelectImage: (url: string | null) => void;
}

/**
 * Product image viewer with thumbnail strip.
 * Extracted from ProductDetail.tsx to reduce page complexity.
 */
export function ProductImageGallery({
  productName,
  displayImage,
  primaryImageUrl,
  galleryImages,
  imgError,
  onImgError,
  onSelectImage,
}: ProductImageGalleryProps) {
  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="group/img flex items-center justify-center overflow-hidden rounded-sm border bg-gradient-to-br from-muted to-muted/30 cursor-zoom-in">
        {imgError || !displayImage ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12">
            <Package className="h-24 w-24 text-muted-foreground/20" />
            <span className="text-sm text-muted-foreground">
              Hình ảnh sản phẩm
            </span>
          </div>
        ) : (
          <img
            src={displayImage}
            alt={productName}
            className="aspect-square w-full object-contain p-6 transition-transform duration-500 ease-out group-hover/img:scale-110"
            onError={onImgError}
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {(galleryImages.length > 0 || primaryImageUrl) && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {primaryImageUrl && (
            <button
              type="button"
              onClick={() => onSelectImage(primaryImageUrl)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-all duration-200 ${
                displayImage === primaryImageUrl
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <img
                src={primaryImageUrl}
                alt={productName}
                className="h-full w-full object-cover"
              />
            </button>
          )}
          {galleryImages.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelectImage(img.url)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-all duration-200 ${
                displayImage === img.url
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <img
                src={img.url}
                alt={productName}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
