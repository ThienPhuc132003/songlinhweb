import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProducts } from "@/hooks/useApi";
import { SAMPLE_PRODUCTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  SlidersHorizontal,
  Tag,
  X,
  GitCompareArrows,
  ShoppingCart,
  Check,
} from "lucide-react";
import { FeatureBadge } from "@/components/ui/FeatureBadge";
import { useCompare } from "@/contexts/CompareContext";
import { useCart } from "@/contexts/CartContext";
import { CategorySidebar } from "@/components/products/CategorySidebar";
import { BrandFilter } from "@/components/products/BrandFilter";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { GroupedFeatureFilter } from "@/components/products/GroupedFeatureFilter";

const ITEMS_PER_PAGE = 8;



export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = searchParams.get("category") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const selectedTags = searchParams.getAll("tag");

  const { data: productsData, isLoading } = useProducts({
    category,
    brand,
    search,
    page,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  // Determine if we're using API data or sample fallback
  const isApiData = !!productsData?.items?.length;
  const rawProducts = isApiData ? productsData.items : SAMPLE_PRODUCTS;

  // Client-side filtering (only for sample data fallback)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredProducts = useMemo((): any[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any[] = [...rawProducts];

    // Category filter (client-side for sample data only)
    if (!isApiData && category) {
      result = result.filter((p) => p.category_slug === category);
    }

    // Brand filter (client-side for sample data only)
    if (!isApiData && brand) {
      result = result.filter(
        (p) => (p.brand as string)?.toLowerCase() === brand.toLowerCase(),
      );
    }

    // Search filter (client-side for sample data only)
    if (!isApiData && search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name as string)?.toLowerCase().includes(q) ||
          (p.model_number as string)?.toLowerCase().includes(q) ||
          (p.description as string)?.toLowerCase().includes(q) ||
          (p.brand as string)?.toLowerCase().includes(q),
      );
    }

    // Feature tag filter — server-side for API data, client-side for sample
    if (!isApiData && selectedTags.length > 0) {
      result = result.filter((p) => {
        // Sample data uses legacy JSON features field
        let productFeatures: string[] = [];
        if (typeof p.features === "string") {
          try {
            productFeatures = JSON.parse(p.features as string);
          } catch {
            productFeatures = [];
          }
        } else if (Array.isArray(p.features)) {
          productFeatures = p.features as string[];
        }
        return selectedTags.every((tag) =>
          productFeatures.some(
            (f) => f.toLowerCase() === tag.toLowerCase(),
          ),
        );
      });
    }

    return result;
  }, [rawProducts, isApiData, category, brand, search, selectedTags]);

  // Client-side pagination
  const totalItems = filteredProducts.length;
  const totalPages = isApiData
    ? (productsData?.totalPages ?? 1)
    : Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedProducts = isApiData
    ? filteredProducts
    : filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const hasActiveFilters = !!(category || brand || search || selectedTags.length > 0);

  const clearFilters = () => {
    setSearchParams({});
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  };

  const toggleTag = (tag: string) => {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll("tag");
    next.delete("tag");
    if (current.includes(tag)) {
      current.filter((t) => t !== tag).forEach((t) => next.append("tag", t));
    } else {
      [...current, tag].forEach((t) => next.append("tag", t));
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <>
      <SEO
        title="Sản phẩm"
        description="Danh mục sản phẩm thiết bị công nghệ từ Song Linh Technologies: camera, thiết bị mạng, PCCC, kiểm soát ra vào."
        url="/san-pham"
      />

      <PageHero
        title="Sản phẩm"
        subtitle="Thiết bị công nghệ chính hãng từ các thương hiệu uy tín hàng đầu"
        breadcrumbs={[{ label: "Sản phẩm" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Search bar + mobile filter toggle */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <ProductSearchBar className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <div className="flex gap-8">
            {/* ─── Sidebar ─── */}
            <aside
              className={`w-64 shrink-0 space-y-6 ${
                sidebarOpen ? "block" : "hidden"
              } lg:block`}
            >
              <CategorySidebar />
              <div className="border-t pt-4">
                <BrandFilter />
              </div>

              {/* ─── Feature Tag Filter (Grouped) ─── */}
              <GroupedFeatureFilter className="border-t pt-4" />
            </aside>

            {/* ─── Products Grid ─── */}
            <div className="flex-1">
              {/* Active filter badges */}
              {hasActiveFilters && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  {category && (
                    <Badge variant="secondary">
                      Danh mục: {category}
                    </Badge>
                  )}
                  {brand && (
                    <Badge variant="secondary">
                      Thương hiệu: {brand}
                    </Badge>
                  )}
                  {search && (
                    <Badge variant="secondary">
                      Tìm kiếm: &quot;{search}&quot;
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Results count */}
              <p className="mb-4 text-sm text-muted-foreground">
                {totalItems} sản phẩm
                {totalPages > 1 && ` · Trang ${page}/${totalPages}`}
              </p>

              {/* Grid — 4 columns on xl */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="space-y-3 rounded-xl border p-4">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))
                  : paginatedProducts.map((product, i) => (
                      <ProductCard
                        key={(product as Record<string, unknown>).slug as string}
                        product={product}
                        index={i}
                      />
                    ))}
              </div>

              {/* Empty state */}
              {!isLoading && paginatedProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({
  product,
  index,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const { add, remove, isInCompare, isFull } = useCompare();
  const { addItem, items: cartItems } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const brandName = (product.brand as string) || (product.brand_name as string) || "";
  const modelNum = (product.model_number as string) || "";
  const catName = (product.category_name as string) || "";
  const imageUrl = product.image_url as string | null;
  const features = (() => {
    if (!product.features) return [];
    if (typeof product.features === "string") {
      try {
        return JSON.parse(product.features);
      } catch {
        return [];
      }
    }
    return Array.isArray(product.features) ? product.features : [];
  })();

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
    >
      <Link
        to={`/san-pham/${product.slug}`}
        className="group block h-full"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5">
          {/* Image */}
          <div className="relative shrink-0 overflow-hidden">
            {imageUrl && !imgError ? (
              <>
                <img
                  src={imageUrl}
                  alt={product.name as string}
                  className="aspect-square w-full object-contain bg-gradient-to-br from-muted to-muted/50 p-4 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </>
            ) : (
              <ImagePlaceholder
                className="aspect-square"
                variant="product"
                title={product.name as string}
              />
            )}
            {brandName && (
              <span className="absolute right-3 top-3 rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/70 shadow-sm backdrop-blur-sm">
                {brandName}
              </span>
            )}
          </div>

          {/* Info — flex-1 pushes CTA to bottom */}
          <div className="flex flex-1 flex-col p-5">
            {catName && (
              <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                {catName}
              </span>
            )}
            <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
              {product.name as string}
            </h3>
            {modelNum && (
              <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                {modelNum}
              </p>
            )}
            <p className="mb-3 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-muted-foreground">
              {(product.description as string) || "\u00A0"}
            </p>

            {/* Feature tags — use product_features if available */}
            {(() => {
              const pf = product.product_features as Array<{ id: number; name: string; color?: string | null; icon?: string | null; is_priority?: number }> | undefined;
              if (pf && pf.length > 0) {
                const sorted = [...pf].sort((a, b) => (b.is_priority ?? 0) - (a.is_priority ?? 0));
                return (
                  <div className="flex flex-wrap gap-1">
                    {sorted.slice(0, 3).map((f) => (
                      <FeatureBadge key={f.id} name={f.name} color={f.color} icon={f.icon} size="sm" />
                    ))}
                    {sorted.length > 3 && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{sorted.length - 3}
                      </span>
                    )}
                  </div>
                );
              }
              // Fallback to JSON features string
              if (features.length > 0) {
                return (
                  <div className="flex flex-wrap gap-1">
                    {(features as string[]).slice(0, 3).map((f: string) => (
                      <span key={f} className="inline-flex items-center gap-0.5 rounded bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        <Tag className="h-2.5 w-2.5" />
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{features.length - 3}
                      </span>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            {/* CTA — pinned to bottom */}
            <div className="mt-auto pt-3 border-t flex items-center justify-between">
              <span className="inline-flex items-center text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
                Xem chi tiết
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
      {/* Action buttons — outside the Link */}
      <div className="absolute bottom-[52px] right-4 z-10 flex items-center gap-1.5">
        {/* Add to quote cart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem({
              productId: product.id as number,
              slug: product.slug as string,
              name: product.name as string,
              imageUrl: product.image_url as string | null,
              categoryName: catName || null,
            });
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
          }}
          className={`rounded-full p-1.5 shadow-sm border transition-all ${
            justAdded
              ? "bg-emerald-500 text-white border-emerald-500"
              : cartItems.some((i) => i.productId === (product.id as number))
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/90 text-muted-foreground border-border hover:border-primary hover:text-primary"
          }`}
          title={justAdded ? "Đã thêm" : "Thêm vào báo giá"}
        >
          {justAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
        </button>
        {/* Compare button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isInCompare(product.id as number)) {
              remove(product.id as number);
            } else {
              add({
                id: product.id as number,
                slug: product.slug as string,
                name: product.name as string,
                image_url: product.image_url as string | null,
                brand_name: brandName || null,
              });
            }
          }}
          disabled={!isInCompare(product.id as number) && isFull}
          className={`rounded-full p-1.5 shadow-sm border transition-all ${
            isInCompare(product.id as number)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background/90 text-muted-foreground border-border hover:border-primary hover:text-primary"
          } ${!isInCompare(product.id as number) && isFull ? "opacity-30 cursor-not-allowed" : ""}`}
          title={isInCompare(product.id as number) ? "Bỏ so sánh" : "Thêm so sánh"}
        >
          <GitCompareArrows className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

