import { motion } from "framer-motion";
import { SEO } from "@/components/ui/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SITE, COMPANY_ACTIVITIES, PARTNERS, PARTNER_CERTIFICATES, COMPANY_STATS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Eye,
  Award,
  Building2,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function About() {
  return (
    <>
      <SEO
        title="Giới thiệu"
        description="SLTECH — Hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn, thiết kế và thi công hệ thống công nghệ cho doanh nghiệp."
        url="/gioi-thieu"
      />

      <PageHero
        title="Giới thiệu"
        subtitle="Đối tác công nghệ tin cậy cho doanh nghiệp Việt Nam"
        breadcrumbs={[{ label: "Giới thiệu" }]}
      />

      {/* Company intro */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div {...fadeUp} className="space-y-5">
              <Badge variant="secondary" className="text-sm">
                <Building2 className="mr-1.5 h-3.5 w-3.5" />
                Về chúng tôi
              </Badge>
              <h2 className="text-2xl font-bold md:text-3xl">
                {SITE.name}
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">SLTECH</strong> (Song Linh Technologies) là
                  công ty chuyên về tư vấn, thiết kế và thi công lắp đặt các hệ thống công nghệ
                  thông tin và hạ tầng kỹ thuật. Với hơn <strong className="text-foreground">10 năm kinh nghiệm</strong>,
                  chúng tôi đã hoàn thành hơn <strong className="text-foreground">500 dự án</strong> trên khắp cả nước.
                </p>
                <p>
                  Chúng tôi cam kết mang đến giải pháp tối ưu nhất cho mỗi dự án, từ khâu tư vấn
                  ban đầu đến thi công triển khai và bảo trì sau bàn giao.
                </p>
              </div>
              <Button asChild>
                <Link to="/lien-he">
                  Liên hệ tư vấn
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {COMPANY_STATS.map((stat, i) => (
                <Card
                  key={stat.label}
                  className={`text-center ${i === 0 ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <CardContent className="p-5">
                    <div className="text-primary text-3xl font-bold">
                      {stat.value}{stat.suffix}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-muted/30 section-padding">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                    <Eye className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Tầm nhìn</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Trở thành đối tác công nghệ hàng đầu trong lĩnh vực hệ thống kỹ thuật & IT
                    cho doanh nghiệp tại Việt Nam, mang đến giải pháp toàn diện từ tư vấn đến
                    vận hành.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                    <Target className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Sứ mệnh</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cung cấp giải pháp công nghệ tối ưu, chất lượng vượt trội với chi phí hợp lý,
                    giúp doanh nghiệp vận hành hiệu quả hơn thông qua công nghệ hiện đại.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core activities */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <motion.div {...fadeUp} className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Lĩnh vực hoạt động</h2>
            <p className="text-muted-foreground mt-2">
              3 mảng kinh doanh chính của SLTECH
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {COMPANY_ACTIVITIES.map((activity, i) => (
              <motion.div
                key={activity}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="flex items-start gap-3 p-5">
                    <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{activity}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-muted/30 section-padding">
        <div className="container-custom">
          <motion.div {...fadeUp} className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Giá trị cốt lõi</h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Chất lượng",
                desc: "Cam kết sử dụng thiết bị chính hãng, thi công đạt chuẩn quốc tế",
              },
              {
                icon: Users,
                title: "Khách hàng",
                desc: "Đặt nhu cầu khách hàng làm trung tâm, tư vấn giải pháp phù hợp nhất",
              },
              {
                icon: Award,
                title: "Uy tín",
                desc: "Hơn 10 năm xây dựng uy tín với 500+ dự án và 50+ đối tác chiến lược",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                      <v.icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{v.title}</h3>
                    <p className="text-muted-foreground text-sm">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Certificates */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div {...fadeUp} className="mb-8 text-center">
            <Badge variant="secondary" className="mb-3 text-sm">
              <Award className="mr-1.5 h-3.5 w-3.5" />
              Chứng nhận
            </Badge>
            <h2 className="text-2xl font-bold md:text-3xl">
              Chứng nhận từ đối tác
            </h2>
            <p className="text-muted-foreground mt-2">
              Được ủy quyền chính thức từ các thương hiệu công nghệ hàng đầu
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_CERTIFICATES.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                  <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                        const placeholder = document.createElement('div');
                        placeholder.className = 'text-center p-4';
                        placeholder.innerHTML = `<div class="text-muted-foreground/40 text-4xl mb-2">🏆</div><p class="text-muted-foreground text-xs">Hình sẽ được cập nhật</p>`;
                        (e.target as HTMLImageElement).parentElement!.appendChild(placeholder);
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold leading-tight">
                      {cert.title}
                    </h3>
                    <div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
                      <span>{cert.partner}</span>
                      {cert.year && (
                        <>
                          <span>·</span>
                          <span>{cert.year}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <motion.div {...fadeUp} className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Đối tác chiến lược</h2>
            <p className="text-muted-foreground mt-2">
              Các thương hiệu công nghệ hàng đầu thế giới
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((name) => (
              <Badge
                key={name}
                variant="outline"
                className="px-4 py-2 text-sm font-medium"
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
