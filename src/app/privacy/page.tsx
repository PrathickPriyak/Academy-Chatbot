import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy information for ${site.name}. Contact ${site.email} for privacy questions.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Section spacing="lg">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          This page summarizes how to reach Infozub Digital Academy about privacy matters. The full published privacy
          policy on academy.infozub.com is effective 17 June 2024. For the authoritative text, visit the live academy
          privacy page or contact the team.
        </p>
        <div className="mt-8 space-y-4 text-base leading-relaxed">
          <p>
            Contact for privacy and support:{" "}
            <a className="text-primary font-semibold underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <p>
            Phone:{" "}
            <a className="text-primary font-semibold underline-offset-4 hover:underline" href={site.phoneHref}>
              {site.phone}
            </a>
            .
          </p>
          <p>
            Offices: {site.offices.registered.lines.join(", ")}; {site.offices.corporate.lines.join(", ")}.
          </p>
        </div>
        <p className="text-muted-foreground mt-8 text-sm">
          Source reference:{" "}
          <a
            href="https://academy.infozub.com/privacy/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            academy.infozub.com/privacy
          </a>
          .
        </p>
        <Link href="/contact" className="text-primary mt-6 inline-block text-sm font-semibold underline-offset-4 hover:underline">
          Contact the Infozub team
        </Link>
      </Container>
    </Section>
  );
}
