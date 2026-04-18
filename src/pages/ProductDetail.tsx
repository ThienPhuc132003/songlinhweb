import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProduct } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Package,
  Shield,
} from "lucide-react";
import { FeatureBadge } from "@/components/ui/FeatureBadge";
import { useProductActions } from "@/hooks/useProductActions";
import { safeJson } from "@/lib/utils";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductSpecTable } from "@/components/products/ProductSpecTable";
import { ProductSidebar } from "@/components/products/ProductSidebar";

/** Inventory status display config — moved to ProductSidebar component */

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug ?? "");
  const [imgError, setImgError] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const specs = safeJson<Record<string, string>>(product?.specifications, {});
  const galleryUrls = safeJson<string[]>(product?.gallery_urls, []);
  const brand = product?.brand || "";
  const modelNumber = product?.model_number || "";
  const metaTitle = product?.meta_title || "";
  const metaDesc = product?.meta_description || "";
  const brandName = product?.brand_name;
  const brandLogo = product?.brand_logo;
  const warranty = product?.warranty || "";
  const inventoryStatus = product?.inventory_status || "contact";

  const relatedProducts = product?.related ?? [];

  const linkedProjects = product?.linked_projects ?? [];

  const { inCompare, inCart, isCompareFull, toggleCompare, addToCart } = useProductActions(
    product ? {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image_url: product.image_url,
      brand_name: brandName,
      category_name: product.category?.name || product.category_name,
    } : null,
  );

  const entityImages = product?.images;
  const allGalleryImages = [
    ...galleryUrls.map((url, i) => ({ id: `g-${i}`, url })),
    ...(entityImages || []).map((img) => ({ id: `e-${img.id}`, url: img.image_url })),
  ];

  const specEntries = useMemo(() => Object.entries(specs), [specs]);
  const displayImage = mainImage || product?.image_url;

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHero
          title=""
          breadcrumbs={[
            { label: "Sản phẩm", href: "/san-pham" },
            { label: "..." },
          ]}
          compact
        />
        <section className="section-padding">
          <div className="container-custom max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Skeleton className="aspect-square w-full rounded-sm" />
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-80 rounded-sm" />
            </div>
          </div>
        </section>
      </>
    );
  }

  // ─── 404 State ──────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <>
        <PageHero
          title="Không tìm thấy sản phẩm"
          breadcrumbs={[
            { label: "Sản phẩm", href: "/san-pham" },
            { label: "404" },
          ]}
        />
        <section className="section-padding">
          <div className="container-custom text-center">
            <p className="mb-4 text-muted-foreground">
              Sản phẩm bạn tìm kiếm không tồn tại.
            </p>
            <Button asChild>
              <Link to="/san-pham">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh mục
              </Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title={metaTitle || product.name}
        description={metaDesc || product.description}
        url={`/san-pham/${slug}`}
        image={product.image_url ?? undefined}
      />

      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: "Sản phẩm", href: "/san-pham" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/san-pham?category=${product.category.slug}`,
                },
              ]
            : product.category_name
              ? [
                  {
                    label: product.category_name,
                    href: `/san-pham?category=${product.category_slug}`,
                  },
                ]
              : []),
          { label: product.name },
        ]}
        compact
      />

      <section className="section-padding">
        <div className="container-custom max-w-7xl">
          {/* ═══ Technical Datasheet Layout ═══ */}
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* ─── MAIN CONTENT (Left) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Image Gallery + Basic Info */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Image + Gallery */}
                <ProductImageGallery
                  productName={product.name}
                  displayImage={displayImage}
                  primaryImageUrl={product.image_url}
                  galleryImages={allGalleryImages}
                  imgError={imgError}
                  onImgError={() => setImgError(true)}
                  onSelectImage={setMainImage}
                />

                {/* Product info */}
                <div className="space-y-5">
                  {/* Brand + Category badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(product.category || product.category_name) && (
                      <Badge variant="secondary">
                        {product.category?.name || product.category_name}
                      </Badge>
                    )}
                    {(brandName || brand) && (
                      <Badge
                        variant="outline"
                        className="font-semibold gap-1.5"
                      >
                        {brandLogo && (
                          <img
                            src={brandLogo}
                            alt={brandName || brand}
                            className="h-4 w-4 rounded object-contain"
                          />
                        )}
                        {brandName || brand}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

                  {modelNumber && (
                    <p className="text-muted-foreground text-sm">
                      Model:{" "}
                      <span className="font-mono font-semibold text-foreground">
                        {modelNumber}
                      </span>
                    </p>
                  )}

                  <p className="leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>

                  {/* Warranty */}
                  {warranty && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">Bảo hành:</span>
                      <span className="font-semibold">{warranty}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ─── Feature Badges (above specs for visibility) ─── */}
              {product.product_features && product.product_features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="mb-3 text-lg font-semibold">Tính năng nổi bật</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.product_features
                      .sort((a, b) => (b.is_priority ?? 0) - (a.is_priority ?? 0))
                      .map((f) => (
                        <FeatureBadge
                          key={f.id}
                          name={f.name}
                          color={f.color}
                          icon={f.icon}
                          size="md"
                        />
                      ))}
                  </div>
                </motion.div>
              )}

              {/* ─── Technical Specifications Table ─── */}
              {specEntries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <ProductSpecTable specEntries={specEntries} />
                </motion.div>
              )}

              {/* ─── Social Proof — Used in Projects ─── */}
              {linkedProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Được sử dụng trong dự án</h2>
                    <p className="text-sm text-muted-foreground">
                      Sản phẩm này đã được triển khai thành công tại các dự án sau:
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {linkedProjects.map((proj) => (
                      <Link
                        key={proj.slug}
                        to={`/du-an/${proj.slug}`}
                        className="group flex items-center gap-3 rounded-sm border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        {proj.thumbnail_url ? (
                          <img
                            src={proj.thumbnail_url}
                            alt={proj.title}
                            className="h-14 w-14 shrink-0 rounded-sm object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-primary/5">
                            <MapPin className="h-6 w-6 text-primary/40" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold group-hover:text-primary truncate">
                            {proj.title}
                          </p>
                          {proj.client_name && (
                            <p className="text-xs text-muted-foreground truncate">
                              {proj.client_name}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {proj.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ─── Related Products ─── */}
              {relatedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-xl font-semibold">Sản phẩm liên quan</h2>
                    <Link
                      to="/san-pham"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      Xem tất cả
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((rp) => (
                      <Link
                        key={rp.slug}
                        to={`/san-pham/${rp.slug}`}
                        className="group overflow-hidden rounded-sm border bg-card transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-4">
                          {rp.image_url ? (
                            <img
                              src={rp.image_url}
                              alt={rp.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Package className="h-12 w-12 text-muted-foreground/20" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
                            {rp.category_name}
                          </p>
                          <h4 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
                            {rp.name}
                          </h4>
                          {rp.model_number && (
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {rp.model_number}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ─── STICKY SIDEBAR (Right) — Technical Summary ─── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProductSidebar
                modelNumber={modelNumber}
                brandName={brandName}
                brandLogo={brandLogo}
                brand={brand}
                categoryName={product.category?.name || product.category_name}
                warranty={warranty}
                inventoryStatus={inventoryStatus}
                specSheetUrl={product.spec_sheet_url}
                inCompare={inCompare}
                isFull={isCompareFull}
                onToggleCompare={toggleCompare}
                inCart={inCart}
                onAddToCart={addToCart}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
