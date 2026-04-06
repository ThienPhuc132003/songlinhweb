import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";
import FloatingBar from "./FloatingBar";
import { PageTransition } from "@/components/ui/page-transition";
import { Toaster } from "@/components/ui/sonner";
import { ZaloWidget } from "@/components/widgets/ZaloWidget";
import { useGA4 } from "@/components/widgets/GA4";
import { CompareDrawer } from "@/components/compare/CompareDrawer";

export default function Layout() {
  const { pathname } = useLocation();

  // GA4 page tracking
  useGA4();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingBar />
      <CompareDrawer />
      <Toaster richColors position="top-right" />
      <ZaloWidget />
    </div>
  );
}
