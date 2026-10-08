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

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <motion.article
            className="border-border bg-card group relative overflow-hidden rounded-[1.5rem] border shadow-lift"
            whileHover={reduceMotion ? undefined : { y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/courses/${primary.slug}`} className="grid h-full md:grid-cols-[0.95fr_1.05fr]">
              <HoverMedia
                src={primary.thumbnail}
                alt={`${primary.title} course thumbnail`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="aspect-[16/10] md:aspect-auto md:min-h-full"
              />
              <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{categoryNameForCourse(primary)}</Badge>
                    <Badge variant="outline">{levelLabel(primary.level)}</Badge>
                  </div>
                  <h3 className="font-display text-2xl tracking-tight group-hover:text-primary sm:text-3xl">
                    {primary.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {primary.shortDescription}
                  </p>
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

          <div className="grid gap-4">
            {rest.map((course) => (
              <motion.article
                key={course.slug}
                className="border-border bg-card group overflow-hidden rounded-[1.35rem] border shadow-soft"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/courses/${course.slug}`} className="flex h-full">
                  <HoverMedia
                    src={course.thumbnail}
                    alt={`${course.title} course thumbnail`}
                    fill
                    sizes="140px"
                    className="aspect-square w-28 shrink-0 sm:w-32"
                  />
                  <div className="flex flex-1 flex-col justify-between gap-2 p-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {categoryNameForCourse(course)}
                      </Badge>
                      <h3 className="font-display text-lg tracking-tight group-hover:text-primary sm:text-xl">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
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

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/courses">Browse all courses</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
