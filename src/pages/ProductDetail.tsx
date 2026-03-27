import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProduct, useProductCategories } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Package } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug ?? "");
  const [imgError, setImgError] = useState(false);

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
          <div className="container-custom max-w-4xl">
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
          breadcrumbs={[
            { label: "Sản phẩm", href: "/san-pham" },
            { label: "404" },
          ]}
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
        title={product.name}
        description={product.description}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 md:grid-cols-2"
          >
            {/* Product image */}
            <div className="bg-muted flex items-center justify-center overflow-hidden rounded-xl border">
              {imgError || !product.image_url ? (
                <div className="flex flex-col items-center justify-center gap-2 p-8">
                  <Package className="text-muted-foreground/30 h-20 w-20" />
                  <span className="text-muted-foreground text-sm">
                    Hình ảnh sản phẩm
                  </span>
                </div>
              ) : (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="aspect-square w-full object-contain p-4"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            {/* Product info */}
            <div className="space-y-5">
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}

              <h1 className="text-2xl font-bold md:text-3xl">
                {product.name}
              </h1>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

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
                      Tải datasheet
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Extra images */}
          {product.images && product.images.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt={img.caption ?? product.name}
                    className="rounded-lg border object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
