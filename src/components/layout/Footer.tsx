import { Link } from "react-router";
import { SITE, NAV_LINKS, SOLUTIONS_DATA } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.webp" alt={SITE.shortName} className="h-10 w-auto brightness-200" />
              <span className="text-lg font-bold">{SITE.displayName}</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">{SITE.tagline}</p>
            <div className="space-y-2.5 text-sm">
              <a href={`tel:${SITE.phoneRaw}`} className="block transition-opacity hover:opacity-80">
                Hotline: {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="block transition-opacity hover:opacity-80">
                {SITE.email}
              </a>
              <p className="text-primary-foreground/80">{SITE.address}</p>
              <p className="text-primary-foreground/80">Thứ 2 - Thứ 7: {SITE.workingHours}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold">Liên kết nhanh</h3>
            <nav className="space-y-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground block text-sm transition-colors">
                Trang chủ
              </Link>
              {NAV_LINKS.map((link) => (
                <Link key={link.href} to={link.href} className="text-primary-foreground/80 hover:text-primary-foreground block text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link to="/lien-he" className="text-primary-foreground/80 hover:text-primary-foreground block text-sm transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold">Giải pháp</h3>
            <nav className="space-y-2">
              {SOLUTIONS_DATA.slice(0, 6).map((solution) => (
                <Link key={solution.slug} to={`/giai-phap/${solution.slug}`} className="text-primary-foreground/80 hover:text-primary-foreground block text-sm transition-colors">
                  {solution.title}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold">Bản đồ</h3>
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <iframe src={SITE.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Song Linh Technologies location map" />
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-primary-foreground/20" />
      <div className="container-custom flex flex-col items-center justify-between gap-2 py-4 text-sm md:flex-row">
        <p className="text-primary-foreground/60">&copy; {new Date().getFullYear()} {SITE.displayName}. Bản quyền thuộc {SITE.name}.</p>
        <p className="text-primary-foreground/60">MST: {SITE.taxId}</p>
      </div>
    </footer>
  );
}
