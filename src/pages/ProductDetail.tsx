import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProduct } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Package, Tag } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

/** Safely parse JSON string, returning fallback */
function safeJson<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug ?? "");
  const [imgError, setImgError] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Parse new B2B fields from the product data
  const specs = safeJson<Record<string, string>>(product?.specifications, {});
  const features = safeJson<string[]>(product?.features, []);
  const brand = product?.brand || "";
  const modelNumber = product?.model_number || "";
  const metaTitle = product?.meta_title || "";
  const metaDesc = product?.meta_description || "";

  const specEntries = Object.entries(specs);
  const displayImage = mainImage || product?.image_url;

  if (isLoading) {
    return (
      <>
        <PageHero title="" breadcrumbs={[{ label: "Sản phẩm", href: "/san-pham" }, { label: "..." }]} compact />
        <section className="section-padding">
          <div className="container-custom max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <PageHero
          title="Không tìm thấy sản phẩm"
          breadcrumbs={[{ label: "Sản phẩm", href: "/san-pham" }, { label: "404" }]}
        />
        <section className="section-padding">
          <div className="container-custom text-center">
            <p className="text-muted-foreground mb-4">
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
                  href: `/san-pham/${product.category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
        compact
      />

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          {/* ─── Product Info Grid ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 md:grid-cols-2"
          >
            {/* Image + Gallery */}
            <div className="space-y-3">
              <div className="bg-muted flex items-center justify-center overflow-hidden rounded-xl border">
                {imgError || !displayImage ? (
                  <div className="flex flex-col items-center justify-center gap-2 p-8">
                    <Package className="text-muted-foreground/30 h-20 w-20" />
                    <span className="text-muted-foreground text-sm">Hình ảnh sản phẩm</span>
                  </div>
                ) : (
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="aspect-square w-full object-contain p-4"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              {/* Thumbnail gallery */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {/* Main image as first thumb */}
                  {product.image_url && (
                    <button
                      type="button"
                      onClick={() => setMainImage(product.image_url)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        displayImage === product.image_url
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )}
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setMainImage(img.image_url)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        displayImage === img.image_url
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption ?? product.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge variant="secondary">{product.category.name}</Badge>
                )}
                {brand && (
                  <Badge variant="outline" className="font-semibold">
                    {brand}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

              {modelNumber && (
                <p className="text-muted-foreground text-sm">
                  Model: <span className="font-mono font-medium">{modelNumber}</span>
                </p>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Features badges */}
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      <Tag className="h-3 w-3" />
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <AddToCartButton product={product} />
                {product.spec_sheet_url && (
                  <Button variant="outline" size="lg" asChild>
                    <a
                      href={product.spec_sheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Tải Datasheet
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ─── Specifications Table ─── */}
          {specEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-12"
            >
              <h2 className="mb-4 text-xl font-semibold">Thông số kỹ thuật</h2>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full">
                  <tbody>
                    {specEntries.map(([key, value], i) => (
                      <tr
                        key={key}
                        className={i % 2 === 0 ? "bg-muted/50" : "bg-background"}
                      >
                        <td className="px-5 py-3 text-sm font-medium text-muted-foreground w-1/3">
                          {key}
                        </td>
                        <td className="px-5 py-3 text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
