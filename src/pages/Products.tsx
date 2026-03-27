import { Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProductCategories, useProducts } from "@/hooks/useApi";
import { PRODUCT_CATEGORIES, SAMPLE_PRODUCTS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Package, Tag } from "lucide-react";

export default function Products() {
  const { data: categories, isLoading: catLoading } = useProductCategories();
  const { data: productsData, isLoading: prodsLoading } = useProducts({ page: 1 });

  const catItems = categories ?? PRODUCT_CATEGORIES.map((c) => ({
    ...c,
    id: 0,
    image_url: null,
    is_active: 1 as const,
    product_count: c.productCount,
  }));

  // Use API products if available, otherwise use sample data
  const products = productsData?.items?.length
    ? productsData.items
    : SAMPLE_PRODUCTS;

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

      {/* ─── Categories Grid ─── */}
      <section className="section-padding pb-0">
        <div className="container-custom">
          <h2 className="mb-6 text-xl font-bold">Danh mục sản phẩm</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-lg border p-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              : catItems.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/san-pham/${cat.slug}`} className="block h-full">
                  <Card className="hover:border-primary/30 group h-full transition-all hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{cat.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {cat.product_count ?? 0} SP
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">
                        {cat.description}
                      </p>
                      <span className="text-primary inline-flex items-center text-xs font-medium">
                        Xem sản phẩm
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products Grid ─── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Thiết bị ELV chính hãng từ Hikvision, Honeywell, Cisco, TOA, ZKTeco
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {prodsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-xl border p-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              : products.map((product, i) => {
                  const brandName = "brand" in product ? product.brand : "";
                  const modelNum = "model_number" in product ? product.model_number : "";
                  const catName = "category_name" in product
                    ? product.category_name
                    : "category" in product && product.category
                      ? (product.category as { name: string }).name
                      : "";
                  const features = "features" in product
                    ? (typeof product.features === "string"
                        ? (() => { try { return JSON.parse(product.features); } catch { return []; } })()
                        : Array.isArray(product.features) ? product.features : [])
                    : [];

                  return (
                    <motion.div
                      key={product.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                    >
                      <Link
                        to={`/san-pham/product/${product.slug}`}
                        className="group block h-full"
                      >
                        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-lg">
                          {/* Image placeholder */}
                          <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-6">
                            <Package className="h-16 w-16 text-muted-foreground/20" />
                            {brandName && (
                              <span className="absolute right-3 top-3 rounded bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/70 shadow-sm">
                                {brandName}
                              </span>
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex flex-1 flex-col p-4">
                            {catName && (
                              <span className="text-primary mb-1 text-[11px] font-medium uppercase tracking-wide">
                                {catName}
                              </span>
                            )}
                            <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-sm font-semibold transition-colors">
                              {product.name}
                            </h3>
                            {modelNum && (
                              <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                                {modelNum}
                              </p>
                            )}
                            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                              {product.description}
                            </p>
                            {/* Feature tags */}
                            {features.length > 0 && (
                              <div className="mt-auto flex flex-wrap gap-1">
                                {(features as string[]).slice(0, 3).map((f: string) => (
                                  <span
                                    key={f}
                                    className="inline-flex items-center gap-0.5 rounded bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                                  >
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
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>
    </>
  );
}
