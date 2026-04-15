import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface LinkedProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  category_name?: string | null;
}

interface ProjectUsedEquipmentProps {
  products: LinkedProduct[];
  className?: string;
}

/**
 * "Sản phẩm đã sử dụng" section for the project detail page.
 * Displays cards of linked products with image, name, category, and link to product detail.
 */
export function ProjectUsedEquipment({
  products,
  className,
}: ProjectUsedEquipmentProps) {
  if (products.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3C5DAA]">Sản phẩm đã sử dụng</h2>
      <p className="text-sm text-muted-foreground">
        Các thiết bị và sản phẩm được triển khai trong dự án này
      </p>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/san-pham/${product.slug}`}
            className="group flex flex-col overflow-hidden rounded-sm border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Product image */}
            <div className="aspect-square overflow-hidden bg-muted">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <span className="text-3xl">📦</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-3">
              {product.category_name && (
                <span className="mb-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                  {product.category_name}
                </span>
              )}
              <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                {product.name}
              </h4>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Xem chi tiết
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
