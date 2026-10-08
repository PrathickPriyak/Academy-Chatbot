"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { CourseSearch } from "@/components/site/course-search";
import { Button } from "@/components/ui/button";
import { listCourses } from "@/data/catalog";
import { site } from "@/data/site";
import { duration, easeOutPremium } from "@/lib/motion";

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const heroImage = listCourses()[0]?.thumbnail ?? "/infozub-logo.jpg";

  return (
    <section className="relative isolate min-h-[calc(100svh-4.25rem)] overflow-hidden">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#071318]/92 via-[#0b1f2a]/78 to-[#0b1f2a]/35"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#071318]/70 via-transparent to-[#071318]/25"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 sm:py-20 lg:justify-center lg:px-8 lg:py-24">
        <div className="max-w-2xl text-white">
          <motion.p
            className="mb-5 font-semibold tracking-[0.22em] text-[0.7rem] text-[#7edfd6] uppercase sm:text-xs"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium }}
          >
            {site.name}
          </motion.p>

          <motion.h1
            className="font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easeOutPremium, delay: 0.05 }}
          >
            {site.tagline}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-base leading-relaxed text-white/82 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium, delay: 0.12 }}
          >
            {site.description} Learn design, marketing, web, video, business, and career skills through published
            Infozub programs.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium, delay: 0.18 }}
          >
            <Button asChild size="lg" className="bg-[#0d7377] text-white hover:bg-[#0d7377]/90">
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/35 bg-white/5 text-white hover:bg-white/12 hover:text-white"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 max-w-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOutPremium, delay: 0.24 }}
          >
            <CourseSearch
              size="lg"
              className="[&_form]:border-white/20 [&_form]:bg-white/95 [&_form]:shadow-hero"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
