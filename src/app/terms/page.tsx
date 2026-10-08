import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms information for ${site.name}. Contact ${site.email} for questions.`,
};

export default function TermsPage() {
  return (
    <Section spacing="lg">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          Course purchases, learning access, and related services are governed by the published terms on Infozub Academy
          domains. This page provides contact paths and pointers rather than inventing policy language.
        </p>
        <div className="mt-8 space-y-4 text-base leading-relaxed">
          <p>
            For terms questions, email{" "}
            <a className="text-primary font-semibold underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            or call{" "}
            <a className="text-primary font-semibold underline-offset-4 hover:underline" href={site.phoneHref}>
              {site.phone}
            </a>
            .
          </p>
          <p>
            Learning access after purchase is delivered through{" "}
            <a href={site.lms} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              {site.lms}
            </a>
            .
          </p>
        </div>
        <p className="text-muted-foreground mt-8 text-sm">
          Source reference:{" "}
          <a
            href="https://academy.infozub.com/terms/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            academy.infozub.com/terms
          </a>
          .
        </p>
        <Link href="/contact" className="text-primary mt-6 inline-block text-sm font-semibold underline-offset-4 hover:underline">
          Contact Us
        </Link>
      </Container>
    </Section>
  );
}
