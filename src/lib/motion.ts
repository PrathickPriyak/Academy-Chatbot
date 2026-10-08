"use client";

import type { Transition, Variants } from "framer-motion";

export const easeOutPremium: Transition["ease"] = [0.22, 1, 0.36, 1];

export const duration = {
  instant: 0.12,
  fast: 0.18,
  base: 0.28,
  slow: 0.4,
} as const;

export const transitionFast: Transition = {
  duration: duration.fast,
  ease: easeOutPremium,
};

export const transitionBase: Transition = {
  duration: duration.base,
  ease: easeOutPremium,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionBase,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionBase,
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easeOutPremium },
  },
};

export const drawerSlide = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
} as const;

export const sheetSlide = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
} as const;

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export const listItemFade: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: easeOutPremium },
  },
};

export function revealProps(reduceMotion: boolean | null) {
  return {
    variants: fadeUp,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-40px" as const },
    transition: reduceMotion ? { duration: 0 } : transitionBase,
  };
}

export function hoverLift(reduceMotion: boolean | null, amount = 3) {
  if (reduceMotion) return undefined;
  return { y: -amount };
}

export function tapPress(reduceMotion: boolean | null) {
  if (reduceMotion) return undefined;
  return { scale: 0.985 };
}

export const softPulse: Variants = {
  hidden: { opacity: 0.55 },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: easeOutPremium },
  },
};
