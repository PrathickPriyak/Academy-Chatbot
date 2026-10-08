import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HoverMedia } from "@/components/ui/hover-media";
import { academyMedia } from "@/data/media";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function WhyInfozub() {
  return (
    <Section spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Why Infozub</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Why learners choose Infozub</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Course highlights published on academy.infozub.com—practical training shaped by real digital marketing
            experience.
          </p>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {academyMedia.highlights.map((item) => (
            <RevealItem key={item.label}>
              <div className="border-border bg-card group h-full overflow-hidden rounded-2xl border shadow-soft transition-colors hover:border-primary/35">
                <HoverMedia
                  src={item.src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="aspect-[16/10] bg-muted"
                />
                <div className="p-5">
                  <h3 className="font-display text-xl tracking-tight">{item.label}</h3>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
