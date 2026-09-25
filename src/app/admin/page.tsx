import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutAction } from "@/lib/admin-actions";
import { isAdminSignedIn } from "@/lib/admin-session";
import { deleteCourse, setPublished } from "@/lib/courses/actions";
import { formatPrice, levelLabel } from "@/lib/courses/present";
import { listAllCourses } from "@/lib/courses/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminSignedIn())) {
    redirect("/admin/login");
  }

  const courses = await listAllCourses();
  const published = courses.filter((course) => course.published).length;

  return (
    <main className="min-h-screen">
      <header className="border-border border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <p className="font-display text-lg tracking-tight">Course admin</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/courses/new">Create course</Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Courses</CardDescription>
              <CardTitle className="text-3xl">{courses.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl">{published}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl">{courses.length - published}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="grid gap-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    {levelLabel(course.level)} · {course.duration} ·{" "}
                    {formatPrice(course.price, course.currency)} ·{" "}
                    {course.published ? "Published" : "Draft"}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/admin/courses/${course.id}`}>Edit</Link>
                  </Button>
                  <form action={setPublished}>
                    <input type="hidden" name="id" value={course.id} />
                    <input
                      type="hidden"
                      name="published"
                      value={course.published ? "false" : "true"}
                    />
                    <Button type="submit" variant="secondary">
                      {course.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
                  <form action={deleteCourse}>
                    <input type="hidden" name="id" value={course.id} />
                    <Button type="submit" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
