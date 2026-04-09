import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Trash2,
  Eye,
  Calendar,
  Building2,
  Phone,
  Mail,
  Package,
  Filter,
  RefreshCw,
  FolderKanban,
  Download,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuotationRequest, QuotationItem, QuoteStatus } from "@/types";

/** Status configuration */
const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; color: string; bg: string }
> = {
  new: { label: "Mới", color: "text-primary", bg: "bg-primary/10 border-primary/30" },
  processing: { label: "Đang xử lý", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  sent: { label: "Đã gửi", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  completed: { label: "Hoàn tất", color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

const ALL_STATUSES: QuoteStatus[] = ["new", "processing", "sent", "completed"];

function StatusBadge({ status }: { status: QuoteStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export default function AdminQuotations() {
  const [quotes, setQuotes] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<QuotationRequest | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.quotations.list({
        status: filterStatus || undefined,
        page,
        limit: 20,
      });
      setQuotes(result.items ?? []);
      setTotalPages(result.totalPages ?? 1);
      setTotal(result.total ?? 0);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách yêu cầu báo giá");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, page]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      await adminApi.quotations.updateStatus(id, newStatus);
      toast.success(`Đã cập nhật trạng thái → ${STATUS_CONFIG[newStatus as QuoteStatus]?.label ?? newStatus}`);
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus as QuoteStatus } : q)),
      );
      if (expandedDetail?.id === id) {
        setExpandedDetail((prev) => (prev ? { ...prev, status: newStatus as QuoteStatus } : null));
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi cập nhật trạng thái");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xác nhận xoá yêu cầu báo giá này?")) return;
    try {
      await adminApi.quotations.delete(id);
      toast.success("Đã xoá yêu cầu báo giá");
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (expandedId === id) {
        setExpandedId(null);
        setExpandedDetail(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi xoá yêu cầu báo giá");
    }
  }

  async function toggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedDetail(null);
      return;
    }
    setExpandedId(id);
    try {
      const detail = await adminApi.quotations.detail(id);
      setExpandedDetail(detail);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải chi tiết");
    }
  }

  // Filter by search term (client-side)
  const filtered = quotes.filter((q) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.customer_name.toLowerCase().includes(term) ||
      q.company_name?.toLowerCase().includes(term) ||
      q.phone.includes(term) ||
      q.email?.toLowerCase().includes(term) ||
      q.project_name?.toLowerCase().includes(term) ||
      `#${q.id}`.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Yêu cầu báo giá
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý {total} yêu cầu báo giá từ khách hàng
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQuotes} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm theo tên, công ty, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Tất cả trạng thái</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">Chưa có yêu cầu báo giá nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Mã</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Khách hàng</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-slate-600 md:table-cell">Công ty</th>
                  <th className="hidden px-4 py-3 text-left font-semibold text-slate-600 lg:table-cell">Dự án</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600">SP</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ngày</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <QuoteRow
                    key={q.id}
                    quote={q}
                    isExpanded={expandedId === q.id}
                    detail={expandedId === q.id ? expandedDetail : null}
                    onToggle={() => toggleExpand(q.id)}
                    onStatusChange={handleStatusChange}
                    onDelete={() => handleDelete(q.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Trang {page} / {totalPages} ({total} yêu cầu)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Individual quote row with expandable detail */
function QuoteRow({
  quote,
  isExpanded,
  detail,
  onToggle,
  onStatusChange,
  onDelete,
}: {
  quote: QuotationRequest;
  isExpanded: boolean;
  detail: QuotationRequest | null;
  onToggle: () => void;
  onStatusChange: (id: number, status: string) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr
        className={`cursor-pointer transition-colors hover:bg-slate-50 ${isExpanded ? "bg-primary/5" : ""}`}
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span className="font-mono text-xs font-bold text-primary">#{quote.id}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <p className="font-medium text-slate-900">{quote.customer_name}</p>
          <p className="text-xs text-slate-500">{quote.phone}</p>
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <span className="text-slate-600">{quote.company_name ?? "—"}</span>
        </td>
        <td className="hidden px-4 py-3 lg:table-cell">
          <span className="max-w-[200px] truncate text-slate-600">
            {quote.project_name ?? "—"}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-700">
            {quote.item_count ?? "?"}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs text-slate-500">{formatDate(quote.created_at)}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <StatusBadge status={quote.status} />
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-primary"
              onClick={onToggle}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-red-600"
              onClick={onDelete}
              title="Xoá"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      {/* Expanded Detail */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="border-b-2 border-primary/20 bg-primary/5 px-6 py-5">
            {!detail ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="ml-2 text-sm text-slate-500">Đang tải...</span>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-3">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Building2 className="h-4 w-4 text-primary" />
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <p><span className="text-slate-400">Họ tên:</span> <strong>{detail.customer_name}</strong></p>
                    {detail.company_name && (
                      <p><span className="text-slate-400">Công ty:</span> {detail.company_name}</p>
                    )}
                    <p className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`https://zalo.me/${detail.phone}`} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1.5 text-primary hover:underline">
                        {detail.phone}
                        <svg className="h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="24" cy="24" r="24" fill="#0068FF"/>
                          <path d="M12.5 34.5c.8-2.3 1.3-4.3 1.3-5.8 0-.4-.1-.7-.3-.9C11.2 25.1 10 22.2 10 19c0-7.2 6.3-13 14-13s14 5.8 14 13-6.3 13-14 13c-1.6 0-3.1-.2-4.5-.7-.4-.1-.8-.1-1.1 0l-3.9 1.3c-.6.2-1.2-.1-1.4-.7-.1-.2-.1-.4-.1-.5l.5-1.7z" fill="white"/>
                          <path d="M17.8 22.2c-.6 0-1 .5-1 1v4.4c0 .6.5 1 1 1s1-.5 1-1v-4.4c0-.6-.4-1-1-1zm8.4-2.6h-1.7c-.4 0-.8.4-.8.8v3l-2.7-3.5c-.2-.2-.4-.3-.7-.3h-.1c-.5.1-.8.4-.8.9v6.1c0 .5.4.8.8.8h.1c.5 0 .8-.4.8-.9v-3l2.7 3.5c.2.2.4.3.7.3h.1c.5 0 .8-.4.8-.9v-6c0-.5-.5-.8-1-.8zm5.8 0h-3c-.4 0-.7.3-.7.7v6.2c0 .4.3.7.7.7h3c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-2.3v-1.7h2.3c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-2.3v-1.7h2.3c.4 0 .7-.3.7-.7s-.3-.7-.7-.7zm-14.5-.1c-.4 0-.7.2-.8.6l-2 6c-.2.5.1.9.6 1.1.5.1.9-.1 1.1-.6l.3-1h2.5l.3 1c.1.5.6.7 1.1.6.5-.2.7-.6.6-1.1l-2-6c-.2-.4-.5-.6-.9-.6h-.8zm-.3 4.5l.7-2.2.7 2.2h-1.4z" fill="#0068FF"/>
                        </svg>
                      </a>
                    </p>
                    {detail.email && (
                      <p className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <a href={`mailto:${detail.email}`} className="text-primary hover:underline">{detail.email}</a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(detail.email!);
                            toast.success("Đã sao chép email");
                          }}
                          className="ml-1 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          title="Sao chép email"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </p>
                    )}
                    {detail.project_name && (
                      <p className="flex items-center gap-1">
                        <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                        <strong className="text-primary">{detail.project_name}</strong>
                      </p>
                    )}
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(detail.created_at)}
                    </p>
                  </div>
                  {detail.note && (
                    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-semibold text-amber-700">📝 Ghi chú</p>
                      <p className="mt-1 text-sm text-amber-800">{detail.note}</p>
                    </div>
                  )}
                </div>

                {/* Items Table */}
                <div className="lg:col-span-2">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Package className="h-4 w-4 text-primary" />
                    Sản phẩm ({detail.items?.length ?? 0})
                  </h4>
                  {detail.items && detail.items.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">STT</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Sản phẩm</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Danh mục</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">SL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detail.items.map((item: QuotationItem, idx: number) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  {item.product_image && (
                                    <img
                                      src={item.product_image}
                                      alt=""
                                      className="h-8 w-8 rounded border border-slate-200 object-cover"
                                    />
                                  )}
                                  <span className="font-medium text-slate-900">{item.product_name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-slate-500">{item.category_name ?? "—"}</td>
                              <td className="px-3 py-2 text-center font-bold text-slate-900">{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Không có sản phẩm</p>
                  )}

                  {/* Actions: Excel Download + Status Change */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await adminApi.quotations.downloadExcel(detail.id);
                            toast.success("Đã tải file Excel");
                          } catch (err) {
                            console.error(err);
                            toast.error("Lỗi tải file Excel");
                          }
                        }}
                        className="bg-primary text-white hover:bg-primary/90 shadow-sm"
                      >
                        <Download className="mr-1.5 h-4 w-4" />
                        Tải Excel
                      </Button>
                      {detail.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-[#0068FF]/30 text-[#0068FF] hover:bg-[#0068FF]/5"
                        >
                          <a
                            href={`https://zalo.me/${detail.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="mr-1.5 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="24" cy="24" r="24" fill="#0068FF"/>
                              <path d="M12.5 34.5c.8-2.3 1.3-4.3 1.3-5.8 0-.4-.1-.7-.3-.9C11.2 25.1 10 22.2 10 19c0-7.2 6.3-13 14-13s14 5.8 14 13-6.3 13-14 13c-1.6 0-3.1-.2-4.5-.7-.4-.1-.8-.1-1.1 0l-3.9 1.3c-.6.2-1.2-.1-1.4-.7-.1-.2-.1-.4-.1-.5l.5-1.7z" fill="white"/>
                            </svg>
                            Chat trên Zalo
                          </a>
                        </Button>
                      )}
                      {detail.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        >
                          <a
                            href={`mailto:${detail.email}?subject=${encodeURIComponent(`[SLTECH] Báo giá #${detail.id}${detail.project_name ? ` - ${detail.project_name}` : ""}`)}&body=${encodeURIComponent(`Kính gửi ${detail.customer_name},\n\nCảm ơn quý khách đã gửi yêu cầu báo giá. Song Linh Technologies xin phản hồi như sau:\n\n---\n\nTrân trọng,\nSong Linh Technologies`)}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="mr-1.5 h-4 w-4" />
                            Gửi Email
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500">Đổi trạng thái:</span>
                      <div className="flex gap-1.5">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => onStatusChange(detail.id, s)}
                            disabled={detail.status === s}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                              detail.status === s
                                ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} cursor-default`
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            {STATUS_CONFIG[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
