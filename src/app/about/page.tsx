import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { catalog } from "@/data/catalog";
import { founder, highlights, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name}, INFOZUB, and the academy’s approach to practical digital education.`,
};

export default function AboutPage() {
  return (
    <>
      <Section spacing="lg" className="border-border border-b bg-card/40">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">About</p>
            <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">{site.name}</h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">{site.description}</p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              {site.tagline}. Courses are designed to equip you with the skills and knowledge to succeed in the digital
              realm, with learning access delivered through the courses.infozub.com platform after purchase.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight">INFOZUB background</h2>
            <div className="mt-5 space-y-4">
              {founder.story.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="border-border bg-card rounded-[2rem] border p-8 shadow-soft">
              <h3 className="font-display text-2xl tracking-tight">{founder.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm font-semibold">{founder.title}</p>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{catalog.instructor.bio}</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {founder.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-muted-foreground text-xs font-semibold uppercase">{stat.label}</dt>
                    <dd className="font-display mt-1 text-2xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-card/40">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-3xl tracking-tight">Learning approach</h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              The academy emphasizes updated strategies, hands-on learning, community support, step-by-step training, and
              the ability to learn on any device—with a certificate on completion from INFOZUB.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <li key={item} className="border-border bg-card rounded-2xl border p-5 shadow-soft">
                <p className="font-display text-xl tracking-tight">{item}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight">Talk with the team</h2>
            <p className="text-muted-foreground mt-2 text-base">
              Questions about programs, enrollment, or corporate training? Reach out.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
