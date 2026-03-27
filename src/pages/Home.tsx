import { SEO } from "@/components/ui/seo";
import { HeroSlider } from "@/components/home/HeroSlider";
import { SolutionCards } from "@/components/home/SolutionCards";
import { CompanyIntro } from "@/components/home/CompanyIntro";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Testimonials } from "@/components/home/Testimonials";
import { CertificateGallery } from "@/components/home/CertificateGallery";
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

      {/* 2. Solutions Overview */}
      <SolutionCards limit={8} />

      {/* 3. Company Introduction (includes Stats) */}
      <CompanyIntro />

      {/* 4. Process Timeline (3 Steps) */}
      <ProcessSteps />

      {/* 5. Featured Projects */}
      <FeaturedProjects />

      {/* 6. Client Testimonials */}
      <Testimonials />

      {/* 7. Certificates & Awards */}
      <CertificateGallery />

      {/* 8. Partner Logos */}
      <PartnerLogos />

      {/* 9. CTA Banner */}
      <CTABanner />
    </>
  );
}
