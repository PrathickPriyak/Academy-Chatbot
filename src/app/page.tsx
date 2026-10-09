import { HomePage } from "@/components/landing/home-page";
import { formatPrice } from "@/lib/courses/present";
import { listPublishedCourses } from "@/lib/courses/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const courses = await listPublishedCourses();
  return (
    <HomePage
      courses={courses.map((course) => ({
        slug: course.slug,
        title: course.title,
        duration: course.duration,
        shortDescription: course.shortDescription,
        category: course.category.name,
        instructor: course.instructor.name,
        enrollmentUrl: course.enrollmentUrl,
        priceLabel: course.price > 0 ? formatPrice(course.price, course.currency) : "See course page",
      }))}
    />
  );
}
