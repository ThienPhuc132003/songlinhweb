import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type GalleryAlbum } from "@/lib/admin-api";
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

const defaultForm: Partial<GalleryAlbum> = {
  slug: "",
  title: "",
  cover_url: "",
  sort_order: 0,
  is_active: 1,
};

export default function AdminGallery() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryAlbum | null>(null);
  const [form, setForm] = useState<Partial<GalleryAlbum>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: adminApi.gallery.albums,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<GalleryAlbum>) =>
      editId
        ? adminApi.gallery.updateAlbum(editId, data)
        : adminApi.gallery.createAlbum(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.gallery.deleteAlbum(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
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

  const openEdit = (row: GalleryAlbum) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<GalleryAlbum>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "title",
      header: "Album",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.cover_url && (
            <img
              src={r.cover_url}
              alt={r.title}
              className="h-10 w-14 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium">{r.title}</p>
            <p className="text-muted-foreground text-xs">{r.slug}</p>
          </div>
        </div>
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
        title="Thư viện ảnh"
        description="Quản lý album và hình ảnh"
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
        title={editId ? "Sửa album" : "Thêm album"}
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
        <Field label="URL Ảnh bìa">
          <Input
            value={form.cover_url || ""}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
          />
        </Field>
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
