import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container-custom flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt={SITE.shortName} className="h-10 w-auto lg:h-12" />
          <div className="hidden sm:block">
            <p className="text-primary text-sm font-bold leading-tight lg:text-base">{SITE.shortName}</p>
            <p className="text-muted-foreground text-xs">{SITE.tagline}</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className={cn("text-foreground/80 hover:text-primary rounded-md px-3 py-2 text-sm font-medium transition-colors", (link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href)) && "text-primary bg-primary/5 font-semibold")}>{link.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild size="sm"><a href={`tel:${SITE.phoneRaw}`}><Phone className="mr-1.5 h-4 w-4" />{SITE.phone}</a></Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" size="icon" asChild><a href={`tel:${SITE.phoneRaw}`}><Phone className="h-5 w-5" /></a></Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button></SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setOpen(false)} className={cn("hover:bg-accent rounded-md px-4 py-3 text-sm font-medium transition-colors", (link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href)) && "bg-primary/10 text-primary font-semibold")}>{link.label}</Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
