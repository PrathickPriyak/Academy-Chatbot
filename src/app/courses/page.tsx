import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CourseExplorer } from "@/components/courses/course-explorer";
import { formatPrice, levelLabel } from "@/lib/courses/present";
import { listPublishedCourses } from "@/lib/courses/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses",
  description: "Published Infozub Digital Academy programs, durations, and enrollment details.",
};

export default async function CoursesPage() {
  const courses = await listPublishedCourses();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Section spacing="lg">
          <Container>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
              Course information
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl">
              Published Infozub Digital Academy programs. The assistant answers from this
              catalog.
            </p>
            <div className="mt-8">
              <CourseExplorer
                courses={courses.map((course) => ({
                  id: course.id,
                  slug: course.slug,
                  title: course.title,
                  shortDescription: course.shortDescription,
                  duration: course.duration,
                  priceLabel:
                    course.price > 0
                      ? formatPrice(course.price, course.currency)
                      : "Price on the course page",
                  level: levelLabel(course.level),
                  category: course.category.name,
                  instructor: course.instructor.name,
                  enrollmentUrl: course.enrollmentUrl,
                  modules: course.modules.map((module) => ({
                    id: module.id,
                    title: module.title,
                    description: module.description,
                  })),
                }))}
              />
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
