import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Project } from "@/lib/admin-api";
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

const defaultForm: Partial<Project> = {
  slug: "",
  title: "",
  description: "",
  location: "",
  client_name: "",
  thumbnail_url: "",
  content_md: "",
  category: "Công trình",
  year: null,
  sort_order: 0,
  is_featured: 0,
  is_active: 1,
};

export default function AdminProjects() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: adminApi.projects.list,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Project>) =>
      editId
        ? adminApi.projects.update(editId, data)
        : adminApi.projects.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.projects.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
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

  const openEdit = (row: Project) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<Project>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "title",
      header: "Dự án",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.thumbnail_url && (
            <img
              src={r.thumbnail_url}
              alt={r.title}
              className="h-10 w-14 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium">{r.title}</p>
            <p className="text-muted-foreground text-xs">{r.location}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Danh mục", className: "w-28" },
    {
      key: "is_featured",
      header: "Nổi bật",
      className: "w-24",
      render: (r) => (
        <span
          className={`text-xs ${r.is_featured ? "text-yellow-600" : "text-slate-400"}`}
        >
          {r.is_featured ? "★ Có" : "—"}
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
        title="Dự án"
        description="Quản lý các dự án đã triển khai"
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

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Sửa dự án" : "Thêm dự án"}
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
        <div className="grid grid-cols-3 gap-4">
          <Field label="Địa điểm">
            <Input
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Khách hàng">
            <Input
              value={form.client_name || ""}
              onChange={(e) =>
                setForm({ ...form, client_name: e.target.value })
              }
            />
          </Field>
          <Field label="Năm">
            <Input
              type="number"
              value={form.year ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  year: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </Field>
        </div>
        <Field label="URL Thumbnail">
          <Input
            value={form.thumbnail_url || ""}
            onChange={(e) =>
              setForm({ ...form, thumbnail_url: e.target.value })
            }
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
          <Field label="Danh mục">
            <Input
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
          <Field label="Nổi bật">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.is_featured ?? 0}
              onChange={(e) =>
                setForm({ ...form, is_featured: Number(e.target.value) })
              }
            >
              <option value={0}>Không</option>
              <option value={1}>Có</option>
            </select>
          </Field>
        </div>
      </FormDialog>

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
