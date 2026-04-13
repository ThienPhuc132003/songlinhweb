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
import { SpecTemplatePresets } from "@/components/admin/SpecTemplatePresets";
import { PdfUploader } from "@/components/admin/PdfUploader";
import type { Product, ProductCategory, Brand, ProductFeature } from "@/lib/admin-api";
import {
  PenLine,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  ChevronRight,
  Wrench,
  BarChart3,
  Globe,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";

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
  /** Directly replace all spec entries (used by template presets) */
  onSpecReplace: (entries: [string, string][]) => void;
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
  onSpecReplace,
  galleryUrls,
  onGalleryChange,
  selectedFeatureIds,
  onFeatureIdsChange,
  allFeatures,
  categories,
  brands,
  validationErrors,
}: ProductFormSheetProps) {
  // Resolve current category slug for spec template auto-suggest
  const currentCategorySlug = useMemo(() => {
    if (!form.category_id) return undefined;
    const cat = categories.find((c) => c.id === form.category_id);
    return cat?.slug;
  }, [form.category_id, categories]);

  // Resolve selected brand logo for preview
  const selectedBrand = useMemo(() => {
    if (!form.brand_id) return null;
    return brands.find((b) => b.id === form.brand_id) ?? null;
  }, [form.brand_id, brands]);

  // Computed counts for tab badges
  const filledSpecCount = specEntries.filter(([k]) => k.trim()).length;
  const featureCount = selectedFeatureIds.length;
  const galleryCount = galleryUrls.length + (form.image_url ? 1 : 0);
  const seoFilled = (form.meta_title ? 1 : 0) + (form.meta_description ? 1 : 0);

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
              <Tabs defaultValue="general" className="h-full flex flex-col">
                <div className="border-b px-4 shrink-0">
                  <TabsList variant="line" className="justify-start -mb-px">
                    <TabsTrigger value="general" className="gap-1.5 text-xs">
                      <PenLine className="h-3.5 w-3.5" /> Thông tin chung
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="gap-1.5 text-xs">
                      <Wrench className="h-3.5 w-3.5" /> Kỹ thuật
                      {(filledSpecCount > 0 || featureCount > 0) && (
                        <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {filledSpecCount + featureCount}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="gap-1.5 text-xs">
                      <ImageIcon className="h-3.5 w-3.5" /> Tài sản
                      {galleryCount > 0 && (
                        <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {galleryCount}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="gap-1.5 text-xs">
                      <Search className="h-3.5 w-3.5" /> SEO
                      {seoFilled > 0 && (
                        <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          {seoFilled}/2
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ─── TAB 1: General ─── */}
                <TabsContent value="general" className="flex-1 overflow-y-auto p-5 mt-0 space-y-5">
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
                      <div className="space-y-1.5">
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
                        {/* Brand logo preview */}
                        {selectedBrand?.logo_url && (
                          <div className="flex items-center gap-2 rounded border bg-muted/50 px-2 py-1">
                            <img
                              src={selectedBrand.logo_url}
                              alt={selectedBrand.name}
                              className="h-5 w-5 rounded object-contain"
                            />
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {selectedBrand.name}
                            </span>
                          </div>
                        )}
                      </div>
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
                            category_id: Number(e.target.value) || undefined,
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

                  {/* ─── B2B Fields: Inventory + Warranty ─── */}
                  <div className="rounded-lg border p-4 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b pb-1.5">
                      Thông tin B2B
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <F label="Tình trạng kho">
                        <div className="flex gap-2">
                          {INVENTORY_OPTIONS.map((opt) => (
                            <label
                              key={opt.value}
                              className={`flex-1 cursor-pointer rounded-md border px-2.5 py-2 text-center text-[11px] font-medium transition-colors ${
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
                          className="h-9 text-sm"
                          onChange={(e) =>
                            setForm((f) => ({ ...f, warranty: e.target.value }))
                          }
                          placeholder="VD: 24 Tháng"
                        />
                      </F>
                    </div>
                  </div>
                </TabsContent>

                {/* ─── TAB 2: Technical (Specs + Features merged) ─── */}
                <TabsContent value="technical" className="flex-1 overflow-y-auto p-5 mt-0 space-y-6">
                  {/* Specs Editor */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Thông số kỹ thuật
                      </p>
                      <div className="flex items-center gap-2">
                        <SpecTemplatePresets
                          categorySlug={currentCategorySlug}
                          currentEntries={specEntries}
                          onApply={onSpecReplace}
                        />
                        <button
                          type="button"
                          onClick={onSpecAdd}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          + Thêm thông số
                        </button>
                      </div>
                    </div>

                    {/* Spec entry header */}
                    {specEntries.length > 0 && (
                      <div className="flex gap-2 px-1">
                        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Tên thông số
                        </span>
                        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Giá trị
                        </span>
                        <span className="w-8" />
                      </div>
                    )}

                    {specEntries.map(([key, val], idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => onSpecChange(idx, e.target.value, val)}
                          placeholder="VD: Độ phân giải"
                          className="flex-1 h-9"
                        />
                        <Input
                          value={val}
                          onChange={(e) => onSpecChange(idx, key, e.target.value)}
                          placeholder="VD: 4MP (2688×1520)"
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
                        Chưa có thông số. Sử dụng &quot;Mẫu thông số&quot; hoặc nhấn &quot;+ Thêm thông số&quot;.
                      </p>
                    )}

                    <p className="text-[10px] text-muted-foreground">
                      {filledSpecCount} thông số đã nhập
                    </p>
                  </div>

                  {/* Features / Tags */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tính năng & Tags
                    </p>
                    <SearchableFeatureSelect
                      features={allFeatures}
                      selectedIds={selectedFeatureIds}
                      onChange={onFeatureIdsChange}
                    />
                  </div>
                </TabsContent>

                {/* ─── TAB 3: Assets (Gallery + PDF) ─── */}
                <TabsContent value="assets" className="flex-1 overflow-y-auto p-5 mt-0 space-y-6">
                  {/* Primary Image */}
                  <ImageUploadField
                    label="Hình chính (Cover)"
                    value={form.image_url ? [form.image_url] : []}
                    onChange={(urls) =>
                      setForm((f) => ({ ...f, image_url: urls[0] || null }))
                    }
                    folder="products"
                    single
                  />

                  {/* Gallery */}
                  <ImageUploadField
                    label="Gallery sản phẩm (tối đa 6 ảnh)"
                    value={galleryUrls}
                    onChange={onGalleryChange}
                    folder="products"
                    maxImages={6}
                  />

                  {/* PDF Datasheet */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      Datasheet PDF
                      <span className="text-[10px] text-muted-foreground font-normal">(Tối đa 10MB)</span>
                    </Label>
                    <PdfUploader
                      value={form.spec_sheet_url ?? null}
                      onChange={(url) =>
                        setForm((f) => ({ ...f, spec_sheet_url: url }))
                      }
                    />
                  </div>
                </TabsContent>

                {/* ─── TAB 4: SEO ─── */}
                <TabsContent value="seo" className="flex-1 overflow-y-auto p-5 mt-0 space-y-6">
                  <div className="rounded-lg border p-4 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b pb-1.5">
                      SEO & Meta Tags
                    </p>
                    <F label="Meta Title">
                      <Input
                        value={form.meta_title || ""}
                        className="h-9 text-sm"
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
                        {(form.meta_title || form.name || "").length > 60 && (
                          <span className="text-destructive ml-1">⚠ Quá dài</span>
                        )}
                      </p>
                    </F>
                    <F label="Meta Description">
                      <Textarea
                        value={form.meta_description || ""}
                        rows={3}
                        className="text-sm"
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            meta_description: e.target.value || null,
                          }))
                        }
                        placeholder={form.description || "Sử dụng mô tả"}
                      />
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {(form.meta_description || form.description || "").length}/160
                        {(form.meta_description || form.description || "").length > 160 && (
                          <span className="text-destructive ml-1">⚠ Quá dài</span>
                        )}
                      </p>
                    </F>
                    <F label="Custom Slug">
                      <Input
                        value={form.slug || ""}
                        className="h-9 font-mono text-xs"
                        onChange={(e) =>
                          setForm((f) => ({ ...f, slug: e.target.value }))
                        }
                        placeholder="custom-url-slug"
                      />
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        URL: sltech.vn/san-pham/<span className="font-semibold">{form.slug || "slug"}</span>
                      </p>
                    </F>
                  </div>

                  {/* Google Preview */}
                  <div className="rounded-lg border p-4 bg-background space-y-1.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Google Search Preview
                    </p>
                    <p className="text-[#1a0dab] text-sm font-medium truncate">
                      {form.meta_title || form.name || "Tiêu đề"} — Song Linh Technologies
                    </p>
                    <p className="text-[#006621] text-[11px]">
                      sltech.vn/san-pham/{form.slug || "slug"}
                    </p>
                    <p className="text-[11px] text-[#545454] line-clamp-2">
                      {form.meta_description || form.description || "Mô tả sản phẩm sẽ hiển thị ở đây..."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* ─── RIGHT PANEL (30%) — Sticky Sidebar ─── */}
            <div className="overflow-y-auto p-4 space-y-5 bg-muted/10">
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
                      className="border-input bg-background flex h-8 w-full rounded-md border px-2 py-1 text-xs"
                      value={form.is_active ?? 1}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          is_active: Number(e.target.value),
                        }))
                      }
                    >
                      <option value={1}>Công khai</option>
                      <option value={0}>Chờ duyệt</option>
                    </select>
                  </F>
                </div>
              </SidebarSection>

              {/* Quick Summary */}
              <SidebarSection title="Tổng quan" icon={Globe}>
                <div className="rounded-lg border bg-background p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Danh mục</span>
                    <span className="font-medium">
                      {categories.find((c) => c.id === form.category_id)?.name || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Thương hiệu</span>
                    <span className="font-medium flex items-center gap-1">
                      {selectedBrand?.logo_url && (
                        <img src={selectedBrand.logo_url} alt="" className="h-3.5 w-3.5 rounded object-contain" />
                      )}
                      {selectedBrand?.name || form.brand || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tình trạng</span>
                    <span className="font-medium">
                      {INVENTORY_OPTIONS.find((o) => o.value === form.inventory_status)?.label || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Bảo hành</span>
                    <span className="font-medium">{form.warranty || "—"}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Thông số</span>
                      <span className="font-medium">{filledSpecCount} mục</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tính năng</span>
                      <span className="font-medium">{featureCount} tag</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Hình ảnh</span>
                      <span className="font-medium">{galleryCount} ảnh</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Datasheet</span>
                      <span className="font-medium">{form.spec_sheet_url ? "✅ Có" : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">SEO</span>
                      <span className="font-medium">{seoFilled}/2 trường</span>
                    </div>
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
