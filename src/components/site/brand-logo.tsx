import Image from "next/image";
import Link from "next/link";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex min-h-11 items-center rounded-xl focus-visible:outline-none", className)}
      aria-label={`${site.name} home`}
    >
      <Image
        src="/infozub-logo-transparent.png"
        alt={site.name}
        width={180}
        height={60}
        sizes="(max-width: 640px) 140px, 180px"
        priority={priority}
        className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-10 md:h-11"
      />
    </Link>
  );
}
