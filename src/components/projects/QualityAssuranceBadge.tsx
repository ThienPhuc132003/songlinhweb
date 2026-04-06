import { cn } from "@/lib/utils";
import { ShieldCheck, Award } from "lucide-react";

interface QualityAssuranceBadgeProps {
  className?: string;
}

/**
 * Professional "Quality Assurance" footer badge for project detail pages.
 * Shows Song Linh commitment to quality and compliance standards.
 */
export function QualityAssuranceBadge({ className }: QualityAssuranceBadgeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/3 p-8 md:p-10",
        className,
      )}
    >
      {/* Subtle decorative circle */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />

      <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        {/* Badge icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-center gap-2 md:justify-start">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Quality Assurance
            </h3>
          </div>
          <p className="text-base font-semibold text-foreground">
            Song Linh Technologies — Cam kết Chất lượng
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Mọi dự án đều được thiết kế, thi công và nghiệm thu theo quy trình quản lý chất lượng nghiêm ngặt.
            Đội ngũ kỹ sư chuyên nghiệp đảm bảo hệ thống hoạt động ổn định, đáp ứng các tiêu chuẩn kỹ thuật cao nhất.
          </p>
        </div>
      </div>
    </div>
  );
}
