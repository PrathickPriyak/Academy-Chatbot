import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/marketing/contact-form";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} by phone, email, or message. Offices in Palladam and Tiruppur.`,
};

export default function ContactPage() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Contact</p>
            <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">Talk with Infozub</h1>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Reach the academy team for course questions, enrollment help, or partnership inquiries.
            </p>

            <ul className="mt-8 space-y-4">
              <li>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Email</p>
                <a href={`mailto:${site.email}`} className="text-foreground font-semibold hover:underline">
                  {site.email}
                </a>
              </li>
              <li>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Phone</p>
                <a href={site.phoneHref} className="text-foreground font-semibold hover:underline">
                  {site.phone}
                </a>
              </li>
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
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

            <div className="mt-8">
              <p className="text-muted-foreground text-xs font-semibold uppercase">Social</p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {site.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground text-sm font-semibold underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
