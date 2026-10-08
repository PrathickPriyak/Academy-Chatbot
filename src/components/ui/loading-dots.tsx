"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export function LoadingDots({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={cn("inline-flex items-center gap-1", className)} role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="bg-current size-1.5 rounded-full opacity-70"
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.35, 1, 0.35],
                  y: [0, -2, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.12,
                }
          }
        />
      ))}
    </span>
  );
}
