"use client";

import { FormEvent, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Section spacing="lg">
          <Container className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h1 className="font-display text-4xl tracking-tight">Contact Infozub</h1>
              <p className="text-muted-foreground mt-4">
                Write to admissions@infozub.academy. This form does not store messages
                yet.
              </p>
            </div>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Send a message</CardTitle>
                <CardDescription>
                  This form is a preview. Messages are not stored yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sent ? (
                  <p className="text-sm">
                    Thanks. In this preview your message stays on this device and is not
                    sent.
                  </p>
                ) : (
                  <form className="grid gap-3" onSubmit={onSubmit}>
                    <Input name="name" required placeholder="Name" aria-label="Name" />
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                      aria-label="Email"
                    />
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="How can we help?"
                      aria-label="Message"
                      className="border-border bg-card focus-visible:ring-ring rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2"
                    />
                    <Button type="submit">Send message</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
