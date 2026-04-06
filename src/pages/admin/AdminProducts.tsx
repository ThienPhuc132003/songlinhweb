import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Product, type ProductCategory, type Brand, type ProductFeature } from "@/lib/admin-api";
import { toast } from "sonner";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  StatusBadge,
  BulkActionBar,
  type Column,
} from "@/components/admin/CrudHelpers";
import { ProductFormSheet } from "@/components/admin/ProductFormSheet";

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
        searchFields={["name", "brand", "model_number", "slug"] as (keyof Product)[]}
        searchPlaceholder="Tìm theo tên, thương hiệu, model..."
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyTitle="Chưa có sản phẩm nào"
        emptyDescription="Thêm sản phẩm đầu tiên vào hệ thống để bắt đầu quản lý."
      />

      <ProductFormSheet
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setValidationErrors({});
        }}
        editId={editId}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
        onNameChange={handleNameChange}
        specEntries={specEntries}
        onSpecChange={updateSpec}
        onSpecAdd={addSpec}
        onSpecRemove={removeSpec}
        galleryUrls={galleryUrls}
        onGalleryChange={setGalleryUrls}
        selectedFeatureIds={selectedFeatureIds}
        onFeatureIdsChange={setSelectedFeatureIds}
        allFeatures={allFeatures}
        categories={categories}
        brands={brands}
        validationErrors={validationErrors}
      />

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
