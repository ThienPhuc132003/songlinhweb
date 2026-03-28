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
