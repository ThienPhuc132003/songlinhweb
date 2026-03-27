import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

// Import partner logo images
import logoAVer from "@/assets/Image/LogoPartner/Logo_AVer.webp";
import logoAxis from "@/assets/Image/LogoPartner/Logo_Axis.png";
import logoCommScope from "@/assets/Image/LogoPartner/Logo_CommScope.svg.png";
import logoHID from "@/assets/Image/LogoPartner/Logo_HID.svg.png";
import logoHanwha from "@/assets/Image/LogoPartner/Logo_Hanwa.png";
import logoHikvision from "@/assets/Image/LogoPartner/Logo_Hikvision.png";
import logoLegrand from "@/assets/Image/LogoPartner/Logo_Lergrand.png";
import logoLsCable from "@/assets/Image/LogoPartner/Logo_LsCable.png";
import logoLuxriot from "@/assets/Image/LogoPartner/Logo_luxriot.png";
import logoMilestone from "@/assets/Image/LogoPartner/Logo_milestone.png";

const PARTNER_LOGOS = [
  { name: "Hikvision", src: logoHikvision },
  { name: "Axis Communications", src: logoAxis },
  { name: "Hanwha Techwin", src: logoHanwha },
  { name: "CommScope", src: logoCommScope },
  { name: "HID Global", src: logoHID },
  { name: "Legrand", src: logoLegrand },
  { name: "LS Cable", src: logoLsCable },
  { name: "Luxriot", src: logoLuxriot },
  { name: "Milestone Systems", src: logoMilestone },
  { name: "AVer", src: logoAVer },
];

export function PartnerLogos({ className }: { className?: string }) {
  const headingRef = useScrollReveal();

  // Double the array for seamless infinite scroll
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section className={cn("section-padding bg-muted/30", className)}>
      <div className="container-custom">
        <div ref={headingRef} className="reveal mb-10 text-center md:mb-14">
          <h2 className="text-primary mb-3 text-2xl font-bold md:text-3xl">
            Đối tác chiến lược
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            Hợp tác cùng các thương hiệu hàng đầu thế giới trong lĩnh vực công
            nghệ và an ninh
          </p>
        </div>

        {/* Infinite scroll marquee — pure CSS */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="from-muted/30 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent" />
          <div className="from-muted/30 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l to-transparent" />

          <div className="animate-marquee flex items-center gap-12">
            {logos.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="bg-background flex h-20 min-w-44 items-center justify-center rounded-lg border px-6 shadow-sm"
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="max-h-10 max-w-28 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
