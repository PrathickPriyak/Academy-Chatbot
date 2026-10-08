import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { highlights } from "@/data/site";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function WhyInfozub() {
  return (
    <Section spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Why Infozub</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Learning built for real digital work</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Highlights published on the Infozub Digital Academy site—practical skills, certificates, and flexible
            access across devices.
          </p>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <RevealItem key={item}>
              <div className="border-border bg-card h-full rounded-2xl border p-6 shadow-soft">
                <div className="bg-primary/10 text-primary mb-4 inline-flex size-10 items-center justify-center rounded-xl text-sm font-bold">
                  ✓
                </div>
                <h3 className="font-display text-xl tracking-tight">{item}</h3>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
