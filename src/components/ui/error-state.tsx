import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-destructive/30 bg-card text-card-foreground flex flex-col items-start gap-3 rounded-2xl border px-6 py-8 shadow-soft",
        className,
      )}
      role="alert"
    >
      <h3 className="font-display text-xl tracking-tight">{title}</h3>
      {description ? <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{description}</p> : null}
      {action}
    </div>
  );
}
