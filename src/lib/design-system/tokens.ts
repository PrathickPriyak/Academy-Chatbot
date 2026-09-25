/**
 * Infozub Digital Academy design tokens.
 * CSS variables in globals.css are the source of truth for runtime theming.
 * These constants document the same scale for TypeScript consumers.
 */

export const colors = {
  light: {
    background: "#f6f3ee",
    foreground: "#14202e",
    card: "#fffdf9",
    cardForeground: "#14202e",
    primary: "#0e6b64",
    primaryForeground: "#f4fffc",
    secondary: "#e7e1d6",
    secondaryForeground: "#1c2a24",
    muted: "#efeae2",
    mutedForeground: "#5c675f",
    accent: "#c9852a",
    accentForeground: "#1a1206",
    destructive: "#b42318",
    destructiveForeground: "#fff7f6",
    border: "#ddd6cb",
    ring: "#0e6b64",
    success: "#1f7a4d",
    warning: "#b86e00",
  },
  dark: {
    background: "#0e1412",
    foreground: "#f3efe6",
    card: "#16201c",
    cardForeground: "#f3efe6",
    primary: "#3dcfc2",
    primaryForeground: "#04221f",
    secondary: "#24302b",
    secondaryForeground: "#f3efe6",
    muted: "#1c2723",
    mutedForeground: "#b7c2bb",
    accent: "#e4b15a",
    accentForeground: "#1a1206",
    destructive: "#f07167",
    destructiveForeground: "#2a0c09",
    border: "#2c3a34",
    ring: "#3dcfc2",
    success: "#4ade80",
    warning: "#f5c16c",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-sans)",
    display: "var(--font-display)",
    mono: "var(--font-mono)",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.15",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.7",
  },
  letterSpacing: {
    tight: "-0.03em",
    normal: "0em",
    wide: "0.08em",
  },
} as const;

export const spacing = {
  0: "0px",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const shadows = {
  xs: "0 1px 2px rgb(20 32 46 / 0.05)",
  sm: "0 1px 2px rgb(20 32 46 / 0.06), 0 1px 3px rgb(20 32 46 / 0.06)",
  md: "0 8px 24px rgb(20 32 46 / 0.08)",
  lg: "0 18px 40px rgb(20 32 46 / 0.12)",
  xl: "0 28px 64px rgb(20 32 46 / 0.16)",
  glow: "0 0 0 4px rgb(14 107 100 / 0.16)",
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.25rem",
  "2xl": "1.75rem",
  full: "9999px",
} as const;

export const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "accent",
  "destructive",
] as const;

export const cardVariants = [
  "default",
  "elevated",
  "outline",
  "glass",
  "interactive",
] as const;

export const inputVariants = ["default", "filled", "ghost"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type CardVariant = (typeof cardVariants)[number];
export type InputVariant = (typeof inputVariants)[number];
