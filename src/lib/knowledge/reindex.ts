import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import { listPublishedCourses } from "@/lib/courses/queries";
import { db } from "@/lib/db";

import { chunkCatalog, chunkCourse, chunkCustom } from "./chunk";
import { embedText, toVectorLiteral } from "./embed";
import { hashDocument } from "./hash";

export interface ReindexProgress {
  processed: number;
  total: number;
  skipped: number;
  embedded: number;
  deleted: number;
  current?: string;
  error?: string;
}

export interface ReindexResult {
  processed: number;
  total: number;
  skipped: number;
  embedded: number;
  deleted: number;
  errors: string[];
}

export async function reindexKnowledge(
  onProgress?: (progress: ReindexProgress) => void | Promise<void>,
): Promise<ReindexResult> {
  const courses = await listPublishedCourses();
  const custom = await db.customKnowledge.findMany({ orderBy: { createdAt: "asc" } });
  const documents = [
    ...chunkCatalog(courses),
    ...courses.flatMap((course) => chunkCourse(course)),
    ...custom.map((entry) => chunkCustom(entry)),
  ];
  const desired = documents.map((document) => ({
    document,
    contentHash: hashDocument(document),
  }));
  const hashes = desired.map((item) => item.contentHash);

  const run = await db.knowledgeIndexRun.create({
    data: { status: "running", total: desired.length },
  });

  const existing = await db.knowledgeChunk.findMany({
    select: { contentHash: true },
  });
  const existingHashes = new Set(existing.map((row) => row.contentHash));
  const removed = await db.knowledgeChunk.deleteMany({
    where: hashes.length > 0 ? { contentHash: { notIn: hashes } } : {},
  });

  let skipped = 0;
  let embedded = 0;
  const errors: string[] = [];

  for (const [index, item] of desired.entries()) {
    if (existingHashes.has(item.contentHash)) {
      skipped += 1;
      await onProgress?.({
        processed: index + 1,
        total: desired.length,
        skipped,
        embedded,
        deleted: removed.count,
        current: item.document.title,
      });
      continue;
    }

    try {
      const embedding = toVectorLiteral(await embedText(item.document.content));
      await db.$executeRaw(Prisma.sql`
        INSERT INTO "KnowledgeChunk" (
          id,
          "courseId",
          "customKnowledgeId",
          "sourceType",
          title,
          content,
          "contentHash",
          embedding,
          "createdAt",
          "updatedAt"
        ) VALUES (
          ${randomUUID()},
          ${item.document.courseId},
          ${item.document.customKnowledgeId},
          ${item.document.sourceType},
          ${item.document.title},
          ${item.document.content},
          ${item.contentHash},
          ${embedding}::vector,
          NOW(),
          NOW()
        )
      `);
      embedded += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Embedding failed.";
      errors.push(`${item.document.title}: ${message}`);
      await onProgress?.({
        processed: index + 1,
        total: desired.length,
        skipped,
        embedded,
        deleted: removed.count,
        current: item.document.title,
        error: message,
      });
      continue;
    }

    await onProgress?.({
      processed: index + 1,
      total: desired.length,
      skipped,
      embedded,
      deleted: removed.count,
      current: item.document.title,
    });
  }

  const result: ReindexResult = {
    processed: desired.length,
    total: desired.length,
    skipped,
    embedded,
    deleted: removed.count,
    errors,
  };

  await db.knowledgeIndexRun.update({
    where: { id: run.id },
    data: {
      status: errors.length > 0 ? "error" : "success",
      processed: result.processed,
      skipped,
      embedded,
      deleted: removed.count,
      error: errors.length > 0 ? errors.join("\n") : null,
      finishedAt: new Date(),
    },
  });

  return result;
}
