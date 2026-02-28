import { Link } from "react-router";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { SITE, NAV_LINKS, SOLUTIONS_DATA } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt={SITE.shortName} className="h-10 w-auto brightness-200" />
              <span className="text-lg font-bold">{SITE.shortName}</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">{SITE.tagline}</p>
            <div className="space-y-2.5 text-sm">
              <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <Phone className="h-4 w-4 shrink-0" />
                <span>Hotline: {SITE.phone}</span>
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{SITE.email}</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{SITE.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Th&#7913; 2 - Th&#7913; 7: {SITE.workingHours}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold">Li&#234;n k&#7871;t nhanh</h3>
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} to={link.href} className="text-primary-foreground/80 hover:text-primary-foreground flex items-center gap-1.5 text-sm transition-colors">
                  <ChevronRight className="h-3 w-3" />{link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold">Gi&#7843;i ph&#225;p</h3>
            <nav className="space-y-2">
              {SOLUTIONS_DATA.slice(0, 6).map((solution) => (
                <Link key={solution.slug} to={`/giai-phap/${solution.slug}`} className="text-primary-foreground/80 hover:text-primary-foreground flex items-center gap-1.5 text-sm transition-colors">
                  <ChevronRight className="h-3 w-3" />{solution.title}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold">B&#7843;n &#273;&#7891;</h3>
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <iframe src={SITE.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="SLTECH location map" />
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-primary-foreground/20" />
      <div className="container-custom flex flex-col items-center justify-between gap-2 py-4 text-sm md:flex-row">
        <p className="text-primary-foreground/60">&copy; {new Date().getFullYear()} {SITE.shortName}. B&#7843;n quy&#7873;n thu&#7897;c {SITE.name}.</p>
        <p className="text-primary-foreground/60">MST: {SITE.taxId}</p>
      </div>
    </footer>
  );
}
