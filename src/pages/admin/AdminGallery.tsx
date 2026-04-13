import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type GalleryAlbum, type GalleryImage } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  FormSheet,
  Field,
  StatusBadge,
  type Column,
} from "@/components/admin/CrudHelpers";
import { GalleryDropzone } from "@/components/admin/GalleryDropzone";
import { GalleryImageGrid } from "@/components/admin/GalleryImageGrid";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Layers } from "lucide-react";

/* ═══ Category Config ═══ */
const CATEGORIES = [
  { value: "general", label: "Chung" },
  { value: "du-an", label: "Dự án" },
  { value: "ky-thuat", label: "Kỹ thuật thi công" },
  { value: "hoat-dong", label: "Hoạt động" },
] as const;

const categoryLabel = (val: string) =>
  CATEGORIES.find((c) => c.value === val)?.label ?? val;

const categoryColor = (val: string) => {
  switch (val) {
    case "du-an": return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
    case "ky-thuat": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "hoat-dong": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
};

/* ═══ Default Form ═══ */
const defaultForm: Partial<GalleryAlbum> = {
  slug: "",
  title: "",
  cover_url: "",
  description: "",
  category: "general",
  sort_order: 0,
  is_active: 1,
};

export default function AdminGallery() {
  const qc = useQueryClient();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryAlbum | null>(null);
  const [form, setForm] = useState<Partial<GalleryAlbum>>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [albumImages, setAlbumImages] = useState<GalleryImage[]>([]);

  /* ─── Queries ─── */
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: adminApi.gallery.albums,
  });

  // Fetch album detail when editing
  const fetchAlbumDetail = useCallback(async (id: number) => {
    try {
      const detail = await adminApi.gallery.albumDetail(id);
      setAlbumImages(detail.images ?? []);
    } catch {
      setAlbumImages([]);
    }
  }, []);

  /* ─── Mutations ─── */
  const saveMutation = useMutation({
    mutationFn: (data: Partial<GalleryAlbum>) =>
      editId
        ? adminApi.gallery.updateAlbum(editId, data)
        : adminApi.gallery.createAlbum(data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      if (!editId && result?.id) {
        // After creating, switch to edit mode
        setEditId(result.id);
        setAlbumImages([]);
        toast.success("Đã tạo album — bạn có thể upload ảnh ngay");
      } else {
        toast.success("Đã cập nhật album");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.gallery.deleteAlbum(id, true),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      setDeleteTarget(null);
      toast.success("Đã xóa album và tất cả ảnh");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const setCoverMutation = useMutation({
    mutationFn: ({ albumId, imageUrl }: { albumId: number; imageUrl: string }) =>
      adminApi.gallery.setCover(albumId, imageUrl),
    onSuccess: (_, vars) => {
      setForm((f) => ({ ...f, cover_url: vars.imageUrl }));
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Đã cập nhật ảnh bìa");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      adminApi.gallery.reorderImages(items),
    onSuccess: () => {
      if (editId) fetchAlbumDetail(editId);
      toast.success("Đã sắp xếp lại");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: number) => adminApi.gallery.deleteImage(id),
    onSuccess: () => {
      if (editId) fetchAlbumDetail(editId);
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Đã xóa ảnh");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => adminApi.gallery.bulkDeleteImages(ids),
    onSuccess: () => {
      if (editId) fetchAlbumDetail(editId);
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Đã xóa ảnh đã chọn");
    },
  });

  const updateCaptionMutation = useMutation({
    mutationFn: ({ id, caption }: { id: number; caption: string }) =>
      adminApi.gallery.updateImage(id, { caption }),
    onSuccess: () => {
      if (editId) fetchAlbumDetail(editId);
    },
  });

  /* ─── Handlers ─── */
  const openCreate = async () => {
    const draftTitle = `Album mới ${new Date().toLocaleDateString("vi-VN")}`;
    const draftSlug = autoSlug(draftTitle);
    const draftData: Partial<GalleryAlbum> = {
      ...defaultForm,
      title: draftTitle,
      slug: draftSlug,
    };
    setForm(draftData);
    setAlbumImages([]);
    setWorkspaceOpen(true);

    // Auto-create draft in DB so images can be uploaded immediately
    try {
      const result = await adminApi.gallery.createAlbum(draftData);
      if (result?.id) {
        setEditId(result.id);
        qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
        toast.success("Album đã tạo — bạn có thể upload ảnh ngay");
      }
    } catch (error) {
      toast.error("Không thể tạo album. Hãy điền thông tin rồi nhấn Lưu.");
      setEditId(null);
    }
  };

  const openEdit = (row: GalleryAlbum) => {
    setEditId(row.id);
    setForm({ ...row });
    setAlbumImages([]);
    setWorkspaceOpen(true);
    fetchAlbumDetail(row.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const handleUploadComplete = useCallback(
    async (urls: Array<{ image_url: string; caption: string }>) => {
      if (!editId) return;
      try {
        await adminApi.gallery.addImagesBatch(
          editId,
          urls.map((u, i) => ({
            image_url: u.image_url,
            caption: u.caption,
            sort_order: albumImages.length + i,
          })),
        );
        fetchAlbumDetail(editId);
        qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
        toast.success(`${urls.length} ảnh đã được thêm`);
      } catch (error) {
        toast.error("Lỗi khi lưu ảnh vào album");
      }
    },
    [editId, albumImages.length, fetchAlbumDetail, qc],
  );

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  /* ─── Table Columns ─── */
  const columns: Column<GalleryAlbum>[] = [
    { key: "id", header: "ID", className: "w-14" },
    {
      key: "title",
      header: "Album",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.cover_url ? (
            <img
              src={r.cover_url}
              alt={r.title}
              className="h-10 w-14 rounded object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
              <ImageIcon className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <div>
            <p className="font-medium">{r.title}</p>
            <p className="text-muted-foreground text-xs">{r.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      className: "w-36",
      render: (r) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor(r.category)}`}>
          {categoryLabel(r.category)}
        </span>
      ),
    },
    {
      key: "image_count",
      header: "Ảnh",
      className: "w-20",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>{r.image_count ?? 0}</span>
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
        description="Quản lý album và hình ảnh — Drag & drop, multi-upload, WebP tự động"
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

      {/* ═══ Album Workspace (Full-screen Sheet) ═══ */}
      <FormSheet
        open={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
        title={editId ? "Chỉnh sửa album" : "Tạo album mới"}
        subtitle={editId ? form.title : undefined}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
        submitLabel="Lưu album"
      >
        <div className="flex h-full">
          {/* ─── Left Panel: Album Info ─── */}
          <div className="w-[340px] shrink-0 border-r border-slate-200 dark:border-slate-800 p-5 space-y-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Thông tin album
            </h3>

            <Field label="Tiêu đề" required>
              <Input
                value={form.title || ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: editId ? f.slug : autoSlug(title),
                  }));
                }}
                required
                placeholder="VD: Thi công Data Center HDBank"
              />
            </Field>

            <Field label="Slug" required>
              <Input
                value={form.slug || ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                className="font-mono text-xs"
              />
            </Field>

            <Field label="Mô tả">
              <textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-y"
                placeholder="Mô tả ngắn về album..."
              />
            </Field>

            <Field label="Danh mục">
              <select
                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                value={form.category ?? "general"}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
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
                  <option value={1}>Công khai</option>
                  <option value={0}>Chờ duyệt</option>
                </select>
              </Field>
            </div>

            {/* Cover Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ảnh bìa
              </h4>
              {form.cover_url ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={form.cover_url}
                    alt="Cover"
                    className="w-full aspect-video object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-amber-500/90 text-black text-[10px]">
                    COVER
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center justify-center aspect-video rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">
                      Click "Cover" trên ảnh để đặt bìa
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Right Panel: Image Management ─── */}
          <div className="flex-1 min-w-0 p-5 space-y-5 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Quản lý hình ảnh
            </h3>

            {/* Dropzone (only when editing, album has ID) */}
            {editId ? (
              <>
                <GalleryDropzone
                  albumId={editId}
                  onUploadComplete={handleUploadComplete}
                />
                <GalleryImageGrid
                  images={albumImages}
                  coverUrl={form.cover_url ?? null}
                  onSetCover={(url) =>
                    setCoverMutation.mutate({ albumId: editId, imageUrl: url })
                  }
                  onDeleteImage={(id) => deleteImageMutation.mutate(id)}
                  onBulkDelete={(ids) => bulkDeleteMutation.mutate(ids)}
                  onReorder={(items) => reorderMutation.mutate(items)}
                  onUpdateCaption={(id, caption) =>
                    updateCaptionMutation.mutate({ id, caption })
                  }
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-[#3C5DAA]/5 p-4 mb-3">
                  <ImageIcon className="h-8 w-8 text-[#3C5DAA]/40" />
                </div>
                <p className="text-sm text-slate-500">
                  Đang tạo album...
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Vui lòng đợi giây lát để bắt đầu upload ảnh
                </p>
              </div>
            )}
          </div>
        </div>
      </FormSheet>

      {/* ═══ Confirm Delete Dialog ═══ */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title={`${deleteTarget?.title} (và tất cả ảnh trong album)`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
