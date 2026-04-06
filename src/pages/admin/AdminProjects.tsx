import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Project } from "@/lib/admin-api";
import { toast } from "sonner";
import { Star, StarOff } from "lucide-react";
import {
  ProjectFormSheet,
  type ProjectFormData,
  defaultProjectForm,
} from "@/components/admin/ProjectFormSheet";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  BulkActionBar,
  StatusBadge,
  type Column,
} from "@/components/admin/CrudHelpers";

export default function AdminProjects() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectFormData>(defaultProjectForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: adminApi.projects.list,
  });

  // Client-side filtering
  const filteredData = data.filter((row) => {
    if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
    if (statusFilter === "active" && !row.is_active) return false;
    if (statusFilter === "hidden" && row.is_active) return false;
    return true;
  });

  // Extract unique categories from data
  const categories = [...new Set(data.map((p) => p.category).filter(Boolean))];

  const saveMutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      editId
        ? adminApi.projects.update(editId, data as Record<string, unknown>)
        : adminApi.projects.create(data as Record<string, unknown>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật dự án" : "Đã tạo dự án mới");
    },
    onError: (err: Error) => {
      const msg = err.message || "";
      // Parse D1 column errors for user-friendly messages
      const colMatch = msg.match(/has no column named (\w+)/);
      if (colMatch) {
        toast.error(`Lỗi cơ sở dữ liệu`, {
          description: `Cột "${colMatch[1]}" chưa tồn tại. Vui lòng chạy migration 0020 trước.`,
          duration: 8000,
        });
      } else if (msg.includes("UNIQUE constraint") || msg.includes("đã tồn tại")) {
        toast.error("Slug trùng lặp", {
          description: msg,
        });
      } else if (msg.includes("slug and title are required")) {
        toast.error("Thiếu thông tin bắt buộc", {
          description: "Tiêu đề và Slug là bắt buộc.",
        });
      } else {
        toast.error("Lỗi lưu dự án", {
          description: msg.length > 200 ? msg.substring(0, 200) + "..." : msg,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.projects.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      setDeleteTarget(null);
      toast.success("Đã xóa dự án");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const quickUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      adminApi.projects.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const bulkMutation = useMutation({
    mutationFn: async ({ action }: { action: string }) => {
      const ids = Array.from(selectedIds);
      const updates: Record<string, unknown> =
        action === "activate" ? { is_active: 1 }
        : action === "deactivate" ? { is_active: 0 }
        : action === "feature" ? { is_featured: 1 }
        : action === "unfeature" ? { is_featured: 0 }
        : {};

      if (action === "delete") {
        await Promise.all(ids.map((id) => adminApi.projects.delete(id)));
      } else {
        await Promise.all(ids.map((id) => adminApi.projects.update(id, updates)));
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      const count = selectedIds.size;
      setSelectedIds(new Set());
      const label =
        vars.action === "delete" ? "xóa"
        : vars.action === "activate" ? "kích hoạt"
        : vars.action === "deactivate" ? "ẩn"
        : vars.action === "feature" ? "đánh dấu nổi bật"
        : "cập nhật";
      toast.success(`Đã ${label} ${count} dự án`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditId(null);
    setForm(defaultProjectForm);
    setFormOpen(true);
  };

  const openEdit = (row: Project) => {
    setEditId(row.id);
    const images = (row as unknown as Record<string, unknown>).images as
      | Array<{ image_url: string }>
      | undefined;
    setForm({
      slug: row.slug || "",
      title: row.title || "",
      description: row.description || "",
      location: row.location || "",
      client_name: row.client_name || "",
      thumbnail_url: row.thumbnail_url || null,
      content_md: row.content_md || "",
      category: row.category || "Công trình",
      year: row.year ?? null,
      completion_year: row.completion_year || null,
      sort_order: row.sort_order ?? 0,
      is_featured: row.is_featured ?? 0,
      is_active: row.is_active ?? 1,
      // Ensure JSON fields always have safe string defaults (never null/undefined)
      system_types: row.system_types || "[]",
      brands_used: row.brands_used || "[]",
      area_sqm: row.area_sqm ?? null,
      duration_months: row.duration_months ?? null,
      key_metrics: row.key_metrics || "{}",
      compliance_standards: row.compliance_standards || "[]",
      client_industry: row.client_industry || null,
      project_scale: row.project_scale || null,
      meta_title: row.meta_title || null,
      meta_description: row.meta_description || null,
      related_solutions: row.related_solutions || "[]",
      related_products: row.related_products || "[]",
      challenges: row.challenges || null,
      outcomes: row.outcomes || null,
      testimonial_name: row.testimonial_name || null,
      testimonial_content: row.testimonial_content || null,
      video_url: row.video_url || null,
      gallery_urls: images?.map((img) => img.image_url) ?? [],
    });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Dự án",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.thumbnail_url && (
            <img
              src={r.thumbnail_url} alt={r.title}
              className="h-10 w-14 rounded border object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{r.title}</p>
            <p className="text-muted-foreground text-xs truncate">{r.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category", header: "Danh mục", className: "w-28",
      render: (r) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium">
          {r.category || "—"}
        </span>
      ),
    },
    {
      key: "client_name", header: "Khách hàng", className: "w-32",
      render: (r) => <span className="text-xs">{r.client_name || "—"}</span>,
    },
    {
      key: "completion_year", header: "Năm", className: "w-20",
      render: (r) => (
        <span className="text-xs font-mono">
          {r.completion_year || (r.year ? String(r.year) : "—")}
        </span>
      ),
    },
    {
      key: "is_featured", header: "Nổi bật", className: "w-20",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            quickUpdateMutation.mutate({
              id: r.id, data: { is_featured: r.is_featured ? 0 : 1 },
            });
          }}
          className={`inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors ${
            r.is_featured
              ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              : "text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {r.is_featured ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-4 w-4" />}
        </button>
      ),
    },
    {
      key: "is_active", header: "Trạng thái", className: "w-28",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            quickUpdateMutation.mutate({
              id: r.id, data: { is_active: r.is_active ? 0 : 1 },
            });
          }}
          className="cursor-pointer"
        >
          <StatusBadge active={r.is_active} />
        </button>
      ),
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
        <option value="active">Hoạt động</option>
        <option value="hidden">Đã ẩn</option>
      </select>
      {categories.length > 0 && (
        <select
          className="border-input bg-background rounded-md border px-2 py-1.5 text-xs"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dự án"
        description="Quản lý các dự án đã triển khai"
        onAdd={openCreate}
      />

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
      >
        <button
          onClick={() => bulkMutation.mutate({ action: "activate" })}
          className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
        >
          Kích hoạt
        </button>
        <button
          onClick={() => bulkMutation.mutate({ action: "deactivate" })}
          className="rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
        >
          Ẩn
        </button>
        <button
          onClick={() => bulkMutation.mutate({ action: "feature" })}
          className="rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200"
        >
          ⭐ Featured
        </button>
        <button
          onClick={() => {
            if (confirm(`Xóa ${selectedIds.size} dự án đã chọn?`)) {
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
        searchFields={["title", "client_name", "location", "category"] as (keyof Project)[]}
        searchPlaceholder="Tìm theo tên, khách hàng, địa điểm..."
        filterBar={filterBar}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyTitle="Chưa có dự án nào"
        emptyDescription="Thêm dự án đầu tiên vào hệ thống để bắt đầu."
      />

      <ProjectFormSheet
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
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title={deleteTarget?.title}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
