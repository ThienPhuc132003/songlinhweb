import { SEO } from "@/components/ui/seo";
import { HeroSlider } from "@/components/home/HeroSlider";
import { StatsBar } from "@/components/home/StatsBar";
import { SolutionCards } from "@/components/home/SolutionCards";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { CTABanner } from "@/components/home/CTABanner";

export default function Home() {
  return (
    <>
      <SEO
        title=""
        description="Song Linh Technologies - Giải pháp tối ưu, Chất lượng vượt trội. Tư vấn, thiết kế, cung cấp và thi công hệ thống ELV, ICT, M&E."
        url="/"
      />

      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Stats Bar */}
      <StatsBar />

      {/* 3. Solutions Overview */}
      <SolutionCards limit={8} />

      {/* 4. Process Timeline (3 Steps) */}
      <ProcessSteps />

      {/* 5. Featured Projects */}
      <FeaturedProjects />

      {/* 6. Partner Logos Marquee */}
      <PartnerLogos />

      {/* 7. CTA Banner */}
      <CTABanner />
    </>
  );
}
