import { useCallback } from "react";
import { Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const fullUrl =
    typeof window !== "undefined" ? window.location.origin + url : url;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Đã sao chép liên kết!");
    } catch {
      toast.error("Không thể sao chép");
    }
  }, [fullUrl]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Chia sẻ:</span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyLink} title="Sao chép liên kết">
        <Link2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" asChild title="Facebook">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`} target="_blank" rel="noopener noreferrer">
          <Share2 className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  );
}
