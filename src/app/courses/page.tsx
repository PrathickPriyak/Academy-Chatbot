import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            <div className="mt-8 grid gap-5">
              {courses.map((course) => (
                <Card key={course.id} id={course.slug} variant="elevated">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{levelLabel(course.level)}</Badge>
                      <Badge variant="secondary">{course.duration}</Badge>
                      <Badge variant="outline">
                        {formatPrice(course.price, course.currency)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-2xl">{course.title}</CardTitle>
                    <CardDescription>{course.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
                    <div className="text-muted-foreground space-y-2 text-sm">
                      <p>{course.description}</p>
                      <p>
                        {course.category.name} · {course.instructor.name}
                      </p>
                      <p>
                        <a className="text-primary underline" href={course.enrollmentUrl}>
                          Enrollment link
                        </a>
                      </p>
                      <ul className="list-disc space-y-1 pl-4">
                        {course.features.map((feature) => (
                          <li key={feature.id}>
                            {feature.title}: {feature.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {course.modules.map((module) => (
                        <div key={module.id} className="bg-muted rounded-xl p-3">
                          <p className="text-sm font-semibold">{module.title}</p>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {module.lessons.map((lesson) => lesson.title).join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
