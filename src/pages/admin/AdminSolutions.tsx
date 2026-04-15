import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Solution } from "@/lib/admin-api";
import { toast } from "sonner";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  StatusBadge,
  type Column,
} from "@/components/admin/CrudHelpers";
import {
  SolutionFormSheet,
  defaultSolutionForm,
  type SolutionFormData,
} from "@/components/admin/SolutionFormSheet";
import { SolutionIconBadge } from "@/components/ui/SolutionIcon";

export default function AdminSolutions() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Solution | null>(null);
  const [form, setForm] = useState<SolutionFormData>(defaultSolutionForm);
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
    setForm(defaultSolutionForm);
    setFormOpen(true);
  };

  const openEdit = (row: Solution) => {
    setEditId(row.id);
    setForm({
      slug: row.slug,
      title: row.title,
      description: row.description,
      excerpt: row.excerpt ?? "",
      content_md: row.content_md,
      icon: row.icon,
      hero_image_url: row.hero_image_url,
      features: row.features ?? "[]",
      applications: row.applications ?? "[]",
      sort_order: row.sort_order,
      is_active: row.is_active,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form as Partial<Solution>);
  };

  const columns: Column<Solution>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "title",
      header: "Tiêu đề",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <SolutionIconBadge name={r.icon} size="sm" />
          <div>
            <p className="font-medium">{r.title}</p>
            <p className="text-muted-foreground text-xs">{r.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "excerpt",
      header: "Tóm tắt",
      render: (r) => (
        <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
          {r.excerpt || r.description || "—"}
        </p>
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
        title="Giải pháp"
        description="Quản lý các giải pháp công nghệ — CMS động"
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

      {/* Form Sheet — Wide tabbed editor */}
      <SolutionFormSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editId={editId}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      />

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
