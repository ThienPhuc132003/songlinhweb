import { useCallback, useState, useRef } from "react";
import { Upload, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import { convertToWebP, formatFileSize } from "@/lib/webp-converter";
import { adminApi } from "@/lib/admin-api";

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "converting" | "uploading" | "done" | "error";
  progress: number;
  resultUrl?: string;
  error?: string;
}

interface GalleryDropzoneProps {
  albumId: number;
  onUploadComplete: (urls: Array<{ image_url: string; caption: string }>) => void;
  disabled?: boolean;
}

export function GalleryDropzone({ albumId, onUploadComplete, disabled }: GalleryDropzoneProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProcessing = items.some((i) => i.status === "converting" || i.status === "uploading");

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (fileArray.length === 0) return;

      // Create items
      const newItems: UploadItem[] = fileArray.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        status: "converting" as const,
        progress: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Process each file
      const results: Array<{ image_url: string; caption: string }> = [];

      for (const item of newItems) {
        try {
          // 1. Convert to WebP
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: "converting", progress: 30 } : i,
            ),
          );
          const webpFile = await convertToWebP(item.file);

          // 2. Upload to R2
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: "uploading", progress: 60 } : i,
            ),
          );
          const result = await adminApi.upload(webpFile, `gallery/${albumId}`);

          // 3. Done
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done", progress: 100, resultUrl: result.url }
                : i,
            ),
          );
          results.push({ image_url: result.url, caption: "" });
        } catch (error) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: "error",
                    error: error instanceof Error ? error.message : "Upload failed",
                  }
                : i,
            ),
          );
        }
      }

      if (results.length > 0) {
        onUploadComplete(results);
      }
    },
    [albumId, onUploadComplete],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled) processFiles(e.dataTransfer.files);
    },
    [disabled, processFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFiles(e.target.files);
      e.target.value = "";
    },
    [processFiles],
  );

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearCompleted = () => {
    setItems((prev) => {
      prev.forEach((i) => {
        if (i.status === "done" || i.status === "error") {
          URL.revokeObjectURL(i.previewUrl);
        }
      });
      return prev.filter((i) => i.status !== "done" && i.status !== "error");
    });
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        className={`relative rounded-sm border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? "border-[#3C5DAA] bg-[#3C5DAA]/5 scale-[1.01]"
            : disabled
              ? "border-slate-300 bg-slate-100/50 opacity-50"
              : "border-slate-300 bg-slate-50 hover:border-[#3C5DAA]/40 hover:bg-[#3C5DAA]/[0.02]"
        } ${disabled ? "pointer-events-none" : "cursor-pointer"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div
            className={`rounded-full p-3 mb-3 transition-colors ${
              isDragOver
                ? "bg-[#3C5DAA]/10 text-[#3C5DAA]"
                : "bg-slate-200/60 text-slate-400"
            }`}
          >
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            {isDragOver ? "Thả ảnh vào đây..." : "Kéo thả ảnh hoặc click để chọn"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            JPG, PNG, WebP • Tự động chuyển sang WebP • Tối đa 10MB/file
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Upload Progress Items */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {items.filter((i) => i.status === "done").length}/{items.length} hoàn thành
            </span>
            {!isProcessing && (
              <button
                onClick={clearCompleted}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Xóa đã xong
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-sm overflow-hidden bg-slate-800 border border-slate-700"
              >
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {/* Status Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                    item.status === "done"
                      ? "bg-black/20"
                      : item.status === "error"
                        ? "bg-red-900/40"
                        : "bg-black/50"
                  }`}
                >
                  {item.status === "converting" && (
                    <div className="text-center">
                      <Loader2 className="h-5 w-5 text-cyan-400 animate-spin mx-auto" />
                      <span className="text-[10px] text-cyan-300 mt-1 block">WebP...</span>
                    </div>
                  )}
                  {item.status === "uploading" && (
                    <div className="text-center">
                      <Loader2 className="h-5 w-5 text-emerald-400 animate-spin mx-auto" />
                      <span className="text-[10px] text-emerald-300 mt-1 block">Upload...</span>
                    </div>
                  )}
                  {item.status === "done" && (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  )}
                  {item.status === "error" && (
                    <div className="text-center px-2">
                      <AlertCircle className="h-5 w-5 text-red-400 mx-auto" />
                      <span className="text-[10px] text-red-300 mt-1 block line-clamp-2">
                        {item.error}
                      </span>
                    </div>
                  )}
                </div>
                {/* Remove Button */}
                {(item.status === "done" || item.status === "error") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                {/* Progress Bar */}
                {(item.status === "converting" || item.status === "uploading") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/50">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
