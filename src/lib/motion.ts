"use client";

import type { Transition, Variants } from "framer-motion";

export const easeOutPremium: Transition["ease"] = [0.22, 1, 0.36, 1];

export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.48,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easeOutPremium },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: easeOutPremium },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: easeOutPremium },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOutPremium },
  },
};

export function revealProps(reduceMotion: boolean | null) {
  if (reduceMotion) {
    return {};
  }
  return {
    variants: fadeUp,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-48px" },
  };
}
