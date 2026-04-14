import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, TrendingUp, Handshake, FileText, Mail, Activity } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const dashStats = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: adminApi.dashboard.stats,
  });

  const { data } = dashStats;

  const stats = [
    {
      label: "Tổng Sản Phẩm",
      value: data?.totalProducts ?? "—",
      icon: Package,
      color: "text-blue-600 bg-blue-100",
      href: "/admin/products",
    },
    {
      label: "Dự Án Nổi Bật",
      value: data?.featuredProjects ?? "—",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-100",
      href: "/admin/projects",
    },
    {
      label: "Báo Giá Chưa Đọc",
      value: data?.unreadQuotes ?? "—",
      icon: FileText,
      color: "text-rose-600 bg-rose-100",
      href: "/admin/quotations",
    },
    {
      label: "Liên Hệ Chưa Đọc",
      value: data?.unreadContacts ?? "—",
      icon: Mail,
      color: "text-amber-600 bg-amber-100",
      href: "/admin/contacts",
    },
  ];

  const chartMax = data?.quotesChart ? Math.max(...data.quotesChart.map((c) => c.cnt), 1) : 1;

  function formatStatus(status: string) {
    if (status === "new") return <Badge variant="destructive">Mới</Badge>;
    if (status === "read") return <Badge variant="secondary">Đang xử lý</Badge>;
    if (status === "replied") return <Badge className="bg-green-500 hover:bg-green-600 border-none">Đã phản hồi</Badge>;
    if (status === "archived") return <Badge variant="outline">Lưu trữ</Badge>;
    return <Badge>{status}</Badge>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Intelligence</h1>
        <p className="text-muted-foreground">Tổng quan hiệu suất vận hành hệ thống SLTECH</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.href} className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/30 group-hover:bg-slate-50/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {s.label}
                </CardTitle>
                <div className={`rounded-lg p-2 ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {dashStats.isLoading ? "..." : s.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Quotes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Yêu cầu báo giá gần đây
              </CardTitle>
              <CardDescription>Danh sách 5 yêu cầu mới nhất từ website</CardDescription>
            </div>
            <Link to="/admin/quotations" className="text-sm text-primary hover:underline font-medium">
              Xem tất cả →
            </Link>
          </CardHeader>
          <CardContent>
            {dashStats.isLoading ? (
              <p className="text-muted-foreground text-sm">Đang tải...</p>
            ) : data?.recentQuotes && data.recentQuotes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 border-slate-100 text-slate-500 font-medium">
                      <th className="py-3 px-4 text-left rounded-tl">Mã</th>
                      <th className="py-3 px-4 text-left">Khách hàng</th>
                      <th className="py-3 px-4 text-left whitespace-nowrap">Dự án</th>
                      <th className="py-3 px-4 text-center">Trạng thái</th>
                      <th className="py-3 px-4 text-right rounded-tr">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentQuotes.map((q) => (
                      <tr key={q.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500">#{q.id}</td>
                        <td className="py-3 px-4 font-medium">{q.customer_name}</td>
                        <td className="py-3 px-4 text-slate-600 line-clamp-1">{q.project_name || "—"}</td>
                        <td className="py-3 px-4 text-center">{formatStatus(q.status)}</td>
                        <td className="py-3 px-4 text-right text-slate-500 whitespace-nowrap">
                           {new Date(q.created_at).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-lg dashed border border-slate-200">
                <FileText className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">Chưa có dữ liệu</p>
                <p className="text-xs text-slate-400">Hệ thống chưa nhận được yêu cầu nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <Card className="lg:col-span-1 border-t-4 border-t-primary h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Lượng Request (6 tháng)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!data?.quotesChart || data.quotesChart.length === 0 ? (
              <p className="text-muted-foreground text-sm">Chưa có dữ liệu</p>
            ) : (
              <div className="flex items-end justify-between gap-2 h-[200px] mt-4 border-b border-slate-200 pb-2">
                {data.quotesChart.map((item) => {
                  const heightPercent = `${(item.cnt / chartMax) * 100}%`;
                  // item.month = "2026-04" -> output "04/26"
                  const [yyyy, mm] = item.month.split("-");
                  return (
                    <div key={item.month} className="flex flex-col items-center justify-end w-full group relative">
                       {/* Tooltip */}
                       <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                         {item.cnt} yêu cầu
                       </div>
                       {/* Bar */}
                      <div 
                        className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary rounded-t-sm transition-colors duration-300"
                        style={{ height: Math.max((item.cnt / chartMax) * 200, 4) + 'px' }}
                      />
                      {/* X-axis */}
                      <span className="text-[10px] text-slate-500 mt-2 whitespace-nowrap">{mm}/{yyyy.slice(-2)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-6 flex items-center gap-2">
               <div className="w-3 h-3 bg-primary rounded-sm"></div>
               <span className="text-xs text-slate-600">Yêu cầu báo giá</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
