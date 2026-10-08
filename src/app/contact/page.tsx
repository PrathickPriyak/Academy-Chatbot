"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AssistantWidget } from "@/components/assistant/assistant-widget";
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

function AssistantNotice() {
  const fromAssistant = useSearchParams().get("from") === "assistant";
  if (!fromAssistant) {
    return null;
  }
  return (
    <p className="border-border bg-muted mb-4 rounded-xl border px-4 py-3 text-sm">
      That question is not in the published course information, so the assistant opened this contact page.
    </p>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:academy@infozub.com?subject=${encodeURIComponent("Infozub academy question")}&body=${encodeURIComponent(body)}`;
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
              <Suspense fallback={null}>
                <AssistantNotice />
              </Suspense>
              <p className="text-muted-foreground mt-4">
                Email academy@infozub.com or call +91 93 22 33 88 22. The contact page lists the Palladam and Tiruppur offices.
              </p>
            </div>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Send a message</CardTitle>
                <CardDescription>
                  This opens an email to academy@infozub.com.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sent ? (
                  <p className="text-sm">Your email app should open with this message addressed to academy@infozub.com.</p>
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
      <AssistantWidget />
    </div>
  );
}
