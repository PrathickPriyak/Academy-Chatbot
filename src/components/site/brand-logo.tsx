import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-white px-2 py-1">
      {/* The mark is a wide wordmark, so a plain image keeps the target icon sharp. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/infozub-logo.jpg"
        alt="Infozub. Your Targeted Marketing Partner."
        className={cn("h-10 w-auto object-contain", className)}
      />
    </span>
  );
}
