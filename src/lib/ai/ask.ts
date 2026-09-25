"use server";

import type { AssistantMessage } from "@/lib/ai/types";
import { answerFromKnowledge } from "@/lib/knowledge/answer";

export async function askAssistant(messages: AssistantMessage[]): Promise<string> {
  const question = [...messages].reverse().find((message) => message.role === "user");
  if (!question?.content.trim()) {
    return "NOT_FOUND";
  }
  return answerFromKnowledge(question.content);
}
