"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { audienceImage } from "@/data/media";
import { audiences } from "@/data/site";
import { hoverLift, transitionFast } from "@/lib/motion";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function AudienceGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <Section spacing="lg" className="bg-card/40">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Who it’s for</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Built for learners at every stage</h2>
        </Reveal>
        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => {
            const image = audienceImage(audience.title);
            return (
              <RevealItem key={audience.title}>
                <motion.article
                  className="border-border bg-card group h-full overflow-hidden rounded-2xl border shadow-soft"
                  whileHover={hoverLift(reduceMotion, 3)}
                  transition={transitionFast}
                >
                  {image ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f2a]/45 via-transparent to-transparent" />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="font-display text-xl tracking-tight">{audience.title}</h3>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{audience.text}</p>
                  </div>
                </motion.article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </Container>
    </Section>
  );
}
