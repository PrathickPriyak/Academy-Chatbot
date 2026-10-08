import Link from "next/link";

import { Container } from "@/components/layout/container";
import { listCategories } from "@/data/catalog";
import { navLinks, site } from "@/data/site";

import { BrandLogo } from "./brand-logo";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
] as const;

export function SiteFooter() {
  const categories = listCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-card/70 mt-auto border-t">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <BrandLogo />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">{site.description}</p>
            <div className="flex flex-wrap gap-2">
              {site.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary inline-flex min-h-11 items-center rounded-xl px-2 text-sm font-medium underline-offset-4 hover:underline"
                >
                  {item.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">Explore</h2>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/chat"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm font-medium transition-colors"
                >
                  Academy Assistant
                </Link>
              </li>
              <li>
                <a
                  href={site.lms}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm font-medium transition-colors"
                >
                  Learning platform
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">Categories</h2>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/courses?category=${category.slug}`}
                    className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm font-medium transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">Contact</h2>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="hover:text-foreground inline-flex min-h-11 items-center break-all font-medium transition-colors"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    className="hover:text-foreground inline-flex min-h-11 items-center font-medium transition-colors"
                  >
                    {site.phone}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {site.offices.corporate.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {site.offices.corporate.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="border-border mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {year} {site.name}. Part of{" "}
            <a href={site.companySite} target="_blank" rel="noreferrer" className="hover:text-foreground underline-offset-4 hover:underline">
              INFOZUB
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center px-2 text-xs font-medium underline-offset-4 hover:underline sm:text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
