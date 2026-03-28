import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { useProduct } from "@/hooks/useApi";
import { SAMPLE_PRODUCTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  Mail,
  Package,
  Phone,
  Tag,
} from "lucide-react";

/** Safely parse JSON string or return array directly */
function safeJson<T>(value: string | T | null | undefined, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

/** Sample specifications for demo */
const SAMPLE_SPECS: Record<string, Record<string, string>> = {
  "hikvision-ds-2cd2143g2-i": {
    "Độ phân giải": "4MP (2688 × 1520)",
    "Cảm biến": "1/3\" Progressive Scan CMOS",
    "Ống kính": "2.8mm / 4mm / 6mm",
    "Tầm xa hồng ngoại": "30m (EXIR 2.0)",
    "Chuẩn nén": "H.265+ / H.265 / H.264+ / H.264",
    "WDR": "120dB True WDR",
    "Công nghệ AI": "AcuSense (Phân biệt người/xe)",
    "Cấp bảo vệ": "IP67 / IK10",
    "Nguồn": "PoE (802.3af) / 12V DC",
    "Nhiệt độ hoạt động": "-30°C ~ 60°C",
  },
  "honeywell-tc810m1109": {
    "Loại": "Đầu báo khói quang",
    "Giao thức": "Addressable CLIP",
    "Điện áp": "15-32V DC",
    "Dòng hoạt động": "300μA",
    "Nhiệt độ": "0°C ~ 49°C",
    "Chứng nhận": "EN 54-7, UL Listed",
    "LED": "360° hiển thị",
    "Kích thước": "Ø102mm × 48mm",
  },
  "zkteco-inbio-260": {
    "Số cửa": "2 cửa",
    "Dung lượng vân tay": "20,000",
    "Dung lượng thẻ": "60,000",
    "Sự kiện": "100,000 bản ghi",
    "Kết nối": "TCP/IP, RS485",
    "Đầu đọc": "Wiegand 26/34 bit",
    "Tính năng": "Anti-Passback, Inter-lock, Multi-card",
    "Nguồn": "12V DC",
  },
};

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: apiProduct, isLoading } = useProduct(slug ?? "");
  const [imgError, setImgError] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Fallback to SAMPLE_PRODUCTS when API returns null
  const sampleProduct = !apiProduct && slug
    ? SAMPLE_PRODUCTS.find((p) => p.slug === slug)
    : null;
  const product = apiProduct ?? (sampleProduct ? {
    ...sampleProduct,
    id: 0,
    category_id: 0,
    image_url: null as string | null,
    spec_sheet_url: null as string | null,
    specifications: JSON.stringify(SAMPLE_SPECS[sampleProduct.slug] ?? {}),
    features: JSON.stringify(sampleProduct.features),
    is_active: 1,
    sort_order: 0,
    meta_title: null as string | null,
    meta_description: null as string | null,
    created_at: "",
    updated_at: "",
    category: { id: 0, slug: sampleProduct.category_slug, name: sampleProduct.category_name, description: "", image_url: null, sort_order: 0, is_active: 1 },
  } : null);

  const specs = safeJson<Record<string, string>>(product?.specifications, {});
  const features = safeJson<string[]>(product?.features, []);
  const brand = product?.brand || "";
  const modelNumber = product?.model_number || "";
  const metaTitle = product?.meta_title || "";
  const metaDesc = product?.meta_description || "";
  const brandName = product?.brand_name;
  const brandLogo = product?.brand_logo;
  const relatedProducts = (product?.related ?? []) as Array<{ slug: string; name: string; image_url: string | null; brand: string; model_number: string; category_name: string }>;

  // Related from sample data
  const sampleRelated = sampleProduct && !relatedProducts.length
    ? SAMPLE_PRODUCTS.filter((p) => p.category_slug === sampleProduct.category_slug && p.slug !== sampleProduct.slug).slice(0, 4)
    : [];

  const specEntries = Object.entries(specs);
  const displayImage = mainImage || product?.image_url;

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
          <div className="container-custom max-w-6xl">
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
            : []),
          { label: product.name },
        ]}
        compact
      />

      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          {/* ─── Product Info Grid ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-10 md:grid-cols-2"
          >
            {/* Image + Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-muted to-muted/30">
                {imgError || !displayImage ? (
                  <div className="flex flex-col items-center justify-center gap-2 p-12">
                    <Package className="h-24 w-24 text-muted-foreground/20" />
                    <span className="text-sm text-muted-foreground">
                      Hình ảnh sản phẩm
                    </span>
                  </div>
                ) : (
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="aspect-square w-full object-contain p-6"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              {/* Thumbnail gallery */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
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
              {/* Brand + Category badges */}
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge variant="secondary">{product.category.name}</Badge>
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

              {/* ─── B2B CTA Section ─── */}
              <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-transparent p-5 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Liên hệ để nhận báo giá tốt nhất
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link
                      to={`/lien-he?product=${encodeURIComponent(product.name)}${modelNumber ? `&model=${encodeURIComponent(modelNumber)}` : ""}`}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Yêu cầu báo giá
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:+84899194868">
                      <Phone className="mr-2 h-4 w-4" />
                      Hotline
                    </a>
                  </Button>
                </div>
              </div>

              {/* Downloads */}
              {product.spec_sheet_url && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Tài liệu
                  </h3>
                  <a
                    href={product.spec_sheet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Download className="h-4 w-4 text-primary" />
                    <span>Tải Datasheet (PDF)</span>
                    <FileText className="ml-auto h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              )}
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
                        <td className="w-1/3 px-5 py-3 text-sm font-medium text-muted-foreground">
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

          {/* ─── Related Products ─── */}
          {(relatedProducts.length > 0 || sampleRelated.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-12"
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
                {(relatedProducts.length > 0 ? relatedProducts : sampleRelated).map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/san-pham/${rp.slug}`}
                    className="group overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-4">
                      {(rp as Record<string, unknown>).image_url ? (
                        <img
                          src={(rp as Record<string, unknown>).image_url as string}
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
        </div>
      </section>
    </>
  );
}
