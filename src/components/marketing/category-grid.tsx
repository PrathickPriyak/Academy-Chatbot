"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HoverMedia } from "@/components/ui/hover-media";
import { listCategories, listCourses } from "@/data/catalog";
import { hoverLift, transitionFast } from "@/lib/motion";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function CategoryGrid() {
  const reduceMotion = useReducedMotion();
  const categories = listCategories().map((category) => {
    const courses = listCourses().filter((course) => course.category === category.slug);
    return {
      ...category,
      count: courses.length,
      cover: courses[0]?.thumbnail,
    };
  });

  return (
    <Section id="categories" spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Categories</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Browse by skill area</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Explore published Infozub Digital Academy categories and jump into the courses that match your goals.
          </p>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <RevealItem key={category.slug}>
              <motion.div whileHover={hoverLift(reduceMotion, 3)} transition={transitionFast} className="h-full">
                <Link
                  href={`/courses?category=${category.slug}`}
                  className="border-border bg-card hover:border-primary/40 hover:shadow-lift group flex h-full flex-col overflow-hidden rounded-2xl border shadow-soft transition-colors duration-200"
                >
                  {category.cover ? (
                    <HoverMedia
                      src={category.cover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="aspect-[16/9] bg-muted"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f2a]/50 via-transparent to-transparent" />
                    </HoverMedia>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl tracking-tight transition-colors group-hover:text-primary">
                        {category.name}
                      </h3>
                      <ArrowUpRight className="text-primary size-5 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">{category.description}</p>
                    <p className="text-foreground mt-5 text-sm font-semibold">
                      {category.count} course{category.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
