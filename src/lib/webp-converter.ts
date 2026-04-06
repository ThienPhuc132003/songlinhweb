/**
 * Browser-native WebP Image Pipeline
 * Converts images to WebP format using Canvas API before upload.
 * Zero external dependencies.
 */

/** Convert any image file to WebP format */
export async function convertToWebP(
  file: File,
  quality = 0.85,
  maxWidth = 2400,
): Promise<File> {
  // Already WebP? Skip conversion
  if (file.type === "image/webp") return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate dimensions (cap at maxWidth, maintain aspect)
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("WebP conversion failed"));
            return;
          }
          const webpName = file.name.replace(/\.\w+$/, ".webp");
          resolve(new File([blob], webpName, { type: "image/webp" }));
        },
        "image/webp",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/** Generate a thumbnail preview URL for a file (for UI preview before upload) */
export function createPreviewURL(file: File): string {
  return URL.createObjectURL(file);
}

/** Revoke a preview URL to free memory */
export function revokePreviewURL(url: string): void {
  URL.revokeObjectURL(url);
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
