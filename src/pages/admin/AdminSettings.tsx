import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type SiteConfig } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/CrudHelpers";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

const configGroups: Record<string, { label: string; keys: string[] }> = {
  company: {
    label: "Thông tin công ty",
    keys: [
      "company_name",
      "company_phone",
      "company_email",
      "company_address",
      "company_hotline",
    ],
  },
  social: {
    label: "Mạng xã hội",
    keys: [
      "social_facebook",
      "social_zalo",
      "social_youtube",
      "social_linkedin",
    ],
  },
  seo: {
    label: "SEO & Meta",
    keys: ["site_title", "site_description", "meta_keywords"],
  },
  other: {
    label: "Khác",
    keys: [], // catch-all for keys not in any group
  },
};

const keyLabels: Record<string, string> = {
  company_name: "Tên công ty",
  company_phone: "Số điện thoại",
  company_email: "Email",
  company_address: "Địa chỉ",
  company_hotline: "Hotline",
  social_facebook: "Facebook URL",
  social_zalo: "Zalo URL",
  social_youtube: "YouTube URL",
  social_linkedin: "LinkedIn URL",
  site_title: "Tiêu đề website",
  site_description: "Mô tả website",
  meta_keywords: "Từ khóa SEO",
};

export default function AdminSettings() {
  const qc = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

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
      setDirty(false);
      toast.success("Đã lưu cấu hình");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  // Assign all known keys to groups, left-over to "other"
  const allKeys = Object.keys(formData);
  const assignedKeys = new Set(
    Object.values(configGroups).flatMap((g) => g.keys),
  );
  const otherKeys = allKeys.filter((k) => !assignedKeys.has(k));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const renderField = (key: string) => {
    const label = keyLabels[key] || key;
    const value = formData[key] ?? "";
    const isLong = key.includes("description") || key.includes("address");
    return (
      <div key={key} className="space-y-1">
        <label className="text-foreground text-sm font-medium">{label}</label>
        {isLong ? (
          <Textarea
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Cài đặt website"
          description="Quản lý cấu hình chung"
        />
        <Button
          onClick={handleSave}
          disabled={!dirty || saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lưu thay đổi
        </Button>
      </div>

      {Object.entries(configGroups).map(([groupKey, group]) => {
        const keys =
          groupKey === "other"
            ? otherKeys
            : group.keys.filter((k) => k in formData);
        if (keys.length === 0) return null;
        return (
          <Card key={groupKey}>
            <CardHeader>
              <CardTitle className="text-base">{group.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {keys.map(renderField)}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
