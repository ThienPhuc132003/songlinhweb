import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "Song Linh Technologies đã triển khai hệ thống camera và kiểm soát ra vào cho toàn bộ tòa nhà của chúng tôi. Đội ngũ kỹ thuật chuyên nghiệp, tiến độ đúng cam kết.",
    author: "Anh Nguyễn Văn Minh",
    role: "Giám đốc kỹ thuật",
    company: "An Bình Bank",
  },
  {
    quote:
      "Chúng tôi đánh giá cao sự tư vấn tận tâm và chất lượng thi công của Song Linh. Hệ thống mạng LAN/WiFi hoạt động ổn định, đáp ứng tốt nhu cầu vận hành.",
    author: "Chị Trần Thị Lan",
    role: "Trưởng phòng IT",
    company: "Cao ốc Lê Quý Đôn",
  },
  {
    quote:
      "Dịch vụ bảo trì sau thi công rất chu đáo. Song Linh luôn phản hồi nhanh và xử lý sự cố kịp thời, giúp chúng tôi yên tâm vận hành.",
    author: "Anh Phạm Hoàng Dũng",
    role: "Quản lý dự án",
    company: "HDBank Data Center",
  },
];

export function Testimonials({ className }: { className?: string }) {
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal();

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-custom">
        <div ref={headingRef} className="reveal mb-10 text-center md:mb-14">
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            Sự tin tưởng của khách hàng là động lực phát triển của Song Linh
            Technologies
          </p>
        </div>

        <div
          ref={gridRef}
          className="reveal-stagger grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={i}
              className="reveal-item bg-card flex flex-col rounded-xl border p-6 shadow-sm"
            >
              {/* Quote mark */}
              <span className="text-primary/20 mb-3 text-4xl font-serif leading-none">"</span>
              <p className="text-foreground/80 mb-6 flex-1 text-sm leading-relaxed">
                {t.quote}
              </p>
              <footer className="border-t pt-4">
                <p className="text-sm font-semibold">{t.author}</p>
                <p className="text-muted-foreground text-xs">
                  {t.role} — {t.company}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
