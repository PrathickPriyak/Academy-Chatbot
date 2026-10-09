import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva("border-border bg-card text-card-foreground rounded-2xl border shadow-soft", {
  variants: {
    variant: {
      default: "",
      elevated: "border-border/70 shadow-lift",
      outline: "bg-transparent shadow-none",
      glass: "border-white/30 bg-card/70 shadow-md backdrop-blur-md",
      interactive:
        "transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lift",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Card({
  className,
  variant,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    interactive?: boolean;
  }) {
  return (
    <div
      className={cn(
        cardVariants({ variant: interactive ? "interactive" : variant }),
        className,
      )}
      {...props}
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
