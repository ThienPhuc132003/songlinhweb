import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Post } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  FormDialog,
  Field,
  type Column,
} from "@/components/admin/CrudHelpers";

const defaultForm: Partial<Post> = {
  slug: "",
  title: "",
  excerpt: "",
  content_md: "",
  thumbnail_url: "",
  author: "Song Linh Technologies",
  tags: "[]",
  is_published: 0,
  published_at: null,
  meta_title: null,
  meta_description: null,
};

export default function AdminPosts() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [form, setForm] = useState<Partial<Post>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: adminApi.posts.list,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Post>) =>
      editId
        ? adminApi.posts.update(editId, data)
        : adminApi.posts.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.posts.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
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

  const openEdit = (row: Post) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<Post>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "title",
      header: "Bài viết",
      render: (r) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {r.excerpt}
          </p>
        </div>
      ),
    },
    { key: "author", header: "Tác giả", className: "w-24" },
    {
      key: "is_published",
      header: "Trạng thái",
      className: "w-28",
      render: (r) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            r.is_published
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {r.is_published ? "Đã xuất bản" : "Bản nháp"}
        </span>
      ),
    },
    {
      key: "published_at",
      header: "Ngày đăng",
      className: "w-28",
      render: (r) =>
        r.published_at
          ? new Date(r.published_at).toLocaleDateString("vi-VN")
          : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bài viết"
        description="Quản lý tin tức & blog"
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
        title={editId ? "Sửa bài viết" : "Thêm bài viết"}
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
        <Field label="Tóm tắt">
          <Textarea
            value={form.excerpt || ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
          />
        </Field>
        <Field label="Nội dung (Markdown)">
          <Textarea
            value={form.content_md || ""}
            onChange={(e) => setForm({ ...form, content_md: e.target.value })}
            rows={10}
            className="font-mono text-sm"
          />
        </Field>
        <Field label="URL Thumbnail">
          <Input
            value={form.thumbnail_url || ""}
            onChange={(e) =>
              setForm({ ...form, thumbnail_url: e.target.value })
            }
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Tác giả">
            <Input
              value={form.author || ""}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </Field>
          <Field label="Xuất bản">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.is_published ?? 0}
              onChange={(e) =>
                setForm({ ...form, is_published: Number(e.target.value) })
              }
            >
              <option value={0}>Bản nháp</option>
              <option value={1}>Xuất bản</option>
            </select>
          </Field>
          <Field label="Ngày đăng">
            <Input
              type="date"
              value={form.published_at?.split("T")[0] || ""}
              onChange={(e) =>
                setForm({ ...form, published_at: e.target.value || null })
              }
            />
          </Field>
        </div>
        <Field label="Tags (JSON array)">
          <Input
            value={form.tags || "[]"}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder='["tag1", "tag2"]'
            className="font-mono text-sm"
          />
        </Field>

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
              placeholder={form.excerpt || "Sử dụng tóm tắt"}
            />
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
