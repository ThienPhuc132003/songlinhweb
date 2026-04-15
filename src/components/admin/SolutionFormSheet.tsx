/**
 * SolutionFormSheet — Wide-sheet admin form for creating/editing solutions.
 * Layout: 90vw dialog with EditorTabs (Basic | Structured Data | Content | SEO)
 *
 * Reuses: IconPickerField, ImageUploadField, DynamicListEditor, StringListEditor, EditorTabs
 */

import { useState, useMemo } from "react";
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
import { IconPickerField } from "@/components/admin/IconPickerField";
import { EditorTabs, type EditorTab } from "@/components/admin/EditorTabs";
import {
  DynamicListEditor,
  StringListEditor,
  type DynamicField,
} from "@/components/admin/DynamicListEditor";
import { useMarkdown } from "@/hooks/useMarkdown";
import type { Solution, SolutionFeature } from "@/types";
import {
  FileText,
  Database,
  PenLine,
  Search,
  Loader2,
  Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SolutionFormData {
  slug?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  content_md?: string | null;
  icon?: string | null;
  hero_image_url?: string | null;
  features?: string;        // JSON string
  applications?: string;    // JSON string
  sort_order?: number;
  is_active?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export const defaultSolutionForm: SolutionFormData = {
  slug: "",
  title: "",
  description: "",
  excerpt: "",
  content_md: "",
  icon: "FileCheck",
  hero_image_url: null,
  features: "[]",
  applications: "[]",
  sort_order: 0,
  is_active: 1,
  meta_title: null,
  meta_description: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseFeatures(json: string | undefined): SolutionFeature[] {
  try {
    const arr = JSON.parse(json || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// Field label helper
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

// ─── Feature fields definition for DynamicListEditor ──────────────────────────

const FEATURE_FIELDS: DynamicField[] = [
  { key: "icon", label: "Icon", type: "icon" },
  { key: "title", label: "Tiêu đề", type: "text", placeholder: "VD: AcuSense AI" },
  {
    key: "description",
    label: "Mô tả",
    type: "textarea",
    placeholder: "Mô tả ngắn về tính năng...",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface SolutionFormSheetProps {
  open: boolean;
  onClose: () => void;
  editId: number | null;
  form: SolutionFormData;
  setForm: React.Dispatch<React.SetStateAction<SolutionFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function SolutionFormSheet({
  open,
  onClose,
  editId,
  form,
  setForm,
  onSubmit,
  loading,
}: SolutionFormSheetProps) {
  const selectClass =
    "border-input bg-background flex h-9 w-full rounded-sm border px-2.5 py-1.5 text-xs";

  // Parse features JSON for DynamicListEditor
  const features = useMemo(() => parseFeatures(form.features), [form.features]);

  // Live preview of markdown content
  const previewHtml = useMarkdown(form.content_md ?? null);

  const updateFeatures = (items: Array<Record<string, string | number>>) => {
    setForm((f) => ({
      ...f,
      features: JSON.stringify(items),
    }));
  };

  // ─── Tab: Basic ─────────────────────────────────────────────────────────────

  const basicTab = (
    <div className="space-y-5 max-w-3xl">
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
            placeholder="VD: Hệ thống giám sát an ninh AI"
          />
        </F>
        <F label="Slug" required>
          <Input
            value={form.slug || ""}
            className="h-9 font-mono text-xs"
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
        </F>
      </div>

      {/* Icon Picker */}
      <F label="Icon (Lucide)">
        <IconPickerField
          value={form.icon}
          onChange={(icon) => setForm((f) => ({ ...f, icon }))}
        />
      </F>

      {/* Cover Image */}
      <ImageUploadField
        label="Ảnh bìa (Cover)"
        value={form.hero_image_url ? [form.hero_image_url] : []}
        onChange={(urls) =>
          setForm((f) => ({ ...f, hero_image_url: urls[0] || null }))
        }
        folder="solutions"
        single
      />

      {/* Excerpt */}
      <F label="Tóm tắt (Excerpt)">
        <Textarea
          value={form.excerpt || ""}
          rows={3}
          className="text-sm"
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          placeholder="Mô tả ngắn hiển thị trên card listing..."
        />
      </F>

      {/* Description */}
      <F label="Mô tả đầy đủ">
        <Textarea
          value={form.description || ""}
          rows={3}
          className="text-sm"
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Mô tả chi tiết về giải pháp..."
        />
      </F>

      {/* Status + Sort Order */}
      <div className="grid grid-cols-2 gap-4">
        <F label="Trạng thái">
          <select
            className={selectClass}
            value={form.is_active ?? 1}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: Number(e.target.value) }))
            }
          >
            <option value={1}>Công khai</option>
            <option value={0}>Chờ duyệt</option>
          </select>
        </F>
        <F label="Thứ tự hiển thị">
          <Input
            type="number"
            value={form.sort_order ?? 0}
            className="h-9"
            onChange={(e) =>
              setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
            }
          />
        </F>
      </div>
    </div>
  );

  // ─── Tab: Structured Data ───────────────────────────────────────────────────

  const structuredDataTab = (
    <div className="space-y-8 max-w-4xl">
      {/* Features — Dynamic array editor */}
      <DynamicListEditor<Record<string, string | number>>
        label="Tính năng nổi bật (Features)"
        description="Mỗi feature gồm icon, tiêu đề và mô tả. Hiển thị dạng grid trên trang chi tiết."
        fields={FEATURE_FIELDS}
        items={features as unknown as Array<Record<string, string | number>>}
        onChange={updateFeatures}
        createEmpty={() => ({ icon: "", title: "", description: "" })}
        maxItems={12}
      />

      {/* Applications — Simple string list */}
      <StringListEditor
        label="Ứng dụng (Applications)"
        value={form.applications || "[]"}
        onChange={(json) => setForm((f) => ({ ...f, applications: json }))}
        placeholder="VD: Tòa nhà văn phòng, Khu công nghiệp..."
      />
    </div>
  );

  // ─── Tab: Content (Markdown) ────────────────────────────────────────────────

  const contentTab = (
    <div className="grid grid-cols-2 gap-0 -m-6 h-[calc(100%+3rem)]">
      {/* Editor Column */}
      <div className="border-r flex flex-col">
        <div className="border-b px-4 py-2 shrink-0 bg-muted/30 flex items-center gap-1.5">
          <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">
            Soạn thảo Markdown
          </span>
        </div>
        <div className="flex-1 p-4">
          <Textarea
            value={form.content_md || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, content_md: e.target.value }))
            }
            className="font-mono text-xs leading-relaxed h-full min-h-[500px] resize-none"
            placeholder="## Giới thiệu&#10;Mô tả chi tiết giải pháp kỹ thuật..."
          />
        </div>
      </div>

      {/* Preview Column */}
      <div className="flex flex-col">
        <div className="border-b px-4 py-2 shrink-0 bg-muted/30 flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">
            Xem trước
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {previewHtml ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:pb-2
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                prose-p:leading-[1.75] prose-p:mb-4
                prose-li:leading-[1.7]
                prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg
                prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            >
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
    </div>
  );

  // ─── Tab: SEO ───────────────────────────────────────────────────────────────

  const seoTab = (
    <div className="space-y-5 max-w-2xl">
      <F label="Meta Title">
        <Input
          value={form.meta_title || ""}
          className="h-9"
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
          rows={3}
          className="text-sm"
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              meta_description: e.target.value || null,
            }))
          }
          placeholder={form.excerpt || form.description || "Sử dụng mô tả"}
        />
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {(form.meta_description || form.excerpt || "").length}/160
        </p>
      </F>

      {/* Google Preview */}
      <div className="rounded-sm border p-4 bg-background">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Google Preview
        </p>
        <p className="text-[#1a0dab] text-sm font-medium truncate">
          {form.meta_title || form.title || "Tiêu đề"} — Song Linh Technologies
        </p>
        <p className="text-[#006621] text-xs">
          sltech.vn/giai-phap/{form.slug || "slug"}
        </p>
        <p className="text-xs text-[#545454] line-clamp-2 mt-0.5">
          {form.meta_description || form.excerpt || form.description || "Mô tả..."}
        </p>
      </div>
    </div>
  );

  // ─── Tabs ───────────────────────────────────────────────────────────────────

  const tabs: EditorTab[] = [
    { id: "basic", label: "Cơ bản", icon: FileText, content: basicTab },
    {
      id: "structured",
      label: "Dữ liệu cấu trúc",
      icon: Database,
      content: structuredDataTab,
    },
    { id: "content", label: "Nội dung", icon: PenLine, content: contentTab },
    { id: "seo", label: "SEO", icon: Search, content: seoTab },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-[90vw] h-[90vh] flex flex-col !p-0 !gap-0"
        showCloseButton={false}
      >
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          {/* ═══ HEADER ═══ */}
          <DialogHeader className="border-b px-6 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">
                {editId ? "Chỉnh sửa giải pháp" : "Tạo giải pháp mới"}
                {form.title && (
                  <span className="text-muted-foreground font-normal ml-1">
                    — {form.title}
                  </span>
                )}
              </DialogTitle>
              <div className="flex items-center gap-3">
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
                    "💾 Lưu giải pháp"
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* ═══ BODY — Tabbed Content ═══ */}
          <div className="flex-1 min-h-0">
            <EditorTabs tabs={tabs} defaultTab="basic" className="h-full" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
