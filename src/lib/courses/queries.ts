import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

import { courseInclude } from "./present";

export type CourseRecord = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;

export async function listPublishedCourses(): Promise<CourseRecord[]> {
  return db.course.findMany({
    where: { published: true },
    include: courseInclude,
    orderBy: { title: "asc" },
  });
}

export async function listAllCourses(): Promise<CourseRecord[]> {
  return db.course.findMany({
    include: courseInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCourseBySlug(slug: string): Promise<CourseRecord | null> {
  return db.course.findUnique({
    where: { slug },
    include: courseInclude,
  });
}

export async function getCourseById(id: string): Promise<CourseRecord | null> {
  return db.course.findUnique({
    where: { id },
    include: courseInclude,
  });
}

export async function listCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export async function listInstructors() {
  return db.instructor.findMany({ orderBy: { name: "asc" } });
}
