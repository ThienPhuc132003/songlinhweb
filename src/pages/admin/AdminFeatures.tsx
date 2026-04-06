import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type ProductFeature } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
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
import { ColorPickerField } from "@/components/admin/ColorPickerField";
import { IconPickerField } from "@/components/admin/IconPickerField";
import { FeatureBadge } from "@/components/ui/FeatureBadge";

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

const defaultForm: Partial<ProductFeature> = {
  name: "",
  slug: "",
  group_name: "",
  sort_order: 0,
  is_active: 1,
  color: null,
  icon: null,
  is_priority: 0,
};

export default function AdminFeatures() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductFeature | null>(null);
  const [form, setForm] = useState<Partial<ProductFeature>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "features"],
    queryFn: adminApi.features.list,
  });

  // Extract unique group names for datalist suggestions
  const existingGroups = useMemo(() => {
    const groups = new Set<string>();
    data.forEach((f) => {
      if (f.group_name) groups.add(f.group_name);
    });
    return Array.from(groups).sort();
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<ProductFeature>) =>
      editId
        ? adminApi.features.update(editId, data)
        : adminApi.features.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "features"] });
      setFormOpen(false);
      toast.success(editId ? "Cập nhật thành công" : "Tạo mới thành công", {
        description: `Tính năng "${form.name}" đã được ${editId ? "cập nhật" : "thêm"}.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Lỗi", { description: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.features.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "features"] });
      const name = deleteTarget?.name || "Tính năng";
      setDeleteTarget(null);
      toast.success("Xóa thành công", {
        description: `"${name}" đã được xóa.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Lỗi xóa", { description: err.message });
    },
  });

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const openEdit = (row: ProductFeature) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleNameChange = (name: string) => {
    const updates: Partial<ProductFeature> = { ...form, name };
    if (!editId && (form.slug === "" || form.slug === toSlug(form.name || ""))) {
      updates.slug = toSlug(name);
    }
    setForm(updates);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.slug?.trim()) {
      toast.error("Thiếu thông tin", {
        description: "Tên và Slug là bắt buộc",
      });
      return;
    }
    saveMutation.mutate(form);
  };

  const columns: Column<ProductFeature>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "name",
      header: "Tính năng",
      render: (r) => (
        <div className="flex items-center gap-3">
          <FeatureBadge
            name={r.name}
            color={r.color}
            icon={r.icon}
            size="md"
          />
          <div>
            <p className="text-xs text-muted-foreground font-mono">{r.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "group_name" as keyof ProductFeature,
      header: "Nhóm",
      className: "w-36",
      render: (r) =>
        r.group_name ? (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {r.group_name}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "is_priority" as keyof ProductFeature,
      header: "Ưu tiên",
      className: "w-20",
      render: (r) =>
        r.is_priority ? (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            ★
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "product_count" as keyof ProductFeature,
      header: "Sản phẩm",
      className: "w-24",
      render: (r) => (
        <span className="text-sm">
          {(r as ProductFeature & { product_count?: number }).product_count ?? 0}
        </span>
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
        title="Tính năng"
        description="Quản lý tags tính năng sản phẩm (PoE, 4K, IP67...)"
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
        title={editId ? "Sửa tính năng" : "Thêm tính năng"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tên tính năng" required>
            <Input
              value={form.name || ""}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: PoE, 4K Ultra HD, IP67"
              required
            />
          </Field>
          <Field label="Slug" required>
            <Input
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="poe, 4k-ultra-hd, ip67"
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nhóm">
            <Input
              value={form.group_name || ""}
              onChange={(e) => setForm({ ...form, group_name: e.target.value })}
              placeholder="VD: Kết nối, Hình ảnh, An toàn"
              list="feature-groups"
            />
            <datalist id="feature-groups">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </Field>
          <Field label="Thứ tự">
            <Input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) =>
                setForm({ ...form, sort_order: Number(e.target.value) })
              }
            />
          </Field>
        </div>

        {/* ═══════ Visual Fields ═══════ */}
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Giao diện badge
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Màu badge">
              <ColorPickerField
                value={form.color}
                onChange={(color) => setForm({ ...form, color })}
              />
            </Field>
            <Field label="Icon">
              <IconPickerField
                value={form.icon}
                onChange={(icon) => setForm({ ...form, icon })}
              />
            </Field>
          </div>

          {/* Live Preview */}
          <Field label="Xem trước">
            <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-4 py-3">
              <FeatureBadge
                name={form.name || "Tên tính năng"}
                color={form.color}
                icon={form.icon}
                size="md"
              />
              <FeatureBadge
                name={form.name || "Tên tính năng"}
                color={form.color}
                icon={form.icon}
                size="sm"
              />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ưu tiên">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.is_priority ?? 0}
              onChange={(e) =>
                setForm({ ...form, is_priority: Number(e.target.value) })
              }
            >
              <option value={0}>Không</option>
              <option value={1}>★ Ưu tiên (hiện trước)</option>
            </select>
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
      </FormDialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget.id)
        }
        title={deleteTarget?.name}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
