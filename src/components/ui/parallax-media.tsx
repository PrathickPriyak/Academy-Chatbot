"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Soft parallax zoom for hero / feature media. Respects reduced motion. */
export function ParallaxMedia({
  src,
  alt = "",
  className,
  imageClassName,
  children,
  intensity = 14,
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
  intensity?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [intensity, -intensity]);
  const scale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.08, 1]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-[-8%] will-change-transform" style={{ y, scale }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
      {children}
    </div>
  );
}
