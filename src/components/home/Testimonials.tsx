import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

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
  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container-custom">
        {/* Editorial heading */}
        <motion.div {...fadeUp()} className="mb-16 text-center">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
            Phản hồi
          </p>
          <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
            Khách hàng{" "}
            <span className="font-semibold">nói gì về chúng tôi</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex flex-col border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-[#3C5DAA]/30 dark:border-border dark:bg-card"
            >
              {/* Quote mark — brand blue */}
              <span className="mb-4 text-4xl font-serif leading-none text-[#3C5DAA]/15">
                "
              </span>
              <p className="mb-6 flex-1 text-sm leading-[1.85] text-slate-600 dark:text-muted-foreground">
                {t.quote}
              </p>
              <footer className="border-t border-slate-200 pt-4 dark:border-border">
                <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-foreground">
                  {t.author}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400">
                  {t.role} — {t.company}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
