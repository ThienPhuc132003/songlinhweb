import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal hook using native IntersectionObserver.
 * Replaces framer-motion's `whileInView` for better performance.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal">...</div>
 *
 * For staggered children:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal-stagger">
 *     <div className="reveal-item">...</div>
 *   </div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-40px",
        ...options,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
