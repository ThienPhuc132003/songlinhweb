import { motion } from "framer-motion";
import { ClipboardList, Wrench, HeadphonesIcon } from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: ClipboardList,
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
    icon: HeadphonesIcon,
    title: "Bảo trì & Đào tạo",
    description:
      "Đào tạo vận hành, bảo trì bảo dưỡng định kỳ, hỗ trợ kỹ thuật 24/7 trong suốt thời gian bảo hành.",
  },
];

export function ProcessSteps({ className }: { className?: string }) {
  return (
    <section className={cn("section-padding bg-muted/30", className)}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-14"
        >
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Quy trình làm việc
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            3 bước đơn giản để triển khai hệ thống công nghệ cho doanh nghiệp
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative grid gap-8 md:grid-cols-3 md:gap-6"
        >
          {/* Connector line (desktop only) */}
          <div className="bg-border absolute top-16 right-[16.7%] left-[16.7%] hidden h-0.5 md:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number circle */}
              <div className="bg-primary relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full shadow-lg">
                <step.icon className="h-6 w-6 text-white" />
              </div>

              {/* Step number badge */}
              <span className="bg-accent absolute top-0 right-[calc(50%-32px)] z-20 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                {i + 1}
              </span>

              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
