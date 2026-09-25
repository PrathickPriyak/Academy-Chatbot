import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

import { embedText, toVectorLiteral } from "./embed";

export interface RetrievedChunk {
  id: string;
  courseId: string;
  sourceType: string;
  title: string;
  content: string;
  score: number;
}

const minimumScore = 0.35;

export async function searchKnowledge(
  question: string,
  limit = 8,
  minimumScore = 0.35,
): Promise<RetrievedChunk[]> {
  const vector = toVectorLiteral(await embedText(question));
  const rows = await db.$queryRaw<RetrievedChunk[]>(Prisma.sql`
    SELECT
      id,
      "courseId",
      "sourceType",
      title,
      content,
      1 - (embedding <=> ${vector}::vector) AS score
    FROM "KnowledgeChunk"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `);

  return rows
    .map((row) => ({ ...row, score: Number(row.score) }))
    .filter((row) => row.score >= minimumScore);
}
