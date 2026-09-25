"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/providers/theme-toggle";
import { BrandLogo } from "@/components/site/brand-logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/chat", label: "Chat" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Admin" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none" aria-label="Infozub home">
          <BrandLogo />
        </Link>
        <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={active ? "text-foreground" : "hover:text-foreground"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/chat">Start Chatting</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav className="border-border border-t px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild>
              <Link href="/chat">Start Chatting</Link>
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
