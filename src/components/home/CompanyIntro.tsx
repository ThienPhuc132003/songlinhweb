import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { COMPANY_ACTIVITIES, SITE } from "@/lib/constants";
import { useSiteConfig } from "@/hooks/useApi";
import { StatsGrid } from "@/components/common/StatsGrid";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";


export function CompanyIntro({ className }: { className?: string }) {
  const { data: config } = useSiteConfig();

  const description = useMemo(() => {
    if (config?.about_description) {
      return config.about_description
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .split("\n\n")[0];
    }
    return `${SITE.name} chuyên cung cấp giải pháp và dịch vụ trọn gói trong lĩnh vực Công nghệ thông tin, Hệ thống M&E và Cơ điện. Với đội ngũ kỹ sư giàu kinh nghiệm, chúng tôi cam kết mang đến chất lượng dịch vụ tốt nhất cho khách hàng.`;
  }, [config]);

  return (
    <section
      className={cn(
        "border-y border-slate-200 bg-[#F8FAFC] py-24 dark:border-border dark:bg-muted/10 md:py-32",
        className,
      )}
    >
      <div className="container-custom">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — editorial text */}
          <motion.div {...fadeUp()}>
            <h2 className="mb-6 text-3xl font-extralight leading-[1.15] tracking-tight md:text-4xl">
              Về{" "}
              <span className="font-semibold">{SITE.displayName}</span>
            </h2>
            {/* Brand accent bar */}
            <div className="mb-8 h-0.5 w-12 bg-[#3C5DAA]" />

            <p className="mb-8 text-[15px] leading-[1.85] text-slate-600 dark:text-muted-foreground">
              {description}
            </p>

            <div className="space-y-4">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Lĩnh vực hoạt động
              </p>
              {COMPANY_ACTIVITIES.map((activity, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(0.05 * i)}
                  className="flex items-center gap-3"
                >
                  <div className="h-2 w-2 shrink-0 border border-[#3C5DAA]/40 bg-[#3C5DAA]/10" />
                  <span className="text-sm text-slate-700 dark:text-foreground">
                    {activity}
                  </span>
                </motion.div>
              ))}
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-8 rounded-none border-slate-300 px-8 text-sm font-medium tracking-wide dark:border-border"
            >
              <Link to="/gioi-thieu">
                Tìm hiểu thêm
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right — stats grid */}
          <motion.div {...fadeUp(0.15)}>
            <StatsGrid variant="card" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
