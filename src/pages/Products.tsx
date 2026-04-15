import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProducts } from "@/hooks/useApi";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

/** Enriched product from API with joined fields */
interface EnrichedProduct extends Product {
  product_features?: Array<{
    id: number;
    name: string;
    slug: string;
    group_name: string;
    color?: string | null;
    icon?: string | null;
    is_priority?: number;
  }>;
}

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

  const products = useMemo(
    () => (productsData?.items ?? []) as EnrichedProduct[],
    [productsData],
  );

  const totalItems = productsData?.total ?? products.length;
  const totalPages = productsData?.totalPages ?? 1;
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
            {/* ─── Sidebar with Accordion ─── */}
            <aside
              className={`w-64 shrink-0 ${
                sidebarOpen ? "block" : "hidden"
              } lg:block`}
            >
              <Accordion
                type="multiple"
                defaultValue={["categories", "brands"]}
                className="space-y-0"
              >
                <AccordionItem value="categories" className="border-b-0">
                  <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                    Danh mục sản phẩm
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <CategorySidebar hideTitle />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brands" className="border-t">
                  <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                    Thương hiệu
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <BrandFilter hideTitle />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features" className="border-t">
                  <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                    Tính năng
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <GroupedFeatureFilter hideTitle />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                      <div key={i} className="space-y-3 rounded-sm border p-4 animate-pulse">
                        <div className="aspect-square w-full rounded-sm bg-muted" />
                        <div className="h-3 w-2/5 rounded bg-muted" />
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                      </div>
                    ))
                  : products.map((product, i) => (
                      <ProductCard
                        key={product.slug}
                        product={product}
                        index={i}
                      />
                    ))}
              </div>

              {/* Empty state */}
              {!isLoading && products.length === 0 && (
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

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
}: {
  product: EnrichedProduct;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const { add, remove, isInCompare, isFull } = useCompare();
  const { addItem, items: cartItems } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const brandName = product.brand_name || product.brand || "";
  const modelNum = product.model_number || "";
  const catName = product.category_name || "";
  const imageUrl = product.image_url;

  // Parse legacy features JSON (if product_features relation is empty)
  const legacyFeatures = useMemo(() => {
    if (product.product_features && product.product_features.length > 0) return [];
    if (!product.features) return [];
    if (typeof product.features === "string") {
      try {
        return JSON.parse(product.features) as string[];
      } catch {
        return [];
      }
    }
    return Array.isArray(product.features) ? (product.features as string[]) : [];
  }, [product.features, product.product_features]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      categoryName: catName || null,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(product.id)) {
      remove(product.id);
    } else {
      add({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image_url: product.image_url,
        brand_name: brandName || null,
      });
    }
  };

  return (
    <motion.div
      className="group/card relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
    >
      <Link
        to={`/san-pham/${product.slug}`}
        className="block h-full"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-sm border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
          {/* Image */}
          <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-muted dark:to-muted/50">
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="aspect-square w-full object-contain mix-blend-multiply p-6 transition-transform duration-500 group-hover/card:scale-105 dark:mix-blend-normal"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImagePlaceholder
                className="aspect-square"
                variant="product"
                title={product.name}
              />
            )}
            {/* Brand logo chip (top-left) */}
            {brandName && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-sm bg-background/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                {product.brand_logo && (
                  <img
                    src={product.brand_logo}
                    alt={brandName}
                    className="h-3.5 w-3.5 rounded-sm object-contain"
                  />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                  {brandName}
                </span>
              </span>
            )}
            {/* Inventory status badge (top-right) */}
            {product.inventory_status === "contact" && (
              <span className="absolute right-3 top-3 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                Liên hệ báo giá
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
            <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors group-hover/card:text-primary">
              {product.name}
            </h3>
            {/* SKU / Model display */}
            {modelNum && (
              <p className="mb-1.5 flex items-center gap-1.5">
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                  SKU: {modelNum}
                </span>
              </p>
            )}
            <p className="mb-3 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-muted-foreground">
              {product.description || "\u00A0"}
            </p>

            {/* Feature tags — use product_features if available */}
            {product.product_features && product.product_features.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {[...product.product_features]
                  .sort((a, b) => (b.is_priority ?? 0) - (a.is_priority ?? 0))
                  .slice(0, 3)
                  .map((f) => (
                    <FeatureBadge key={f.id} name={f.name} color={f.color} icon={f.icon} size="sm" />
                  ))}
                {product.product_features.length > 3 && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{product.product_features.length - 3}
                  </span>
                )}
              </div>
            ) : legacyFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {legacyFeatures.slice(0, 3).map((f) => (
                  <span key={f} className="inline-flex items-center gap-0.5 rounded bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    <Tag className="h-2.5 w-2.5" />
                    {f}
                  </span>
                ))}
                {legacyFeatures.length > 3 && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{legacyFeatures.length - 3}
                  </span>
                )}
              </div>
            ) : null}

            {/* Action bar — pinned to bottom, revealed on hover */}
            <div className="mt-auto border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center text-xs font-medium text-primary transition-colors group-hover/card:text-primary/80">
                  Xem chi tiết
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/card:translate-x-1" />
                </span>

                {/* Action icons — visible on hover */}
                <div className="flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                  {/* Add to quote */}
                  <button
                    onClick={handleAddToCart}
                    className={`rounded-full p-1.5 border transition-all ${
                      justAdded
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : cartItems.some((i) => i.productId === product.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                    title={justAdded ? "Đã thêm" : "Thêm vào báo giá"}
                  >
                    {justAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                  </button>
                  {/* Compare */}
                  <button
                    onClick={handleCompare}
                    disabled={!isInCompare(product.id) && isFull}
                    className={`rounded-full p-1.5 border transition-all ${
                      isInCompare(product.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                    } ${!isInCompare(product.id) && isFull ? "opacity-30 cursor-not-allowed" : ""}`}
                    title={isInCompare(product.id) ? "Bỏ so sánh" : "Thêm so sánh"}
                  >
                    <GitCompareArrows className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
