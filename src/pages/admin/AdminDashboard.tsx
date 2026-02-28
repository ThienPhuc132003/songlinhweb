import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightbulb,
  FolderKanban,
  Package,
  FileText,
  Mail,
  Handshake,
  Image,
} from "lucide-react";

export default function AdminDashboard() {
  const solutions = useQuery({
    queryKey: ["admin", "solutions"],
    queryFn: adminApi.solutions.list,
  });
  const projects = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: adminApi.projects.list,
  });
  const posts = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: adminApi.posts.list,
  });
  const partners = useQuery({
    queryKey: ["admin", "partners"],
    queryFn: adminApi.partners.list,
  });
  const contacts = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: adminApi.contacts.list,
  });
  const categories = useQuery({
    queryKey: ["admin", "productCategories"],
    queryFn: adminApi.productCategories.list,
  });
  const albums = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: adminApi.gallery.albums,
  });

  const stats = [
    {
      label: "Giải pháp",
      value: solutions.data?.length ?? "—",
      icon: Lightbulb,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Dự án",
      value: projects.data?.length ?? "—",
      icon: FolderKanban,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Danh mục SP",
      value: categories.data?.length ?? "—",
      icon: Package,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Bài viết",
      value: posts.data?.length ?? "—",
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Thư viện",
      value: albums.data?.length ?? "—",
      icon: Image,
      color: "text-pink-600 bg-pink-50",
    },
    {
      label: "Đối tác",
      value: partners.data?.length ?? "—",
      icon: Handshake,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: "Liên hệ",
      value: contacts.data?.length ?? "—",
      icon: Mail,
      color: "text-red-600 bg-red-50",
    },
  ];

  const newContacts = (contacts.data || []).filter((c) => c.status === "new");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống SLTECH</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {s.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent contacts */}
      {newContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Liên hệ mới ({newContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {newContacts.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="flex items-start justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{c.company_name}</p>
                    <p className="text-muted-foreground text-xs">
                      {c.contact_person} · {c.email} · {c.phone}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                      {c.message}
                    </p>
                  </div>
                  <span className="text-muted-foreground ml-4 text-xs whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
