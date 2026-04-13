import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RelationalMultiSelect } from "@/components/admin/RelationalMultiSelect";
import { KeyMetricsEditor } from "@/components/admin/KeyMetricsEditor";
import { StringListEditor } from "@/components/admin/DynamicListEditor";
import { adminApi, type Solution, type Product } from "@/lib/admin-api";
import { FileText, Loader2, PenLine, Image as ImageIcon, Wrench } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  "Thương mại", "Văn phòng", "Khách sạn", "Y tế",
  "Dân cư", "Công nghiệp", "Giáo dục", "Công trình",
];

const SYSTEM_OPTIONS = [
  "CCTV", "CCTV AI", "Access Control", "PA System", "PCCC",
  "LAN/WAN", "BMS", "Điện nhẹ", "Intercom", "Báo trộm",
  "Server/Storage", "Tổng đài", "Parking", "ICT", "ELV",
];

const BRAND_OPTIONS = [
  "Hikvision", "Dahua", "Hanwha Techwin", "Axis", "Honeywell",
  "Bosch", "TOA", "ZKTeco", "LS Cable", "Legrand",
  "Cisco", "HPE", "Ruckus", "Allied Telesis",
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

const CONTENT_TEMPLATE = `## Tổng quan dự án
[Mô tả tổng quan về dự án, quy mô và mục tiêu]

## Thách thức
[Các thách thức kỹ thuật cần giải quyết]

## Giải pháp Song Linh
[Giải pháp kỹ thuật đã triển khai, thiết bị sử dụng]

## Kết quả
[Kết quả đạt được, metrics, feedback khách hàng]
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectFormData {
  slug?: string;
  title?: string;
  description?: string | null;
  location?: string | null;
  client_name?: string | null;
  thumbnail_url?: string | null;
  content_md?: string | null;
  category?: string;
  year?: number | null;
  completion_year?: string | null;
  sort_order?: number;
  is_featured?: number;
  is_active?: number;
  system_types?: string;
  brands_used?: string;
  area_sqm?: number | null;
  duration_months?: number | null;
  key_metrics?: string;
  compliance_standards?: string;
  client_industry?: string | null;
  project_scale?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  related_solutions?: string;
  related_products?: string;
  gallery_urls?: string[];
  // Case Study fields
  challenges?: string | null;
  outcomes?: string | null;
  testimonial_name?: string | null;
  testimonial_content?: string | null;
  video_url?: string | null;
}

export const defaultProjectForm: ProjectFormData = {
  slug: "", title: "", description: "", location: "",
  client_name: "", thumbnail_url: "", content_md: "",
  category: "Công trình", year: null, completion_year: null,
  sort_order: 0, is_featured: 0, is_active: 1,
  system_types: "[]", brands_used: "[]",
  area_sqm: null, duration_months: null,
  key_metrics: "{}", compliance_standards: "[]",
  client_industry: null, project_scale: null,
  meta_title: null, meta_description: null,
  related_solutions: "[]", related_products: "[]",
  gallery_urls: [],
  challenges: null, outcomes: null,
  testimonial_name: null, testimonial_content: null,
  video_url: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toggleJsonArray(jsonStr: string, item: string): string {
  try {
    const arr: string[] = JSON.parse(jsonStr || "[]");
    const idx = arr.indexOf(item);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(item);
    return JSON.stringify(arr);
  } catch { return JSON.stringify([item]); }
}

function parseArr(jsonStr: string | undefined): string[] {
  try { return JSON.parse(jsonStr || "[]"); } catch { return []; }
}

function parseNumArr(jsonStr: string | undefined): number[] {
  try { return JSON.parse(jsonStr || "[]"); } catch { return []; }
}

export function slugify(text: string): string {
  return text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

// ─── Sidebar Section ──────────────────────────────────────────────────────────

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground border-b pb-1.5">
        {title}
      </h4>
      {children}
    </div>
  );
}

function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProjectFormSheetProps {
  open: boolean;
  onClose: () => void;
  editId: number | null;
  form: ProjectFormData;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ProjectFormSheet({
  open, onClose, editId, form, setForm, onSubmit, loading,
}: ProjectFormSheetProps) {

  const selectedSystems = parseArr(form.system_types);
  const selectedBrands = parseArr(form.brands_used);

  const fetchSolutionOptions = useCallback(async () => {
    const solutions = await adminApi.solutions.list();
    return solutions.map((s: Solution) => ({
      id: s.id, label: s.title,
      sublabel: s.description?.substring(0, 60), icon: s.icon,
    }));
  }, []);

  const fetchProductOptions = useCallback(async () => {
    const products = await adminApi.products.list();
    return products.map((p: Product) => ({
      id: p.id, label: p.name,
      sublabel: p.brand ? `${p.brand} ${p.model_number || ""}` : p.model_number,
      image: p.image_url,
    }));
  }, []);

  const insertTemplate = () => {
    setForm((f) => ({
      ...f,
      content_md: f.content_md ? f.content_md + "\n\n" + CONTENT_TEMPLATE : CONTENT_TEMPLATE,
    }));
  };

  const selectClass = "border-input bg-background flex h-8 w-full rounded-md border px-2 py-1 text-xs";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] h-[90vh] flex flex-col !p-0 !gap-0" showCloseButton={false}>
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          {/* ═══ HEADER ═══ */}
          <DialogHeader className="border-b px-6 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">
                {editId ? "Sửa dự án" : "Thêm dự án mới"}
                {form.title && <span className="text-muted-foreground font-normal ml-1">— {form.title}</span>}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                  Hủy
                </Button>
                <Button type="submit" size="sm" disabled={loading} className="min-w-[100px]">
                  {loading ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Lưu...</> : "💾 Lưu dự án"}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* ═══ BODY — 2 Column Layout ═══ */}
          <div className="flex-1 grid grid-cols-[1fr_380px] min-h-0">

            {/* ─── LEFT PANEL (70%) — Tabs ─── */}
            <div className="border-r overflow-y-auto">
              <Tabs defaultValue="content" className="h-full flex flex-col">
                <div className="border-b px-4 shrink-0">
                  <TabsList variant="line" className="justify-start -mb-px">
                    <TabsTrigger value="content" className="gap-1.5 text-xs">
                      <PenLine className="h-3.5 w-3.5" /> Nội dung chi tiết
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="gap-1.5 text-xs">
                      <ImageIcon className="h-3.5 w-3.5" /> Hình ảnh Gallery
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* TAB: Content */}
                <TabsContent value="content" className="flex-1 overflow-y-auto p-5 mt-0 space-y-5">
                  {/* Title + Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <F label="Tiêu đề" required>
                      <Input
                        value={form.title || ""} className="h-9"
                        onChange={(e) => {
                          const title = e.target.value;
                          setForm((f) => ({ ...f, title, ...(editId ? {} : { slug: slugify(title) }) }));
                        }}
                        required
                      />
                    </F>
                    <F label="Slug" required>
                      <Input value={form.slug || ""} className="h-9 font-mono text-xs"
                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required
                      />
                    </F>
                  </div>

                  {/* Short description */}
                  <F label="Mô tả ngắn">
                    <Textarea value={form.description || ""} rows={2} className="text-sm"
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Mô tả ngắn gọn cho listing card..."
                    />
                  </F>

                  {/* Main Markdown editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs font-medium">Nội dung chi tiết (Markdown)</Label>
                      <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={insertTemplate}>
                        <FileText className="h-3 w-3" /> Chèn template
                      </Button>
                    </div>
                    <Textarea
                      value={form.content_md || ""} rows={18}
                      onChange={(e) => setForm((f) => ({ ...f, content_md: e.target.value }))}
                      className="font-mono text-xs leading-relaxed"
                      placeholder="## Tổng quan dự án&#10;..."
                    />
                  </div>

                  {/* Challenges */}
                  <StringListEditor
                    label="Thách thức (Challenges)"
                    value={form.challenges || "[]"}
                    onChange={(json) => setForm((f) => ({ ...f, challenges: json }))}
                    placeholder="Các thách thức kỹ thuật trong dự án..."
                  />

                  {/* Outcomes */}
                  <StringListEditor
                    label="Kết quả đạt được / Điểm nổi bật (Outcomes)"
                    value={form.outcomes || "[]"}
                    onChange={(json) => setForm((f) => ({ ...f, outcomes: json }))}
                    placeholder="Hiệu năng, metrics, điểm đặc biệt..."
                  />
                </TabsContent>

                {/* TAB: Gallery */}
                <TabsContent value="gallery" className="flex-1 overflow-y-auto p-5 mt-0 space-y-6">
                  <ImageUploadField
                    label="Hình đại diện (Cover)"
                    value={form.thumbnail_url ? [form.thumbnail_url] : []}
                    onChange={(urls) => setForm((f) => ({ ...f, thumbnail_url: urls[0] || null }))}
                    folder="projects" single
                  />
                  <ImageUploadField
                    label="Gallery dự án (tối đa 12 ảnh)"
                    value={form.gallery_urls ?? []}
                    onChange={(urls) => setForm((f) => ({ ...f, gallery_urls: urls }))}
                    folder="projects" maxImages={12}
                  />

                  {/* Video URL */}
                  <F label="Video URL (YouTube / Vimeo)">
                    <Input value={form.video_url || ""} className="h-9 text-sm"
                      onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value || null }))}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    {form.video_url && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Video sẽ được embed trên trang chi tiết dự án
                      </p>
                    )}
                  </F>
                </TabsContent>
              </Tabs>
            </div>

            {/* ─── RIGHT PANEL (30%) — Sticky Sidebar ─── */}
            <div className="overflow-y-auto p-4 space-y-5 bg-muted/10">

              {/* Project Info */}
              <SidebarSection title="Thông tin dự án">
                <div className="grid grid-cols-2 gap-2">
                  <F label="Khách hàng">
                    <Input value={form.client_name || ""} className="h-8 text-xs"
                      onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                      placeholder="HDBank"
                    />
                  </F>
                  <F label="Địa điểm">
                    <Input value={form.location || ""} className="h-8 text-xs"
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="TP.HCM"
                    />
                  </F>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <F label="Năm hoàn thành">
                    <Input value={form.completion_year || ""} className="h-8 text-xs"
                      onChange={(e) => setForm((f) => ({ ...f, completion_year: e.target.value || null }))}
                      placeholder="2024"
                    />
                  </F>
                  <F label="Danh mục">
                    <select className={selectClass} value={form.category || ""}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    >
                      <option value="">— Chọn —</option>
                      {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </F>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <F label="Ngành">
                    <select className={selectClass} value={form.client_industry ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, client_industry: e.target.value || null }))}
                    >
                      <option value="">— Chọn —</option>
                      {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </F>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <F label="Thứ tự">
                    <Input type="number" value={form.sort_order ?? 0} className="h-8 text-xs"
                      onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                    />
                  </F>
                  <F label="Nổi bật">
                    <select className={selectClass} value={form.is_featured ?? 0}
                      onChange={(e) => setForm((f) => ({ ...f, is_featured: Number(e.target.value) }))}
                    >
                      <option value={0}>Không</option>
                      <option value={1}>Có</option>
                    </select>
                  </F>
                  <F label="Trạng thái">
                    <select className={selectClass} value={form.is_active ?? 1}
                      onChange={(e) => setForm((f) => ({ ...f, is_active: Number(e.target.value) }))}
                    >
                      <option value={1}>Công khai</option>
                      <option value={0}>Chờ duyệt</option>
                    </select>
                  </F>
                </div>
              </SidebarSection>

              {/* Key Metrics */}
              <SidebarSection title="Key Metrics">
                <KeyMetricsEditor
                  value={form.key_metrics || "{}"}
                  onChange={(json) => setForm((f) => ({ ...f, key_metrics: json }))}
                />

              </SidebarSection>

              {/* Linkages */}
              <SidebarSection title="Hệ thống & Thương hiệu">
                <F label="Hệ thống triển khai">
                  <div className="flex flex-wrap gap-1.5">
                    {SYSTEM_OPTIONS.map((sys) => (
                      <label key={sys}
                        className={`cursor-pointer rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          selectedSystems.includes(sys)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={selectedSystems.includes(sys)}
                          onChange={() => setForm((f) => ({ ...f, system_types: toggleJsonArray(f.system_types || "[]", sys) }))}
                        />
                        {sys}
                      </label>
                    ))}
                  </div>
                </F>
                <F label="Thương hiệu">
                  <div className="flex flex-wrap gap-1.5">
                    {BRAND_OPTIONS.map((brand) => (
                      <label key={brand}
                        className={`cursor-pointer rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          selectedBrands.includes(brand)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={selectedBrands.includes(brand)}
                          onChange={() => setForm((f) => ({ ...f, brands_used: toggleJsonArray(f.brands_used || "[]", brand) }))}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </F>
                <F label="Tiêu chuẩn tuân thủ">
                  <Input className="h-8 text-xs"
                    value={parseArr(form.compliance_standards).join(", ")}
                    onChange={(e) => setForm((f) => ({
                      ...f, compliance_standards: JSON.stringify(
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      ),
                    }))}
                    placeholder="TCVN 7336, ISO 14001"
                  />
                </F>
              </SidebarSection>

              {/* Relational */}
              <SidebarSection title="Liên kết">
                <RelationalMultiSelect
                  label="Giải pháp liên quan" value={parseNumArr(form.related_solutions)}
                  onChange={(ids) => setForm((f) => ({ ...f, related_solutions: JSON.stringify(ids) }))}
                  fetchOptions={fetchSolutionOptions} placeholder="Chọn giải pháp..."
                />
                <RelationalMultiSelect
                  label="Sản phẩm liên quan" value={parseNumArr(form.related_products)}
                  onChange={(ids) => setForm((f) => ({ ...f, related_products: JSON.stringify(ids) }))}
                  fetchOptions={fetchProductOptions} placeholder="Chọn sản phẩm..."
                />
              </SidebarSection>

              {/* SEO */}
              <SidebarSection title="SEO">
                <F label="Meta Title">
                  <Input value={form.meta_title || ""} className="h-8 text-xs"
                    onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value || null }))}
                    placeholder={form.title || "Tiêu đề"}
                  />
                  <p className="text-[10px] text-muted-foreground">{(form.meta_title || form.title || "").length}/60</p>
                </F>
                <F label="Meta Description">
                  <Textarea value={form.meta_description || ""} rows={2} className="text-xs"
                    onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value || null }))}
                    placeholder={form.description || "Mô tả"}
                  />
                  <p className="text-[10px] text-muted-foreground">{(form.meta_description || form.description || "").length}/160</p>
                </F>
                {/* Google Preview */}
                <div className="rounded-lg border p-3 bg-background">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Preview</p>
                  <p className="text-[#1a0dab] text-xs font-medium truncate">
                    {form.meta_title || form.title || "Tiêu đề"} — Song Linh Technologies
                  </p>
                  <p className="text-[#006621] text-[10px]">sltech.vn/du-an/{form.slug || "slug"}</p>
                  <p className="text-[10px] text-[#545454] line-clamp-2">
                    {form.meta_description || form.description || "Mô tả..."}
                  </p>
                </div>
              </SidebarSection>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
