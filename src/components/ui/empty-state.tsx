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
      role="status"
      className={cn(
        "bg-muted/45 flex flex-col items-start gap-4 rounded-[1.5rem] px-7 py-12 text-left ring-1 ring-border/70",
        className,
      )}
    >
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">No matches</p>
        <h2 className="font-display text-2xl tracking-tight">{title}</h2>
        {description ? <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
