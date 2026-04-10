import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { SEO } from "@/components/ui/seo";
import { SITE, COMPANY_ACTIVITIES } from "@/lib/constants";
import { useSiteConfig } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { CertificateGallery } from "@/components/home/CertificateGallery";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { CTABanner } from "@/components/home/CTABanner";
import {
  ArrowRight,
  ShieldCheck,
  Headphones,
  Layers,
  Award,
} from "lucide-react";

// Fallback hero image
import heroFallback from "@/assets/Image/HomePage/Hero GiaiPhap.webp";
import heroME from "@/assets/Image/HomePage/Hero M&E.webp";
import { fadeUp, fadeIn } from "@/lib/animations";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface WhyItem {
  title: string;
  description: string;
}

interface ValueItem {
  title: string;
  description: string;
}

// ─── CountUp Hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const has = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !has.current) {
          has.current = true;
          const steps = 50;
          const inc = target / steps;
          let cur = 0;
          const t = setInterval(() => {
            cur += inc;
            if (cur >= target) {
              setCount(target);
              clearInterval(t);
            } else {
              setCount(Math.floor(cur));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

function CountUpStat({ stat }: { stat: StatItem }) {
  const { ref, count } = useCountUp(stat.value);
  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {stat.suffix}
    </span>
  );
}

// ─── WHY CHOOSE US ICONS ──────────────────────────────────────────────────────

const WHY_ICONS = [ShieldCheck, Headphones, Layers, Award];

const WHY_PROOFS = [
  "Axis Silver Partner · Hikvision Authorized · Legrand Certified",
  "SLA Response Time < 4h · Hotline 0968.811.911 hoạt động 24/7",
  "500+ dự án end-to-end từ thiết kế → thi công → bảo trì dài hạn",
  "Cam kết 1-đổi-1 · Bảo hành chính hãng từ nhà sản xuất",
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function parseConfigArray<T>(configStr: string | undefined, fallback: T[]): T[] {
  if (configStr) {
    try {
      const parsed = JSON.parse(configStr) as T[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      /* fall through */
    }
  }
  return fallback;
}

// ═══════════════════════════════════════════════════════════════════════════════

export default function About() {
  const { data: config } = useSiteConfig();

  // ─── Site config data ─────────────────────────────────────────────────────
  const heroImage = config?.about_hero_image || heroFallback;
  const aboutDescription =
    config?.about_description || "";
  const vision =
    config?.about_vision ||
    "Trở thành đối tác công nghệ hàng đầu trong lĩnh vực hệ thống kỹ thuật & IT cho doanh nghiệp tại Việt Nam.";
  const mission =
    config?.about_mission ||
    "Cung cấp giải pháp công nghệ tối ưu, chất lượng vượt trội với chi phí hợp lý.";

  const stats: StatItem[] = useMemo(() => parseConfigArray<StatItem>(config?.company_stats, [
    { value: 10, suffix: "+", label: "Năm kinh nghiệm" },
    { value: 500, suffix: "+", label: "Dự án hoàn thành" },
    { value: 50, suffix: "+", label: "Đối tác tin cậy" },
    { value: 100, suffix: "%", label: "Khách hàng hài lòng" },
  ]), [config?.company_stats]);

  const whyChooseUs: WhyItem[] = useMemo(() => parseConfigArray<WhyItem>(config?.why_choose_us, [
    {
      title: "Đội ngũ kỹ sư chứng chỉ",
      description: "Kỹ sư được đào tạo và cấp chứng chỉ từ Axis, Hikvision, Honeywell, Legrand",
    },
    {
      title: "Hỗ trợ kỹ thuật 24/7",
      description: "Đội ngũ kỹ thuật túc trực xử lý sự cố nhanh chóng",
    },
    {
      title: "Giải pháp tích hợp",
      description: "Tư vấn và triển khai end-to-end: thiết kế, thi công, bảo trì dài hạn",
    },
    {
      title: "Bảo hành chính hãng",
      description: "Tất cả thiết bị bảo hành chính hãng, cam kết 1-đổi-1",
    },
  ]), [config?.why_choose_us]);

  const coreValues: ValueItem[] = useMemo(() => parseConfigArray<ValueItem>(config?.core_values, [
    {
      title: "Chất lượng",
      description: "Cam kết sử dụng thiết bị chính hãng, thi công đạt chuẩn quốc tế",
    },
    {
      title: "Khách hàng",
      description: "Đặt nhu cầu khách hàng làm trung tâm, tư vấn giải pháp phù hợp nhất",
    },
    {
      title: "Uy tín",
      description: "Hơn 10 năm xây dựng uy tín với 500+ dự án và 50+ đối tác chiến lược",
    },
  ]), [config?.core_values]);

  // ─── Default narrative ────────────────────────────────────────────────────
  const defaultNarrative = `SLTECH (Song Linh Technologies) là công ty chuyên về tư vấn, thiết kế và thi công lắp đặt các hệ thống công nghệ thông tin và hạ tầng kỹ thuật.

Với hơn **10 năm kinh nghiệm**, chúng tôi đã hoàn thành hơn **500 dự án** trên khắp cả nước, từ các tòa nhà thương mại, khu công nghiệp đến bệnh viện và trường học.

Chúng tôi cam kết mang đến giải pháp tối ưu nhất cho mỗi dự án — từ khâu tư vấn ban đầu, thiết kế chi tiết, thi công chuyên nghiệp đến bảo trì dài hạn sau bàn giao.`;

  const narrativeText = aboutDescription || defaultNarrative;
  const paragraphs = narrativeText
    .split("\n\n")
    .filter(Boolean)
    .map((p) =>
      p
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>"),
    );

  return (
    <>
      <SEO
        title="Giới thiệu"
        description="Song Linh Technologies — Hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn, thiết kế và thi công hệ thống công nghệ cho doanh nghiệp."
        url="/gioi-thieu"
      />

      {/* ═══ 1. ASYMMETRIC EDITORIAL HERO ═══ */}
      <section className="relative bg-white dark:bg-background">
        <div className="grid min-h-[600px] lg:grid-cols-2">
          {/* Left — Full-bleed image */}
          <motion.div
            {...fadeIn()}
            className="relative min-h-[400px] overflow-hidden lg:min-h-0"
          >
            <img
              src={heroImage}
              alt="SLTECH — Hệ thống kỹ thuật hạ tầng"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Subtle brand-blue overlay for cohesion */}
            <div className="absolute inset-0 bg-[#3C5DAA]/10 mix-blend-multiply" />
          </motion.div>

          {/* Right — Mission statement */}
          <div className="flex flex-col justify-center px-8 py-16 md:px-14 lg:px-20 lg:py-24">
            <motion.div {...fadeUp()}>
              <p className="mb-6 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
                {SITE.displayName}
              </p>
              {/* Brand accent bar */}
              <div className="mb-8 h-1 w-16 bg-[#3C5DAA]" />
              <h1 className="text-3xl font-extralight leading-[1.15] tracking-tight text-slate-900 dark:text-foreground md:text-4xl lg:text-5xl">
                Đối tác công nghệ
                <br />
                <span className="font-semibold">đáng tin cậy</span>
                <br />
                <span className="text-[#3C5DAA]">cho doanh nghiệp</span>
              </h1>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-slate-500 dark:text-muted-foreground">
                Tư vấn, thiết kế và thi công hệ thống ELV, IT & hạ tầng kỹ
                thuật — tiêu chuẩn quốc tế, bảo hành chính hãng.
              </p>
              <div className="mt-10 flex gap-4">
                <Button
                  asChild
                  className="rounded-none bg-[#3C5DAA] px-8 py-3 text-sm font-medium tracking-wide text-white hover:bg-[#3C5DAA]/90"
                >
                  <Link to="/lien-he">
                    Liên hệ tư vấn
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-slate-300 px-8 py-3 text-sm font-medium tracking-wide dark:border-border"
                >
                  <Link to="/du-an">Dự án tiêu biểu</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 2. MAGAZINE STORYTELLING — Drop Cap + Split Layout ═══ */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
            {/* Left — Narrative */}
            <motion.div {...fadeUp()}>
              <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
                Câu chuyện của chúng tôi
              </p>
              <h2 className="mb-10 text-3xl font-extralight leading-[1.15] tracking-tight md:text-4xl">
                {stats[0]?.value || 10}+ Năm{" "}
                <span className="font-semibold">Kinh Nghiệm Kỹ Thuật</span>
              </h2>

              {/* Drop Cap paragraph */}
              <div className="space-y-5 text-[15px] leading-[1.85] text-slate-600 dark:text-muted-foreground">
                {paragraphs.map((html, i) => (
                  <p
                    key={i}
                    className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:text-[3.5rem] first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[#3C5DAA]" : ""}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>

              <Button
                asChild
                variant="outline"
                className="mt-8 rounded-none border-slate-300 px-8 text-sm font-medium tracking-wide dark:border-border"
              >
                <Link to="/lien-he">
                  Liên hệ tư vấn
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Right — Engineering atmosphere photo */}
            <motion.div
              {...fadeUp(0.15)}
              className="relative hidden lg:block"
            >
              <div className="sticky top-32">
                <div className="relative overflow-hidden">
                  <img
                    src={heroME}
                    alt="SLTECH Engineering Team"
                    className="aspect-[4/5] w-full object-cover grayscale-[30%]"
                  />
                  {/* Brand accent corner */}
                  <div className="absolute bottom-0 left-0 h-24 w-1 bg-[#3C5DAA]" />
                  <div className="absolute bottom-0 left-0 h-1 w-24 bg-[#3C5DAA]" />
                </div>
                {/* Technical caption */}
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Thi công hệ thống M&E — {SITE.displayName}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 3. TECHNICAL METRIC HEADER — Brand accent stats ═══ */}
      <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-border dark:bg-muted/10 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative text-center"
              >
                {/* Brand blue top accent */}
                <div className="mx-auto mb-6 h-0.5 w-8 bg-[#3C5DAA]" />
                <span className="block font-mono text-4xl font-extralight tracking-tight text-slate-900 dark:text-foreground md:text-5xl">
                  <CountUpStat stat={stat} />
                </span>
                <span className="mt-3 block font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400 dark:text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. VISION & MISSION — Full-bleed editorial split ═══ */}
      <section className="grid md:grid-cols-2">
        {/* Vision — dark brand */}
        <motion.div
          {...fadeUp()}
          className="bg-slate-900 px-8 py-20 md:px-14 md:py-28"
        >
          <div className="mb-6 h-0.5 w-10 bg-blue-400" />
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-blue-300">
            Tầm nhìn
          </p>
          <h3 className="mb-8 text-2xl font-extralight leading-snug tracking-tight text-white md:text-3xl">
            Trở thành{" "}
            <span className="font-semibold">đối tác hàng đầu</span>
          </h3>
          <p className="max-w-md leading-relaxed text-slate-300 text-[15px]">
            {vision}
          </p>
        </motion.div>

        {/* Mission — clean light */}
        <motion.div
          {...fadeUp(0.1)}
          className="bg-[#F8FAFC] px-8 py-20 dark:bg-muted/10 md:px-14 md:py-28"
        >
          <div className="mb-6 h-0.5 w-10 bg-[#3C5DAA]" />
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
            Sứ mệnh
          </p>
          <h3 className="mb-8 text-2xl font-extralight leading-snug tracking-tight md:text-3xl">
            Giải pháp{" "}
            <span className="font-semibold">tối ưu</span>
          </h3>
          <p className="max-w-md leading-relaxed text-slate-500 dark:text-muted-foreground text-[15px]">
            {mission}
          </p>
        </motion.div>
      </section>

      {/* ═══ 5. WHY CHOOSE US — Industrial Card System ═══ */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <motion.div {...fadeUp()} className="mb-16 max-w-xl">
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
              Tại sao chọn chúng tôi
            </p>
            <h2 className="text-3xl font-extralight leading-[1.15] tracking-tight md:text-4xl">
              Năng lực{" "}
              <span className="font-semibold">vượt trội</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              const proof = WHY_PROOFS[i % WHY_PROOFS.length];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="group relative border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-[#3C5DAA]/40 hover:shadow-lg dark:border-border dark:bg-card"
                >
                  {/* Icon */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#3C5DAA]/20 bg-[#3C5DAA]/5 transition-colors duration-300 group-hover:bg-[#3C5DAA]/10">
                    <Icon className="h-5 w-5 text-[#3C5DAA]" strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-3 text-base font-semibold tracking-tight text-slate-900 dark:text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Hover Reveal — Technical Proof */}
                  <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
                    <div className="border-t border-dashed border-[#3C5DAA]/20 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#3C5DAA]/60">
                        Chứng minh
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {proof}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 6. CORE VALUES — Clean editorial list ═══ */}
      <section className="border-y border-slate-200 bg-[#F8FAFC] py-24 dark:border-border dark:bg-muted/10 md:py-32">
        <div className="container-custom max-w-4xl">
          <motion.div {...fadeUp()} className="mb-14 text-center">
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
              Nền tảng
            </p>
            <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
              Giá trị{" "}
              <span className="font-semibold">cốt lõi</span>
            </h2>
          </motion.div>

          <div className="space-y-0 divide-y divide-slate-200 dark:divide-border">
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(i * 0.08)}
                className="flex items-start gap-8 py-10 first:pt-0 last:pb-0 md:gap-12"
              >
                {/* Brand accent line instead of numbers */}
                <div className="mt-2 shrink-0">
                  <div className="h-8 w-0.5 bg-[#3C5DAA]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. ACTIVITIES — Scope of expertise ═══ */}
      <section className="py-24 md:py-32">
        <div className="container-custom max-w-4xl">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
              Phạm vi hoạt động
            </p>
            <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
              Lĩnh vực{" "}
              <span className="font-semibold">chuyên môn</span>
            </h2>
          </motion.div>

          <div className="space-y-0 divide-y divide-slate-200 dark:divide-border">
            {COMPANY_ACTIVITIES.map((activity, i) => (
              <motion.div
                key={activity}
                {...fadeUp(i * 0.06)}
                className="group flex items-center gap-6 py-6 transition-colors hover:bg-[#3C5DAA]/3"
              >
                <div className="h-3 w-3 shrink-0 border border-[#3C5DAA]/40 transition-colors group-hover:bg-[#3C5DAA] group-hover:border-[#3C5DAA]" />
                <p className="text-[15px] font-medium text-slate-700 dark:text-foreground">
                  {activity}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. CERTIFICATES — Authority Archive ═══ */}
      <CertificateGallery />

      {/* ═══ 9. PARTNERS ═══ */}
      <PartnerLogos />

      {/* ═══ 10. CTA ═══ */}
      <CTABanner />
    </>
  );
}
