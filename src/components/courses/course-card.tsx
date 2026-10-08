"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { HoverMedia } from "@/components/ui/hover-media";
import {
  catalog,
  categoryNameForCourse,
  formatCoursePrice,
  levelLabel,
  type CatalogCourse,
} from "@/data/catalog";
import { hoverLift, transitionFast } from "@/lib/motion";
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
        "bg-card group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] ring-1 ring-border/80 shadow-[0_1px_2px_rgb(11_31_42/0.04),0_8px_24px_rgb(11_31_42/0.05)] transition-[box-shadow,ring-color] duration-200 hover:ring-primary/25 hover:shadow-[0_2px_8px_rgb(11_31_42/0.06),0_16px_36px_rgb(11_31_42/0.08)]",
        className,
      )}
      whileHover={hoverLift(reduceMotion, 3)}
      transition={transitionFast}
    >
      <Link href={`/courses/${course.slug}`} className="flex h-full flex-col outline-none">
        <HoverMedia
          src={course.thumbnail}
          alt={`${course.title} course thumbnail`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[16/9] bg-muted"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f2a]/45 via-[#0b1f2a]/10 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/92 text-foreground shadow-xs backdrop-blur-sm">
              {category}
            </Badge>
            {featured ? <Badge variant="accent">Featured</Badge> : null}
          </div>
        </HoverMedia>

        <div className="flex flex-1 flex-col gap-3.5 px-5 pt-4 pb-5">
          <div className="space-y-2">
            <h3 className="font-display line-clamp-2 text-[1.35rem] leading-snug tracking-tight transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {course.shortDescription}
            </p>
          </div>

          <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.7rem] font-medium tracking-wide uppercase">
            <span className="normal-case tracking-normal">{catalog.instructor.name}</span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span>{levelLabel(course.level)}</span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal">
              <Clock3 className="size-3.5" aria-hidden />
              {course.duration}
            </span>
          </div>

          <div className="border-border/80 flex items-center justify-between gap-3 border-t pt-3.5">
            <span className="text-foreground text-[0.95rem] font-semibold tracking-tight">{price}</span>
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
  );
}
