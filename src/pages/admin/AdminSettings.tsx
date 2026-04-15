import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type SiteConfig } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/CrudHelpers";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DynamicListEditor, type DynamicField } from "@/components/admin/DynamicListEditor";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2,
  Save,
  Building2,
  Search,
  FileText,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Globe,
  Facebook,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
  Hash,
  Link as LinkIcon,
  Shield,
  BarChart3,
  RefreshCw,
  Info,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   Field definitions for each tab
   ═══════════════════════════════════════════════════ */

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "masked" | "url" | "image" | "switch";
  icon?: React.ReactNode;
  placeholder?: string;
  description?: string;
}

const TAB1_COMPANY: FieldDef[] = [
  { key: "company_name", label: "Tên công ty", type: "text", icon: <Building2 className="h-4 w-4" />, placeholder: "CÔNG TY TNHH TM CÔNG NGHỆ SONG LINH" },
  { key: "company_slogan", label: "Slogan", type: "text", icon: <Globe className="h-4 w-4" />, placeholder: "Giải pháp tối ưu – Chất lượng vượt trội" },
  { key: "company_hotline", label: "Hotline", type: "text", icon: <Phone className="h-4 w-4" />, placeholder: "0968.811.911" },
  { key: "company_phone", label: "Số điện thoại", type: "text", icon: <Phone className="h-4 w-4" />, placeholder: "0968811911" },
  { key: "company_email", label: "Email", type: "text", icon: <Mail className="h-4 w-4" />, placeholder: "songlinh@sltech.vn" },
  { key: "company_address", label: "Địa chỉ", type: "textarea", icon: <MapPin className="h-4 w-4" />, placeholder: "19 Linh Đông, Khu phố 7, P. Hiệp Bình, TP.HCM" },
  { key: "company_hours", label: "Giờ làm việc", type: "text", icon: <Clock className="h-4 w-4" />, placeholder: "08:00 - 17:00" },
  { key: "company_tax_id", label: "Mã số thuế", type: "text", icon: <Hash className="h-4 w-4" />, placeholder: "0313573739" },
];

const TAB1_SOCIAL: FieldDef[] = [
  { key: "social_zalo", label: "Zalo URL", type: "url", icon: <Globe className="h-4 w-4" />, placeholder: "https://zalo.me/..." },
  { key: "social_facebook", label: "Facebook URL", type: "url", icon: <Facebook className="h-4 w-4" />, placeholder: "https://facebook.com/..." },
  { key: "social_linkedin", label: "LinkedIn URL", type: "url", icon: <Linkedin className="h-4 w-4" />, placeholder: "https://linkedin.com/..." },
  { key: "social_youtube", label: "YouTube URL", type: "url", icon: <Youtube className="h-4 w-4" />, placeholder: "https://youtube.com/..." },
];

const TAB2_SEO: FieldDef[] = [
  { key: "site_title", label: "Tiêu đề website", type: "text", icon: <Globe className="h-4 w-4" />, placeholder: "Song Linh Technologies — Giải pháp ELV & ICT" },
  { key: "site_description", label: "Mô tả website", type: "textarea", icon: <FileText className="h-4 w-4" />, placeholder: "Mô tả ngắn gọn cho SEO...", description: "Tối đa 160 ký tự cho kết quả tìm kiếm tốt nhất" },
  { key: "meta_keywords", label: "Từ khóa SEO", type: "text", icon: <Search className="h-4 w-4" />, placeholder: "camera, PCCC, điện nhẹ, Song Linh" },
];

const TAB2_TRACKING: FieldDef[] = [
  { key: "ga4_id", label: "Google Analytics (GA4)", type: "masked", icon: <BarChart3 className="h-4 w-4" />, placeholder: "G-XXXXXXXXXX", description: "Measurement ID bắt đầu với G-" },
  { key: "gsc_verification", label: "Google Search Console", type: "masked", icon: <Search className="h-4 w-4" />, placeholder: "Verification meta tag content" },
  { key: "fb_pixel_id", label: "Facebook Pixel ID", type: "masked", icon: <Facebook className="h-4 w-4" />, placeholder: "1234567890", description: "ID pixel từ Facebook Business Manager" },
];

const TAB3_FIELDS: FieldDef[] = [
  { key: "portfolio_pdf_url", label: "Hồ sơ năng lực (PDF URL)", type: "url", icon: <FileText className="h-4 w-4" />, placeholder: "https://drive.google.com/..." },
  { key: "footer_copyright", label: "Footer Copyright", type: "text", icon: <Shield className="h-4 w-4" />, placeholder: "© 2026 Song Linh Technologies. Bản quyền thuộc..." },
  { key: "privacy_policy_url", label: "Chính sách bảo mật", type: "url", icon: <LinkIcon className="h-4 w-4" />, placeholder: "/chinh-sach-bao-mat" },
  { key: "warranty_policy_url", label: "Chính sách bảo hành", type: "url", icon: <LinkIcon className="h-4 w-4" />, placeholder: "/chinh-sach-bao-hanh" },
];

/* ═══════════════════════════════════════════════════
/* ─── Section Helper (outside component to preserve identity across renders) ─── */
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50">
    <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-3">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-5 space-y-4">
      {children}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════ */

export default function AdminSettings() {
  const qc = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "site-config"],
    queryFn: adminApi.siteConfig.list,
  });

  useEffect(() => {
    if (data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((c: SiteConfig) => {
        map[c.key] = c.value;
      });
      setFormData(map);
      setDirty(false);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (entries: Record<string, string>) => {
      await adminApi.siteConfig.update(entries);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "site-config"] });
      qc.invalidateQueries({ queryKey: ["site-config"] });
      setDirty(false);
      toast.success("Đã lưu cấu hình thành công");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const clearCacheMutation = useMutation({
    mutationFn: () => adminApi.siteConfig.clearCache(),
    onSuccess: () => {
      toast.success("Đã xóa cache thành công", {
        description: "Website sẽ tải cấu hình mới từ database.",
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  // Collect all managed keys from field definitions
  const MANAGED_KEYS = useMemo(() => {
    const allFields = [...TAB1_COMPANY, ...TAB1_SOCIAL, ...TAB2_SEO, ...TAB2_TRACKING, ...TAB3_FIELDS];
    const keys = new Set(allFields.map((f) => f.key));
    // Also include system keys managed by switches/buttons
    keys.add("maintenance_mode");
    keys.add("logo_light_url");
    keys.add("logo_dark_url");
    keys.add("favicon_url");
    // About page dynamic keys
    keys.add("about_description");
    keys.add("about_vision");
    keys.add("about_mission");
    keys.add("company_stats");
    keys.add("core_values");
    keys.add("why_choose_us");
    keys.add("about_hero_image");
    return keys;
  }, []);

  const handleSave = () => {
    // Only send keys that our form actually manages — excludes legacy/orphan keys
    const payload: Record<string, string> = {};
    for (const key of MANAGED_KEYS) {
      if (key in formData) {
        payload[key] = formData[key];
      }
    }
    saveMutation.mutate(payload);
  };

  const toggleReveal = (key: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /* ─── Field Renderers ─── */

  const renderField = (field: FieldDef) => {
    const value = formData[field.key] ?? "";

    if (field.type === "image") {
      return (
        <div key={field.key} className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            {field.icon}
            {field.label}
          </Label>
          <ImageUploadField
            value={value ? [value] : []}
            onChange={(urls) => handleChange(field.key, urls[0] ?? "")}
            folder="settings"
            single
            label=""
          />
        </div>
      );
    }

    if (field.type === "switch") {
      return (
        <div key={field.key} className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium flex items-center gap-2">
              {field.icon}
              {field.label}
            </Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => handleChange(field.key, checked ? "true" : "false")}
          />
        </div>
      );
    }

    if (field.type === "masked") {
      const isRevealed = revealedKeys.has(field.key);
      return (
        <div key={field.key} className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-2">
            {field.icon}
            {field.label}
          </Label>
          <div className="relative">
            <Input
              type={isRevealed ? "text" : "password"}
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="pr-10 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => toggleReveal(field.key)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
              title={isRevealed ? "Ẩn" : "Hiện"}
            >
              {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.key} className="space-y-1.5">
          <Label className="text-sm font-medium flex items-center gap-2">
            {field.icon}
            {field.label}
          </Label>
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
          />
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      );
    }

    // text or url
    return (
      <div key={field.key} className="space-y-1.5">
        <Label className="text-sm font-medium flex items-center gap-2">
          {field.icon}
          {field.label}
        </Label>
        <Input
          type={field.type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder}
        />
        {field.description && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}
      </div>
    );
  };



  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Save */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Trung tâm Cấu hình"
          description="Quản lý toàn bộ thông tin doanh nghiệp, SEO, pháp lý và hệ thống"
        />
        <Button
          onClick={handleSave}
          disabled={!dirty || saveMutation.isPending}
          className="shadow-sm"
        >
          {saveMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lưu thay đổi
        </Button>
      </div>

      {/* Dirty indicator — always rendered, visibility toggled via CSS to prevent focus loss */}
      <div
        className={`flex items-center gap-2 rounded-sm border px-4 py-2.5 transition-all duration-200 ${
          dirty
            ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 opacity-100 h-auto"
            : "border-transparent bg-transparent opacity-0 h-0 overflow-hidden py-0"
        }`}
      >
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-sm text-amber-700 dark:text-amber-400">
          Có thay đổi chưa lưu. Nhấn "Lưu thay đổi" để áp dụng.
        </span>
      </div>

      {/* 4-Tab Interface */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList variant="line" className="w-full justify-start border-b border-slate-200 dark:border-slate-800 gap-0">
          <TabsTrigger value="general" className="gap-2 px-4">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Tổng quan & Thương hiệu</span>
            <span className="sm:hidden">Tổng quan</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2 px-4">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO & Marketing</span>
            <span className="sm:hidden">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-2 px-4">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Pháp lý & Tài liệu</span>
            <span className="sm:hidden">Pháp lý</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2 px-4">
            <Settings className="h-4 w-4" />
            Hệ thống
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2 px-4">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Trang giới thiệu</span>
            <span className="sm:hidden">Giới thiệu</span>
          </TabsTrigger>
        </TabsList>

        {/* ════ Tab 1: General & Brand ════ */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <SectionCard title="Thông tin doanh nghiệp">
            <div className="grid gap-4 md:grid-cols-2">
              {TAB1_COMPANY.map(renderField)}
            </div>
          </SectionCard>

          <SectionCard title="Logo doanh nghiệp">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Logo chế độ sáng</Label>
                <p className="text-xs text-muted-foreground">
                  Logo hiển thị trên nền trắng/sáng. Khuyến nghị: PNG/WebP nền trong suốt.
                </p>
                <ImageUploadField
                  value={formData.logo_light_url ? [formData.logo_light_url] : []}
                  onChange={(urls) => handleChange("logo_light_url", urls[0] ?? "")}
                  folder="settings"
                  single
                  label=""
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Logo chế độ tối</Label>
                <p className="text-xs text-muted-foreground">
                  Logo hiển thị trên nền đen/tối. Dùng phiên bản trắng hoặc đảo màu.
                </p>
                <ImageUploadField
                  value={formData.logo_dark_url ? [formData.logo_dark_url] : []}
                  onChange={(urls) => handleChange("logo_dark_url", urls[0] ?? "")}
                  folder="settings"
                  single
                  label=""
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Mạng xã hội">
            <div className="grid gap-4 md:grid-cols-2">
              {TAB1_SOCIAL.map(renderField)}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ════ Tab 2: SEO & Marketing ════ */}
        <TabsContent value="seo" className="mt-6 space-y-6">
          <SectionCard title="Thông tin SEO">
            <div className="space-y-4">
              {TAB2_SEO.map(renderField)}
            </div>
            {/* Live SEO Preview */}
            <div className="mt-4 rounded-sm border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Xem trước kết quả Google</p>
              <div className="space-y-0.5">
                <p className="text-lg text-primary font-medium truncate">
                  {formData.site_title || "Song Linh Technologies"}
                </p>
                <p className="text-xs text-green-700 dark:text-green-500">https://sltech.vn</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {formData.site_description || "Mô tả website sẽ hiển thị ở đây..."}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Favicon">
            <div className="max-w-xs">
              <p className="text-xs text-muted-foreground mb-3">
                Favicon hiển thị trên tab trình duyệt. Khuyến nghị: 32×32px hoặc 64×64px.
              </p>
              <ImageUploadField
                value={formData.favicon_url ? [formData.favicon_url] : []}
                onChange={(urls) => handleChange("favicon_url", urls[0] ?? "")}
                folder="settings"
                single
                label=""
              />
            </div>
          </SectionCard>

          <SectionCard title="Tracking & Analytics">
            <div className="space-y-4">
              {TAB2_TRACKING.map(renderField)}
            </div>
            <div className="mt-3 flex items-start gap-2.5 rounded-sm bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-3">
              <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-primary dark:text-primary">
                Các mã tracking được mã hóa khi hiển thị. Nhấn biểu tượng 👁 để xem giá trị thực.
              </p>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ════ Tab 3: Legal & Docs ════ */}
        <TabsContent value="legal" className="mt-6 space-y-6">
          <SectionCard title="Pháp lý & Tài liệu">
            <div className="space-y-4">
              {TAB3_FIELDS.map(renderField)}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ════ Tab 4: System ════ */}
        <TabsContent value="system" className="mt-6 space-y-6">
          <SectionCard title="Chế độ hoạt động">
            <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-amber-500" />
                  Chế độ bảo trì
                </Label>
                <p className="text-xs text-muted-foreground">
                  Khi bật, website sẽ hiển thị trang "Đang bảo trì" cho khách truy cập. Admin vẫn truy cập bình thường.
                </p>
              </div>
              <Switch
                checked={formData.maintenance_mode === "true"}
                onCheckedChange={(checked) => handleChange("maintenance_mode", checked ? "true" : "false")}
              />
            </div>
            {formData.maintenance_mode === "true" && (
              <div className="flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  ⚠️ Website đang ở chế độ bảo trì — khách truy cập sẽ không thấy nội dung.
                </span>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Google Maps">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Google Maps Embed URL
              </Label>
              <Textarea
                value={formData.map_embed_url ?? ""}
                onChange={(e) => handleChange("map_embed_url", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                rows={3}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                URL iframe từ Google Maps. Sử dụng "Chia sẻ → Nhúng bản đồ" từ Google Maps.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Cache & Performance">
            <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  Xóa Cache hệ thống
                </Label>
                <p className="text-xs text-muted-foreground">
                  Xóa toàn bộ cache cấu hình trên Cloudflare KV. Website sẽ tải lại từ database.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCacheMutation.mutate()}
                disabled={clearCacheMutation.isPending}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {clearCacheMutation.isPending ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                )}
                Xóa Cache
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ════ Tab 5: About Page ════ */}
        <TabsContent value="about" className="mt-6 space-y-6">
          <SectionCard title="Ảnh bìa trang Giới thiệu">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ảnh Hero (full-width)</Label>
              <p className="text-xs text-muted-foreground">Ảnh chất lượng cao của dự án thực tế. Khuyến nghị: 1920×800px hoặc lớn hơn.</p>
              <ImageUploadField
                value={formData.about_hero_image ? [formData.about_hero_image] : []}
                onChange={(urls) => handleChange("about_hero_image", urls[0] ?? "")}
                folder="settings"
                single
                label=""
              />
            </div>
          </SectionCard>

          <SectionCard title="Giới thiệu công ty">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Mô tả công ty (Markdown)
                </Label>
                <Textarea
                  value={formData.about_description ?? ""}
                  onChange={(e) => handleChange("about_description", e.target.value)}
                  placeholder="**Song Linh Technologies** là công ty chuyên về..."
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Hỗ trợ **in đậm**, *in nghiêng*. Dùng dòng trống để tách đoạn.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Tầm nhìn & Sứ mệnh">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Tầm nhìn
                </Label>
                <Textarea
                  value={formData.about_vision ?? ""}
                  onChange={(e) => handleChange("about_vision", e.target.value)}
                  placeholder="Trở thành đối tác công nghệ hàng đầu..."
                  rows={4}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Sứ mệnh
                </Label>
                <Textarea
                  value={formData.about_mission ?? ""}
                  onChange={(e) => handleChange("about_mission", e.target.value)}
                  placeholder="Cung cấp giải pháp công nghệ tối ưu..."
                  rows={4}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Thành tích & Số liệu">
            <DynamicListEditor
              label="Số liệu nổi bật"
              description='Hiển thị trên trang Chủ và Giới thiệu. VD: "10+" "Năm kinh nghiệm"'
              fields={[
                { key: "icon", label: "Icon", type: "icon" as const },
                { key: "value", label: "Số", type: "number" as const, placeholder: "500" },
                { key: "suffix", label: "Hậu tố", type: "text" as const, placeholder: "+" },
                { key: "label", label: "Nhãn", type: "text" as const, placeholder: "Dự án hoàn thành" },
              ] satisfies DynamicField[]}
              items={(() => {
                try { return JSON.parse(formData.company_stats || "[]"); } catch { return []; }
              })()}
              onChange={(items) => handleChange("company_stats", JSON.stringify(items))}
              createEmpty={() => ({ icon: "", value: 0, suffix: "+", label: "" })}
              maxItems={8}
            />
          </SectionCard>

          <SectionCard title="Giá trị cốt lõi">
            <DynamicListEditor
              label="Giá trị cốt lõi"
              description="3-6 giá trị thể hiện bản sắc doanh nghiệp"
              fields={[
                { key: "icon", label: "Icon", type: "icon" as const },
                { key: "title", label: "Tiêu đề", type: "text" as const, placeholder: "Chất lượng" },
                { key: "description", label: "Mô tả", type: "textarea" as const, placeholder: "Cam kết sử dụng thiết bị chính hãng..." },
              ] satisfies DynamicField[]}
              items={(() => {
                try { return JSON.parse(formData.core_values || "[]"); } catch { return []; }
              })()}
              onChange={(items) => handleChange("core_values", JSON.stringify(items))}
              createEmpty={() => ({ icon: "Shield", title: "", description: "" })}
              maxItems={6}
            />
          </SectionCard>

          <SectionCard title='"Tại sao chọn Song Linh Technologies?"'>
            <DynamicListEditor
              label="Ưu thế cạnh tranh"
              description="4 lý do hàng đầu để khách hàng B2B tin tưởng"
              fields={[
                { key: "icon", label: "Icon", type: "icon" as const },
                { key: "title", label: "Tiêu đề", type: "text" as const, placeholder: "Đội ngũ kỹ sư chứng chỉ" },
                { key: "description", label: "Mô tả", type: "textarea" as const, placeholder: "Kỹ sư được đào tạo và cấp chứng chỉ từ..." },
              ] satisfies DynamicField[]}
              items={(() => {
                try { return JSON.parse(formData.why_choose_us || "[]"); } catch { return []; }
              })()}
              onChange={(items) => handleChange("why_choose_us", JSON.stringify(items))}
              createEmpty={() => ({ icon: "ShieldCheck", title: "", description: "" })}
              maxItems={6}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
