import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  onClick: () => void;
  className?: string;
}

export function CartBadge({ onClick, className }: CartBadgeProps) {
  const { itemCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("relative", className)}
      aria-label={`Giỏ báo giá (${itemCount} sản phẩm)`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span
          className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold animate-in zoom-in-50"
          key={itemCount}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
