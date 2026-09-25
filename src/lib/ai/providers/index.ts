import { getAiConfig } from "@/lib/ai/config";
import type { AIProvider } from "@/lib/ai/types";

import { OllamaProvider } from "./ollama";

export function createAIProvider(): AIProvider {
  const { provider } = getAiConfig();
  if (provider === "ollama") {
    return new OllamaProvider();
  }
  throw new Error(`AI provider "${provider}" is not implemented.`);
}
