import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} at ${site.email} or ${site.phone}. Offices in Palladam and Tiruppur.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${site.name}`,
    description: `Contact ${site.name} at ${site.email} or ${site.phone}. Offices in Palladam and Tiruppur.`,
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact · ${site.name}`,
    description: `Contact ${site.name} at ${site.email} or ${site.phone}. Offices in Palladam and Tiruppur.`,
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-border relative overflow-hidden border-b bg-card/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 0%, rgb(13 115 119 / 0.16), transparent 55%), radial-gradient(ellipse 40% 35% at 100% 80%, rgb(201 162 39 / 0.1), transparent 50%)",
          }}
        />
        <Container className="relative py-14 sm:py-16">
          <Reveal>
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Contact</p>
            <h1 className="font-display mt-3 max-w-2xl text-4xl tracking-tight sm:text-5xl">Talk with Infozub</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
              Reach the academy team for course questions, enrollment help, or partnership inquiries using the published
              Infozub contact details below.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <div className="space-y-6">
                <div className="border-border bg-card rounded-2xl border p-5 shadow-soft">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Email</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-foreground mt-2 block text-lg font-semibold underline-offset-4 hover:underline"
                  >
                    {site.email}
                  </a>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Login and course-access issues on the LMS may also use logesh@infozub.com, as published in the
                    platform FAQ.
                  </p>
                </div>

                <div className="border-border bg-card rounded-2xl border p-5 shadow-soft">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Phone</p>
                  <a
                    href={site.phoneHref}
                    className="text-foreground mt-2 block text-lg font-semibold underline-offset-4 hover:underline"
                  >
                    {site.phone}
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[site.offices.registered, site.offices.corporate].map((office) => (
                    <div key={office.label} className="border-border bg-card rounded-2xl border p-5 shadow-soft">
                      <h2 className="text-sm font-semibold tracking-wide uppercase">{office.label}</h2>
                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                        {office.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-border bg-card rounded-2xl border p-5 shadow-soft">
                  <h2 className="text-sm font-semibold tracking-wide uppercase">Business & social</h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    INFOZUB Private Limited ·{" "}
                    <a
                      href={site.companySite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground font-semibold underline-offset-4 hover:underline"
                    >
                      infozub.com
                    </a>
                    {" · "}
                    <a
                      href={site.lms}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground font-semibold underline-offset-4 hover:underline"
                    >
                      Learning platform
                    </a>
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {site.social.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="border-border hover:border-primary/40 inline-flex min-h-11 items-center rounded-xl border px-3.5 text-sm font-semibold transition-colors"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/courses">Browse courses</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/about">About the academy</Link>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
