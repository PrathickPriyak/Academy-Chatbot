"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { refundSummary, site } from "@/data/site";
import { duration, easeOutPremium } from "@/lib/motion";

import { Reveal } from "./reveal";

export function FinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <Section spacing="lg">
      <Container>
        <Reveal>
          <motion.div
            className="border-border from-primary/90 to-primary relative overflow-hidden rounded-[2rem] bg-gradient-to-br px-6 py-12 text-primary-foreground shadow-hero sm:px-12 sm:py-16"
            whileHover={reduceMotion ? undefined : { scale: 1.005 }}
            transition={{ duration: duration.base, ease: easeOutPremium }}
          >
            <div className="absolute -top-20 right-0 size-64 rounded-full bg-accent/25 blur-3xl" aria-hidden />
            {!reduceMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["0%", "280%"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
              />
            ) : null}
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Ready to start learning?</h2>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/90">
                Explore published courses from {site.name}, or talk with the team about the right program for your
                goals.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/courses">Explore Courses</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <p className="mt-8 text-sm text-primary-foreground/85">
                {refundSummary.headline}{" "}
                <Link href={refundSummary.href} className="underline underline-offset-4">
                  Read refund policy
                </Link>
              </p>
            </div>
          </motion.div>
        </Reveal>
      </Container>
    </Section>
  );
}
