import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Trash2,
  Minus,
  Plus,
  Send,
  Loader2,
  ShoppingCart,
  ArrowLeft,
  Package,
  CheckCircle2,
  Mail,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { isHoneypotTriggered } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuoteFormData } from "@/types";

const initialForm: QuoteFormData = {
  company_name: "",
  customer_name: "",
  phone: "",
  email: "",
  project_name: "",
  notes: "",
};

export default function QuoteCart() {
  const { items, itemCount, removeItem, updateQuantity, updateItemNotes, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<QuoteFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [honeypot, setHoneypot] = useState("");

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.company_name.trim()) errs.company_name = "Vui lòng nhập tên công ty";
    if (!form.customer_name.trim()) errs.customer_name = "Vui lòng nhập tên người liên hệ";
    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    if (!form.email.trim()) {
      errs.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email không hợp lệ";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function update(field: keyof QuoteFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || items.length === 0) return;
    if (isHoneypotTriggered(honeypot)) return;

    setSubmitting(true);
    try {
      const result = await api.quotations.submit({
        ...form,
        items: items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          product_image: item.imageUrl ?? null,
          category_name: item.categoryName ?? null,
          quantity: item.quantity,
          notes: item.notes ?? null,
        })),
      });

      setQuoteId(result.id);
      setSubmitted(true);
      clearCart();
      setForm(initialForm);
    } catch (err) {
      console.error("Quote submit error:", err);
      toast.error("Gửi yêu cầu thất bại", {
        description: "Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          Yêu cầu báo giá đã được gửi thành công!
        </h1>

        {/* RFQ ID Badge */}
        {quoteId && (
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-sm border border-primary/20 bg-primary/5 px-4 py-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Mã yêu cầu: SLTECH_RFQ_{quoteId}
            </span>
          </div>
        )}

        <div className="mx-auto mb-8 max-w-md space-y-3">
          <div className="flex items-start gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-left">
            <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Email xác nhận đã được gửi</p>
              <p className="text-xs text-emerald-600">
                Vui lòng kiểm tra hộp thư (bao gồm thư mục Spam) để nhận xác nhận và bảng báo giá Excel.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Đội ngũ Song Linh Technologies sẽ phản hồi trong vòng <strong>24 — 48 giờ</strong> làm việc.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate("/san-pham")}>
            Tiếp tục duyệt sản phẩm
          </Button>
          <Button onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <ShoppingCart className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          Giỏ hàng báo giá trống
        </h1>
        <p className="mb-8 text-slate-500">
          Hãy duyệt sản phẩm và thêm vào danh sách báo giá.
        </p>
        <Button onClick={() => navigate("/san-pham")}>
          <Package className="mr-2 h-4 w-4" />
          Duyệt sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link to="/san-pham" className="hover:text-primary transition-colors">Sản phẩm</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-slate-900">Giỏ hàng báo giá</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
            📋 Giỏ hàng báo giá
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {items.length} sản phẩm · {itemCount} đơn vị
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Product Table — 3 cols */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Sản phẩm</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 w-[120px]">Số lượng</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.productId} className="group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-12 w-12 rounded-sm border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/san-pham/${item.slug}`}
                              className="font-medium text-slate-900 hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            {item.categoryName && (
                              <p className="text-xs text-slate-400">{item.categoryName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-sm border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val > 0) updateQuantity(item.productId, val);
                            }}
                            className="h-7 w-12 rounded-sm border border-slate-300 text-center text-sm font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-sm border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-slate-300 transition-colors hover:text-red-500"
                          title="Xoá"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clear cart */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <button
                onClick={() => {
                  if (confirm("Xoá toàn bộ giỏ hàng?")) clearCart();
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Xoá tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Customer Form — 2 cols */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              📝 Thông tin liên hệ
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Honeypot */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qc-company">
                  Tên công ty <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="qc-company"
                  placeholder="Công ty TNHH ABC"
                  value={form.company_name}
                  onChange={(e) => update("company_name", e.target.value)}
                />
                {errors.company_name && (
                  <p className="text-xs text-red-500">{errors.company_name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qc-project">Tên dự án</Label>
                <Input
                  id="qc-project"
                  placeholder="VD: Tòa nhà XYZ - Phase 2"
                  value={form.project_name}
                  onChange={(e) => update("project_name", e.target.value)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="qc-name">
                    Người liên hệ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="qc-name"
                    placeholder="Họ và tên"
                    value={form.customer_name}
                    onChange={(e) => update("customer_name", e.target.value)}
                  />
                  {errors.customer_name && (
                    <p className="text-xs text-red-500">{errors.customer_name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qc-phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="qc-phone"
                    type="tel"
                    placeholder="0901 234 567"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qc-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="qc-email"
                  type="email"
                  placeholder="email@company.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qc-notes">Ghi chú</Label>
                <Textarea
                  id="qc-notes"
                  placeholder="Yêu cầu đặc biệt, thời gian cần hàng..."
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting || items.length === 0}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Gửi yêu cầu báo giá ({itemCount} SP)
                  </>
                )}
              </Button>
            </form>

            {/* Process info */}
            <div className="mt-4 rounded-sm bg-blue-50 p-3">
              <p className="text-xs font-semibold text-primary">ℹ️ Quy trình</p>
              <ol className="mt-1.5 space-y-0.5 text-xs text-primary/80">
                <li>1. Chọn sản phẩm & gửi yêu cầu</li>
                <li>2. Song Linh Technologies tiếp nhận & tư vấn</li>
                <li>3. Nhận báo giá qua email (24-48h)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
