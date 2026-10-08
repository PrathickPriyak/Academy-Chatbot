"use client";

import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** GPU-friendly image hover zoom via CSS transform (respects prefers-reduced-motion). */
export function HoverMedia({
  className,
  imageClassName,
  alt = "",
  children,
  ...props
}: Omit<ImageProps, "alt"> & {
  alt?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        alt={alt}
        className={cn(
          "object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]",
          imageClassName,
        )}
        {...props}
      />
      {children}
    </div>
  );
}
