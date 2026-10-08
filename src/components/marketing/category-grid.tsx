"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { listCategories, listCourses } from "@/data/catalog";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

export function CategoryGrid() {
  const categories = listCategories().map((category) => ({
    ...category,
    count: listCourses().filter((course) => course.category === category.slug).length,
  }));

  return (
    <Section id="categories" spacing="lg">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">Categories</p>
          <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">Browse by skill area</h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Explore published Infozub Digital Academy categories and jump into the courses that match your goals.
          </p>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <RevealItem key={category.slug}>
              <Link
                href={`/courses?category=${category.slug}`}
                className="border-border bg-card hover:border-primary/40 hover:shadow-lift group flex h-full flex-col rounded-2xl border p-6 shadow-soft transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl tracking-tight">{category.name}</h3>
                  <ArrowUpRight className="text-primary size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">{category.description}</p>
                <p className="text-foreground mt-5 text-sm font-semibold">
                  {category.count} course{category.count === 1 ? "" : "s"}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
