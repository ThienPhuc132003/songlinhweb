import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { TagInput } from "@/components/admin/TagInput";
import { useMarkdown } from "@/hooks/useMarkdown";
import type { Post } from "@/lib/admin-api";
import {
  PenLine,
  Eye,
  Search as SearchIcon,
  Star,
  Loader2,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Scale,
  Cog,
  Globe,
  Building2,
  BookOpen,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const POST_CATEGORIES = [
  { value: "general", label: "Tổng hợp" },
  { value: "technology", label: "Công nghệ" },
  { value: "project-update", label: "Cập nhật dự án" },
  { value: "industry-news", label: "Tin ngành" },
  { value: "tutorial", label: "Hướng dẫn" },
] as const;

export const POST_STATUS_OPTIONS = [
  { value: "draft", label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "published", label: "Công khai", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { value: "archived", label: "Lưu trữ", color: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
] as const;

const CONTENT_TEMPLATE = `## Giới thiệu
[Mở đầu bài viết, giới thiệu chủ đề]

## Nội dung chính

### 1. Điểm đầu tiên
[Chi tiết về điểm 1]

### 2. Điểm thứ hai
[Chi tiết về điểm 2]

### 3. Điểm thứ ba
[Chi tiết về điểm 3]

## Kết luận
[Tóm tắt và kêu gọi hành động]
`;

const WHITEPAPER_TEMPLATE = `## Giới thiệu giải pháp
[Tổng quan về giải pháp kỹ thuật, bối cảnh thị trường và nhu cầu triển khai]

## Căn cứ pháp lý & Tiêu chuẩn áp dụng

- **TCVN 7336:2021** — Phòng cháy chữa cháy — Hệ thống sprinkler tự động [1]
- **Nghị định 136/2020/NĐ-CP** — Quy định chi tiết thi hành Luật PCCC [2]
- **TCVN 5738:2021** — Hệ thống báo cháy tự động [3]

## Giải pháp kỹ thuật chi tiết

### Kiến trúc hệ thống
[Mô tả kiến trúc tổng thể, sơ đồ kết nối và tích hợp]

### Thiết bị & Thông số kỹ thuật

| Thiết bị | Model | Thông số chính | Số lượng |
|----------|-------|----------------|----------|
| [Tên] | [Model] | [Specs] | [Qty] |

### So sánh giải pháp

| Tiêu chí | Giải pháp A | Giải pháp B (Đề xuất) |
|----------|-------------|----------------------|
| [Tiêu chí 1] | | |

> [!TIP]
> Khuyến nghị kỹ thuật quan trọng cho đơn vị triển khai

## Kết luận & Khuyến nghị
[Tóm tắt giải pháp, lợi ích kinh doanh, và bước triển khai tiếp theo]
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReferenceItem {
  title: string;
  url: string;
  type: 'law' | 'standard' | 'news' | 'vendor';
}

export interface PostFormData {
  slug?: string;
  title?: string;
  excerpt?: string;
  content_md?: string | null;
  thumbnail_url?: string | null;
  author?: string;
  tags?: string[];
  status?: string;
  category?: string;
  is_featured?: number;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  reviewed_by?: string | null;
  references?: ReferenceItem[];
}

export const defaultPostForm: PostFormData = {
  slug: "",
  title: "",
  excerpt: "",
  content_md: "",
  thumbnail_url: null,
  author: "Song Linh Technologies",
  tags: [],
  status: "draft",
  category: "general",
  is_featured: 0,
  published_at: null,
  meta_title: null,
  meta_description: null,
  reviewed_by: null,
  references: [],
};

const REFERENCE_TYPES = [
  { value: 'law' as const, label: 'Pháp lý', icon: Scale, color: 'text-amber-600' },
  { value: 'standard' as const, label: 'Tiêu chuẩn', icon: Cog, color: 'text-primary' },
  { value: 'news' as const, label: 'Tin tức', icon: Globe, color: 'text-emerald-600' },
  { value: 'vendor' as const, label: 'Nhà cung cấp', icon: Building2, color: 'text-violet-600' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function calcReadingTime(content: string | null): number {
  if (!content) return 0;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// ─── Sidebar Section ──────────────────────────────────────────────────────────

function SidebarSection({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => collapsible && setOpen(!open)}
        className={`flex w-full items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground border-b pb-1.5 ${collapsible ? "cursor-pointer hover:text-foreground" : "cursor-default"}`}
      >
        {collapsible && (
          open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
        )}
        {title}
      </button>
      {(!collapsible || open) && children}
    </div>
  );
}

function F({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PostFormSheetProps {
  open: boolean;
  onClose: () => void;
  editId: number | null;
  form: PostFormData;
  setForm: React.Dispatch<React.SetStateAction<PostFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function PostFormSheet({
  open,
  onClose,
  editId,
  form,
  setForm,
  onSubmit,
  loading,
}: PostFormSheetProps) {
  const selectClass =
    "border-input bg-background flex h-9 w-full rounded-md border px-2.5 py-1.5 text-xs";

  // Live preview of markdown content
  const previewHtml = useMarkdown(form.content_md ?? null);

  // Reading time calculation
  const readingTime = useMemo(
    () => calcReadingTime(form.content_md ?? null),
    [form.content_md],
  );

  const insertTemplate = () => {
    setForm((f) => ({
      ...f,
      content_md: f.content_md
        ? f.content_md + "\n\n" + CONTENT_TEMPLATE
        : CONTENT_TEMPLATE,
    }));
  };

  const insertWhitepaperTemplate = () => {
    setForm((f) => ({
      ...f,
      content_md: f.content_md
        ? f.content_md + "\n\n" + WHITEPAPER_TEMPLATE
        : WHITEPAPER_TEMPLATE,
    }));
  };

  const addReference = () => {
    setForm((f) => ({
      ...f,
      references: [...(f.references || []), { title: '', url: '', type: 'standard' as const }],
    }));
  };

  const removeReference = (index: number) => {
    setForm((f) => ({
      ...f,
      references: (f.references || []).filter((_, i) => i !== index),
    }));
  };

  const updateReference = (index: number, field: keyof ReferenceItem, value: string) => {
    setForm((f) => {
      const refs = [...(f.references || [])];
      refs[index] = { ...refs[index], [field]: value };
      return { ...f, references: refs };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-[95vw] h-[94vh] flex flex-col !p-0 !gap-0"
        showCloseButton={false}
      >
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          {/* ═══ HEADER ═══ */}
          <DialogHeader className="border-b px-6 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">
                {editId ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
                {form.title && (
                  <span className="text-muted-foreground font-normal ml-1">
                    — {form.title}
                  </span>
                )}
              </DialogTitle>
              <div className="flex items-center gap-3">
                {readingTime > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    📖 ~{readingTime} phút đọc
                  </span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Lưu...
                    </>
                  ) : (
                    "💾 Lưu tin tức"
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* ═══ BODY — 3 Column Split-View Layout ═══ */}
          <div className="flex-1 grid grid-cols-[1fr_1fr_320px] min-h-0">
            {/* ─── COLUMN 1 — Markdown Editor ─── */}
            <div className="border-r overflow-y-auto flex flex-col">
              {/* Column Header */}
              <div className="border-b px-5 py-2.5 shrink-0 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <PenLine className="h-3.5 w-3.5" />
                  Soạn thảo
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={insertTemplate}
                >
                  <FileText className="h-3 w-3" /> Template
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={insertWhitepaperTemplate}
                >
                  <BookOpen className="h-3 w-3" /> Whitepaper
                </Button>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Title + Slug */}
                <div className="grid grid-cols-2 gap-4">
                  <F label="Tiêu đề" required>
                    <Input
                      value={form.title || ""}
                      className="h-9"
                      onChange={(e) => {
                        const title = e.target.value;
                        setForm((f) => ({
                          ...f,
                          title,
                          ...(editId ? {} : { slug: slugify(title) }),
                        }));
                      }}
                      required
                      placeholder="VD: 5 Lợi ích khi lắp đặt camera..."
                    />
                  </F>
                  <F label="Slug" required>
                    <Input
                      value={form.slug || ""}
                      className="h-9 font-mono text-xs"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, slug: e.target.value }))
                      }
                      required
                    />
                  </F>
                </div>

                {/* Excerpt */}
                <F label="Tóm tắt">
                  <Textarea
                    value={form.excerpt || ""}
                    rows={2}
                    className="text-sm"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, excerpt: e.target.value }))
                    }
                    placeholder="Mô tả ngắn hiển thị trên listing card..."
                  />
                </F>

                {/* Markdown Editor */}
                <div className="flex-1">
                  <Label className="text-xs font-medium mb-1.5 block">
                    Nội dung chi tiết (Markdown)
                  </Label>
                  <Textarea
                    value={form.content_md || ""}
                    rows={28}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        content_md: e.target.value,
                      }))
                    }
                    className="font-mono text-xs leading-relaxed min-h-[400px] resize-y"
                    placeholder="## Giới thiệu&#10;..."
                  />
                </div>
              </div>
            </div>

            {/* ─── COLUMN 2 — Live Preview ─── */}
            <div className="border-r overflow-y-auto flex flex-col">
              {/* Column Header */}
              <div className="border-b px-5 py-2.5 shrink-0 bg-muted/30 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Xem trước
                </span>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {previewHtml ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-2xl prose-h1:mb-4
                    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:pb-2
                    prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                    prose-p:leading-[1.75] prose-p:mb-4
                    prose-li:leading-[1.7]
                    prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
                    prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
                    prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                    <h1>{form.title || "Tiêu đề tin tức"}</h1>
                    {form.excerpt && (
                      <p className="lead text-muted-foreground italic">{form.excerpt}</p>
                    )}
                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Eye className="h-10 w-10 mb-3 opacity-20" />
                    <p className="text-sm">
                      Nhập nội dung Markdown ở cột soạn thảo để xem trước
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ─── COLUMN 3 — Right Sidebar ─── */}
            <div className="overflow-y-auto p-4 space-y-5 bg-muted/10">
              {/* Publishing */}
              <SidebarSection title="Phát hành">
                <div className="grid grid-cols-2 gap-3">
                  <F label="Trạng thái">
                    <select
                      className={selectClass}
                      value={form.status || "draft"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      {POST_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </F>
                  <F label="Ngày đăng">
                    <Input
                      type="date"
                      className="h-9 text-xs"
                      value={form.published_at?.split("T")[0] || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          published_at: e.target.value || null,
                        }))
                      }
                    />
                  </F>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Danh mục">
                    <select
                      className={selectClass}
                      value={form.category || "general"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      {POST_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </F>
                  <F label="Nổi bật">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          is_featured: f.is_featured ? 0 : 1,
                        }))
                      }
                      className={`flex items-center gap-1.5 h-9 px-3 rounded-md border text-xs font-medium transition-colors ${
                        form.is_featured
                          ? "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "border-input text-muted-foreground hover:border-yellow-300"
                      }`}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${form.is_featured ? "fill-current" : ""}`}
                      />
                      {form.is_featured ? "Featured" : "Bình thường"}
                    </button>
                  </F>
                </div>
                <F label="Chuyên gia phụ trách">
                  <Input
                    value={form.author || ""}
                    className="h-9 text-xs"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, author: e.target.value }))
                    }
                    placeholder="Song Linh Technologies"
                  />
                </F>
                <F label="Kiểm duyệt bởi">
                  <Input
                    value={form.reviewed_by || ""}
                    className="h-9 text-xs"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, reviewed_by: e.target.value || null }))
                    }
                    placeholder="Nguyễn Văn A — KS Trưởng"
                  />
                </F>
              </SidebarSection>

              {/* Thumbnail */}
              <SidebarSection title="Hình đại diện">
                <ImageUploadField
                  label=""
                  value={
                    form.thumbnail_url ? [form.thumbnail_url] : []
                  }
                  onChange={(urls) =>
                    setForm((f) => ({
                      ...f,
                      thumbnail_url: urls[0] || null,
                    }))
                  }
                  folder="posts"
                  single
                />
              </SidebarSection>

              {/* Tags */}
              <SidebarSection title="Phân loại">
                <TagInput
                  value={form.tags ?? []}
                  onChange={(tags) => setForm((f) => ({ ...f, tags }))}
                  label=""
                />
              </SidebarSection>

              {/* References — Collapsible */}
              <SidebarSection title="Tài liệu tham khảo" collapsible defaultOpen={true}>
                <div className="space-y-3">
                  {(form.references || []).map((ref, idx) => {
                    const typeConfig = REFERENCE_TYPES.find(t => t.value === ref.type);
                    const TypeIcon = typeConfig?.icon || Cog;
                    return (
                      <div key={idx} className="rounded-lg border p-3 bg-background space-y-2 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            [{idx + 1}]
                          </span>
                          <button
                            type="button"
                            onClick={() => removeReference(idx)}
                            className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <Input
                          value={ref.title}
                          className="h-8 text-xs"
                          placeholder="Tên tài liệu (VD: TCVN 7336:2021)"
                          onChange={(e) => updateReference(idx, 'title', e.target.value)}
                        />
                        <Input
                          value={ref.url}
                          className="h-8 text-xs font-mono"
                          placeholder="https://..."
                          onChange={(e) => updateReference(idx, 'url', e.target.value)}
                        />
                        <select
                          className={`${selectClass} !h-8`}
                          value={ref.type}
                          onChange={(e) => updateReference(idx, 'type', e.target.value)}
                        >
                          {REFERENCE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs h-8"
                    onClick={addReference}
                  >
                    <Plus className="h-3 w-3" />
                    Thêm tài liệu tham khảo
                  </Button>
                </div>
              </SidebarSection>

              {/* SEO — Collapsible */}
              <SidebarSection title="SEO & Meta" collapsible defaultOpen={false}>
                <div className="space-y-3">
                  <F label="Meta Title">
                    <Input
                      value={form.meta_title || ""}
                      className="h-9 text-xs"
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          meta_title: e.target.value || null,
                        }))
                      }
                      placeholder={form.title || "Sử dụng tiêu đề"}
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {(form.meta_title || form.title || "").length}/60
                    </p>
                  </F>
                  <F label="Meta Description">
                    <Textarea
                      value={form.meta_description || ""}
                      rows={2}
                      className="text-xs"
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          meta_description: e.target.value || null,
                        }))
                      }
                      placeholder={form.excerpt || "Sử dụng tóm tắt"}
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {(form.meta_description || form.excerpt || "").length}/160
                    </p>
                  </F>
                  {/* Google Preview */}
                  <div className="rounded-lg border p-3 bg-background">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Google Preview
                    </p>
                    <p className="text-[#1a0dab] text-xs font-medium truncate">
                      {form.meta_title || form.title || "Tiêu đề"} — Song Linh Technologies
                    </p>
                    <p className="text-[#006621] text-[10px]">
                      sltech.vn/tin-tuc/{form.slug || "slug"}
                    </p>
                    <p className="text-[10px] text-[#545454] line-clamp-2">
                      {form.meta_description || form.excerpt || "Mô tả..."}
                    </p>
                  </div>
                </div>
              </SidebarSection>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
