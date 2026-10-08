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
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061116]/94 via-[#0b1f2a]/82 to-[#0b1f2a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061116]/78 via-transparent to-[#061116]/30" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-end px-4 py-12 sm:min-h-[calc(100svh-4.25rem)] sm:px-6 sm:py-20 lg:justify-center lg:px-8 lg:py-24">
        <div className="max-w-2xl text-white">
          <motion.h1
            className="font-display text-[2.65rem] leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.slow)}
          >
            {site.name}
          </motion.h1>

          <motion.p
            className="mt-4 text-xl font-medium tracking-tight text-[#9ee8e1] sm:mt-5 sm:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.06)}
          >
            {site.tagline}
          </motion.p>

          <motion.p
            className="mt-4 max-w-lg text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.12)}
          >
            {site.description} Learn design, marketing, web, video, business, and career skills through published
            Infozub programs.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
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
              className="w-full border-white/40 bg-white/5 text-white hover:bg-white/12 hover:text-white sm:w-auto"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>

          <motion.div
            className="relative z-20 mt-8 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.24)}
          >
            <CourseSearch
              size="lg"
              className="[&_form]:border-white/25 [&_form]:bg-white [&_form]:shadow-hero"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
