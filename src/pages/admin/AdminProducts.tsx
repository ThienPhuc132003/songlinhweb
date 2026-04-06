import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Product, type ProductCategory, type Brand, type ProductFeature } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  FormDialog,
  Field,
  StatusBadge,
  BulkActionBar,
  type Column,
} from "@/components/admin/CrudHelpers";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SearchableFeatureSelect } from "@/components/admin/SearchableFeatureSelect";

const INVENTORY_OPTIONS = [
  { value: "in-stock", label: "Còn hàng", color: "bg-green-100 text-green-700" },
  { value: "pre-order", label: "Đặt trước", color: "bg-amber-100 text-amber-700" },
  { value: "contact", label: "Liên hệ", color: "bg-slate-100 text-slate-600" },
] as const;

const defaultForm: Partial<Product> = {
  slug: "",
  name: "",
  description: "",
  category_id: null,
  brand_id: null,
  brand: "",
  model_number: "",
  image_url: null,
  gallery_urls: "[]",
  spec_sheet_url: null,
  specifications: "{}",
  features: "[]",
  inventory_status: "in-stock",
  warranty: "",
  sort_order: 0,
  is_active: 1,
  meta_title: null,
  meta_description: null,
};

/** Generate slug from name */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Specs editor state (key-value pairs)
  const [specEntries, setSpecEntries] = useState<[string, string][]>([]);
  // Selected feature IDs (from product_features table)
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);
  // Gallery URLs state
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: adminApi.products.list,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "productCategories"],
    queryFn: adminApi.productCategories.list,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: adminApi.brands.list,
  });

  // Fetch all features for checkbox selection
  const { data: allFeatures = [] } = useQuery({
    queryKey: ["admin", "features"],
    queryFn: adminApi.features.list,
  });


  /** Client-side validation */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name?.trim()) {
      errors.name = "Tên sản phẩm là bắt buộc";
    }
    if (!form.slug?.trim()) {
      errors.slug = "Slug là bắt buộc";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      errors.slug = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang";
    }
    if (!form.category_id) {
      errors.category_id = "Vui lòng chọn danh mục";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error("Thiếu thông tin", {
        description: firstError,
      });
      return false;
    }
    return true;
  };

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Product>) => {
      // Serialize specs, features & gallery back to JSON strings
      const payload = {
        ...data,
        specifications: JSON.stringify(Object.fromEntries(specEntries.filter(([k]) => k.trim()))),
        features: JSON.stringify(selectedFeatureIds.map((id) => {
          const f = allFeatures.find((feat) => feat.id === id);
          return f?.name || "";
        }).filter(Boolean)),
        gallery_urls: JSON.stringify(galleryUrls),
        feature_ids: selectedFeatureIds,
      };
      return editId
        ? adminApi.products.update(editId, payload)
        : adminApi.products.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setFormOpen(false);
      setValidationErrors({});
      if (editId) {
        toast.success("Cập nhật thành công", {
          description: `Sản phẩm "${form.name}" đã được cập nhật.`,
        });
      } else {
        toast.success("Tạo mới thành công", {
          description: `Sản phẩm "${form.name}" đã được thêm vào hệ thống.`,
        });
      }
    },
    onError: (err: Error) => {
      const msg = err.message || "Đã xảy ra lỗi không xác định";
      if (msg.includes("Slug") && msg.includes("đã tồn tại")) {
        setValidationErrors({ slug: msg });
        toast.error("Slug trùng lặp", {
          description: msg,
        });
      } else if (msg.includes("Thiếu thông tin")) {
        toast.error("Thiếu thông tin bắt buộc", {
          description: msg,
        });
      } else {
        toast.error("Lỗi lưu sản phẩm", {
          description: msg,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.products.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      const deletedName = deleteTarget?.name || "Sản phẩm";
      setDeleteTarget(null);
      toast.success("Xóa thành công", {
        description: `"${deletedName}" đã được chuyển vào thùng rác. Bạn có thể khôi phục nếu cần.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Lỗi xóa sản phẩm", {
        description: err.message || "Không thể xóa sản phẩm. Vui lòng thử lại.",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => adminApi.products.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      toast.success("Khôi phục thành công");
    },
    onError: (err: Error) => {
      toast.error("Lỗi khôi phục", { description: err.message });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: ({ action, value }: { action: string; value?: unknown }) =>
      adminApi.products.bulk(action, Array.from(selectedIds), value),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      const count = selectedIds.size;
      setSelectedIds(new Set());
      const actionLabel = vars.action === "delete" ? "xóa" : vars.action === "update-status" ? "cập nhật trạng thái" : "đổi danh mục";
      toast.success(`Đã ${actionLabel} ${count} sản phẩm`);
    },
    onError: (err: Error) => {
      toast.error("Lỗi bulk action", { description: err.message });
    },
  });

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setSpecEntries([["", ""]]);
    setSelectedFeatureIds([]);
    setGalleryUrls([]);
    setValidationErrors({});
    setFormOpen(true);
  };

  const openEdit = (row: Product) => {
    setEditId(row.id);
    setForm({ ...row });
    setValidationErrors({});
    // Parse JSON fields
    try {
      const specs = JSON.parse(row.specifications || "{}");
      setSpecEntries(Object.entries(specs).length > 0 ? Object.entries(specs) : [["", ""]]);
    } catch {
      setSpecEntries([["", ""]]);
    }
    // Set selected feature IDs from product_features
    const pf = (row as Product & { product_features?: { id: number }[] }).product_features;
    if (pf && Array.isArray(pf)) {
      setSelectedFeatureIds(pf.map((f) => f.id));
    } else {
      setSelectedFeatureIds([]);
    }
    try {
      setGalleryUrls(JSON.parse(row.gallery_urls || "[]"));
    } catch {
      setGalleryUrls([]);
    }
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    saveMutation.mutate(form);
  };

  /** Auto-generate slug from name */
  const handleNameChange = (name: string) => {
    const updates: Partial<Product> = { ...form, name };
    // Auto-slug only when creating new (not editing) and slug hasn't been manually changed
    if (!editId && (form.slug === "" || form.slug === toSlug(form.name || ""))) {
      updates.slug = toSlug(name);
    }
    setForm(updates);
    // Clear validation error for name
    if (validationErrors.name && name.trim()) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  // Spec entries helpers
  const updateSpec = (idx: number, key: string, val: string) => {
    const next = [...specEntries];
    next[idx] = [key, val];
    setSpecEntries(next);
  };
  const addSpec = () => setSpecEntries([...specEntries, ["", ""]]);
  const removeSpec = (idx: number) => {
    if (specEntries.length <= 1) {
      setSpecEntries([["", ""]]);
      return;
    }
    setSpecEntries(specEntries.filter((_, i) => i !== idx));
  };



  const inventoryBadge = (status: string) => {
    const opt = INVENTORY_OPTIONS.find((o) => o.value === status);
    return opt ? (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${opt.color}`}>
        {opt.label}
      </span>
    ) : (
      <span className="text-xs text-muted-foreground">—</span>
    );
  };

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Sản phẩm",
      render: (r) => {
        const isDeleted = !!(r as Product & { deleted_at?: string | null }).deleted_at;
        return (
          <div className={`flex items-center gap-3 ${isDeleted ? "opacity-50" : ""}`}>
            {r.image_url && (
              <img
                src={r.image_url}
                alt={r.name}
                className="h-10 w-10 rounded object-cover"
              />
            )}
            <div>
              <p className={`font-medium ${isDeleted ? "line-through" : ""}`}>{r.name}</p>
              <p className="text-muted-foreground text-xs">
                {(r.brand_name || r.brand) && `${r.brand_name || r.brand} · `}{r.model_number || r.slug}
              </p>
              {isDeleted && (
                <span className="text-xs text-red-500 font-medium">Đã xóa</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "category_name" as keyof Product,
      header: "Danh mục",
      className: "w-32",
      render: (r) => r.category_name || "—",
    },
    {
      key: "inventory_status" as keyof Product,
      header: "Tồn kho",
      className: "w-28",
      render: (r) => inventoryBadge(r.inventory_status || "in-stock"),
    },
    { key: "sort_order", header: "Thứ tự", className: "w-20" },
    {
      key: "is_active",
      header: "Trạng thái",
      className: "w-28",
      render: (r) => {
        const isDeleted = !!(r as Product & { deleted_at?: string | null }).deleted_at;
        if (isDeleted) {
          return (
            <button
              onClick={(e) => { e.stopPropagation(); restoreMutation.mutate(r.id); }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Khôi phục
            </button>
          );
        }
        return <StatusBadge active={r.is_active} />;
      },
    },
  ];

  /** Inline error message component */
  const FieldError = ({ field }: { field: string }) => {
    const error = validationErrors[field];
    if (!error) return null;
    return <p className="text-xs text-destructive mt-1">{error}</p>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý sản phẩm B2B ELV"
        onAdd={openCreate}
      />

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
      >
        <button
          onClick={() => bulkMutation.mutate({ action: "update-status", value: "active" })}
          className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
        >
          Kích hoạt
        </button>
        <button
          onClick={() => bulkMutation.mutate({ action: "update-status", value: "draft" })}
          className="rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
        >
          Ẩn
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              bulkMutation.mutate({ action: "change-category", value: Number(e.target.value) });
              e.target.value = "";
            }
          }}
          className="rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-3 py-1 text-xs"
          defaultValue=""
        >
          <option value="" disabled>Đổi danh mục...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => {
            if (confirm(`Xóa ${selectedIds.size} sản phẩm đã chọn?`)) {
              bulkMutation.mutate({ action: "delete" });
            }
          }}
          className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
        >
          Xóa
        </button>
      </BulkActionBar>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        searchField="name"
        searchPlaceholder="Tìm theo tên sản phẩm..."
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <FormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setValidationErrors({});
        }}
        title={editId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        {/* ═══════ Section: Thông tin cơ bản ═══════ */}
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Thông tin
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tên sản phẩm" required>
              <Input
                value={form.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Camera IP 4MP Dome"
                required
                className={validationErrors.name ? "border-destructive" : ""}
              />
              <FieldError field="name" />
            </Field>
            <Field label="Slug" required>
              <Input
                value={form.slug || ""}
                onChange={(e) => {
                  setForm({ ...form, slug: e.target.value });
                  if (validationErrors.slug) {
                    setValidationErrors((prev) => {
                      const next = { ...prev };
                      delete next.slug;
                      return next;
                    });
                  }
                }}
                placeholder="camera-ip-4mp-dome"
                required
                className={validationErrors.slug ? "border-destructive" : ""}
              />
              <FieldError field="slug" />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Thương hiệu">
              <select
                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                value={form.brand_id ?? ""}
                onChange={(e) => {
                  const brandId = Number(e.target.value) || null;
                  const selected = brands.find((b: Brand) => b.id === brandId);
                  setForm({
                    ...form,
                    brand_id: brandId,
                    brand: selected?.name || "",
                  });
                }}
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((b: Brand) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Model">
              <Input
                value={form.model_number || ""}
                onChange={(e) => setForm({ ...form, model_number: e.target.value })}
                placeholder="DS-2CD2143G2-I"
              />
            </Field>
            <Field label="Danh mục" required>
              <select
                className={`border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm ${validationErrors.category_id ? "border-destructive" : ""}`}
                value={form.category_id ?? ""}
                onChange={(e) => {
                  setForm({ ...form, category_id: Number(e.target.value) || null });
                  if (validationErrors.category_id) {
                    setValidationErrors((prev) => {
                      const next = { ...prev };
                      delete next.category_id;
                      return next;
                    });
                  }
                }}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories
                  .sort((a: ProductCategory, b: ProductCategory) => {
                    const aOrder = a.parent_id ? 1000 + a.sort_order : a.sort_order;
                    const bOrder = b.parent_id ? 1000 + b.sort_order : b.sort_order;
                    return aOrder - bOrder;
                  })
                  .map((c: ProductCategory) => (
                    <option key={c.id} value={c.id}>
                      {c.parent_id ? `  └ ${c.name}` : c.name}
                    </option>
                  ))}
              </select>
              <FieldError field="category_id" />
            </Field>
          </div>

          <Field label="Mô tả">
            <Textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </Field>
        </div>

        {/* ═══════ Section: Hình ảnh ═══════ */}
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hình ảnh
          </p>
          <ImageUploadField
            label="Hình chính"
            value={form.image_url ? [form.image_url] : []}
            onChange={(urls) => setForm({ ...form, image_url: urls[0] || null })}
            folder="products"
            single
          />
          <ImageUploadField
            label="Gallery (tối đa 6 ảnh)"
            value={galleryUrls}
            onChange={(urls) => setGalleryUrls(urls)}
            folder="products"
            maxImages={6}
          />
        </div>

        {/* ═══════ Section: Thông số kỹ thuật ═══════ */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Thông số kỹ thuật
            </p>
            <button
              type="button"
              onClick={addSpec}
              className="text-xs text-primary hover:underline"
            >
              + Thêm thông số
            </button>
          </div>
          {specEntries.map(([key, val], idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={key}
                onChange={(e) => updateSpec(idx, e.target.value, val)}
                placeholder="Tên (VD: Resolution)"
                className="flex-1"
              />
              <Input
                value={val}
                onChange={(e) => updateSpec(idx, key, e.target.value)}
                placeholder="Giá trị (VD: 4MP)"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="text-xs text-destructive hover:underline px-2"
              >
                ✕
              </button>
            </div>
          ))}
          {specEntries.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              Chưa có thông số. Nhấn "+ Thêm thông số" để bắt đầu.
            </p>
          )}
        </div>

        {/* ═══════ Section: Tính năng (Searchable Multi-select) ═══════ */}
        <SearchableFeatureSelect
          features={allFeatures}
          selectedIds={selectedFeatureIds}
          onChange={setSelectedFeatureIds}
        />

        {/* ═══════ Section: B2B Data ═══════ */}
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dữ liệu B2B
          </p>
          <Field label="Datasheet PDF (URL)">
            <Input
              value={form.spec_sheet_url || ""}
              onChange={(e) => setForm({ ...form, spec_sheet_url: e.target.value || null })}
              placeholder="https://... hoặc upload PDF rồi dán link"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tình trạng kho">
              <select
                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                value={form.inventory_status || "in-stock"}
                onChange={(e) => setForm({ ...form, inventory_status: e.target.value })}
              >
                {INVENTORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bảo hành">
              <Input
                value={form.warranty || ""}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                placeholder="VD: 24 Tháng"
              />
            </Field>
          </div>
        </div>

        {/* ═══════ Section: Sort / Status ═══════ */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Thứ tự">
            <Input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) =>
                setForm({ ...form, sort_order: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Trạng thái">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.is_active ?? 1}
              onChange={(e) =>
                setForm({ ...form, is_active: Number(e.target.value) })
              }
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ẩn</option>
            </select>
          </Field>
        </div>

        {/* ═══════ Section: SEO ═══════ */}
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            SEO Metadata
          </p>
          <Field label="Meta Title">
            <Input
              value={form.meta_title || ""}
              onChange={(e) => setForm({ ...form, meta_title: e.target.value || null })}
              placeholder={form.name || "Sử dụng tên sản phẩm"}
            />
          </Field>
          <Field label="Meta Description">
            <Textarea
              value={form.meta_description || ""}
              onChange={(e) => setForm({ ...form, meta_description: e.target.value || null })}
              rows={2}
              placeholder={form.description || "Sử dụng mô tả"}
            />
          </Field>
        </div>
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title={deleteTarget?.name}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
