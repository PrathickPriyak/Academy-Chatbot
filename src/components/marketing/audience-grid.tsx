import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { audiences } from "@/data/site";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function AudienceGrid() {
  return (
    <Section spacing="lg" className="bg-card/40">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Who it’s for</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Built for learners at every stage</h2>
        </Reveal>
        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <RevealItem key={audience.title}>
              <article className="border-border bg-card h-full rounded-2xl border p-6 shadow-soft">
                <h3 className="font-display text-xl tracking-tight">{audience.title}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{audience.text}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
