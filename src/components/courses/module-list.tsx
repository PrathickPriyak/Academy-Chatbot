"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { CatalogModule } from "@/data/catalog";
import { duration, easeOutPremium } from "@/lib/motion";

export function ModuleList({ modules }: { modules: CatalogModule[] }) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));
  const reduceMotion = useReducedMotion();

  function toggle(index: number) {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function expandAll() {
    setOpenIndexes(new Set(modules.map((_, index) => index)));
  }

  function collapseAll() {
    setOpenIndexes(new Set());
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={expandAll}>
          Expand all
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={collapseAll}>
          Collapse all
        </Button>
      </div>
      <ul className="space-y-3">
        {modules.map((module, index) => {
          const open = openIndexes.has(index);
          const panelId = `module-panel-${index}`;
          return (
            <li
              key={`${module.title}-${index}`}
              className="border-border bg-card overflow-hidden rounded-2xl border transition-shadow duration-200 hover:shadow-soft"
            >
              <button
                type="button"
                className="flex w-full min-h-14 items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                <span>
                  <span className="text-primary block text-xs font-semibold tracking-wide uppercase">
                    Module {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display mt-1 block text-lg tracking-tight">
                    {module.title.replace(/^Module\s+\d+:\s*/i, "")}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: duration.fast, ease: easeOutPremium }}
                  className="inline-flex"
                >
                  <ChevronDown className="size-5 shrink-0" aria-hidden />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: duration.base, ease: easeOutPremium }}
                    className="overflow-hidden"
                  >
                    <div className="border-border space-y-3 border-t px-5 py-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">{module.description}</p>
                      <p className="text-muted-foreground text-xs">
                        Published as a module overview. Individual lesson titles are not listed separately in the
                        archived catalog.
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
