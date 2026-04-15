import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Brand } from "@/lib/admin-api";
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

const defaultForm: Partial<Brand> = {
  slug: "",
  name: "",
  logo_url: null,
  description: "",
  website_url: null,
  sort_order: 0,
  is_active: 1,
};

export default function AdminBrands() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [form, setForm] = useState<Partial<Brand>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: adminApi.brands.list,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Brand>) =>
      editId ? adminApi.brands.update(editId, data) : adminApi.brands.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "brands"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.brands.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "brands"] });
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

  const openEdit = (row: Brand) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<Brand>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "name",
      header: "Thương hiệu",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.logo_url ? (
            <img
              src={r.logo_url}
              alt={r.name}
              className="h-8 w-8 rounded object-contain bg-muted p-0.5"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
              {r.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">{r.name}</p>
            <p className="text-muted-foreground text-xs">{r.slug}</p>
          </div>
        </div>
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
        title="Thương hiệu"
        description="Quản lý thương hiệu (Brands) cho sản phẩm B2B ELV"
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
        title={editId ? "Sửa thương hiệu" : "Thêm thương hiệu"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tên thương hiệu" required>
            <Input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Hikvision"
              required
            />
          </Field>
          <Field label="Slug" required>
            <Input
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="hikvision"
              required
            />
          </Field>
        </div>

        <Field label="Mô tả">
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Thương hiệu camera và giải pháp an ninh hàng đầu thế giới"
          />
        </Field>

        <ImageUploadField
          label="Logo thương hiệu"
          value={form.logo_url ? [form.logo_url] : []}
          onChange={(urls) => setForm({ ...form, logo_url: urls[0] || null })}
          folder="brands"
          single
        />

        <Field label="Website">
          <Input
            value={form.website_url || ""}
            onChange={(e) => setForm({ ...form, website_url: e.target.value || null })}
            placeholder="https://www.hikvision.com"
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
              className="border-input bg-background flex h-9 w-full rounded-sm border px-3 py-1 text-sm"
              value={form.is_active ?? 1}
              onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
            >
              <option value={1}>Công khai</option>
              <option value={0}>Chờ duyệt</option>
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
