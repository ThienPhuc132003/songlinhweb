import { motion } from "framer-motion";
import { Compass, Wrench, HeadsetIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

const STEPS = [
  {
    icon: Compass,
    title: "Tư vấn & Thiết kế",
    description:
      "Khảo sát hiện trạng, phân tích nhu cầu, tư vấn giải pháp tối ưu và lập hồ sơ thiết kế chi tiết.",
  },
  {
    icon: Wrench,
    title: "Cung cấp & Thi công",
    description:
      "Cung cấp thiết bị chính hãng, thi công lắp đặt theo tiêu chuẩn kỹ thuật, nghiệm thu bàn giao.",
  },
  {
    icon: HeadsetIcon,
    title: "Bảo trì & Đào tạo",
    description:
      "Đào tạo vận hành, bảo trì bảo dưỡng định kỳ, hỗ trợ kỹ thuật 24/7 trong suốt thời gian bảo hành.",
  },
];


export function ProcessSteps({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "border-y border-slate-200 bg-[#F8FAFC] py-24 dark:border-border dark:bg-muted/10 md:py-32",
        className,
      )}
    >
      <div className="container-custom">
        {/* Editorial heading */}
        <motion.div {...fadeUp()} className="mb-16 text-center">
          <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
            3 bước{" "}
            <span className="font-semibold">triển khai chuyên nghiệp</span>
          </h2>
        </motion.div>

        {/* Industrial Flow */}
        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Connector line — thin, brand-accented */}
          <div className="absolute top-10 right-[16.7%] left-[16.7%] hidden h-px bg-[#3C5DAA]/20 md:block">
            {/* Connection dots */}
            <div className="absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-[#3C5DAA]/30" />
            <div className="absolute -top-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#3C5DAA]/30" />
            <div className="absolute -top-[3px] right-0 h-[7px] w-[7px] rounded-full bg-[#3C5DAA]/30" />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Thin bordered circle with brand-blue center dot */}
                <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#3C5DAA]/20 bg-white dark:bg-card">
                  <Icon
                    className="h-7 w-7 text-[#3C5DAA]"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Step label — monospace */}
                <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#3C5DAA]/60">
                  Bước {String(i + 1).padStart(2, "0")}
                </p>

                <h3 className="mb-3 text-base font-semibold tracking-tight text-slate-900 dark:text-foreground">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
