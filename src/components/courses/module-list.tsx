"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { CatalogModule } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function ModuleList({ modules }: { modules: CatalogModule[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <ul className="space-y-3">
      {modules.map((module, index) => {
        const open = openIndex === index;
        return (
          <li key={`${module.title}-${index}`} className="border-border bg-card overflow-hidden rounded-2xl border">
            <button
              type="button"
              className="flex w-full min-h-14 items-center justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>
                <span className="text-primary block text-xs font-semibold tracking-wide uppercase">
                  Module {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display mt-1 block text-lg tracking-tight">{module.title}</span>
              </span>
              <ChevronDown className={cn("size-5 shrink-0 transition-transform", open && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <p className="text-muted-foreground border-border border-t px-5 py-4 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
