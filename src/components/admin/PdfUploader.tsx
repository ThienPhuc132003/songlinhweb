import { useState, useRef } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PdfUploaderProps {
  /** Current PDF URL */
  value: string | null;
  /** Called when URL changes */
  onChange: (url: string | null) => void;
  /** Max file size in MB */
  maxSizeMb?: number;
}

const MAX_SIZE_DEFAULT = 10; // 10MB

export function PdfUploader({
  value,
  onChange,
  maxSizeMb = MAX_SIZE_DEFAULT,
}: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate type
    if (file.type !== "application/pdf") {
      toast.error("Chỉ chấp nhận file PDF");
      return;
    }
    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File quá lớn`, {
        description: `Kích thước tối đa ${maxSizeMb}MB. File bạn chọn: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
      });
      return;
    }

    setUploading(true);
    try {
      const result = await adminApi.upload(file, "datasheets");
      onChange(result.url);
      toast.success("Upload thành công", {
        description: `${file.name} (${(file.size / 1024).toFixed(0)}KB)`,
      });
    } catch (err) {
      toast.error("Lỗi upload", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset to allow re-selecting same file
    e.target.value = "";
  };

  const fileName = value ? value.split("/").pop() : null;

  return (
    <div className="space-y-2">
      {/* Current file display */}
      {value && (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-2.5">
          <FileText className="h-5 w-5 shrink-0 text-red-500" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{fileName}</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5"
            >
              Xem file <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onChange(null)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Upload area */}
      {!value && !manualMode && (
        <div
          className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary/50 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Đang upload...</p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground text-center">
                Kéo thả file PDF hoặc click để chọn
                <br />
                <span className="text-[10px]">Tối đa {maxSizeMb}MB</span>
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={handleInputChange}
            disabled={uploading}
          />
        </div>
      )}

      {/* Manual URL input */}
      {!value && manualMode && (
        <Input
          value=""
          placeholder="https://... URL datasheet PDF"
          className="h-8 text-xs"
          onChange={(e) => {
            if (e.target.value.trim()) {
              onChange(e.target.value.trim());
            }
          }}
          onBlur={(e) => {
            if (e.target.value.trim()) {
              onChange(e.target.value.trim());
            }
          }}
        />
      )}

      {/* Toggle manual mode */}
      {!value && (
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-[10px] text-primary hover:underline"
        >
          {manualMode ? "Upload file" : "Nhập URL trực tiếp"}
        </button>
      )}
    </div>
  );
}
