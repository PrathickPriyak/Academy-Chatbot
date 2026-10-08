"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award, BookOpen, Laptop, LineChart, Users, Wrench } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { highlights } from "@/data/site";
import { hoverLift, transitionFast } from "@/lib/motion";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

const icons = [LineChart, Award, Wrench, Users, BookOpen, Laptop] as const;

export function WhyInfozub() {
  const reduceMotion = useReducedMotion();

  return (
    <Section spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Why Infozub</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Why learners choose Infozub</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Course highlights published on academy.infozub.com—practical training shaped by real digital marketing
            experience.
          </p>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = icons[index] ?? BookOpen;
            return (
              <RevealItem key={item}>
                <motion.div
                  className="border-border bg-card group h-full rounded-2xl border p-6 shadow-soft transition-colors hover:border-primary/35"
                  whileHover={hoverLift(reduceMotion, 3)}
                  transition={transitionFast}
                >
                  <div className="bg-primary/10 text-primary mb-4 inline-flex size-11 items-center justify-center rounded-xl transition-transform motion-safe:group-hover:-translate-y-0.5">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl tracking-tight">{item}</h3>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </Container>
    </Section>
  );
}
