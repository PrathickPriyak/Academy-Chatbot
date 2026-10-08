import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogClient } from "@/components/courses/catalog-client";
import { Skeleton } from "@/components/ui/skeleton";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Courses",
  description: `Browse published courses from ${site.name}. Search by skill, category, and topic.`,
};

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="mt-6 h-11 w-full" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
