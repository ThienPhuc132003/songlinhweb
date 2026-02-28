import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Partner } from "@/lib/admin-api";
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

const defaultForm: Partial<Partner> = {
  name: "",
  logo_url: "",
  website_url: "",
  sort_order: 0,
  is_active: 1,
};

export default function AdminPartners() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [form, setForm] = useState<Partial<Partner>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "partners"],
    queryFn: adminApi.partners.list,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Partner>) =>
      editId
        ? adminApi.partners.update(editId, data)
        : adminApi.partners.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      setFormOpen(false);
      toast.success(editId ? "Đã cập nhật" : "Đã tạo mới");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.partners.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
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

  const openEdit = (row: Partner) => {
    setEditId(row.id);
    setForm({ ...row });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const columns: Column<Partner>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "name",
      header: "Đối tác",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.logo_url && (
            <img
              src={r.logo_url}
              alt={r.name}
              className="h-8 w-12 object-contain"
            />
          )}
          <span className="font-medium">{r.name}</span>
        </div>
      ),
    },
    {
      key: "website_url",
      header: "Website",
      render: (r) =>
        r.website_url ? (
          <a
            href={r.website_url}
            target="_blank"
            rel="noreferrer"
            className="text-primary text-sm hover:underline"
          >
            {new URL(r.website_url).hostname}
          </a>
        ) : (
          "—"
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
        title="Đối tác"
        description="Quản lý danh sách đối tác & khách hàng"
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
        title={editId ? "Sửa đối tác" : "Thêm đối tác"}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        <Field label="Tên đối tác" required>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <Field label="URL Logo">
          <Input
            value={form.logo_url || ""}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          />
        </Field>
        <Field label="Website">
          <Input
            value={form.website_url || ""}
            onChange={(e) => setForm({ ...form, website_url: e.target.value })}
            placeholder="https://..."
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
        title={deleteTarget?.name}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
