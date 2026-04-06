import { useQuery } from "@tanstack/react-query";
import { adminApi, type DashboardStats } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightbulb,
  FolderKanban,
  Package,
  FileText,
  Mail,
  Handshake,
  Image,
  Tag,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router";

export default function AdminDashboard() {
  const solutions = useQuery({
    queryKey: ["admin", "solutions"],
    queryFn: adminApi.solutions.list,
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
  const albums = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: adminApi.gallery.albums,
  });

  // New dedicated dashboard stats API
  const dashStats = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: adminApi.dashboard.stats,
  });

  const stats = [
    {
      label: "Sản phẩm",
      value: dashStats.data?.totalProducts ?? "—",
      icon: Package,
      color: "text-blue-600 bg-blue-50",
      href: "/admin/products",
    },
    {
      label: "Thương hiệu",
      value: dashStats.data?.totalBrands ?? "—",
      icon: Tag,
      color: "text-indigo-600 bg-indigo-50",
      href: "/admin/brands",
    },
    {
      label: "Danh mục SP",
      value: dashStats.data?.totalCategories ?? "—",
      icon: FolderKanban,
      color: "text-orange-600 bg-orange-50",
      href: "/admin/categories",
    },
    {
      label: "Dự án",
      value: dashStats.data?.totalProjects ?? "—",
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
      href: "/admin/projects",
    },
    {
      label: "Giải pháp",
      value: solutions.data?.length ?? "—",
      icon: Lightbulb,
      color: "text-cyan-600 bg-cyan-50",
      href: "/admin/solutions",
    },
    {
      label: "Bài viết",
      value: posts.data?.length ?? "—",
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
      href: "/admin/posts",
    },
    {
      label: "Thư viện",
      value: albums.data?.length ?? "—",
      icon: Image,
      color: "text-pink-600 bg-pink-50",
      href: "/admin/gallery",
    },
    {
      label: "Đối tác",
      value: partners.data?.length ?? "—",
      icon: Handshake,
      color: "text-teal-600 bg-teal-50",
      href: "/admin/partners",
    },
    {
      label: "Liên hệ",
      value: contacts.data?.length ?? "—",
      icon: Mail,
      color: "text-red-600 bg-red-50",
      href: "/admin/contacts",
    },
  ];

  const newContacts = (contacts.data || []).filter((c) => c.status === "new");
  const recentProducts = dashStats.data?.recentProducts ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống Song Linh Technologies</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} to={s.href} className="group">
            <Card className="transition-all hover:shadow-md hover:border-blue-200 group-hover:bg-slate-50/50">
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
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Sản phẩm mới thêm
            </CardTitle>
            <Link
              to="/admin/products"
              className="text-sm text-blue-600 hover:underline"
            >
              Xem tất cả →
            </Link>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">Chưa có sản phẩm nào</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-200">
                        <Package className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {p.brand_name ?? "—"}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-500" />
              Liên hệ mới ({newContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {newContacts.length === 0 ? (
              <p className="text-muted-foreground text-sm">Không có liên hệ mới</p>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
