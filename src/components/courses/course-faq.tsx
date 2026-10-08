"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { CourseFaq } from "@/lib/courses/presenters";
import { duration, easeOutPremium } from "@/lib/motion";

export function CourseFaqList({ faqs }: { faqs: CourseFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <ul className="space-y-3">
      {faqs.map((faq, index) => {
        const open = openIndex === index;
        return (
          <li
            key={faq.question}
            className="border-border bg-card overflow-hidden rounded-2xl border transition-shadow duration-200 hover:shadow-soft"
          >
            <button
              type="button"
              className="flex w-full min-h-14 items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="font-semibold">{faq.question}</span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: duration.fast, ease: easeOutPremium }}
                className="inline-flex"
              >
                <ChevronDown className="size-5 shrink-0" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: duration.base, ease: easeOutPremium }}
                  className="overflow-hidden"
                >
                  <p className="text-muted-foreground border-border border-t px-5 py-4 text-sm leading-relaxed">
                    {faq.answer}
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
