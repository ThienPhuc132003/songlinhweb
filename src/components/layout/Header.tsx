import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown, Camera, ShieldCheck, Flame, Network, Volume2, Cpu, Package, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useSolutions } from "@/hooks/useApi";
import { SolutionIcon, SolutionIconBadge } from "@/components/ui/SolutionIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

/* ─── Product Categories for Mega Menu ─── */
const PRODUCT_MENU_COLUMNS = [
  {
    title: "Camera & An ninh",
    icon: Camera,
    items: [
      { label: "Camera IP", slug: "camera-ip" },
      { label: "Camera Analog", slug: "camera-analog" },
      { label: "Đầu ghi hình NVR/DVR", slug: "dau-ghi-hinh" },
      { label: "Phụ kiện Camera", slug: "phu-kien-camera" },
    ],
  },
  {
    title: "Kiểm soát ra vào",
    icon: ShieldCheck,
    items: [
      { label: "Máy chấm công", slug: "may-cham-cong" },
      { label: "Khóa điện tử", slug: "khoa-dien-tu" },
      { label: "Barrier tự động", slug: "barrier-tu-dong" },
      { label: "Cổng từ an ninh", slug: "cong-tu-an-ninh" },
    ],
  },
  {
    title: "PCCC & Báo cháy",
    icon: Flame,
    items: [
      { label: "Trung tâm báo cháy", slug: "trung-tam-bao-chay" },
      { label: "Đầu báo khói/nhiệt", slug: "dau-bao-khoi-nhiet" },
      { label: "Hệ thống chữa cháy", slug: "he-thong-chua-chay" },
    ],
  },
  {
    title: "Mạng & Hạ tầng IT",
    icon: Network,
    items: [
      { label: "Switch PoE", slug: "switch-poe" },
      { label: "Router doanh nghiệp", slug: "router-doanh-nghiep" },
      { label: "Cáp mạng & Phụ kiện", slug: "cap-mang" },
      { label: "Tủ rack & UPS", slug: "tu-rack-ups" },
    ],
  },
];

/* ─── Custom Hooks & Abstractions ─── */
function useHoverMenu(delay = 150) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), delay);
  };

  return { isOpen, setIsOpen, handleEnter, handleLeave };
}

function MobileAccordionItem({ 
  label, 
  isActive, 
  children 
}: { 
  label: string; 
  isActive: boolean; 
  children: React.ReactNode; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "hover:bg-accent flex w-full items-center justify-between rounded-sm px-4 py-3 text-sm font-medium transition-colors",
          isActive && "bg-primary/10 text-primary font-semibold"
        )}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="ml-4 flex flex-col gap-0.5 border-l pl-3 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b border-slate-200 backdrop-blur transition-all duration-300 dark:border-slate-800",
          scrolled && "header-scrolled",
        )}
      >
        <div className="container-custom flex h-16 items-center justify-between lg:h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src="/logo.webp"
              alt={SITE.displayName}
              className="h-10 w-auto lg:h-11"
            />
            <div className="hidden sm:block">
              <p className="text-primary text-sm font-bold leading-tight">
                {SITE.displayName}
              </p>
              <p className="text-muted-foreground text-[11px]">{SITE.tagline}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) =>
              link.href === "/giai-phap" ? (
                <SolutionsDropdown key={link.href} />
              ) : link.href === "/san-pham" ? (
                <ProductsDropdown key={link.href} />
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-foreground/70 hover:text-primary whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150",
                    location.pathname.startsWith(link.href) &&
                      "text-primary bg-primary/5 font-semibold",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <CartBadge onClick={() => setCartOpen(true)} />
            <ThemeToggle />
            <Button asChild size="sm" className="cta-glow rounded-[4px] bg-[#3C5DAA] px-5 text-white hover:bg-[#3C5DAA]/90">
              <Link to="/lien-he">Liên hệ</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <CartBadge onClick={() => setCartOpen(true)} />
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  {open ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <MobileNav onClose={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

/* ════════════ Solutions Dropdown (Desktop) ════════════ */

function SolutionsDropdown() {
  const location = useLocation();
  const { isOpen, setIsOpen, handleEnter, handleLeave } = useHoverMenu();
  const isActive = location.pathname.startsWith("/giai-phap");
  const { data } = useSolutions();
  const solutions = data?.items ?? [];

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <Link
        to="/giai-phap"
        className={cn(
          "text-foreground/70 hover:text-primary inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150",
          isActive && "text-primary bg-primary/5 font-semibold",
        )}
      >
        Giải pháp
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </Link>

      {/* Dropdown panel */}
      <div
        className={cn(
          "absolute left-1/2 top-full pt-2 -translate-x-1/2 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="mega-menu-animated w-[600px] rounded-sm border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
              Giải pháp công nghệ
            </p>
            <Link
              to="/giai-phap"
              className="text-xs text-muted-foreground transition-colors hover:text-[#3C5DAA]"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả →
            </Link>
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {solutions.map((solution) => (
              <Link
                key={solution.slug}
                to={`/giai-phap/${solution.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 rounded-sm p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <SolutionIcon
                  name={solution.icon}
                  size="md"
                  className="mt-0.5 shrink-0 text-[#3C5DAA]"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">
                    {solution.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs leading-tight text-slate-500 dark:text-slate-400">
                    {solution.excerpt || solution.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════ Products Dropdown (Desktop Mega Menu) ════════════ */

function ProductsDropdown() {
  const location = useLocation();
  const { isOpen, setIsOpen, handleEnter, handleLeave } = useHoverMenu();
  const isActive = location.pathname.startsWith("/san-pham");

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        to="/san-pham"
        className={cn(
          "text-foreground/70 hover:text-primary inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150",
          isActive && "text-primary bg-primary/5 font-semibold",
        )}
      >
        Sản phẩm
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </Link>

      <div
        className={cn(
          "absolute left-1/2 top-full pt-2 -translate-x-1/2 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="mega-menu-animated w-[720px] rounded-sm border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
              Danh mục sản phẩm
            </p>
            <Link
              to="/san-pham"
              className="text-xs text-muted-foreground transition-colors hover:text-[#3C5DAA]"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>

          {/* 4-column mega menu */}
          <div className="grid grid-cols-4 gap-8">
            {PRODUCT_MENU_COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="mb-3 flex items-center gap-2">
                  <col.icon className="h-5 w-5 text-[#3C5DAA]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#3C5DAA]">
                    {col.title}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {col.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/san-pham?category=${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-sm px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#3C5DAA] dark:text-slate-400 dark:hover:bg-slate-800/50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════ Mobile Nav ════════════ */

function MobileNav({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  const { data } = useSolutions();
  const solutions = data?.items ?? [];

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {NAV_LINKS.map((link) =>
        link.href === "/giai-phap" ? (
          <MobileAccordionItem
            key={link.href}
            label={link.label}
            isActive={location.pathname.startsWith("/giai-phap")}
          >
            <Link
              to="/giai-phap"
              onClick={onClose}
              className="rounded-sm px-3 py-2 text-xs font-medium text-primary hover:bg-accent"
            >
              Tất cả giải pháp
            </Link>
            {solutions.map((s) => (
              <Link
                key={s.slug}
                to={`/giai-phap/${s.slug}`}
                onClick={onClose}
                className="rounded-sm px-3 py-2 text-xs text-foreground/70 hover:bg-accent hover:text-foreground"
              >
                {s.title}
              </Link>
            ))}
          </MobileAccordionItem>
        ) : link.href === "/san-pham" ? (
          <MobileAccordionItem
            key={link.href}
            label={link.label}
            isActive={location.pathname.startsWith("/san-pham")}
          >
            <Link
              to="/san-pham"
              onClick={onClose}
              className="rounded-sm px-3 py-2 text-xs font-medium text-primary hover:bg-accent"
            >
              Tất cả sản phẩm
            </Link>
            {PRODUCT_MENU_COLUMNS.flatMap((col) =>
              col.items.map((item) => (
                <Link
                  key={item.slug}
                  to={`/san-pham?category=${item.slug}`}
                  onClick={onClose}
                  className="rounded-sm px-3 py-2 text-xs text-foreground/70 hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              )),
            )}
          </MobileAccordionItem>
        ) : (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className={cn(
              "hover:bg-accent rounded-sm px-4 py-3 text-sm font-medium transition-colors",
              location.pathname.startsWith(link.href) &&
                "bg-primary/10 text-primary font-semibold",
            )}
          >
            {link.label}
          </Link>
        ),
      )}
      <Link
        to="/lien-he"
        onClick={onClose}
        className={cn(
          "hover:bg-accent rounded-sm px-4 py-3 text-sm font-medium transition-colors",
          location.pathname.startsWith("/lien-he") &&
            "bg-primary/10 text-primary font-semibold",
        )}
      >
        Liên hệ
      </Link>
    </nav>
  );
}
