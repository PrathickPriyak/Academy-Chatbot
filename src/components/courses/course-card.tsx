"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  catalog,
  categoryNameForCourse,
  formatCoursePrice,
  levelLabel,
  type CatalogCourse,
} from "@/data/catalog";
import { cn } from "@/lib/utils";

export function CourseCard({
  course,
  className,
  featured = false,
}: {
  course: CatalogCourse;
  className?: string;
  featured?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const category = categoryNameForCourse(course);
  const price = formatCoursePrice(course);

  return (
    <motion.article
      className={cn(
        "border-border bg-card group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-soft",
        className,
      )}
      whileHover={reduceMotion ? undefined : { y: -4, boxShadow: "var(--shadow-md)" }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/courses/${course.slug}`} className="flex h-full flex-col outline-none">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={course.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{category}</Badge>
            {featured ? <Badge variant="accent">Featured</Badge> : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-2">
            <h3 className="font-display text-xl leading-snug tracking-tight transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {course.shortDescription}
            </p>
          </div>

          <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
            <span>{catalog.instructor.name}</span>
            <span aria-hidden>·</span>
            <span>{levelLabel(course.level)}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden />
              {course.duration}
            </span>
          </div>

          <div className="border-border flex items-center justify-between gap-3 border-t pt-3">
            <span className="text-foreground text-sm font-semibold">{price}</span>
            <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold opacity-90 transition-opacity group-hover:opacity-100">
              View course
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
