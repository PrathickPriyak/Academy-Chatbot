import { getAiConfig } from "@/lib/ai/config";
import type { AIProvider, AssistantRequest, AssistantResponse } from "@/lib/ai/types";

interface OllamaChatResponse {
  message?: { content?: string };
}

export class OllamaProvider implements AIProvider {
  readonly id = "ollama";
  readonly name = "Ollama";

  async complete(request: AssistantRequest): Promise<AssistantResponse> {
    const config = getAiConfig();
    const response = await fetch(`${config.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.ollamaModel,
        stream: false,
        messages: request.messages,
        options: { temperature: 0 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as OllamaChatResponse;
    const content = payload.message?.content?.trim();
    if (!content) {
      throw new Error("Ollama returned an empty answer.");
    }

    return { content, providerId: this.id };
  }
}
