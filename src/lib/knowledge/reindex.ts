import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { listPublishedCourses } from "@/lib/courses/queries";

import { chunkCatalog, chunkCourse } from "./chunk";
import { embedText, toVectorLiteral } from "./embed";

export async function reindexKnowledge(): Promise<number> {
  const courses = await listPublishedCourses();
  const documents = [
    ...chunkCatalog(courses),
    ...courses.flatMap((course) => chunkCourse(course)),
  ];

  await db.knowledgeChunk.deleteMany();

  for (const document of documents) {
    const embedding = toVectorLiteral(await embedText(document.content));
    await db.$executeRaw(Prisma.sql`
      INSERT INTO "KnowledgeChunk" (
        id, "courseId", "sourceType", title, content, embedding, "createdAt"
      ) VALUES (
        ${randomUUID()},
        ${document.courseId},
        ${document.sourceType},
        ${document.title},
        ${document.content},
        ${embedding}::vector,
        NOW()
      )
    `);
  }

  return documents.length;
}
