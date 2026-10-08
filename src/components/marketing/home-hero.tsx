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
  const t = (ms: number, delay = 0) => ({
    duration: reduceMotion ? 0 : ms,
    ease: easeOutPremium,
    delay: reduceMotion ? 0 : delay,
  });

  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-4.25rem)]">
      {/* Clip media only so search suggestions can escape the hero */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071318]/92 via-[#0b1f2a]/78 to-[#0b1f2a]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071318]/70 via-transparent to-[#071318]/25" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-end px-4 py-12 sm:min-h-[calc(100svh-4.25rem)] sm:px-6 sm:py-20 lg:justify-center lg:px-8 lg:py-24">
        <div className="max-w-2xl text-white">
          <motion.p
            className="mb-4 font-semibold tracking-[0.22em] text-[0.7rem] text-[#7edfd6] uppercase sm:mb-5 sm:text-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base)}
          >
            {site.name}
          </motion.p>

          <motion.h1
            className="font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] lg:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.slow, 0.05)}
          >
            {site.tagline}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-lg text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.12)}
          >
            {site.description} Learn design, marketing, web, video, business, and career skills through published
            Infozub programs.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.18)}
          >
            <Button asChild size="lg" className="w-full bg-[#0d7377] text-white hover:bg-[#0d7377]/90 sm:w-auto">
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/35 bg-white/5 text-white hover:bg-white/12 hover:text-white sm:w-auto"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>

          <motion.div
            className="relative z-20 mt-7 max-w-xl sm:mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.24)}
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
