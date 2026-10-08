import type { ReactNode } from "react";

import { AssistantWidget } from "@/components/assistant/assistant-widget";
import { PageTransition } from "@/components/motion/page-transition";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 sr-only focus:not-sr-only"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <AssistantWidget />
    </div>
  );
}
