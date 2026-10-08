import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { listPlatformKnowledge } from "@/data/catalog";
import { refundSummary, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: refundSummary.body,
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  const academyRefund = listPlatformKnowledge().find((item) => item.title === "Academy refund policy");
  const lmsRefund = listPlatformKnowledge().find((item) => item.title === "Refund policy");

  return (
    <Section spacing="lg">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Refund Policy</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{refundSummary.headline}</p>
        <div className="prose-muted mt-8 space-y-5 text-base leading-relaxed">
          <p>{refundSummary.body}</p>
          {academyRefund ? <p>{academyRefund.content}</p> : null}
          {lmsRefund && lmsRefund.content !== academyRefund?.content ? (
            <p>
              <span className="font-semibold">Learning platform note: </span>
              {lmsRefund.content}
            </p>
          ) : null}
          <p>
            For refund requests, email{" "}
            <a className="text-primary font-semibold underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>{" "}
            with your order number and purchase email.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
