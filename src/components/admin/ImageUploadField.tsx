import { useState, useRef, useCallback, useEffect } from "react";
import { useWebPConverter } from "@/hooks/useWebPConverter";
import { adminApi } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { ImagePlus, X, Loader2, Upload } from "lucide-react";

interface UploadedImage {
  /** URL from R2 or local preview */
  url: string;
  /** R2 key for cleanup */
  key?: string;
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
  /** Fallback image URL when empty */
  fallbackUrl?: string;
  className?: string;
}

/**
 * Multi-image upload component with automatic WebP conversion.
 * Shows preview, size reduction badge, upload progress, and drag-and-drop.
 */
export function ImageUploadField({
  value,
  onChange,
  folder = "images",
  maxImages = 10,
  single = false,
  label = "Hình ảnh",
  fallbackUrl,
  className,
}: ImageUploadFieldProps) {
  // Defensive: ensure value is always an array
  const safeValue: string[] = Array.isArray(value) ? value : [];
  const inputRef = useRef<HTMLInputElement>(null);
  const { convert, isConverting } = useWebPConverter();
  const [uploadingCount, setUploadingCount] = useState(0);
  const [images, setImages] = useState<UploadedImage[]>(() =>
    safeValue.map((url) => ({ url, isUploaded: true })),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());

  // ─── Fix: Sync images state when parent value changes (e.g., opening edit dialog) ───
  useEffect(() => {
    const valueKey = safeValue.join(",");
    const imagesKey = images
      .filter((img) => img.isUploaded)
      .map((img) => img.url)
      .join(",");

    // Only resync if the uploaded URLs don't match the incoming value
    if (valueKey !== imagesKey) {
      setImages(safeValue.map((url) => ({ url, isUploaded: true })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeValue.join(",")]);

  const effectiveMax = single ? 1 : maxImages;
  const canAdd = images.length < effectiveMax && !isConverting && uploadingCount === 0;

  // ─── Process files (shared between click upload and drag-and-drop) ───
  const processFiles = useCallback(
    async (files: File[]) => {
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
                  ? { ...img, url: result.url, key: result.key, isUploaded: true }
                  : img,
              ),
            );

            // Notify parent
            if (single) {
              onChange([result.url]);
            } else {
              onChange([...safeValue, result.url]);
            }
          } finally {
            setUploadingCount((c) => c - 1);
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }
    },
    [convert, effectiveMax, folder, images.length, onChange, single, value],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      await processFiles(files);
      // Reset input
      if (inputRef.current) inputRef.current.value = "";
    },
    [processFiles],
  );

  // ─── Drag and Drop handlers ───
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      await processFiles(files);
    },
    [processFiles],
  );

  const removeImage = useCallback(
    (index: number) => {
      const removed = images[index];
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onChange(newImages.filter((img) => img.isUploaded).map((img) => img.url));

      // Cleanup: delete from R2 if we have the key
      if (removed?.key && removed.isUploaded) {
        adminApi.deleteUpload(removed.key).catch((err) => {
          console.warn("R2 cleanup failed (non-blocking):", err);
        });
      }
    },
    [images, onChange],
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn("space-y-2", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="text-sm font-medium">{label}</label>

      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={img.url}
            className="group relative h-24 w-24 overflow-hidden rounded-sm border bg-muted"
          >
            {brokenUrls.has(img.url) ? (
              /* Broken image fallback — rendered in React, not DOM manipulation */
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                ⚠️
              </div>
            ) : (
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
                onError={() => {
                  setBrokenUrls((prev) => new Set(prev).add(img.url));
                }}
              />
            )}

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

            {/* Remove button — z-50 ensures it's always clickable above error overlays */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeImage(i);
              }}
              className="absolute right-1 top-1 z-50 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Fallback image when no image is uploaded */}
        {images.length === 0 && fallbackUrl && (
          <div className="group relative h-24 w-24 overflow-hidden rounded-sm border border-dashed border-slate-300 bg-muted/50 opacity-70">
            <img src={fallbackUrl} alt="Mặc định" className="h-full w-full object-cover grayscale-[30%]" />
            <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white tracking-widest uppercase">
              Mặc định
            </div>
          </div>
        )}

        {/* Add button / Drop zone */}
        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed text-muted-foreground transition-colors",
              isDragging
                ? "border-primary bg-primary/5 text-primary"
                : "border-muted-foreground/25 hover:border-primary hover:text-primary",
            )}
          >
            {isDragging ? (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-[10px]">Thả ảnh</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px]">Thêm ảnh</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Drag overlay for empty state */}
      {isDragging && images.length === 0 && (
        <div className="flex items-center justify-center rounded-sm border-2 border-dashed border-primary bg-primary/5 p-6">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-1 text-sm font-medium text-primary">Thả ảnh vào đây</p>
          </div>
        </div>
      )}

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
