import Image from "next/image";
import Link from "next/link";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex min-h-11 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={`${site.name} home`}
    >
      <span className="inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-xs ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.02] sm:px-2.5 sm:py-1.5">
        <Image
          src="/infozub-logo.png"
          alt={site.name}
          width={270}
          height={90}
          sizes="(max-width: 640px) 150px, 200px"
          priority={priority}
          className="h-8 w-auto max-w-[9.75rem] object-contain object-left sm:h-9 sm:max-w-[11.5rem] md:h-10 md:max-w-[12.75rem]"
        />
      </span>
    </Link>
  );
}
