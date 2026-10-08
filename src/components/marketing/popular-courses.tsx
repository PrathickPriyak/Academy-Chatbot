import Link from "next/link";

import { CourseCard } from "@/components/courses/course-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { listCourses } from "@/data/catalog";

import { Reveal } from "./reveal";

export function PopularCourses() {
  const courses = listCourses().slice(0, 6);

  return (
    <Section spacing="lg" className="bg-card/40">
      <Container>
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Courses</p>
            <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Start with these programs</h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              A selection of published Infozub Digital Academy courses across design, marketing, web, video, business,
              and career skills.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/courses">View all courses</Link>
          </Button>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <CourseCard key={course.slug} course={course} featured={index < 2} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
