"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Clock3, Layers3, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { CourseFaqList } from "@/components/courses/course-faq";
import { ModuleList } from "@/components/courses/module-list";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CatalogCourse } from "@/data/catalog";
import { refundSummary } from "@/data/site";
import type { CourseFaq } from "@/lib/courses/presenters";
import { duration, easeOutPremium } from "@/lib/motion";

type Review = { name: string; quote: string };

export function CourseDetailView({
  course,
  category,
  price,
  level,
  instructorName,
  instructorTitle,
  instructorBio,
  outcomes,
  requirements,
  faqs,
  reviews,
}: {
  course: CatalogCourse;
  category: string;
  price: string;
  level: string;
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;
  outcomes: string[];
  requirements: string[];
  faqs: CourseFaq[];
  reviews: readonly Review[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="border-border relative overflow-hidden border-b bg-card/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 85% 10%, rgb(13 115 119 / 0.16), transparent 55%), radial-gradient(ellipse 40% 40% at 0% 100%, rgb(201 162 39 / 0.08), transparent 50%)",
          }}
        />
        <Container className="relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/courses" className="hover:text-foreground underline-offset-4 hover:underline">
                  Courses
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/courses?category=${course.category}`}
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {category}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium">{course.title}</li>
            </ol>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, ease: easeOutPremium }}
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline">{level}</Badge>
              </div>
              <h1 className="font-display mt-4 text-3xl tracking-tight break-words sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
                {course.shortDescription}
              </p>

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <MetaItem icon={<UserRound className="size-4" />} label="Instructor" value={instructorName} />
                <MetaItem icon={<Clock3 className="size-4" />} label="Duration" value={course.duration} />
                <MetaItem icon={<Layers3 className="size-4" />} label="Modules" value={String(course.modules.length)} />
                <MetaItem icon={<CheckCircle2 className="size-4" />} label="Level" value={level} />
              </dl>

              <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                Course ratings and student counts are not published in the archived catalog, so they are not shown here.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full whitespace-normal sm:w-auto sm:whitespace-nowrap">
                  <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
                    <span className="sm:hidden">Enroll on Academy</span>
                    <span className="hidden sm:inline">Enroll / View on Academy</span>
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href={`/chat?q=${encodeURIComponent(`Tell me about ${course.title}`)}`}>Ask Assistant</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="border-border relative aspect-[4/3] overflow-hidden rounded-[2rem] border shadow-hero"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: duration.slow, ease: easeOutPremium, delay: 0.08 }}
            >
              <Image
                src={course.thumbnail}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <Section spacing="lg" className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] lg:pb-16">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-14">
            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">What you will learn</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Outcomes summarized from the published module descriptions for this course.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="border-border bg-card flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed shadow-soft"
                    >
                      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">Course curriculum</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {course.modules.length} published modules. Expand a module to read its description.
                </p>
                <div className="mt-6">
                  <ModuleList modules={course.modules} />
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">Course description</h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">{course.description}</p>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">Requirements</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Access and level details published for Infozub Digital Academy courses. Specific software prerequisites
                  are not listed in the archived catalog.
                </p>
                <ul className="mt-6 space-y-3">
                  {requirements.map((item) => (
                    <li key={item} className="border-border bg-card rounded-2xl border px-4 py-3 text-sm leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">Instructor</h2>
                <div className="border-border bg-card mt-5 overflow-hidden rounded-[1.75rem] border shadow-soft">
                  <div className="grid sm:grid-cols-[8rem_1fr]">
                    <div className="relative min-h-40 bg-muted sm:min-h-full">
                      <Image src={course.thumbnail} alt="" fill className="object-cover" sizes="160px" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl tracking-tight">{instructorName}</h3>
                      <p className="text-primary mt-1 text-sm font-semibold">{instructorTitle}</p>
                      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{instructorBio}</p>
                      <Button asChild variant="outline" className="mt-5">
                        <Link href="/about">About the academy</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">Reviews</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Testimonials published on academy.infozub.com. Course-specific star ratings are not available in the
                  catalog.
                </p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <li key={review.name} className="border-border bg-card rounded-2xl border p-5 shadow-soft">
                      <p className="text-sm leading-relaxed">“{review.quote}”</p>
                      <p className="text-muted-foreground mt-4 text-sm font-semibold">{review.name}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl tracking-tight">FAQ</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Answers grounded in this course’s published details and Infozub Academy platform information.
                </p>
                <div className="mt-6">
                  <CourseFaqList faqs={faqs} />
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section className="border-border from-primary to-primary/90 rounded-[2rem] bg-gradient-to-br px-6 py-10 text-primary-foreground shadow-hero sm:px-10">
                <h2 className="font-display text-3xl tracking-tight">Ready to enroll in {course.title}?</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/90">
                  Continue to the Infozub Academy course page for enrollment, or contact the team with questions.{" "}
                  {refundSummary.headline}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="lg" variant="secondary">
                    <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
                      Enroll now
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </section>
            </Reveal>
          </div>

          <aside className="hidden lg:block">
            <div className="border-border bg-card sticky top-24 rounded-[1.75rem] border p-5 shadow-lift">
              <p className="text-muted-foreground text-xs font-semibold uppercase">Investment</p>
              <p className="font-display mt-2 text-3xl tracking-tight">{price}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{course.duration}</p>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>{level} level</li>
                <li>{course.modules.length} published modules</li>
                <li>Instructor: {instructorName}</li>
              </ul>
              <Button asChild className="mt-5 w-full" size="lg">
                <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
                  Continue to enrollment
                </a>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link href="/contact">Contact Infozub</Link>
              </Button>
              <Link
                href={refundSummary.href}
                className="text-muted-foreground hover:text-foreground mt-4 block text-center text-xs underline-offset-4 hover:underline"
              >
                Refund policy
              </Link>
            </div>
          </aside>
        </Container>
      </Section>

      <div className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-40 border-t px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{course.title}</p>
            <p className="text-muted-foreground text-xs">{price}</p>
          </div>
          <Button asChild className="shrink-0">
            <a href={course.enrollmentUrl} target="_blank" rel="noreferrer">
              Enroll
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-border bg-card/80 rounded-2xl border px-4 py-3">
      <dt className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
