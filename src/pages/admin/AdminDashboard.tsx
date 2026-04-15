import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
  Handshake,
  FileText,
  Mail,
  Activity,
  Database,
  HardDrive,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ═══════════════════════════════════════════════
 *  TREND BADGE
 * ═══════════════════════════════════════════════ */

function TrendBadge({
  current,
  previous,
  label,
}: {
  current: number;
  previous: number;
  label: string;
}) {
  const delta = current - previous;
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <TrendingUp className="h-3 w-3" />
        +{delta} {label}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
        <TrendingDown className="h-3 w-3" />
        {delta} {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
      <Minus className="h-3 w-3" />
      Không đổi
    </span>
  );
}

/* ═══════════════════════════════════════════════
 *  STATUS BADGE
 * ═══════════════════════════════════════════════ */

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "new":
      return <Badge variant="destructive">Mới</Badge>;
    case "processing":
      return <Badge variant="secondary">Đang xử lý</Badge>;
    case "sent":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 border-none text-white">
          Đã gửi
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none text-white">
          Hoàn thành
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

/* ═══════════════════════════════════════════════
 *  CHART TOOLTIP
 * ═══════════════════════════════════════════════ */

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  // label = "2026-04-10" → "10/04"
  const parts = label?.split("-");
  const formatted = parts ? `${parts[2]}/${parts[1]}` : label;
  return (
    <div className="rounded-sm border bg-background px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{formatted}</p>
      <p className="text-sm font-semibold">
        {payload[0].value} yêu cầu
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
 *  STORAGE PROGRESS BAR
 * ═══════════════════════════════════════════════ */

function StorageRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-slate-700">
          {count.toLocaleString()}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/70 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
 *  MAIN DASHBOARD
 * ═══════════════════════════════════════════════ */

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
      color: "text-blue-600 bg-blue-50",
      href: "/admin/products",
    },
    {
      label: "Dự Án Nổi Bật",
      value: data?.featuredProjects ?? "—",
      icon: Handshake,
      color: "text-indigo-600 bg-indigo-50",
      href: "/admin/projects",
    },
    {
      label: "Báo Giá Chưa Đọc",
      value: data?.unreadQuotes ?? "—",
      icon: FileText,
      color: "text-rose-600 bg-rose-50",
      href: "/admin/quotations",
      trend:
        data?.trends && (
          <TrendBadge
            current={data.trends.quotesThisWeek}
            previous={data.trends.quotesLastWeek}
            label="tuần này"
          />
        ),
    },
    {
      label: "Liên Hệ Chưa Đọc",
      value: data?.unreadContacts ?? "—",
      icon: Mail,
      color: "text-amber-600 bg-amber-50",
      href: "/admin/contacts",
      trend:
        data?.trends && (
          <TrendBadge
            current={data.trends.contactsThisWeek}
            previous={data.trends.contactsLastWeek}
            label="tuần này"
          />
        ),
    },
  ];

  // Prepare chart data: fill all 30 days even if some have 0
  const chartData = (() => {
    if (!data?.dailyQuotesChart) return [];
    const map = new Map(
      data.dailyQuotesChart.map((d) => [d.day, d.cnt]),
    );
    const days: Array<{ day: string; label: string; cnt: number }> = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dd = key.slice(8, 10);
      const mm = key.slice(5, 7);
      days.push({
        day: key,
        label: `${dd}/${mm}`,
        cnt: map.get(key) ?? 0,
      });
    }
    return days;
  })();

  // D1 storage max for progress bars
  const d1Entries = data?.storage?.d1;
  const d1Max = d1Entries
    ? Math.max(
        d1Entries.products,
        d1Entries.projects,
        d1Entries.contacts,
        d1Entries.quotations,
        d1Entries.posts,
        1,
      )
    : 1;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Business Intelligence
        </h1>
        <p className="text-muted-foreground">
          Tổng quan hiệu suất vận hành hệ thống SLTECH
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.href} className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/30 group-hover:bg-slate-50/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {s.label}
                </CardTitle>
                <div className={`rounded-sm p-2.5 ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {dashStats.isLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    s.value
                  )}
                </div>
                {"trend" in s && s.trend && (
                  <div className="mt-1.5">{s.trend}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Area Chart: Quotation Trend (30 days) ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Xu hướng Yêu cầu Báo giá
            </CardTitle>
            <CardDescription>
              Dữ liệu 30 ngày gần nhất
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            Số lượng yêu cầu
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {dashStats.isLoading ? (
            <div className="h-[280px] flex items-center justify-center">
              <span className="text-sm text-muted-foreground animate-pulse">
                Đang tải biểu đồ...
              </span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
              <Activity className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">
                Chưa có dữ liệu
              </p>
              <p className="text-xs text-slate-400">
                Biểu đồ sẽ hiển thị khi có yêu cầu báo giá
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="quotesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3C5DAA"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#3C5DAA"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cnt"
                  stroke="#3C5DAA"
                  strokeWidth={2.5}
                  fill="url(#quotesGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#3C5DAA",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Bottom Split: Recent Activities + Storage ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Quotes (2/3 width) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Yêu cầu báo giá gần đây
              </CardTitle>
              <CardDescription>
                Danh sách 5 yêu cầu mới nhất từ website
              </CardDescription>
            </div>
            <Link
              to="/admin/quotations"
              className="text-sm text-primary hover:underline font-medium"
            >
              Xem tất cả →
            </Link>
          </CardHeader>
          <CardContent>
            {dashStats.isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded bg-slate-100"
                  />
                ))}
              </div>
            ) : data?.recentQuotes && data.recentQuotes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 border-slate-100 text-slate-500 font-medium">
                      <th className="py-3 px-4 text-left rounded-tl">
                        Mã
                      </th>
                      <th className="py-3 px-4 text-left">
                        Khách hàng
                      </th>
                      <th className="py-3 px-4 text-left whitespace-nowrap">
                        Dự án
                      </th>
                      <th className="py-3 px-4 text-center">
                        Trạng thái
                      </th>
                      <th className="py-3 px-4 text-right rounded-tr">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentQuotes.map((q) => (
                      <tr
                        key={q.id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-slate-500">
                          #{q.id}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {q.customer_name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 line-clamp-1">
                          {q.project_name || "—"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={q.status} />
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 whitespace-nowrap">
                          {new Date(q.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
                <FileText className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  Chưa có dữ liệu
                </p>
                <p className="text-xs text-slate-400">
                  Hệ thống chưa nhận được yêu cầu nào
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage Monitor (1/3 width) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Hệ thống Lưu trữ
            </CardTitle>
            <CardDescription>D1 Database & R2 Storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {dashStats.isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 animate-pulse rounded bg-slate-100"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* D1 Section */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      D1 Database
                    </span>
                  </div>
                  <div className="space-y-3">
                    <StorageRow
                      label="Sản phẩm"
                      count={d1Entries?.products ?? 0}
                      max={d1Max}
                    />
                    <StorageRow
                      label="Dự án"
                      count={d1Entries?.projects ?? 0}
                      max={d1Max}
                    />
                    <StorageRow
                      label="Báo giá"
                      count={d1Entries?.quotations ?? 0}
                      max={d1Max}
                    />
                    <StorageRow
                      label="Liên hệ"
                      count={d1Entries?.contacts ?? 0}
                      max={d1Max}
                    />
                    <StorageRow
                      label="Bài viết"
                      count={d1Entries?.posts ?? 0}
                      max={d1Max}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* R2 Section */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <HardDrive className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      R2 Storage
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 font-mono">
                      {data?.storage?.r2ObjectCount === 1000
                        ? "1,000+"
                        : (
                            data?.storage?.r2ObjectCount ?? 0
                          ).toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      objects
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
