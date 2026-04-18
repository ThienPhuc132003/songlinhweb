import { Button } from "@/components/ui/button";
import {
  Clock,
  Cpu,
  Download,
  GitCompareArrows,
  Phone,
  Send,
  Shield,
  CheckCircle2,
} from "lucide-react";

/** Inventory status display config */
const INVENTORY_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  "in-stock": {
    label: "Còn hàng",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  "pre-order": {
    label: "Đặt trước",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  "contact": {
    label: "Liên hệ",
    icon: Phone,
    className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
};

interface ProductSidebarProps {
  modelNumber: string;
  brandName: string | null | undefined;
  brandLogo: string | null | undefined;
  brand: string;
  categoryName: string | null | undefined;
  warranty: string;
  inventoryStatus: string;
  specSheetUrl: string | null | undefined;
  /** Compare state */
  inCompare: boolean;
  isFull: boolean;
  onToggleCompare: () => void;
  /** Cart state */
  inCart: boolean;
  onAddToCart: () => void;
}

/**
 * Sticky sidebar for product detail pages.
 * Contains the tech summary card and B2B CTA section.
 * Extracted from ProductDetail.tsx to reduce page complexity.
 */
export function ProductSidebar({
  modelNumber,
  brandName,
  brandLogo,
  brand,
  categoryName,
  warranty,
  inventoryStatus,
  specSheetUrl,
  inCompare,
  isFull,
  onToggleCompare,
  inCart,
  onAddToCart,
}: ProductSidebarProps) {
  const inventoryInfo = INVENTORY_CONFIG[inventoryStatus] || INVENTORY_CONFIG["contact"];
  const InventoryIcon = inventoryInfo.icon;

  return (
    <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
      {/* Quick Specs Card */}
      <div className="rounded-sm border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-3 border-b">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Cpu className="h-4 w-4" />
            Tóm tắt kỹ thuật
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {/* SKU / Model */}
          {modelNumber && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">SKU / Model</span>
              <span className="font-mono font-semibold">{modelNumber}</span>
            </div>
          )}
          {/* Brand */}
          {(brandName || brand) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Thương hiệu</span>
              <span className="font-semibold flex items-center gap-1.5">
                {brandLogo && (
                  <img src={brandLogo} alt="" className="h-4 w-4 rounded object-contain" />
                )}
                {brandName || brand}
              </span>
            </div>
          )}
          {/* Category */}
          {categoryName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Danh mục</span>
              <span className="font-semibold">{categoryName}</span>
            </div>
          )}
          {/* Warranty */}
          {warranty && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bảo hành</span>
              <span className="font-semibold flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                {warranty}
              </span>
            </div>
          )}
          {/* Inventory */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tình trạng</span>
            <span
              className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium ${inventoryInfo.className}`}
            >
              <InventoryIcon className="h-3 w-3" />
              {inventoryInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* B2B CTA Section */}
      <div className="rounded-sm border bg-card shadow-sm p-5 space-y-3">
        <p className="text-sm font-bold text-foreground">
          Liên hệ báo giá dự án
        </p>
        <p className="text-xs text-muted-foreground">
          Nhận báo giá tốt nhất cho dự án của bạn từ đội ngũ kỹ thuật Song Linh Technologies.
        </p>
        <div className="flex flex-col gap-2">
          {/* Primary CTA — RFQ */}
          <Button
            size="lg"
            className="w-full font-semibold gap-2"
            onClick={onAddToCart}
          >
            <Send className="h-4 w-4" />
            {inCart ? "✓ Đã thêm — Yêu cầu báo giá" : "Yêu cầu báo giá dự án"}
          </Button>

          {/* Download Datasheet */}
          {specSheetUrl && (
            <Button variant="outline" size="lg" className="w-full gap-2" asChild>
              <a
                href={specSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 text-primary" />
                Tải tài liệu kỹ thuật (PDF)
              </a>
            </Button>
          )}

          {/* Compare */}
          <Button
            variant={inCompare ? "default" : "outline"}
            size="default"
            className="w-full gap-2"
            onClick={onToggleCompare}
            disabled={!inCompare && isFull}
          >
            <GitCompareArrows className="h-4 w-4" />
            {inCompare ? "Đã thêm so sánh" : "So sánh sản phẩm"}
          </Button>

          {/* Hotline */}
          <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground" asChild>
            <a href="tel:+84899194868">
              <Phone className="h-3.5 w-3.5" />
              Hotline: 0899.194.868
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
