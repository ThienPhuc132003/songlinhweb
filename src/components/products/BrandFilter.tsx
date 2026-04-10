import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { useBrands } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandFilterProps {
  className?: string;
  hideTitle?: boolean;
}

export function BrandFilter({ className, hideTitle }: BrandFilterProps) {
  const { data: brands, isLoading } = useBrands();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBrand = searchParams.get("brand") ?? "";

  const handleBrandClick = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (activeBrand === slug) {
      next.delete("brand");
    } else {
      next.set("brand", slug);
    }
    next.delete("page"); // reset page
    setSearchParams(next);
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-5 w-1/2" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (!brands?.length) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {!hideTitle && (
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Thương hiệu
        </h3>
      )}
      <div className="space-y-1">
        {brands.map((brand) => (
          <button
            key={brand.slug}
            onClick={() => handleBrandClick(brand.slug)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
              activeBrand === brand.slug &&
                "bg-primary/10 font-medium text-primary",
            )}
          >
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="h-5 w-5 rounded object-contain"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-bold">
                {brand.name.charAt(0)}
              </div>
            )}
            <span className="truncate">{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
