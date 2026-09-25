import Link from "next/link";

import { BrandLogo } from "@/components/site/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <BrandLogo className="h-8" />
          <p>Infozub AI Assistant. Answers stay inside academy course knowledge.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
