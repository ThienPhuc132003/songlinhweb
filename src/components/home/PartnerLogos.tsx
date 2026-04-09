import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

// Import partner logo images — Row 1
import logoAxis from "@/assets/Image/LogoPartner/Logo_Axis.png";
import logoIPRO from "@/assets/Image/LogoPartner/Logo_IPRO.webp";
import logoHoneywell from "@/assets/Image/LogoPartner/Logo_Honeywell.png";
import logoHanwha from "@/assets/Image/LogoPartner/Logo_Hanwa.png";
import logoSuprema from "@/assets/Image/LogoPartner/Logo_Suprema.png";
import logoHikvision from "@/assets/Image/LogoPartner/Logo_Hikvision.png";
import logoZKTeco from "@/assets/Image/LogoPartner/Logo_ZKTeco.webp";
import logoFaceMe from "@/assets/Image/LogoPartner/Logo_Faceme.webp";
import logoMilestone from "@/assets/Image/LogoPartner/Logo_milestone.webp";

// Import partner logo images — Row 2
import logoAimetis from "@/assets/Image/LogoPartner/Logo_Aimetis.webp";
import logoAxxonSoft from "@/assets/Image/LogoPartner/Logo_AxxonSoft.png";
import logoAlcatelLucent from "@/assets/Image/LogoPartner/Logo_alcatel-lucent.webp";
import logoCisco from "@/assets/Image/LogoPartner/Logo_cisco.webp";
import logoHPE from "@/assets/Image/LogoPartner/Logo_HPE.png";

// Import partner logo images — Row 3
import logoRuckus from "@/assets/Image/LogoPartner/Logo_Ruckus.webp";
import logoAlliedTelesis from "@/assets/Image/LogoPartner/Logo_AlliedTelesis.webp";
import logoUbiquiti from "@/assets/Image/LogoPartner/Logo_ubiquiti.png";
import logoRuijie from "@/assets/Image/LogoPartner/Logo_Ruijie.webp";
import logoLegrand from "@/assets/Image/LogoPartner/Logo_Legrand.webp";

// Import partner logo images — Row 4
import logoCommScope from "@/assets/Image/LogoPartner/Logo_CommScope.svg.png";
import logoAginode from "@/assets/Image/LogoPartner/Logo_aginode.png";
import logoPrysmian from "@/assets/Image/LogoPartner/Logo_Prysmian.svg.png";
import logoLsCable from "@/assets/Image/LogoPartner/Logo_LsCable.png";
import logoVietFiber from "@/assets/Image/LogoPartner/Logo_VietFiber.webp";

const PARTNER_LOGOS_ROW1 = [
  { name: "Axis", src: logoAxis },
  { name: "iPRO", src: logoIPRO },
  { name: "Honeywell", src: logoHoneywell },
  { name: "Hanwha", src: logoHanwha },
  { name: "Suprema", src: logoSuprema },
  { name: "Hikvision", src: logoHikvision },
  { name: "ZKTeco", src: logoZKTeco },
  { name: "FaceMe", src: logoFaceMe },
  { name: "Milestone", src: logoMilestone },
];

const PARTNER_LOGOS_ROW2 = [
  { name: "Aimetis", src: logoAimetis },
  { name: "Axxon", src: logoAxxonSoft },
  { name: "Alcatel Lucent", src: logoAlcatelLucent },
  { name: "Cisco", src: logoCisco },
  { name: "HPE", src: logoHPE },
  { name: "Ruckus", src: logoRuckus },
  { name: "Allied Telesis", src: logoAlliedTelesis },
  { name: "Ubiquiti", src: logoUbiquiti },
  { name: "Ruijie", src: logoRuijie },
  { name: "Legrand", src: logoLegrand },
];

const PARTNER_LOGOS_ROW3 = [
  { name: "CommScope", src: logoCommScope },
  { name: "Aginode", src: logoAginode },
  { name: "Prysmian", src: logoPrysmian },
  { name: "LS Cable & System", src: logoLsCable },
  { name: "VietFiber", src: logoVietFiber },
];

function MarqueeRow({
  logos,
  direction = "left",
  speed = "normal",
}: {
  logos: { name: string; src: string }[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
}) {
  const doubled = [...logos, ...logos];

  const getAnimationClass = () => {
    if (direction === "right") return "animate-marquee-reverse";
    if (speed === "slow") return "animate-marquee-slow";
    if (speed === "fast") return "animate-marquee-fast";
    return "animate-marquee";
  };

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="from-muted/30 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent" />
      <div className="from-muted/30 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l to-transparent" />

      <div
        className={cn(
          "flex items-center gap-8",
          getAnimationClass(),
        )}
      >
        {doubled.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="bg-background flex h-20 min-w-[160px] items-center justify-center rounded-lg border px-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <img
              src={partner.src}
              alt={partner.name}
              className="max-h-10 max-w-[100px] object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerLogos({ className }: { className?: string }) {
  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container-custom">
        <motion.div {...fadeUp()} className="mb-16 text-center">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#3C5DAA]">
            Hệ sinh thái
          </p>
          <h2 className="text-3xl font-extralight tracking-tight md:text-4xl">
            Đối tác <span className="font-semibold">chiến lược</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
            Hợp tác cùng các thương hiệu hàng đầu thế giới trong lĩnh vực
            công nghệ và an ninh
          </p>
        </motion.div>

        {/* 3-row marquee layout */}
        <div className="flex flex-col gap-5">
          <MarqueeRow logos={PARTNER_LOGOS_ROW1} direction="left" speed="normal" />
          <MarqueeRow logos={PARTNER_LOGOS_ROW2} direction="right" speed="normal" />
          <MarqueeRow logos={PARTNER_LOGOS_ROW3} direction="left" speed="slow" />
        </div>
      </div>
    </section>
  );
}
