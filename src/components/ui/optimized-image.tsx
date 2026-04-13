import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  /** When true, disables lazy loading and sets fetchpriority="high" for LCP-critical images */
  priority?: boolean;
  /** @deprecated Use `priority` instead. Kept for backward compatibility. */
  lazy?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  lazy = true,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(priority); // skip skeleton for priority images
  const [error, setError] = useState(false);

  const cdnUrl = import.meta.env.VITE_CDN_URL;
  const optimizedSrc = src.startsWith("http")
    ? src
    : cdnUrl
      ? `${cdnUrl}/${src}`
      : src;

  const isEager = priority || !lazy;

  if (error) {
    return (
      <div
        className={cn("bg-muted flex items-center justify-center", className)}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">
          Ảnh không tải được
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <div className="bg-muted absolute inset-0 animate-pulse" />}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={isEager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}

