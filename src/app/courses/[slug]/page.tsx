import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ModuleList } from "@/components/courses/module-list";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  catalog,
  categoryNameForCourse,
  formatCoursePrice,
  getCourseBySlug,
  levelLabel,
  listCourses,
} from "@/data/catalog";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listCourses().map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [{ url: course.thumbnail }],
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const category = categoryNameForCourse(course);
  const price = formatCoursePrice(course);

  return (
    <>
      <Section spacing="md" className="border-border border-b bg-card/40">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline">{levelLabel(course.level)}</Badge>
              </div>
              <h1 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">{course.title}</h1>
              <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
                {course.shortDescription}
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold uppercase">Instructor</dt>
                  <dd className="mt-1 text-sm font-semibold">{catalog.instructor.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold uppercase">Duration</dt>
                  <dd className="mt-1 text-sm font-semibold">{course.duration}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold uppercase">Price</dt>
                  <dd className="mt-1 text-sm font-semibold">{price}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold uppercase">Modules</dt>
                  <dd className="mt-1 text-sm font-semibold">{course.modules.length}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
                    Enroll / View on Academy
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/chat?q=${encodeURIComponent(`Tell me about ${course.title}`)}`}>Ask Assistant</Link>
                </Button>
              </div>
            </div>
            <div className="border-border relative aspect-[4/3] overflow-hidden rounded-[2rem] border shadow-lift">
              <Image
                src={course.thumbnail}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="pb-24 lg:pb-16">
        <Container className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-12">
            <section>
              <h2 className="font-display text-3xl tracking-tight">About this course</h2>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">{course.description}</p>
            </section>

            <section>
              <h2 className="font-display text-3xl tracking-tight">Curriculum</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Modules published for this course. Expand each module for the description provided by Infozub Digital
                Academy.
              </p>
              <div className="mt-6">
                <ModuleList modules={course.modules} />
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl tracking-tight">Instructor</h2>
              <div className="border-border bg-card mt-4 rounded-2xl border p-6 shadow-soft">
                <h3 className="font-display text-2xl tracking-tight">{catalog.instructor.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm font-semibold">{catalog.instructor.title}</p>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{catalog.instructor.bio}</p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-border bg-card hidden rounded-2xl border p-5 shadow-lift lg:block">
              <p className="text-muted-foreground text-xs font-semibold uppercase">Investment</p>
              <p className="font-display mt-2 text-3xl tracking-tight">{price}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{course.duration}</p>
              <Button asChild className="mt-5 w-full" size="lg">
                <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
                  Continue to enrollment
                </a>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link href="/contact">Contact Infozub</Link>
              </Button>
            </div>
          </aside>
        </Container>
      </Section>

      <div className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-40 border-t p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{course.title}</p>
            <p className="text-muted-foreground text-xs">{price}</p>
          </div>
          <Button asChild>
            <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
              Enroll
            </a>
          </Button>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.shortDescription,
            provider: {
              "@type": "Organization",
              name: site.name,
              sameAs: site.url,
            },
            url: `${site.url}/courses/${course.slug}`,
          }),
        }}
      />
    </>
  );
}
