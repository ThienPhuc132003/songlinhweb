import { Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProductCategories } from "@/hooks/useApi";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Package } from "lucide-react";

export default function Products() {
  const { data: categories, isLoading } = useProductCategories();
  const items = categories ?? PRODUCT_CATEGORIES.map((c) => ({
    ...c,
    id: 0,
    image_url: null,
    is_active: 1 as const,
    product_count: c.productCount,
  }));

  return (
    <>
      <SEO
        title="Sản phẩm"
        description="Danh mục sản phẩm thiết bị công nghệ từ SLTECH: camera, thiết bị mạng, PCCC, kiểm soát ra vào."
        url="/san-pham"
      />

      <PageHero
        title="Sản phẩm"
        subtitle="Thiết bị công nghệ chính hãng từ các thương hiệu uy tín hàng đầu"
        breadcrumbs={[{ label: "Sản phẩm" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-lg border p-5">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              : items.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/san-pham/${cat.slug}`} className="block h-full">
                  <Card className="hover:border-primary/30 group h-full transition-all hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                        <Package className="h-6 w-6" />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{cat.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {cat.product_count ?? 0} SP
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4 text-sm">
                        {cat.description}
                      </p>
                      <span className="text-primary inline-flex items-center text-sm font-medium">
                        Xem sản phẩm
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
