import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogClient } from "@/components/courses/catalog-client";
import { JsonLd } from "@/components/seo/json-ld";
import { Skeleton } from "@/components/ui/skeleton";
import { listCategories, listCourses } from "@/data/catalog";
import { site } from "@/data/site";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

const categories = listCategories()
  .map((category) => category.name)
  .join(", ");
const description = `Browse ${listCourses().length} published ${site.name} courses across ${listCategories().length} categories: ${categories}. Search by skill, instructor, and topic.`;

export const metadata: Metadata = {
  title: "Courses",
  description,
  alternates: { canonical: "/courses" },
  openGraph: {
    title: `Courses · ${site.name}`,
    description,
    url: absoluteUrl("/courses"),
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `Courses · ${site.name}`,
    description,
    images: [defaultOgImage.url],
  },
};

export default function CoursesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} courses`,
    itemListElement: listCourses().map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/courses/${course.slug}`),
      name: course.title,
    })),
  };

  return (
    <>
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
      <JsonLd data={itemList} />
    </>
  );
}
