"use server";

import { createAiProvider } from "@/lib/ai";
import type { AssistantMessage } from "@/lib/ai/types";

export async function askAssistant(messages: AssistantMessage[]): Promise<string> {
  const provider = await createAiProvider();
  const response = await provider.complete({ messages });
  return response.content;
}
