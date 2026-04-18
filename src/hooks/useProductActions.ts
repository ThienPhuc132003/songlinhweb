import { useCompare } from "@/contexts/CompareContext";
import { useCart } from "@/contexts/CartContext";

interface ProductForActions {
  id: number;
  slug: string;
  name: string;
  image_url: string | null;
  brand_name?: string | null;
  category_name?: string | null;
}

/**
 * Shared hook that encapsulates compare + cart (RFQ) logic
 * for any product. Used by ProductDetail page and ProductCard component
 * to avoid duplicating the same toggle/add logic.
 */
export function useProductActions(product: ProductForActions | null | undefined) {
  const { add, remove, isInCompare, isFull } = useCompare();
  const { addItem, items: cartItems } = useCart();

  const inCompare = product ? isInCompare(product.id) : false;
  const inCart = product ? cartItems.some((i) => i.productId === product.id) : false;

  const toggleCompare = () => {
    if (!product) return;
    if (inCompare) {
      remove(product.id);
    } else if (!isFull) {
      add({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image_url: product.image_url,
        brand_name: product.brand_name ?? null,
      });
    }
  };

  const addToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      categoryName: product.category_name ?? null,
    });
  };

  return {
    inCompare,
    inCart,
    isCompareFull: isFull,
    toggleCompare,
    addToCart,
  };
}
