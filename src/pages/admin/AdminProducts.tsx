import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Product, type ProductCategory, type Brand } from "@/lib/admin-api";
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
  type Column,
} from "@/components/admin/CrudHelpers";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const defaultForm: Partial<Product> = {
  slug: "",
  name: "",
  description: "",
  category_id: null,
  brand: "",
  model_number: "",
  image_url: null,
  spec_sheet_url: null,
  specifications: "{}",
  features: "[]",
  sort_order: 0,
  is_active: 1,
  meta_title: null,
  meta_description: null,
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  // Specs editor state (key-value pairs)
  const [specEntries, setSpecEntries] = useState<[string, string][]>([]);
  // Features editor state (tag list)
  const [featureList, setFeatureList] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

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

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Product>) => {
      // Serialize specs & features back to JSON strings
      const payload = {
        ...data,
        specifications: JSON.stringify(Object.fromEntries(specEntries.filter(([k]) => k.trim()))),
        features: JSON.stringify(featureList.filter((f) => f.trim())),
      };
      return editId
        ? adminApi.products.update(editId, payload)
        : adminApi.products.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.products.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      setDeleteTarget(null);
      toast.success("Đã xóa");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setSpecEntries([["", ""]]);
    setFeatureList([]);
    setFormOpen(true);
  };

  const openEdit = (row: Product) => {
    setEditId(row.id);
    setForm({ ...row });
    // Parse JSON fields
    try {
      const specs = JSON.parse(row.specifications || "{}");
      setSpecEntries(Object.entries(specs).length > 0 ? Object.entries(specs) : [["", ""]]);
    } catch {
      setSpecEntries([["", ""]]);
    }
    try {
      setFeatureList(JSON.parse(row.features || "[]"));
    } catch {
      setFeatureList([]);
    }
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  // Spec entries helpers
  const updateSpec = (idx: number, key: string, val: string) => {
    const next = [...specEntries];
    next[idx] = [key, val];
    setSpecEntries(next);
  };
  const addSpec = () => setSpecEntries([...specEntries, ["", ""]]);
  const removeSpec = (idx: number) => setSpecEntries(specEntries.filter((_, i) => i !== idx));

  // Feature helpers
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatureList([...featureList, newFeature.trim()]);
      setNewFeature("");
    }
  };
  const removeFeature = (idx: number) => setFeatureList(featureList.filter((_, i) => i !== idx));

  const columns: Column<Product>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "name",
      header: "Sản phẩm",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.image_url && (
            <img
              src={r.image_url}
              alt={r.name}
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium">{r.name}</p>
            <p className="text-muted-foreground text-xs">
              {r.brand && `${r.brand} · `}{r.model_number || r.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category_name" as keyof Product,
      header: "Danh mục",
      className: "w-32",
      render: (r) => r.category_name || "—",
    },
    { key: "sort_order", header: "Thứ tự", className: "w-20" },
    {
      key: "is_active",
      header: "Trạng thái",
      className: "w-28",
      render: (r) => <StatusBadge active={r.is_active} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý sản phẩm B2B ELV"
        onAdd={openCreate}
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        searchField="name"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tên sản phẩm" required>
            <Input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Slug" required>
            <Input
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Thương hiệu">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.brand || ""}
              onChange={(e) => {
                const selected = brands.find((b: Brand) => b.name === e.target.value);
                setForm({ ...form, brand: e.target.value || "" });
                if (selected) {
                  // Also populate brand text field for backward compatibility
                }
              }}
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((b: Brand) => (
                <option key={b.id} value={b.name}>
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
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.category_id ?? ""}
              onChange={(e) =>
                setForm({ ...form, category_id: Number(e.target.value) || null })
              }
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
          </Field>
        </div>

        <Field label="Mô tả">
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </Field>

        {/* Image */}
        <ImageUploadField
          label="Hình sản phẩm"
          value={form.image_url ? [form.image_url] : []}
          onChange={(urls) => setForm({ ...form, image_url: urls[0] || null })}
          folder="products"
          single
        />

        {/* Datasheet URL */}
        <Field label="Datasheet PDF (URL)">
          <Input
            value={form.spec_sheet_url || ""}
            onChange={(e) => setForm({ ...form, spec_sheet_url: e.target.value || null })}
            placeholder="https://... hoặc upload PDF rồi dán link"
          />
        </Field>

        {/* Specifications (key-value editor) */}
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
        </div>

        {/* Features (tag input) */}
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tính năng
          </p>
          <div className="flex flex-wrap gap-2">
            {featureList.map((f, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {f}
                <button type="button" onClick={() => removeFeature(idx)} className="hover:text-destructive">
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="VD: IP67, PoE, AI Detection"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="flex-1"
            />
            <button
              type="button"
              onClick={addFeature}
              className="text-xs text-primary hover:underline px-3"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Sort / Status */}
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

        {/* SEO Meta */}
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
