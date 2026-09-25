export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantRequest {
  messages: AssistantMessage[];
}

export interface AssistantResponse {
  content: string;
  providerId: string;
}

/**
 * Provider contract for later Ollama, Qwen, Llama, and hosted models.
 * Phase 1 uses only the mock provider.
 */
export interface AiProvider {
  id: string;
  name: string;
  complete(request: AssistantRequest): Promise<AssistantResponse>;
}
