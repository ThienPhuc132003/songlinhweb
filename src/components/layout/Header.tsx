import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

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
          "bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur transition-shadow duration-200",
          scrolled && "shadow-sm",
        )}
      >
        <div className="container-custom flex h-16 items-center justify-between lg:h-[4.5rem]">
          {/* Logo — clicking goes to homepage */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
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

          {/* Desktop Nav — visible from lg (1024px) */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-foreground/70 hover:text-primary whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  location.pathname.startsWith(link.href) &&
                    "text-primary bg-primary/5 font-semibold",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions — Liên hệ button replaces phone number */}
          <div className="hidden items-center gap-2 lg:flex shrink-0">
            <CartBadge onClick={() => setCartOpen(true)} />
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/lien-he">Liên hệ</Link>
            </Button>
          </div>

          {/* Mobile Actions — visible below lg */}
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
                <nav className="mt-8 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "hover:bg-accent rounded-md px-4 py-3 text-sm font-medium transition-colors",
                        location.pathname.startsWith(link.href) &&
                          "bg-primary/10 text-primary font-semibold",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {/* Liên hệ in mobile menu */}
                  <Link
                    to="/lien-he"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "hover:bg-accent rounded-md px-4 py-3 text-sm font-medium transition-colors",
                      location.pathname.startsWith("/lien-he") &&
                        "bg-primary/10 text-primary font-semibold",
                    )}
                  >
                    Liên hệ
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
