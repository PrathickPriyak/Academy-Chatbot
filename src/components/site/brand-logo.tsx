import Image from "next/image";
import Link from "next/link";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none", className)}
      aria-label={`${site.name} home`}
    >
      <Image
        src="/infozub-logo.jpg"
        alt="Infozub"
        width={148}
        height={40}
        sizes="148px"
        priority={priority}
        className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-10"
      />
      <span className="text-foreground hidden min-w-0 font-semibold tracking-tight xl:inline">
        <span className="block text-sm leading-none">Digital Academy</span>
        <span className="text-muted-foreground mt-1 block max-w-[11rem] truncate text-[11px] font-medium">
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
