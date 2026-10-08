"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { duration, easeOutPremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function CourseGallery({
  title,
  images,
}: {
  title: string;
  images: readonly string[];
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  if (!images.length) return null;

  const current = images[active] ?? images[0]!;

  return (
    <section>
      <h2 className="font-display text-3xl tracking-tight">From the course page</h2>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Visuals published on the Infozub Academy page for {title}.
      </p>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-muted shadow-lift ring-1 ring-border/70">
        <div className="relative aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : duration.base, ease: easeOutPremium }}
            >
              <Image
                src={current}
                alt={`${title} gallery image ${active + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show gallery image ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-xl ring-2 transition-[ring-color,transform] sm:size-20",
                  index === active ? "ring-primary" : "ring-transparent hover:ring-border",
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
