import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Section({
  className,
  spacing = "md",
  ...props
}: HTMLAttributes<HTMLElement> & { spacing?: "sm" | "md" | "lg" }) {
  return (
    <section
      className={cn(
        spacing === "sm" && "py-10 sm:py-12",
        spacing === "md" && "py-14 sm:py-16",
        spacing === "lg" && "py-16 sm:py-24",
        className,
      )}
      {...props}
    />
  );
}
