/**
 * Google Analytics 4 — loads gtag.js when VITE_GA4_ID is configured.
 * To use: set VITE_GA4_ID in .env (e.g., G-XXXXXXXXXX).
 */
import { useEffect } from "react";
import { useLocation } from "react-router";

const GA4_ID = import.meta.env.VITE_GA4_ID ?? "";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Load the GA4 script once. Call this in a top-level component. */
export function useGA4() {
  const location = useLocation();

  useEffect(() => {
    if (!GA4_ID) return;

    // Load gtag.js script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);

    return () => {
      script.remove();
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA4_ID || !window.gtag) return;
    window.gtag("config", GA4_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}
