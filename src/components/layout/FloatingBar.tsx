import { Phone, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function FloatingBar() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {/* Zalo (placeholder - update with actual Zalo link) */}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        asChild
      >
        <a
          href="https://zalo.me/0968811911"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </Button>

      {/* Phone */}
      <Button
        size="icon"
        className="bg-secondary hover:bg-secondary/90 h-12 w-12 animate-pulse rounded-full shadow-lg"
        asChild
      >
        <a href={`tel:${SITE.phoneRaw}`} aria-label="Gọi điện">
          <Phone className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
