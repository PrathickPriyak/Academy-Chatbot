"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { CourseSearch } from "@/components/site/course-search";
import { Button } from "@/components/ui/button";
import { listCourses } from "@/data/catalog";
import { site } from "@/data/site";
import { duration, easeOutPremium } from "@/lib/motion";

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const courseCount = listCourses().length;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 70% 20%, rgb(13 115 119 / 0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgb(201 162 39 / 0.1), transparent 55%)",
        }}
      />
      <div className="relative mx-auto grid min-h-[calc(100svh-4.25rem)] max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <motion.p
            className="text-primary mb-4 text-sm font-semibold tracking-[0.18em] uppercase"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium }}
          >
            {site.name}
          </motion.p>
          <motion.h1
            className="font-display text-foreground text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easeOutPremium, delay: 0.05 }}
          >
            {site.tagline}
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium, delay: 0.12 }}
          >
            {site.description}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium, delay: 0.18 }}
          >
            <Button asChild size="lg">
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>
          <motion.div
            className="mt-8"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium, delay: 0.24 }}
          >
            <CourseSearch size="lg" />
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.slow, ease: easeOutPremium, delay: 0.15 }}
        >
          <div className="border-border from-card via-card to-secondary/40 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-6 shadow-hero sm:p-8">
            <div className="absolute -top-16 -right-10 size-48 rounded-full bg-primary/15 blur-3xl" aria-hidden />
            <div className="absolute -bottom-20 -left-10 size-52 rounded-full bg-accent/20 blur-3xl" aria-hidden />
            <div className="relative space-y-6">
              <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Digital skills that ship
              </p>
              <p className="font-display text-3xl tracking-tight sm:text-4xl">
                Design, marketing, web, video, business, and career programs—built for practical outcomes.
              </p>
              <dl className="grid grid-cols-2 gap-4">
                <div className="bg-background/70 rounded-2xl p-4">
                  <dt className="text-muted-foreground text-xs font-semibold uppercase">Published courses</dt>
                  <dd className="font-display mt-1 text-3xl">{courseCount}</dd>
                </div>
                <div className="bg-background/70 rounded-2xl p-4">
                  <dt className="text-muted-foreground text-xs font-semibold uppercase">Access</dt>
                  <dd className="font-display mt-1 text-2xl leading-tight">Self-paced</dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
