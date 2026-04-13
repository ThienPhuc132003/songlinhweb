import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Post } from "@/lib/admin-api";
import { toast } from "sonner";
import { Star, StarOff, Eye } from "lucide-react";
import {
  PostFormSheet,
  type PostFormData,
  defaultPostForm,
  POST_CATEGORIES,
  POST_STATUS_OPTIONS,
} from "@/components/admin/PostFormSheet";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  BulkActionBar,
  type Column,
} from "@/components/admin/CrudHelpers";

export default function AdminPosts() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [form, setForm] = useState<PostFormData>(defaultPostForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: adminApi.posts.list,
  });

  // Filter data client-side
  const filteredData = data.filter((post) => {
    if (statusFilter !== "all") {
      const postStatus = post.status || (post.is_published ? "published" : "draft");
      if (postStatus !== statusFilter) return false;
    }
    if (categoryFilter !== "all" && post.category !== categoryFilter) return false;
    return true;
  });

  const saveMutation = useMutation({
    mutationFn: (data: PostFormData) => {
      const payload = {
        ...data,
        tags: JSON.stringify(data.tags ?? []),
        is_published: data.status === "published" ? 1 : 0,
        references: JSON.stringify(data.references ?? []),
      };
      return editId
        ? adminApi.posts.update(editId, payload as unknown as Partial<Post>)
        : adminApi.posts.create(payload as unknown as Partial<Post>);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật tin tức" : "Đã tạo tin tức mới");
    },
    onError: (err: Error) => {
      const msg = err.message || "Unknown error";
      if (msg.includes("thiếu cột") || msg.includes("has no column")) {
        toast.error(`Lỗi Schema DB: ${msg}`, { duration: 8000 });
      } else if (msg.includes("Trùng") || msg.includes("UNIQUE")) {
        toast.error(`Slug đã tồn tại. Vui lòng chọn slug khác.`, { duration: 5000 });
      } else {
        toast.error(`Lỗi: ${msg}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.posts.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      setDeleteTarget(null);
      toast.success("Đã xóa tin tức");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const quickUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
      adminApi.posts.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ action }: { action: string }) =>
      adminApi.posts.bulk(action, Array.from(selectedIds)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      const count = selectedIds.size;
      setSelectedIds(new Set());
      const actionLabel =
        vars.action === "delete"
          ? "xóa"
          : vars.action === "publish"
            ? "công khai"
            : vars.action === "draft"
              ? "chờ duyệt"
              : "cập nhật";
      toast.success(`Đã ${actionLabel} ${count} bài viết`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditId(null);
    setForm(defaultPostForm);
    setFormOpen(true);
  };

  const openEdit = (row: Post) => {
    setEditId(row.id);
    let parsedTags: string[] = [];
    try {
      parsedTags =
        typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : row.tags ?? [];
    } catch {
      parsedTags = [];
    }
    let parsedRefs: Array<{ title: string; url: string; type: 'law' | 'standard' | 'news' | 'vendor' }> = [];
    try {
      const refsRaw = row.references;
      if (typeof refsRaw === 'string') {
        parsedRefs = JSON.parse(refsRaw || '[]');
      } else if (Array.isArray(refsRaw)) {
        parsedRefs = refsRaw as typeof parsedRefs;
      }
    } catch { parsedRefs = []; }
    setForm({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content_md: row.content_md,
      thumbnail_url: row.thumbnail_url,
      author: row.author,
      tags: parsedTags,
      status: row.status || (row.is_published ? "published" : "draft"),
      category: row.category || "general",
      is_featured: row.is_featured ?? 0,
      published_at: row.published_at,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      reviewed_by: row.reviewed_by ?? null,
      references: parsedRefs,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const getStatusBadge = (row: Post) => {
    const status = row.status || (row.is_published ? "published" : "draft");
    const opt = POST_STATUS_OPTIONS.find((o) => o.value === status);
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${opt?.color || "bg-slate-100 text-slate-500"}`}
      >
        {opt?.label || status}
      </span>
    );
  };

  const getCategoryLabel = (cat: string) => {
    return POST_CATEGORIES.find((c) => c.value === cat)?.label || cat;
  };

  const columns: Column<Post>[] = [
    {
      key: "title",
      header: "Tin tức",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.thumbnail_url && (
            <img
              src={r.thumbnail_url}
              alt={r.title}
              className="h-10 w-14 rounded border object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{r.title}</p>
            <p className="text-muted-foreground line-clamp-1 text-xs">
              {r.excerpt}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      className: "w-28",
      render: (r) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium">
          {getCategoryLabel(r.category || "general")}
        </span>
      ),
    },
    {
      key: "author",
      header: "Chuyên gia phụ trách",
      className: "w-32",
      render: (r) => <span className="text-xs">{r.author}</span>,
    },
    {
      key: "view_count",
      header: "Views",
      className: "w-20",
      render: (r) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {r.view_count ?? 0}
        </span>
      ),
    },
    {
      key: "is_featured",
      header: "Nổi bật",
      className: "w-20",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            quickUpdateMutation.mutate({
              id: r.id,
              data: { is_featured: r.is_featured ? 0 : 1 },
            });
          }}
          className={`inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors ${
            r.is_featured
              ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              : "text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {r.is_featured ? (
            <Star className="h-5 w-5 fill-current" />
          ) : (
            <StarOff className="h-4 w-4" />
          )}
        </button>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "w-28",
      render: (r) => getStatusBadge(r),
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

  const filterBar = (
    <div className="flex items-center gap-2">
      <select
        className="border-input bg-background rounded-md border px-2 py-1.5 text-xs"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">Tất cả trạng thái</option>
        {POST_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        className="border-input bg-background rounded-md border px-2 py-1.5 text-xs"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">Tất cả danh mục</option>
        {POST_CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tin tức & Kiến thức"
        description="Quản lý nội dung chuyên môn & tin tức doanh nghiệp"
        onAdd={openCreate}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
      >
        <button
          onClick={() => bulkMutation.mutate({ action: "publish" })}
          className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
        >
          Công khai
        </button>
        <button
          onClick={() => bulkMutation.mutate({ action: "draft" })}
          className="rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
        >
          Chờ duyệt
        </button>
        <button
          onClick={() => bulkMutation.mutate({ action: "feature" })}
          className="rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200"
        >
          ⭐ Featured
        </button>
        <button
          onClick={() => {
            if (confirm(`Xóa ${selectedIds.size} tin tức đã chọn?`)) {
              bulkMutation.mutate({ action: "delete" });
            }
          }}
          className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
        >
          Xóa
        </button>
      </BulkActionBar>

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        searchField="title"
        searchPlaceholder="Tìm theo tiêu đề..."
        filterBar={filterBar}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <PostFormSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editId={editId}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      />

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget.id)
        }
        title={deleteTarget?.title}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
