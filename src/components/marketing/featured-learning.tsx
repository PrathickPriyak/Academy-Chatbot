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
  durationLabel,
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

        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[1.25fr_1fr]">
          <motion.article
            className="border-border bg-card group relative h-full overflow-hidden rounded-[1.5rem] border shadow-lift"
            whileHover={reduceMotion ? undefined : { y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={`/courses/${primary.slug}`}
              className="grid h-full md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
            >
              <HoverMedia
                src={primary.thumbnail}
                alt={`${primary.title} course thumbnail`}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[22rem]"
                imageClassName="object-cover object-center"
              />
              <div className="flex flex-col justify-between gap-5 p-5 sm:p-6 md:p-7">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{categoryNameForCourse(primary)}</Badge>
                    <Badge variant="outline">{levelLabel(primary.level)}</Badge>
                  </div>
                  <h3 className="font-display text-primary text-2xl tracking-tight sm:text-3xl">
                    {primary.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {primary.shortDescription}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">
                    {catalog.instructor.name} · {durationLabel(primary.duration)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-foreground text-lg font-semibold">{formatCoursePrice(primary)}</span>
                  <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold">
                    View course
                    <ArrowUpRight
                      className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>

          <div className="grid h-full auto-rows-fr gap-4">
            {rest.map((course) => (
              <motion.article
                key={course.slug}
                className="border-border bg-card group h-full overflow-hidden rounded-[1.35rem] border shadow-soft"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/courses/${course.slug}`} className="flex h-full min-h-[9.5rem]">
                  <HoverMedia
                    src={course.thumbnail}
                    alt={`${course.title} course thumbnail`}
                    fill
                    sizes="180px"
                    className="relative w-[7.5rem] shrink-0 self-stretch sm:w-40"
                    imageClassName="object-cover object-center"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
                    <div className="min-w-0">
                      <Badge variant="secondary" className="mb-2">
                        {categoryNameForCourse(course)}
                      </Badge>
                      <h3 className="font-display line-clamp-2 text-lg tracking-tight transition-colors group-hover:text-primary sm:text-xl">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
                        {course.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">{formatCoursePrice(course)}</span>
                      <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold">
                        View course
                        <ArrowUpRight
                          className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </span>
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
