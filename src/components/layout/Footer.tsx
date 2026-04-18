import { Link } from "react-router";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { useSiteConfig, useSolutions } from "@/hooks/useApi";
import { Phone, Mail, MapPin, Clock, ArrowUpRight, LucideIcon } from "lucide-react";

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="block text-sm text-[#94A3B8] transition-colors duration-300 hover:text-white"
  >
    {children}
  </Link>
);

const ContactItem = ({ 
  href, 
  icon: Icon, 
  iconClassName = "text-[#3C5DAA]", 
  align = "center", 
  children 
}: { 
  href?: string; 
  icon: LucideIcon; 
  iconClassName?: string;
  align?: "center" | "start";
  children: React.ReactNode;
}) => {
  const inner = (
    <>
      <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClassName} ${align === "start" ? "mt-0.5" : ""}`} />
      {children}
    </>
  );
  
  if (href) {
    return (
      <a href={href} className={`flex items-${align} gap-2.5 text-[#CBD5E1] transition-colors duration-300 hover:text-[#3C5DAA]`}>
        {inner}
      </a>
    );
  }
  return <div className={`flex items-${align} gap-2.5 text-[#94A3B8]`}>{inner}</div>;
};

export default function Footer() {
  const { data: config } = useSiteConfig();
  const { data: solutionsData } = useSolutions();
  const solutions = solutionsData?.items ?? [];
  const c = config || {};
  
  const displayName = c.company_name || SITE.displayName;
  const tagline = c.company_slogan || SITE.tagline;
  const phone = c.company_hotline || SITE.phone;
  const email = c.company_email || SITE.email;
  const address = c.company_address || SITE.address;
  const workingHours = c.company_hours || SITE.workingHours;
  const mapEmbedUrl = c.map_embed_url || SITE.mapEmbedUrl;
  const taxId = c.company_tax_id || SITE.taxId;
  const copyRight = c.footer_copyright || `© ${new Date().getFullYear()} ${displayName}. Bản quyền thuộc Công ty TNHH TM CÔNG NGHỆ SONG LINH.`;

  return (
    <footer className="footer-editorial relative bg-[#1E3A6E]">
      {/* Brand accent line — sharp top edge */}
      <div className="h-[3px] w-full bg-white/20" />

      {/* Main content */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="space-y-6">
            <Link to="/" className="group flex items-center gap-3">
              <img
                src="/logo.webp"
                alt={SITE.shortName}
                className="h-10 w-auto brightness-200"
              />
              <span className="text-lg font-semibold tracking-tight text-white">
                {displayName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {tagline}
            </p>
            <div className="space-y-3 text-sm">
              <ContactItem href={`tel:${phone.replace(/\D/g, '')}`} icon={Phone}>
                Hotline: {phone}
              </ContactItem>
              <ContactItem href={`mailto:${email}`} icon={Mail}>
                {email}
              </ContactItem>
              <ContactItem icon={MapPin} align="start" iconClassName="text-[#3C5DAA]/70">
                {address}
              </ContactItem>
              <ContactItem icon={Clock} iconClassName="text-[#3C5DAA]/70">
                Thứ 2 – Thứ 7: {workingHours}
              </ContactItem>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.05em] text-white">
              Liên kết nhanh
            </p>
            <nav className="space-y-2.5">
              <FooterLink to="/">Trang chủ</FooterLink>
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.href} to={link.href}>
                  {link.label}
                </FooterLink>
              ))}
              <FooterLink to="/lien-he">Liên hệ</FooterLink>
            </nav>
          </div>

          {/* Column 3 — Solutions */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.05em] text-white">
              Giải pháp
            </p>
            <nav className="space-y-2.5">
              {solutions.slice(0, 6).map((solution) => (
                <Link
                  key={solution.slug}
                  to={`/giai-phap/${solution.slug}`}
                  className="group flex items-center gap-1 text-sm text-[#94A3B8] transition-colors duration-300 hover:text-[#3C5DAA]"
                >
                  {solution.title}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 — Map */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.05em] text-white">
              Vị trí
            </p>
            <div className="aspect-square w-full overflow-hidden rounded-sm border-2 border-[#3C5DAA]/40">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 ,filter: 'brightness(0.85) contrast(0.95)'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Song Linh Technologies location map"
                className="transition-[filter] duration-500 hover:brightness-110"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-white/[0.12]">
        <div className="container-custom flex flex-col items-center justify-between gap-2 py-5 md:flex-row">
          <p className="text-xs text-[#94A3B8]">
            {copyRight}
          </p>
          <p className="font-mono text-[10px] tracking-wider text-[#64748B]">
            MST: {taxId}
          </p>
        </div>
      </div>
    </footer>
  );
}
