import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailView } from "@/components/courses/course-detail-view";
import { getCourseBySlug, listCourses } from "@/data/catalog";
import { site } from "@/data/site";
import {
  courseFaqs,
  courseMeta,
  courseRequirements,
  courseReviews,
  learningOutcomesFromCourse,
} from "@/lib/courses/presenters";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listCourses().map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.shortDescription,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [{ url: course.thumbnail }],
      type: "website",
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const meta = courseMeta(course);
  const outcomes = learningOutcomesFromCourse(course);
  const requirements = courseRequirements(course);
  const faqs = courseFaqs(course);
  const reviews = courseReviews();

  return (
    <>
      <CourseDetailView
        course={course}
        category={meta.category}
        price={meta.price}
        level={meta.level}
        instructorName={meta.instructorName}
        instructorTitle={meta.instructorTitle}
        instructorBio={meta.instructorBio}
        outcomes={outcomes}
        requirements={requirements}
        faqs={faqs}
        reviews={reviews}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.shortDescription,
            provider: {
              "@type": "Organization",
              name: site.name,
              sameAs: site.url,
            },
            url: `${site.url}/courses/${course.slug}`,
            educationalLevel: meta.level,
            timeRequired: course.duration,
            offers:
              course.price > 0
                ? {
                    "@type": "Offer",
                    price: course.price,
                    priceCurrency: "INR",
                    url: course.enrollmentUrl,
                  }
                : undefined,
          }),
        }}
      />
    </>
  );
}
