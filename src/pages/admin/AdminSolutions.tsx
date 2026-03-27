import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Solution } from "@/lib/admin-api";
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

const defaultForm: Partial<Solution> = {
  slug: "",
  title: "",
  description: "",
  content_md: "",
  icon: "FileCheck",
  hero_image_url: null,
  sort_order: 0,
  is_active: 1,
  meta_title: null,
  meta_description: null,
};

export default function AdminSolutions() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Solution | null>(null);
  const [form, setForm] = useState<Partial<Solution>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "solutions"],
    queryFn: adminApi.solutions.list,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Solution>) =>
      editId
        ? adminApi.solutions.update(editId, data)
        : adminApi.solutions.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "solutions"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.solutions.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "solutions"] });
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

  const openEdit = (row: Solution) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<Solution>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "title",
      header: "Tiêu đề",
      render: (r) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-muted-foreground text-xs">{r.slug}</p>
        </div>
      ),
    },
    { key: "icon", header: "Icon", className: "w-24" },
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
        title="Giải pháp"
        description="Quản lý các giải pháp công nghệ"
        onAdd={openCreate}
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        searchField="title"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      {/* Form Dialog */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Sửa giải pháp" : "Thêm giải pháp"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tiêu đề" required>
            <Input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
        <Field label="Mô tả">
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </Field>
        <Field label="Nội dung (Markdown)">
          <Textarea
            value={form.content_md || ""}
            onChange={(e) => setForm({ ...form, content_md: e.target.value })}
            rows={8}
            className="font-mono text-sm"
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Icon">
            <Input
              value={form.icon || ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
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

        {/* Hero Image */}
        <ImageUploadField
          label="Ảnh Hero"
          value={form.hero_image_url ? [form.hero_image_url] : []}
          onChange={(urls) => setForm({ ...form, hero_image_url: urls[0] || null })}
          folder="solutions"
          single
        />

        {/* SEO Meta */}
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO Metadata</p>
          <Field label="Meta Title">
            <Input
              value={form.meta_title || ""}
              onChange={(e) => setForm({ ...form, meta_title: e.target.value || null })}
              placeholder={form.title || "Sử dụng tiêu đề"}
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

      {/* Delete confirm */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title={deleteTarget?.title}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
