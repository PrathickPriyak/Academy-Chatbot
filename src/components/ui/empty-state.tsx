import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-card flex flex-col items-start gap-3 rounded-2xl border border-dashed px-6 py-10 text-left shadow-soft",
        className,
      )}
    >
      <h3 className="font-display text-xl tracking-tight">{title}</h3>
      {description ? <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{description}</p> : null}
      {action}
    </div>
  );
}
