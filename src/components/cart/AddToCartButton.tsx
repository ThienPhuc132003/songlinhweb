import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: number;
    slug: string;
    name: string;
    image_url: string | null;
    category?: { name: string } | null;
  };
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCartButton({
  product,
  size = "lg",
  className,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = items.some((i) => i.productId === product.id);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(t);
  }, [justAdded]);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      categoryName: product.category?.name ?? null,
    });
    setJustAdded(true);
    toast.success(`Đã thêm "${product.name}" vào giỏ báo giá`);
  }

  return (
    <Button
      size={size}
      onClick={handleAdd}
      className={cn(
        "transition-all duration-300",
        justAdded && "bg-emerald-600 hover:bg-emerald-700",
        className,
      )}
    >
      {justAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Đã thêm
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isInCart ? "Thêm nữa" : "Thêm vào báo giá"}
        </>
      )}
    </Button>
  );
}
