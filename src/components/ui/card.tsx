"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  const reduceMotion = useReducedMotion();

  if (!interactive) {
    return (
      <div
        className={cn("border-border bg-card text-card-foreground rounded-2xl border shadow-soft", className)}
        {...props}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "border-border bg-card text-card-foreground rounded-2xl border shadow-soft transition-colors",
        className,
      )}
      whileHover={reduceMotion ? undefined : { y: -4, boxShadow: "var(--shadow-md)" }}
      transition={{ duration: 0.2 }}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-xl leading-snug tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground text-sm leading-relaxed", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 p-5 pt-0", className)} {...props} />;
}
