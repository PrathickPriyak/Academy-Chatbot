import { HomePage } from "@/components/landing/home-page";
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
      }))}
    />
  );
}
