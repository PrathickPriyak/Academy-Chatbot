import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { catalog } from "@/data/catalog";
import { founder } from "@/data/site";

import { Reveal } from "./reveal";

export function FounderBlock() {
  return (
    <Section spacing="lg" className="bg-card/40">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="border-border from-primary/15 via-card to-accent/10 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-8 shadow-lift">
              <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Instructor</p>
              <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">{founder.name}</h2>
              <p className="text-muted-foreground mt-2 text-sm font-semibold">{founder.title}</p>
              <p className="text-muted-foreground mt-6 text-sm leading-relaxed">{catalog.instructor.bio}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="space-y-4">
              <h3 className="font-display text-2xl tracking-tight sm:text-3xl">Experience that shapes the curriculum</h3>
              {founder.story.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {founder.stats.map((stat) => (
                  <div key={stat.label} className="border-border bg-card rounded-2xl border p-4">
                    <dt className="text-muted-foreground text-xs font-semibold uppercase">{stat.label}</dt>
                    <dd className="font-display mt-1 text-2xl tracking-tight">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
