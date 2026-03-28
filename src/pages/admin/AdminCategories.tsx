import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type ProductCategory } from "@/lib/admin-api";
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

const defaultForm: Partial<ProductCategory> = {
  slug: "",
  name: "",
  description: "",
  image_url: null,
  parent_id: null,
  sort_order: 0,
  is_active: 1,
};

export default function AdminCategories() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductCategory | null>(null);
  const [form, setForm] = useState<Partial<ProductCategory>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "productCategories"],
    queryFn: adminApi.productCategories.list,
  });

  // Only root categories as parent options (no deep nesting)
  const rootCategories = data.filter(
    (c) => !c.parent_id && c.id !== editId,
  );

  const saveMutation = useMutation({
    mutationFn: (data: Partial<ProductCategory>) =>
      editId
        ? adminApi.productCategories.update(editId, data)
        : adminApi.productCategories.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "productCategories"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.productCategories.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "productCategories"] });
      setDeleteTarget(null);
      toast.success("Đã xóa");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const openEdit = (row: ProductCategory) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  // Sort: roots first, then children under their parent
  const sortedData = [...data].sort((a, b) => {
    const aRoot = a.parent_id ? data.find((c) => c.id === a.parent_id)?.sort_order ?? 0 : a.sort_order;
    const bRoot = b.parent_id ? data.find((c) => c.id === b.parent_id)?.sort_order ?? 0 : b.sort_order;
    if (aRoot !== bRoot) return aRoot - bRoot;
    if (a.parent_id && !b.parent_id) return 1;
    if (!a.parent_id && b.parent_id) return -1;
    return a.sort_order - b.sort_order;
  });

  const columns: Column<ProductCategory & { product_count?: number; parent_name?: string }>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "name",
      header: "Danh mục",
      render: (r) => (
        <div className={r.parent_id ? "pl-6" : ""}>
          <p className="font-medium">
            {r.parent_id && <span className="mr-1 text-muted-foreground">└</span>}
            {r.name}
          </p>
          <p className="text-xs text-muted-foreground">{r.slug}</p>
        </div>
      ),
    },
    {
      key: "parent_id" as keyof ProductCategory,
      header: "Cha",
      className: "w-32",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {(r as ProductCategory & { parent_name?: string }).parent_name || "—"}
        </span>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      className: "max-w-xs",
      render: (r) => (
        <p className="truncate text-sm text-muted-foreground">{r.description || "—"}</p>
      ),
    },
    {
      key: "sort_order",
      header: "SP",
      className: "w-16",
      render: (r) => (
        <span className="text-sm">{(r as ProductCategory & { product_count?: number }).product_count ?? 0}</span>
      ),
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
        title="Danh mục sản phẩm"
        description="Quản lý danh mục phân loại sản phẩm ELV (hỗ trợ phân cấp cha-con)"
        onAdd={openCreate}
      />

      <DataTable
        data={sortedData}
        columns={columns}
        isLoading={isLoading}
        searchField="name"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Sửa danh mục" : "Thêm danh mục"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tên danh mục" required>
            <Input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Camera giám sát"
              required
            />
          </Field>
          <Field label="Slug" required>
            <Input
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="camera-giam-sat"
              required
            />
          </Field>
        </div>

        <Field label="Danh mục cha">
          <select
            className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
            value={form.parent_id ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                parent_id: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">— Không (gốc) —</option>
            {rootCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Mô tả">
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Camera IP, Analog, PTZ, NVR/DVR cho hệ thống an ninh"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Thứ tự">
            <Input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </Field>
          <Field label="Trạng thái">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.is_active ?? 1}
              onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ẩn</option>
            </select>
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
