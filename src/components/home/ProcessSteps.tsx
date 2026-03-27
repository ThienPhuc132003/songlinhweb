import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    title: "Tư vấn & Thiết kế",
    description:
      "Khảo sát hiện trạng, phân tích nhu cầu, tư vấn giải pháp tối ưu và lập hồ sơ thiết kế chi tiết.",
  },
  {
    number: "02",
    title: "Cung cấp & Thi công",
    description:
      "Cung cấp thiết bị chính hãng, thi công lắp đặt theo tiêu chuẩn kỹ thuật, nghiệm thu bàn giao.",
  },
  {
    number: "03",
    title: "Bảo trì & Đào tạo",
    description:
      "Đào tạo vận hành, bảo trì bảo dưỡng định kỳ, hỗ trợ kỹ thuật 24/7 trong suốt thời gian bảo hành.",
  },
];

export function ProcessSteps({ className }: { className?: string }) {
  const headingRef = useScrollReveal();
  const stepsRef = useScrollReveal();

  return (
    <section className={cn("section-padding bg-muted/30", className)}>
      <div className="container-custom">
        <div ref={headingRef} className="reveal mb-10 text-center md:mb-14">
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Quy trình làm việc
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            3 bước đơn giản để triển khai hệ thống công nghệ cho doanh nghiệp
          </p>
        </div>

        <div
          ref={stepsRef}
          className="reveal-stagger relative grid gap-8 md:grid-cols-3 md:gap-6"
        >
          {/* Connector line — vertically centered on the circles (h-12 = 3rem, center = 1.5rem = top-6) */}
          <div className="bg-border absolute top-6 right-[16.7%] left-[16.7%] hidden h-px md:block" />

          {STEPS.map((step) => (
            <div
              key={step.number}
              className="reveal-item relative flex flex-col items-center text-center"
            >
              {/* Step number — clean typography instead of icon */}
              <div className="bg-primary relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full">
                <span className="text-sm font-bold text-white">{step.number}</span>
              </div>

              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
