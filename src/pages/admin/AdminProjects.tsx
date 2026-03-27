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

const SYSTEM_OPTIONS = [
  "CCTV",
  "Access Control",
  "PA System",
  "PCCC",
  "LAN/WAN",
  "BMS",
  "Điện nhẹ",
  "Intercom",
  "Báo trộm",
  "Server/Storage",
  "Tổng đài",
  "Parking",
];

const BRAND_OPTIONS = [
  "Hikvision",
  "Dahua",
  "Hanwha Techwin",
  "Axis",
  "Honeywell",
  "Bosch",
  "TOA",
  "ZKTeco",
  "LS Cable",
  "Legrand",
  "Cisco",
  "HPE",
];

const INDUSTRY_OPTIONS = [
  { value: "banking", label: "Ngân hàng / Tài chính" },
  { value: "hospitality", label: "Khách sạn / Du lịch" },
  { value: "government", label: "Chính phủ / Công" },
  { value: "industrial", label: "Khu công nghiệp" },
  { value: "education", label: "Giáo dục" },
  { value: "healthcare", label: "Y tế" },
  { value: "retail", label: "Bán lẻ / TTTM" },
  { value: "office", label: "Văn phòng / Cao ốc" },
  { value: "residential", label: "Chung cư / Dân cư" },
];

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
  system_types: "[]",
  brands_used: "[]",
  area_sqm: null,
  duration_months: null,
  key_metrics: "{}",
  compliance_standards: "[]",
  client_industry: null,
  project_scale: null,
  meta_title: null,
  meta_description: null,
};

/** Toggle an item in a JSON array string */
function toggleJsonArray(jsonStr: string, item: string): string {
  try {
    const arr: string[] = JSON.parse(jsonStr || "[]");
    const idx = arr.indexOf(item);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(item);
    return JSON.stringify(arr);
  } catch {
    return JSON.stringify([item]);
  }
}

/** Parse JSON array string safely */
function parseArr(jsonStr: string | undefined): string[] {
  try {
    return JSON.parse(jsonStr || "[]");
  } catch {
    return [];
  }
}

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
      key: "client_industry",
      header: "Ngành",
      className: "w-28",
      render: (r) => (
        <span className="text-xs capitalize">
          {r.client_industry || "—"}
        </span>
      ),
    },
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

  const selectedSystems = parseArr(form.system_types);
  const selectedBrands = parseArr(form.brands_used);

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
        {/* Basic Info */}
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

        {/* Location & Client */}
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

        {/* Category & Meta */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Danh mục">
            <Input
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Field>
          <Field label="Ngành khách hàng">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.client_industry ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  client_industry: e.target.value || null,
                })
              }
            >
              <option value="">— Chọn ngành —</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quy mô">
            <select
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              value={form.project_scale ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  project_scale: e.target.value || null,
                })
              }
            >
              <option value="">— Chọn —</option>
              <option value="small">Nhỏ (&lt;500m²)</option>
              <option value="medium">Vừa (500–5000m²)</option>
              <option value="large">Lớn (&gt;5000m²)</option>
            </select>
          </Field>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Field label="Diện tích (m²)">
            <Input
              type="number"
              value={form.area_sqm ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  area_sqm: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </Field>
          <Field label="Thời gian (tháng)">
            <Input
              type="number"
              value={form.duration_months ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration_months: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
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

        {/* System Types — checkbox grid */}
        <Field label="Hệ thống triển khai">
          <div className="flex flex-wrap gap-2">
            {SYSTEM_OPTIONS.map((sys) => (
              <label
                key={sys}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedSystems.includes(sys)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedSystems.includes(sys)}
                  onChange={() =>
                    setForm({
                      ...form,
                      system_types: toggleJsonArray(
                        form.system_types || "[]",
                        sys,
                      ),
                    })
                  }
                />
                {sys}
              </label>
            ))}
          </div>
        </Field>

        {/* Brands Used — checkbox grid */}
        <Field label="Thương hiệu sử dụng">
          <div className="flex flex-wrap gap-2">
            {BRAND_OPTIONS.map((brand) => (
              <label
                key={brand}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedBrands.includes(brand)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedBrands.includes(brand)}
                  onChange={() =>
                    setForm({
                      ...form,
                      brands_used: toggleJsonArray(
                        form.brands_used || "[]",
                        brand,
                      ),
                    })
                  }
                />
                {brand}
              </label>
            ))}
          </div>
        </Field>

        {/* Key Metrics — JSON editor */}
        <Field label="Key Metrics (JSON)">
          <Textarea
            value={form.key_metrics || "{}"}
            onChange={(e) => setForm({ ...form, key_metrics: e.target.value })}
            rows={3}
            className="font-mono text-sm"
            placeholder='{"cameras": 120, "access_points": 50, "floors": 12}'
          />
        </Field>

        {/* Compliance Standards — comma separated input */}
        <Field label="Tiêu chuẩn tuân thủ (phân cách bởi dấu phẩy)">
          <Input
            value={parseArr(form.compliance_standards).join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                compliance_standards: JSON.stringify(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                ),
              })
            }
            placeholder="TCVN 7336:2003, ONVIF Profile S, ISO 14001"
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
              placeholder={form.description || "Sử dụng mô tả"}
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
