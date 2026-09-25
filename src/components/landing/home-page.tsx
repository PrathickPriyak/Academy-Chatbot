"use client";

import { motion } from "framer-motion";
import { BookOpen, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { ChatPreview } from "@/components/landing/chat-preview";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export interface CourseHighlight {
  slug: string;
  title: string;
  duration: string;
  shortDescription: string;
}

const features = [
  {
    title: "Course knowledge only",
    description: "Answers stay inside published Infozub courses, policies, and enrollment pages.",
    icon: ShieldCheck,
  },
  {
    title: "Quick replies",
    description: "Prices, durations, and the course list come straight from the stored catalog.",
    icon: Sparkles,
  },
  {
    title: "Follow-up questions",
    description: "Ask about a course, then ask for its modules, price, or enrollment link.",
    icon: MessagesSquare,
  },
  {
    title: "Published syllabi",
    description: "Each course card opens a conversation about that course’s modules and page.",
    icon: BookOpen,
  },
];

const examples = [
  "What courses are available?",
  "Tell me about the Social Media Marketing course.",
  "Who should enroll?",
  "What is the refund policy?",
  "Where is the Infozub office?",
];

const audiences = ["Digital marketers", "Students and freshers", "Business owners", "Freelancers"];

export function HomePage({ courses }: { courses: CourseHighlight[] }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Section spacing="lg">
          <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge variant="accent">Infozub AI Assistant</Badge>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display mt-5 text-4xl tracking-tight text-balance sm:text-6xl"
              >
                Ask Anything About Infozub Courses
              </motion.h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-base sm:text-lg">
                Get instant answers about our courses, curriculum, enrollment and learning
                programs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/chat">Start Chatting</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/courses">View courses</Link>
                </Button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="from-primary/15 rounded-3xl bg-gradient-to-b to-transparent p-2"
            >
              <ChatPreview titles={courses.map((course) => course.title)} />
            </motion.div>
          </Container>
        </Section>

        <Section spacing="md" className="pt-0">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-3xl tracking-tight">Course highlights</h2>
              <div className="flex flex-wrap gap-2">
                {audiences.map((audience) => (
                  <Link
                    key={audience}
                    href={`/chat?q=${encodeURIComponent("Who should enroll?")}`}
                    className="bg-muted text-foreground rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {audience}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.slug} href={`/chat?q=${encodeURIComponent(`Tell me about the ${course.title}`)}`}>
                  <Card variant="interactive" className="h-full">
                    <CardHeader>
                      <Badge variant="secondary">{course.duration}</Badge>
                      <CardTitle className="mt-3">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{course.shortDescription}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        <Section spacing="md" className="border-border border-t">
          <Container>
            <h2 className="font-display text-3xl tracking-tight">
              Built for clear answers
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} variant="outline">
                  <CardHeader>
                    <feature.icon className="text-primary size-5" />
                    <CardTitle className="mt-3">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section spacing="md" className="border-border border-t">
          <Container size="md">
            <h2 className="font-display text-center text-3xl tracking-tight">
              Example questions
            </h2>
            <div className="mt-6 grid gap-3">
              {examples.map((question) => (
                <Link
                  key={question}
                  href={`/chat?q=${encodeURIComponent(question)}`}
                  className="border-border bg-card rounded-2xl border px-4 py-4 text-sm font-medium shadow-xs transition-shadow hover:shadow-md"
                >
                  {question}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
