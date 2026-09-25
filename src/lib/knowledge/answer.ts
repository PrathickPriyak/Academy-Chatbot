import { createAIProvider } from "@/lib/ai/providers";
import type { AssistantMessage } from "@/lib/ai/types";
import { db } from "@/lib/db";

import { standaloneQuestion } from "./context";
import { searchKnowledge, type RetrievedChunk } from "./search";

export interface AnswerSource {
  title: string;
  url: string;
}

export interface KnowledgeAnswer {
  content: string;
  sources: AnswerSource[];
}

const blockedClaims = ["certificate", "placement", "job guarantee", "salary", "stipend"];

function isGrounded(answer: string, chunks: RetrievedChunk[]): boolean {
  const normalized = answer.trim();
  if (normalized === "NOT_FOUND") {
    return true;
  }

  const context = chunks
    .map((chunk) => chunk.content)
    .join("\n")
    .toLowerCase();
  const lower = normalized.toLowerCase();
  for (const claim of blockedClaims) {
    if (lower.includes(claim) && !context.includes(claim)) {
      return false;
    }
  }

  const contextDigits = context.replace(/,/g, "");
  const numbers = normalized.match(/\d[\d,]*/g) ?? [];
  return numbers.every((value) => {
    const digits = value.replace(/,/g, "");
    return digits.length < 2 || contextDigits.includes(digits);
  });
}

export async function answerFromKnowledge(question: string): Promise<string> {
  const result = await answerConversation([{ role: "user", content: question }]);
  return result.content;
}

export async function answerConversation(
  messages: AssistantMessage[],
): Promise<KnowledgeAnswer> {
  const question = await standaloneQuestion(messages);
  if (!question) {
    return { content: "NOT_FOUND", sources: [] };
  }

  const chunks = await searchKnowledge(question);
  if (chunks.length === 0) {
    return { content: "NOT_FOUND", sources: [] };
  }

  const knowledge = chunks
    .map((chunk, index) => `[${index + 1}] ${chunk.content}`)
    .join("\n");
  const provider = createAIProvider();
  const response = await provider.complete({
    messages: [
      {
        role: "system",
        content:
          "You answer questions about Infozub Digital Academy using only the knowledge provided. Copy course titles, prices, durations, topics, features, instructor names, and enrollment URLs exactly from that knowledge. If the knowledge does not contain the answer, reply with exactly NOT_FOUND. Do not invent certificates, placement claims, prices, durations, curriculum, instructors, or features.",
      },
      {
        role: "user",
        content: `Knowledge:\n${knowledge}\n\nQuestion: ${question}`,
      },
    ],
  });

  const answer = response.content.trim();
  if (!isGrounded(answer, chunks)) {
    return { content: "NOT_FOUND", sources: [] };
  }

  const content = includeMissingCatalogTitles(question, answer, chunks);
  return { content, sources: await sourcesFor(content, chunks) };
}

async function sourcesFor(
  answer: string,
  chunks: RetrievedChunk[],
): Promise<AnswerSource[]> {
  if (answer.trim() === "NOT_FOUND") {
    return [];
  }

  const courseIds = [...new Set(chunks.map((chunk) => chunk.courseId))];
  const courses = await db.course.findMany({
    where: { id: { in: courseIds } },
    select: { id: true, title: true, enrollmentUrl: true },
  });
  const lower = answer.toLowerCase();
  const digits = answer.replace(/,/g, "");

  return courses
    .filter((course) => course.enrollmentUrl.startsWith("http"))
    .filter((course) => {
      const title = course.title.toLowerCase();
      if (
        lower.includes(title) ||
        (title.includes("full stack") && lower.includes("full stack")) ||
        (title.includes("data analytics") && lower.includes("data analytics")) ||
        (title.includes("digital marketing") && lower.includes("digital marketing")) ||
        (title.includes("ui/ux") && lower.includes("ui/ux"))
      ) {
        return true;
      }

      return chunks
        .filter((chunk) => chunk.courseId === course.id)
        .some((chunk) => {
          const duration = chunk.content.match(/Duration of .+: (.+)\./)?.[1];
          const price = chunk.content.match(/Price of .+: (\d+)/)?.[1];
          return (
            (duration !== undefined && lower.includes(duration.toLowerCase())) ||
            (price !== undefined && digits.includes(price))
          );
        });
    })
    .map((course) => ({ title: course.title, url: course.enrollmentUrl }));
}

function includeMissingCatalogTitles(
  question: string,
  answer: string,
  chunks: RetrievedChunk[],
): string {
  const asksForCatalog =
    /courses/.test(question.toLowerCase()) &&
    /offer|available/.test(question.toLowerCase());
  const catalog = chunks.find((chunk) => chunk.sourceType === "catalog");
  if (!asksForCatalog || !catalog) {
    return answer;
  }

  const titles = catalog.content
    .replace(/^Infozub courses offered:\s*/i, "")
    .replace(/\.$/, "")
    .split(";")
    .map((title) => title.trim())
    .filter((title) => title.length > 0);
  const missing = titles.filter(
    (title) => !answer.toLowerCase().includes(title.toLowerCase()),
  );
  if (missing.length === 0) {
    return answer;
  }
  return `${answer}\nAlso offered: ${missing.join("; ")}.`;
}
