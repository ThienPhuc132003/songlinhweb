import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SearchableFeatureSelect } from "@/components/admin/SearchableFeatureSelect";
import type { Product, ProductCategory, Brand, ProductFeature } from "@/lib/admin-api";
import {
  PenLine,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  ChevronRight,
  Wrench,
  Package,
  BarChart3,
  Globe,
} from "lucide-react";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const INVENTORY_OPTIONS = [
  { value: "in-stock", label: "Còn hàng", color: "border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
  { value: "pre-order", label: "Đặt trước", color: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  { value: "contact", label: "Liên hệ", color: "border-slate-300 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
] as const;

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function SidebarSection({
  title,
  icon: Icon,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => collapsible && setOpen(!open)}
        className={`flex w-full items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground border-b pb-1.5 ${collapsible ? "cursor-pointer hover:text-foreground" : "cursor-default"}`}
      >
        {collapsible && (
          open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
        )}
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </button>
      {(!collapsible || open) && children}
    </div>
  );
}

function F({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormSheetProps {
  open: boolean;
  onClose: () => void;
  editId: number | null;
  form: Partial<Product>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  /** Name change handler (with auto-slug) */
  onNameChange: (name: string) => void;
  /** Spec entries state */
  specEntries: [string, string][];
  onSpecChange: (idx: number, key: string, val: string) => void;
  onSpecAdd: () => void;
  onSpecRemove: (idx: number) => void;
  /** Gallery URLs */
  galleryUrls: string[];
  onGalleryChange: (urls: string[]) => void;
  /** Feature selection */
  selectedFeatureIds: number[];
  onFeatureIdsChange: (ids: number[]) => void;
  allFeatures: ProductFeature[];
  /** Reference data */
  categories: ProductCategory[];
  brands: Brand[];
  /** Validation errors */
  validationErrors: Record<string, string>;
}

export function ProductFormSheet({
  open,
  onClose,
  editId,
  form,
  setForm,
  onSubmit,
  loading,
  onNameChange,
  specEntries,
  onSpecChange,
  onSpecAdd,
  onSpecRemove,
  galleryUrls,
  onGalleryChange,
  selectedFeatureIds,
  onFeatureIdsChange,
  allFeatures,
  categories,
  brands,
  validationErrors,
}: ProductFormSheetProps) {
  const selectClass =
    "border-input bg-background flex h-8 w-full rounded-md border px-2 py-1 text-xs";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-[95vw] h-[92vh] flex flex-col !p-0 !gap-0"
        showCloseButton={false}
      >
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          {/* ═══ HEADER ═══ */}
          <DialogHeader className="border-b px-6 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">
                {editId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                {form.name && (
                  <span className="text-muted-foreground font-normal ml-1">
                    — {form.name}
                  </span>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Lưu...
                    </>
                  ) : (
                    "💾 Lưu sản phẩm"
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* ═══ BODY — 2 Column Layout ═══ */}
          <div className="flex-1 grid grid-cols-[1fr_360px] min-h-0">
            {/* ─── LEFT PANEL (70%) — Tabs ─── */}
            <div className="border-r overflow-y-auto">
              <Tabs defaultValue="info" className="h-full flex flex-col">
                <div className="border-b px-4 shrink-0">
                  <TabsList variant="line" className="justify-start -mb-px">
                    <TabsTrigger value="info" className="gap-1.5 text-xs">
                      <PenLine className="h-3.5 w-3.5" /> Thông tin sản phẩm
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="gap-1.5 text-xs">
                      <ImageIcon className="h-3.5 w-3.5" /> Hình ảnh
                    </TabsTrigger>
                    <TabsTrigger value="specs" className="gap-1.5 text-xs">
                      <Wrench className="h-3.5 w-3.5" /> Thông số & Tính năng
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* TAB: Info */}
                <TabsContent value="info" className="flex-1 overflow-y-auto p-5 mt-0 space-y-5">
                  {/* Name + Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <F label="Tên sản phẩm" required error={validationErrors.name}>
                      <Input
                        value={form.name || ""}
                        className={`h-9 ${validationErrors.name ? "border-destructive" : ""}`}
                        onChange={(e) => onNameChange(e.target.value)}
                        required
                        placeholder="VD: Camera IP 4MP Dome"
                      />
                    </F>
                    <F label="Slug" required error={validationErrors.slug}>
                      <Input
                        value={form.slug || ""}
                        className={`h-9 font-mono text-xs ${validationErrors.slug ? "border-destructive" : ""}`}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, slug: e.target.value }))
                        }
                        required
                        placeholder="camera-ip-4mp-dome"
                      />
                    </F>
                  </div>

                  {/* Brand + Model + Category */}
                  <div className="grid grid-cols-3 gap-4">
                    <F label="Thương hiệu">
                      <select
                        className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                        value={form.brand_id ?? ""}
                        onChange={(e) => {
                          const brandId = Number(e.target.value) || null;
                          const selected = brands.find((b) => b.id === brandId);
                          setForm((f) => ({
                            ...f,
                            brand_id: brandId,
                            brand: selected?.name || "",
                          }));
                        }}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </F>
                    <F label="Model">
                      <Input
                        value={form.model_number || ""}
                        className="h-9"
                        onChange={(e) =>
                          setForm((f) => ({ ...f, model_number: e.target.value }))
                        }
                        placeholder="DS-2CD2143G2-I"
                      />
                    </F>
                    <F label="Danh mục" required error={validationErrors.category_id}>
                      <select
                        className={`border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm ${validationErrors.category_id ? "border-destructive" : ""}`}
                        value={form.category_id ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            category_id: Number(e.target.value) || null,
                          }))
                        }
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories
                          .sort((a, b) => {
                            const aOrder = a.parent_id
                              ? 1000 + a.sort_order
                              : a.sort_order;
                            const bOrder = b.parent_id
                              ? 1000 + b.sort_order
                              : b.sort_order;
                            return aOrder - bOrder;
                          })
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.parent_id ? `  └ ${c.name}` : c.name}
                            </option>
                          ))}
                      </select>
                    </F>
                  </div>

                  {/* Description */}
                  <F label="Mô tả">
                    <Textarea
                      value={form.description || ""}
                      rows={4}
                      className="text-sm"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="Mô tả chi tiết sản phẩm..."
                    />
                  </F>
                </TabsContent>

                {/* TAB: Gallery */}
                <TabsContent value="gallery" className="flex-1 overflow-y-auto p-5 mt-0 space-y-6">
                  <ImageUploadField
                    label="Hình chính (Cover)"
                    value={form.image_url ? [form.image_url] : []}
                    onChange={(urls) =>
                      setForm((f) => ({ ...f, image_url: urls[0] || null }))
                    }
                    folder="products"
                    single
                  />
                  <ImageUploadField
                    label="Gallery sản phẩm (tối đa 6 ảnh)"
                    value={galleryUrls}
                    onChange={onGalleryChange}
                    folder="products"
                    maxImages={6}
                  />
                </TabsContent>

                {/* TAB: Specs & Features */}
                <TabsContent value="specs" className="flex-1 overflow-y-auto p-5 mt-0 space-y-6">
                  {/* Specifications — Key-Value Editor */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Thông số kỹ thuật
                      </p>
                      <button
                        type="button"
                        onClick={onSpecAdd}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        + Thêm thông số
                      </button>
                    </div>
                    {specEntries.map(([key, val], idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => onSpecChange(idx, e.target.value, val)}
                          placeholder="Tên (VD: Resolution)"
                          className="flex-1 h-9"
                        />
                        <Input
                          value={val}
                          onChange={(e) => onSpecChange(idx, key, e.target.value)}
                          placeholder="Giá trị (VD: 4MP)"
                          className="flex-1 h-9"
                        />
                        <button
                          type="button"
                          onClick={() => onSpecRemove(idx)}
                          className="text-xs text-destructive hover:underline px-2 shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {specEntries.length === 0 && (
                      <p className="text-xs text-muted-foreground italic py-2">
                        Chưa có thông số. Nhấn "+ Thêm thông số" để bắt đầu.
                      </p>
                    )}
                  </div>

                  {/* Features — Searchable Multi-select */}
                  <SearchableFeatureSelect
                    features={allFeatures}
                    selectedIds={selectedFeatureIds}
                    onChange={onFeatureIdsChange}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* ─── RIGHT PANEL (30%) — Sticky Sidebar ─── */}
            <div className="overflow-y-auto p-4 space-y-5 bg-muted/10">
              {/* B2B Data */}
              <SidebarSection title="Dữ liệu B2B" icon={Package}>
                <F label="Datasheet PDF (URL)">
                  <Input
                    value={form.spec_sheet_url || ""}
                    className="h-8 text-xs"
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        spec_sheet_url: e.target.value || null,
                      }))
                    }
                    placeholder="https://... hoặc upload PDF"
                  />
                </F>
                <div className="grid grid-cols-2 gap-2">
                  <F label="Tình trạng kho">
                    <div className="flex flex-col gap-1.5">
                      {INVENTORY_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                            form.inventory_status === opt.value
                              ? opt.color
                              : "border-input text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="inventory_status"
                            value={opt.value}
                            checked={form.inventory_status === opt.value}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                inventory_status: e.target.value,
                              }))
                            }
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </F>
                  <F label="Bảo hành">
                    <Input
                      value={form.warranty || ""}
                      className="h-8 text-xs"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, warranty: e.target.value }))
                      }
                      placeholder="24 Tháng"
                    />
                  </F>
                </div>
              </SidebarSection>

              {/* Sort & Status */}
              <SidebarSection title="Trạng thái" icon={BarChart3}>
                <div className="grid grid-cols-2 gap-2">
                  <F label="Thứ tự">
                    <Input
                      type="number"
                      value={form.sort_order ?? 0}
                      className="h-8 text-xs"
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          sort_order: Number(e.target.value),
                        }))
                      }
                    />
                  </F>
                  <F label="Trạng thái">
                    <select
                      className={selectClass}
                      value={form.is_active ?? 1}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          is_active: Number(e.target.value),
                        }))
                      }
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Ẩn</option>
                    </select>
                  </F>
                </div>
              </SidebarSection>

              {/* SEO */}
              <SidebarSection title="SEO & Meta" icon={Globe} collapsible defaultOpen={false}>
                <div className="space-y-3">
                  <F label="Meta Title">
                    <Input
                      value={form.meta_title || ""}
                      className="h-8 text-xs"
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          meta_title: e.target.value || null,
                        }))
                      }
                      placeholder={form.name || "Sử dụng tên sản phẩm"}
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {(form.meta_title || form.name || "").length}/60
                    </p>
                  </F>
                  <F label="Meta Description">
                    <Textarea
                      value={form.meta_description || ""}
                      rows={2}
                      className="text-xs"
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          meta_description: e.target.value || null,
                        }))
                      }
                      placeholder={form.description || "Sử dụng mô tả"}
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {(form.meta_description || form.description || "").length}
                      /160
                    </p>
                  </F>
                  {/* Google Preview */}
                  <div className="rounded-lg border p-3 bg-background">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Google Preview
                    </p>
                    <p className="text-[#1a0dab] text-xs font-medium truncate">
                      {form.meta_title || form.name || "Tiêu đề"} — SLTECH
                    </p>
                    <p className="text-[#006621] text-[10px]">
                      sltech.vn/san-pham/{form.slug || "slug"}
                    </p>
                    <p className="text-[10px] text-[#545454] line-clamp-2">
                      {form.meta_description || form.description || "Mô tả..."}
                    </p>
                  </div>
                </div>
              </SidebarSection>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
