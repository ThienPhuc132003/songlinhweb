import { useState, useRef, useCallback } from "react";
import { useWebPConverter } from "@/hooks/useWebPConverter";
import { adminApi } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface UploadedImage {
  /** URL from R2 or local preview */
  url: string;
  /** Whether this image is already uploaded to R2 */
  isUploaded: boolean;
  /** Original size before conversion */
  originalSize?: number;
  /** WebP size after conversion */
  convertedSize?: number;
}

interface ImageUploadFieldProps {
  /** Current image URLs (from DB) */
  value: string[];
  /** Callback when images change */
  onChange: (urls: string[]) => void;
  /** R2 folder for uploads */
  folder?: string;
  /** Max number of images */
  maxImages?: number;
  /** Single image mode */
  single?: boolean;
  /** Label */
  label?: string;
  className?: string;
}

/**
 * Multi-image upload component with automatic WebP conversion.
 * Shows preview, size reduction badge, and upload progress.
 */
export function ImageUploadField({
  value,
  onChange,
  folder = "images",
  maxImages = 10,
  single = false,
  label = "Hình ảnh",
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { convert, isConverting } = useWebPConverter();
  const [uploadingCount, setUploadingCount] = useState(0);
  const [images, setImages] = useState<UploadedImage[]>(() =>
    value.map((url) => ({ url, isUploaded: true })),
  );

  const effectiveMax = single ? 1 : maxImages;
  const canAdd = images.length < effectiveMax && !isConverting && uploadingCount === 0;

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const filesToProcess = files.slice(0, effectiveMax - images.length);

      for (const file of filesToProcess) {
        try {
          // Convert to WebP
          const { blob, previewUrl, originalSize, convertedSize, filename } =
            await convert(file);

          // Show preview immediately
          const previewImage: UploadedImage = {
            url: previewUrl,
            isUploaded: false,
            originalSize,
            convertedSize,
          };

          setImages((prev) => {
            if (single) return [previewImage];
            return [...prev, previewImage];
          });

          // Upload to R2
          setUploadingCount((c) => c + 1);
          try {
            const webpFile = new File([blob], filename, {
              type: blob.type,
            });
            const result = await adminApi.upload(webpFile, folder);

            // Replace preview URL with R2 URL
            setImages((prev) =>
              prev.map((img) =>
                img.url === previewUrl
                  ? { ...img, url: result.url, isUploaded: true }
                  : img,
              ),
            );

            // Notify parent
            if (single) {
              onChange([result.url]);
            } else {
              onChange([...value, result.url]);
            }
          } finally {
            setUploadingCount((c) => c - 1);
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }

      // Reset input
      if (inputRef.current) inputRef.current.value = "";
    },
    [convert, effectiveMax, folder, images.length, onChange, single, value],
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onChange(newImages.filter((img) => img.isUploaded).map((img) => img.url));
    },
    [images, onChange],
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>

      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={img.url}
            className="group relative h-24 w-24 overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={img.url}
              alt=""
              className="h-full w-full object-cover"
            />

            {/* Size reduction badge */}
            {img.originalSize && img.convertedSize && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5 text-center text-[10px] text-white">
                {formatSize(img.convertedSize)}
                <span className="ml-1 text-green-400">
                  -{Math.round((1 - img.convertedSize / img.originalSize) * 100)}%
                </span>
              </div>
            )}

            {/* Upload indicator */}
            {!img.isUploaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px]">Thêm ảnh</span>
          </button>
        )}
      </div>

      {/* Converting indicator */}
      {isConverting && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Đang chuyển đổi sang WebP...
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
