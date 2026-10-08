"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { listCategories, listCourses } from "@/data/catalog";
import { founder } from "@/data/site";

function AnimatedValue({
  value,
  suffix = "",
  compact = false,
}: {
  value: number;
  suffix?: string;
  compact?: boolean;
}) {
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

  const formatted = compact
    ? new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(display)
    : display.toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsBand() {
  const courseCount = listCourses().length;
  const categoryCount = listCategories().length;

  const stats = [
    { label: "Published courses", numeric: courseCount, suffix: "", compact: false },
    { label: "Skill categories", numeric: categoryCount, suffix: "", compact: false },
    { label: founder.stats[0].label, numeric: 10, suffix: "+", compact: false },
    { label: founder.stats[1].label, numeric: 200, suffix: "+", compact: false },
    { label: founder.stats[2].label, numeric: 170000, suffix: "+", compact: true },
    { label: founder.stats[3].label, numeric: 47000000, suffix: "+", compact: true },
  ] as const;

  return (
    <Section spacing="sm" className="border-border/70 border-y bg-card/70">
      <Container>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat, index) => (
            <motion.li
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
              className="text-center sm:text-left"
            >
              <p className="font-display text-3xl tracking-tight sm:text-4xl">
                <AnimatedValue value={stat.numeric} suffix={stat.suffix} compact={stat.compact} />
              </p>
              <p className="text-muted-foreground mt-1 text-sm font-medium">{stat.label}</p>
            </motion.li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
