import { listPublishedCourses } from "@/lib/courses/queries";

import { createMockProvider } from "./mock-provider";
import type { AiProvider } from "./types";

/**
 * Returns the active assistant provider.
 * Later phases can switch this to Ollama, Qwen, Llama, or another provider.
 * This phase still uses the mock provider, fed by published course records.
 */
export async function createAiProvider(): Promise<AiProvider> {
  const courses = await listPublishedCourses();
  return createMockProvider(courses);
}

export type {
  AiProvider,
  AssistantMessage,
  AssistantRequest,
  AssistantResponse,
} from "./types";
