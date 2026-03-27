import { useState, useCallback } from "react";

interface ConvertResult {
  /** WebP blob ready for upload */
  blob: Blob;
  /** Object URL for preview */
  previewUrl: string;
  /** Original file size (bytes) */
  originalSize: number;
  /** Converted file size (bytes) */
  convertedSize: number;
  /** Original filename (with .webp ext) */
  filename: string;
}

interface UseWebPConverterOptions {
  /** Max width — images wider than this will be resized. Default: 1920 */
  maxWidth?: number;
  /** WebP quality 0-1. Default: 0.82 */
  quality?: number;
}

/**
 * Client-side image → WebP converter using Canvas API.
 * Resizes large images and converts any format to WebP.
 *
 * Usage:
 * ```ts
 * const { convert, isConverting } = useWebPConverter();
 * const result = await convert(file);
 * // result.blob → upload to R2
 * // result.previewUrl → show in <img>
 * ```
 */
export function useWebPConverter(options?: UseWebPConverterOptions) {
  const maxWidth = options?.maxWidth ?? 1920;
  const quality = options?.quality ?? 0.82;

  const [isConverting, setIsConverting] = useState(false);

  /** Check if browser supports WebP encoding */
  const supportsWebP = useCallback((): boolean => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").startsWith("data:image/webp");
    } catch {
      return false;
    }
  }, []);

  const convert = useCallback(
    async (file: File): Promise<ConvertResult> => {
      setIsConverting(true);

      try {
        // Load file into an Image element
        const img = await loadImage(file);

        // Calculate resize dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }

        // Draw on canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context not available");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP (or fallback to JPEG if unsupported)
        const mimeType = supportsWebP() ? "image/webp" : "image/jpeg";
        const ext = mimeType === "image/webp" ? "webp" : "jpg";

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
            mimeType,
            quality,
          );
        });

        // Generate preview URL
        const previewUrl = URL.createObjectURL(blob);

        // Build filename
        const baseName = file.name.replace(/\.[^.]+$/, "");
        const filename = `${baseName}.${ext}`;

        return {
          blob,
          previewUrl,
          originalSize: file.size,
          convertedSize: blob.size,
          filename,
        };
      } finally {
        setIsConverting(false);
      }
    },
    [maxWidth, quality, supportsWebP],
  );

  return { convert, isConverting, supportsWebP };
}

/** Helper: load a File into an HTMLImageElement */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}
