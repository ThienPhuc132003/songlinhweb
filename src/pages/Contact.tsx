import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SITE } from "@/lib/constants";
import { useSiteConfig } from "@/hooks/useApi";
import {
  isHoneypotTriggered,
} from "@/lib/email";
import { TurnstileWidget, isTurnstileEnabled } from "@/components/ui/TurnstileWidget";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  Building2,
} from "lucide-react";
import type { ContactForm as ContactFormData } from "@/types";

const initialForm: ContactFormData = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  message: "",
};

export default function Contact() {
  const { data: config } = useSiteConfig();
  const c = config || {};
  
  const phone = c.company_hotline || SITE.phone;
  const email = c.company_email || SITE.email;
  const address = c.company_address || SITE.address;
  const workingHours = c.company_hours || SITE.workingHours;
  const mapEmbedUrl = c.map_embed_url || SITE.mapEmbedUrl;
  const displayName = c.company_name || SITE.displayName;

  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.company_name.trim())
      errs.company_name = "Vui lòng nhập tên công ty";
    if (!form.email.trim()) {
      errs.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email không hợp lệ";
    }
    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    if (!form.message.trim()) errs.message = "Vui lòng nhập nội dung";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function update(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (isHoneypotTriggered(honeypotRef.current?.value ?? "")) {
      console.warn("[Contact] Honeypot triggered — submission blocked.");
      return;
    }
    setSubmitting(true);
    try {
      // Save to database via backend API (also sends Resend email notification)
      await api.contact({ ...form, cf_turnstile_response: turnstileToken ?? undefined });

      toast.success("Gửi yêu cầu thành công!", {
        description: "Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
      });
      setForm(initialForm);
    } catch {
      toast.error("Gửi yêu cầu thất bại", {
        description: "Vui lòng thử lại hoặc gọi trực tiếp qua hotline.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      label: "Hotline",
      value: phone,
      href: `tel:${phone.replace(/\D/g, '')}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    { icon: MapPin, label: "Địa chỉ", value: address },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: `Thứ 2 – Thứ 7: ${workingHours}`,
    },
  ];

  return (
    <>
      <SEO
        title="Liên hệ"
        description={`Liên hệ ${displayName} để được tư vấn giải pháp công nghệ cho doanh nghiệp.`}
        url="/lien-he"
      />

      <PageHero
        title="Liên hệ"
        subtitle="Liên hệ ngay để được tư vấn giải pháp phù hợp"
        breadcrumbs={[{ label: "Liên hệ" }]}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Gửi yêu cầu tư vấn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot — hidden from real users, obscure name to avoid autofill */}
                    <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden>
                      <input
                        type="text"
                        name="url_field_hp"
                        tabIndex={-1}
                        autoComplete="new-password"
                        ref={honeypotRef}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="company_name">
                          Tên công ty{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company_name"
                          placeholder="VD: Công ty TNHH ABC"
                          value={form.company_name}
                          onChange={(e) =>
                            update("company_name", e.target.value)
                          }
                        />
                        {errors.company_name && (
                          <p className="text-destructive text-xs">
                            {errors.company_name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contact_person">Người liên hệ</Label>
                        <Input
                          id="contact_person"
                          placeholder="Họ và tên"
                          value={form.contact_person}
                          onChange={(e) =>
                            update("contact_person", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone">
                          Số điện thoại{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0901 234 567"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                        />
                        {errors.phone && (
                          <p className="text-destructive text-xs">
                            {errors.phone}
                          </p>
                        )}
                      </div>

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
                          <p className="text-destructive text-xs">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          placeholder="Địa chỉ công ty"
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="message">
                          Nội dung{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Mô tả yêu cầu tư vấn, nhu cầu hệ thống..."
                          rows={4}
                          value={form.message}
                          onChange={(e) => update("message", e.target.value)}
                        />
                        {errors.message && (
                          <p className="text-destructive text-xs">
                            {errors.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <TurnstileWidget
                      onSuccess={setTurnstileToken}
                      onExpire={() => setTurnstileToken(null)}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={submitting || (isTurnstileEnabled() && !turnstileToken)}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Gửi yêu cầu
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info + Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="bg-primary/10 flex-shrink-0 rounded-sm p-2">
                        <item.icon className="text-primary h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-primary text-sm hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Map */}
              <div className="aspect-video overflow-hidden rounded-sm border">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${displayName} map`}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
