"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { listCourses } from "@/data/catalog";
import { founder } from "@/data/site";

function AnimatedValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const durationMs = 900;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function StatsBand() {
  const courseCount = listCourses().length;
  const stats = [
    { label: "Published courses", numeric: courseCount, suffix: "", display: null as string | null },
    { label: founder.stats[0].label, numeric: 10, suffix: "+", display: null },
    { label: founder.stats[1].label, numeric: 200, suffix: "+", display: null },
    { label: founder.stats[2].label, numeric: 170000, suffix: "+", display: null },
  ];

  return (
    <Section spacing="sm" className="border-border/70 border-y bg-card/50">
      <Container>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.li
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="text-center sm:text-left"
            >
              <p className="font-display text-3xl tracking-tight sm:text-4xl">
                <AnimatedValue value={stat.numeric} suffix={stat.suffix} />
              </p>
              <p className="text-muted-foreground mt-1 text-sm font-medium">{stat.label}</p>
            </motion.li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
