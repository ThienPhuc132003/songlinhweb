import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Phone, FileText } from "lucide-react";

export function ConsultCTA() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Primary CTA */}
      <div className="rounded-xl bg-primary p-6 text-white shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">
          Tư vấn chuyên gia
        </h3>
        <p className="mb-4 text-sm text-white/80">
          Đội ngũ kỹ sư Song Linh Technologies sẵn sàng tư vấn giải pháp phù hợp cho dự án của bạn
        </p>
        <Button
          asChild
          size="lg"
          className="w-full bg-white !text-[var(--color-primary)] hover:bg-white/90"
        >
          <Link to="/lien-he">
            <Phone className="mr-2 h-4 w-4" />
            Liên hệ ngay
          </Link>
        </Button>
      </div>

      {/* Secondary CTA */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tài liệu kỹ thuật
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Yêu cầu bảng báo giá và thông số kỹ thuật chi tiết
        </p>
        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link to="/lien-he">
            <FileText className="mr-2 h-4 w-4" />
            Yêu cầu khảo sát kỹ thuật
          </Link>
        </Button>
      </div>

      {/* Hotline */}
      <div className="rounded-xl border bg-slate-50 p-4 text-center dark:bg-slate-900">
        <p className="text-xs text-muted-foreground">Hotline tư vấn</p>
        <a
          href="tel:0968811911"
          className="text-xl font-bold text-primary hover:underline"
        >
          0968.811.911
        </a>
      </div>
    </aside>
  );
}

/** Full-width inline CTA — used in the editorial full-width template */
export function ConsultCTAInline() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-[#3C5DAA] to-[#2d4a8a] p-8 text-white shadow-xl md:p-12">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div className="flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
            Bắt đầu dự án
          </p>
          <h3 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Tư vấn giải pháp chuyên nghiệp
          </h3>
          <p className="max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
            Đội ngũ kỹ sư Song Linh Technologies sẵn sàng khảo sát, tư vấn và thiết kế giải pháp phù hợp cho dự án của bạn.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white font-semibold !text-[#3C5DAA] hover:bg-white/90"
          >
            <Link to="/lien-he">
              <Phone className="mr-2 h-4 w-4" />
              Liên hệ ngay
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <a href="tel:0968811911">
              <FileText className="mr-2 h-4 w-4" />
              0968.811.911
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
