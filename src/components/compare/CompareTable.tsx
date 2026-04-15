import { useQuery } from "@tanstack/react-query";
import { useCompare } from "@/contexts/CompareContext";
import { X, Package, Check, Minus, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FeatureBadge } from "@/components/ui/FeatureBadge";

const API_URL = import.meta.env.VITE_API_URL || "";

interface CompareProduct {
  id: number;
  slug: string;
  name: string;
  image_url: string | null;
  brand_name?: string | null;
  brand_logo?: string | null;
  category_name?: string;
  model_number?: string;
  description?: string;
  specifications?: string;
  warranty?: string;
  inventory_status?: string;
  product_features?: Array<{
    id: number;
    name: string;
    color?: string | null;
    icon?: string | null;
  }>;
}

async function fetchCompareProducts(ids: number[]): Promise<CompareProduct[]> {
  const res = await fetch(`${API_URL}/api/products/compare?ids=${ids.join(",")}`);
  if (!res.ok) throw new Error("Fetch compare failed");
  const json = await res.json();
  return json.data;
}

export function CompareTable({ onClose }: { onClose: () => void }) {
  const { items, remove } = useCompare();
  const ids = items.map((i) => i.id);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => fetchCompareProducts(ids),
    enabled: ids.length >= 2,
  });

  // Collect all spec keys from all products
  const allSpecKeys = new Set<string>();
  products.forEach((p) => {
    try {
      const specs = JSON.parse(p.specifications || "{}");
      Object.keys(specs).forEach((k) => allSpecKeys.add(k));
    } catch { /* empty */ }
  });
  const specKeys = Array.from(allSpecKeys);

  // Collect all feature names
  const allFeatureNames = new Set<string>();
  products.forEach((p) => {
    p.product_features?.forEach((f) => allFeatureNames.add(f.name));
  });
  const featureNames = Array.from(allFeatureNames);

  const getSpec = (product: CompareProduct, key: string): string => {
    try {
      const specs = JSON.parse(product.specifications || "{}");
      return specs[key] || "—";
    } catch {
      return "—";
    }
  };

  const hasFeature = (product: CompareProduct, featureName: string) => {
    return product.product_features?.some((f) => f.name === featureName) ?? false;
  };

  const getFeature = (product: CompareProduct, featureName: string) => {
    return product.product_features?.find((f) => f.name === featureName);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mt-8 mb-24 w-full max-w-5xl rounded-sm border bg-background shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">So sánh sản phẩm</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="w-40 bg-muted/30 px-4 py-3 text-left font-medium text-muted-foreground">
                    &nbsp;
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="min-w-[200px] px-4 py-3 text-center">
                      <div className="space-y-2">
                        <button
                          onClick={() => remove(p.id)}
                          className="absolute right-2 top-2 rounded-full p-1 hover:bg-destructive/10"
                          title="Bỏ khỏi so sánh"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="mx-auto h-28 w-28 rounded-sm object-contain bg-muted/30 p-2"
                          />
                        ) : (
                          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-sm bg-muted/30">
                            <Package className="h-10 w-10 text-muted-foreground/40" />
                          </div>
                        )}
                        <Link
                          to={`/san-pham/${p.slug}`}
                          className="block text-sm font-semibold hover:text-primary"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Basic Info */}
                <SectionHeader label="Thông tin cơ bản" colSpan={products.length + 1} />
                <CompareRow label="Thương hiệu" values={products.map((p) => p.brand_name || "—")} />
                <CompareRow label="Danh mục" values={products.map((p) => p.category_name || "—")} />
                <CompareRow label="Model" values={products.map((p) => p.model_number || "—")} />
                <CompareRow label="Bảo hành" values={products.map((p) => p.warranty || "—")} />
                <CompareRow
                  label="Tình trạng"
                  values={products.map((p) => {
                    const s = p.inventory_status || "contact";
                    return s === "in-stock" ? "Còn hàng" : s === "pre-order" ? "Đặt trước" : "Liên hệ";
                  })}
                />

                {/* Specifications */}
                {specKeys.length > 0 && (
                  <>
                    <SectionHeader label="Thông số kỹ thuật" colSpan={products.length + 1} />
                    {specKeys.map((key) => (
                      <CompareRow
                        key={key}
                        label={key}
                        values={products.map((p) => getSpec(p, key))}
                      />
                    ))}
                  </>
                )}

                {/* Features */}
                {featureNames.length > 0 && (
                  <>
                    <SectionHeader label="Tính năng" colSpan={products.length + 1} />
                    {featureNames.map((name) => (
                      <tr key={name} className="hover:bg-muted/20">
                        <td className="bg-muted/10 px-4 py-2.5 font-medium text-muted-foreground">
                          {name}
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="px-4 py-2.5 text-center">
                            {hasFeature(p, name) ? (
                              <span className="inline-flex items-center gap-1">
                                {(() => {
                                  const f = getFeature(p, name);
                                  if (f) return <FeatureBadge name={f.name} color={f.color} icon={f.icon} size="sm" />;
                                  return <Check className="h-4 w-4 text-green-600" />;
                                })()}
                              </span>
                            ) : (
                              <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* Actions */}
                <tr>
                  <td className="bg-muted/10 px-4 py-4">&nbsp;</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-4 text-center">
                      <Link
                        to={`/san-pham/${p.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Xem chi tiết
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function SectionHeader({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary"
      >
        {label}
      </td>
    </tr>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="hover:bg-muted/20">
      <td className="bg-muted/10 px-4 py-2.5 font-medium text-muted-foreground">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-2.5 text-center">
          {v}
        </td>
      ))}
    </tr>
  );
}
