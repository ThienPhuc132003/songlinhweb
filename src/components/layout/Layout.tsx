import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";
import FloatingBar from "./FloatingBar";
import { Toaster } from "@/components/ui/sonner";
import { ZaloWidget } from "@/components/widgets/ZaloWidget";
import { useGA4 } from "@/components/widgets/GA4";
import { CompareDrawer } from "@/components/compare/CompareDrawer";

export default function Layout() {
  const { pathname } = useLocation();
  const [fadeIn, setFadeIn] = useState(false);

  // GA4 page tracking
  useGA4();

  // Scroll to top + trigger fade-in on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setFadeIn(false);
    // Force reflow then fade in
    const raf = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <div
          key={pathname}
          className={`transition-opacity duration-300 ease-out ${fadeIn ? "opacity-100" : "opacity-0"}`}
        >
          <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingBar />
      <CompareDrawer />
      <Toaster richColors position="top-right" />
      <ZaloWidget />
    </div>
  );
}
