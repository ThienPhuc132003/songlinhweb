import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProducts } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { CategorySidebar } from "@/components/products/CategorySidebar";
import { BrandFilter } from "@/components/products/BrandFilter";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { GroupedFeatureFilter } from "@/components/products/GroupedFeatureFilter";
import { ProductCard, type EnrichedProduct } from "@/components/products/ProductCard";

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
