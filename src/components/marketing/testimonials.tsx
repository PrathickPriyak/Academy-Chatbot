"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/site";

import { Reveal } from "./reveal";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = testimonials[index]!;

  function prev() {
    setIndex((value) => (value - 1 + testimonials.length) % testimonials.length);
  }

  function next() {
    setIndex((value) => (value + 1) % testimonials.length);
  }

  return (
    <Section spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Testimonials</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">What learners say</h2>
        </Reveal>

        <div className="border-border bg-card relative mx-auto mt-10 max-w-3xl rounded-[2rem] border p-8 shadow-soft sm:p-12">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={item.name}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="text-center"
              aria-live="polite"
            >
              <p className="font-display text-xl leading-relaxed tracking-tight sm:text-2xl">“{item.quote}”</p>
              <footer className="text-muted-foreground mt-6 text-sm font-semibold">{item.name}</footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button type="button" variant="outline" size="icon" aria-label="Previous testimonial" onClick={prev}>
              <ChevronLeft />
            </Button>
            <div className="flex gap-1" role="group" aria-label="Choose testimonial">
              {testimonials.map((testimonial, i) => (
                <button
                  key={testimonial.name}
                  type="button"
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Show testimonial from ${testimonial.name}`}
                  className={`inline-flex size-11 items-center justify-center rounded-full transition-colors ${
                    i === index ? "text-primary" : "text-border"
                  }`}
                  onClick={() => setIndex(i)}
                >
                  <span
                    className={`size-2.5 rounded-full ${i === index ? "bg-primary" : "bg-border"}`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
            <Button type="button" variant="outline" size="icon" aria-label="Next testimonial" onClick={next}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
