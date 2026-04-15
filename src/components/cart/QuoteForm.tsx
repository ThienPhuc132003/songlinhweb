import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { isHoneypotTriggered } from "@/lib/email";
import type { QuoteFormData } from "@/types";

interface QuoteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm: QuoteFormData = {
  company_name: "",
  customer_name: "",
  phone: "",
  email: "",
  project_name: "",
  notes: "",
};

export function QuoteForm({ open, onOpenChange }: QuoteFormProps) {
  const { items, clearCart } = useCart();
  const [form, setForm] = useState<QuoteFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
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
    if (isHoneypotTriggered(honeypot)) return; // silent fail for bots

    setSubmitting(true);
    try {
      // 1. Save to backend DB
      await api.quotations.submit({
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

      toast.success("Yêu cầu báo giá đã được gửi thành công!", {
        description: "Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
      });
      clearCart();
      setForm(initialForm);
      onOpenChange(false);
    } catch (err) {
      console.error("Quote submit error:", err);
      toast.error("Gửi yêu cầu thất bại", {
        description: "Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gửi yêu cầu báo giá</DialogTitle>
          <DialogDescription>
            {items.length} sản phẩm trong giỏ hàng. Vui lòng điền thông tin để
            nhận báo giá.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot — hidden from real users */}
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

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Company */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="company_name">
                Tên công ty <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company_name"
                placeholder="VD: Công ty TNHH ABC"
                value={form.company_name}
                onChange={(e) => update("company_name", e.target.value)}
              />
              {errors.company_name && (
                <p className="text-destructive text-xs">{errors.company_name}</p>
              )}
            </div>

            {/* Project Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="project_name">
                Tên dự án
              </Label>
              <Input
                id="project_name"
                placeholder="VD: Tòa nhà XYZ - Phase 2"
                value={form.project_name}
                onChange={(e) => update("project_name", e.target.value)}
              />
            </div>

            {/* Contact person */}
            <div className="space-y-1.5">
              <Label htmlFor="customer_name">
                Người liên hệ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer_name"
                placeholder="Họ và tên"
                value={form.customer_name}
                onChange={(e) => update("customer_name", e.target.value)}
              />
              {errors.customer_name && (
                <p className="text-destructive text-xs">{errors.customer_name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0901 234 567"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              {errors.phone && (
                <p className="text-destructive text-xs">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@company.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Yêu cầu đặc biệt, số lượng lớn, thời gian cần hàng..."
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Items summary */}
          <div className="bg-muted/50 rounded-sm p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide">
              Sản phẩm yêu cầu ({items.length})
            </p>
            <ul className="space-y-1">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="text-muted-foreground flex justify-between text-sm"
                >
                  <span className="line-clamp-1 mr-2">{item.name}</span>
                  <span className="flex-shrink-0">x{item.quantity}</span>
                </li>
              ))}
            </ul>
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
                Gửi yêu cầu báo giá
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
