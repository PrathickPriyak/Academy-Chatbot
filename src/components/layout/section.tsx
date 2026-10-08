import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-8 sm:py-10",
      md: "py-12 sm:py-16",
      lg: "py-16 sm:py-24",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, className }))}
      {...props}
    />
  ),
);
Section.displayName = "Section";

export { Section, sectionVariants };
