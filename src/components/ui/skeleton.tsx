import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-muted relative overflow-hidden rounded-xl",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[skeleton-shimmer_1.4s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent motion-reduce:before:animate-none dark:before:via-white/10",
        className,
      )}
      {...props}
    />
  );
}
