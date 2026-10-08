"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverMedia } from "@/components/ui/hover-media";
import {
  catalog,
  categoryNameForCourse,
  formatCoursePrice,
  getCourseBySlug,
  levelLabel,
} from "@/data/catalog";

import { Reveal } from "./reveal";

const featuredSlugs = [
  "social-media-marketing",
  "adobe-photoshop",
  "web-design",
] as const;

export function FeaturedLearning() {
  const reduceMotion = useReducedMotion();
  const courses = featuredSlugs
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is NonNullable<typeof course> => Boolean(course));

  const [primary, ...rest] = courses;
  if (!primary) return null;

  return (
    <Section spacing="lg" className="bg-card/40">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Featured learning</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Programs learners start with</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Highlighted published Infozub Digital Academy courses with clear pricing and practical curricula.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <motion.article
            className="border-border bg-card group relative overflow-hidden rounded-[2rem] border shadow-lift"
            whileHover={reduceMotion ? undefined : { y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/courses/${primary.slug}`} className="grid h-full md:grid-cols-[1.1fr_0.9fr]">
              <HoverMedia
                src={primary.thumbnail}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="min-h-64 md:min-h-full"
              />
              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{categoryNameForCourse(primary)}</Badge>
                    <Badge variant="outline">{levelLabel(primary.level)}</Badge>
                  </div>
                  <h3 className="font-display text-3xl tracking-tight group-hover:text-primary">{primary.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{primary.shortDescription}</p>
                  <p className="text-muted-foreground text-xs font-medium">
                    {catalog.instructor.name} · {primary.duration}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-foreground text-lg font-semibold">{formatCoursePrice(primary)}</span>
                  <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold">
                    View course
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>

          <div className="grid gap-6">
            {rest.map((course) => (
              <motion.article
                key={course.slug}
                className="border-border bg-card group overflow-hidden rounded-[1.75rem] border shadow-soft"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/courses/${course.slug}`} className="flex h-full flex-col sm:flex-row">
                  <HoverMedia
                    src={course.thumbnail}
                    alt=""
                    fill
                    sizes="160px"
                    className="aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:min-h-full sm:w-40"
                  />
                  <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {categoryNameForCourse(course)}
                      </Badge>
                      <h3 className="font-display text-xl tracking-tight group-hover:text-primary">{course.title}</h3>
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                        {course.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">{formatCoursePrice(course)}</span>
                      <span className="text-primary text-sm font-semibold">View course</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/courses">Browse all courses</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
