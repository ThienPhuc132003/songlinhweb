import { motion } from "framer-motion";
import { MessageSquare, Ruler, Wrench, ClipboardCheck, Handshake } from "lucide-react";

const STEPS = [
  { icon: MessageSquare, title: "Tư vấn", description: "Khảo sát hiện trạng, phân tích yêu cầu" },
  { icon: Ruler, title: "Thiết kế", description: "Lập bản vẽ kỹ thuật, dự toán chi phí" },
  { icon: Wrench, title: "Thi công", description: "Lắp đặt thiết bị, đi dây, cấu hình hệ thống" },
  { icon: ClipboardCheck, title: "Kiểm tra", description: "Test vận hành, hiệu chỉnh, nghiệm thu" },
  { icon: Handshake, title: "Bàn giao", description: "Đào tạo vận hành, bảo hành dài hạn" },
];

export function ImplementationWorkflow() {
  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
        Quy trình triển khai
      </p>
      <h2 className="mb-8 text-3xl font-bold">5 bước triển khai</h2>
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-6 top-6 hidden h-0.5 w-[calc(100%-48px)] bg-gradient-to-r from-primary/20 via-primary to-primary/20 md:left-0 md:block md:w-full" />
        <div className="grid gap-6 md:grid-cols-5 md:gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 * i }}
                className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center"
              >
                {/* Dot + Icon */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white shadow-md dark:bg-slate-900">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                {/* Text */}
                <div>
                  <span className="mb-0.5 block text-xs font-medium text-primary">
                    Bước {i + 1}
                  </span>
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
