import { createAIProvider } from "@/lib/ai/providers";

import { searchKnowledge, type RetrievedChunk } from "./search";

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
  const chunks = await searchKnowledge(question);
  if (chunks.length === 0) {
    return "NOT_FOUND";
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
    return "NOT_FOUND";
  }
  return includeMissingCatalogTitles(question, answer, chunks);
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
