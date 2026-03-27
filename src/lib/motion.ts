import { type Variants } from "framer-motion";

/** Fade in + slide up on scroll */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Fade in from left */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Fade in from right */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Stagger container for children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

/** Scale up on hover */
export const scaleOnHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

/** Default viewport trigger settings */
export const viewportOnce = {
  once: true,
  margin: "-50px" as const,
  amount: 0.2 as const,
};
