import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { catalog, listCourses } from "@/data/catalog";
import { academyMedia } from "@/data/media";
import { founder } from "@/data/site";

import { Reveal } from "./reveal";

export function InstructorSpotlight() {
  const courseCount = listCourses().length;
  const portrait = academyMedia.instructorPortrait;

  return (
    <Section spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Instructor</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Learn from INFOZUB’s founder</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Published academy instructor information for the person behind the curriculum.
          </p>
        </Reveal>

        <Reveal className="border-border bg-card mx-auto mt-10 max-w-4xl overflow-hidden rounded-[2rem] border shadow-lift">
          <div className="grid md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-72 md:min-h-full">
              <Image
                src={portrait}
                alt={`${founder.name}, ${founder.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
              <div>
                <h3 className="font-display text-3xl tracking-tight">{founder.name}</h3>
                <p className="text-primary mt-1 text-sm font-semibold">{founder.title}</p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{catalog.instructor.bio}</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {founder.stats.slice(0, 4).map((stat) => (
                  <div key={stat.label} className="bg-muted/60 rounded-2xl p-4">
                    <dt className="text-muted-foreground text-xs font-semibold uppercase">{stat.label}</dt>
                    <dd className="font-display mt-1 text-2xl tracking-tight">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-muted-foreground text-sm">
                Guides {courseCount} published Infozub Digital Academy courses across design, marketing, web, video,
                business, and career tracks.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/about">About the academy</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/courses">View courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
