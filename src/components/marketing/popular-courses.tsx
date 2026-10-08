"use client";

import Link from "next/link";

import { CourseCard } from "@/components/courses/course-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { listCourses } from "@/data/catalog";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function PopularCourses() {
  const courses = listCourses().slice(0, 6);

  return (
    <Section spacing="lg" className="bg-card/40">
      <Container>
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Popular courses</p>
            <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Explore the catalog</h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Published Infozub Digital Academy courses across design, marketing, web, video, business, and career
              skills—with instructor, level, duration, and price where available.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/courses">View all courses</Link>
          </Button>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <RevealItem key={course.slug}>
              <CourseCard course={course} featured={index < 2} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
