export interface AssistantMessage {
  role: "system" | "user" | "assistant";
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
 * Provider contract. Ollama is implemented. Other providers can use the same interface.
 */
export interface AIProvider {
  id: string;
  name: string;
  complete(request: AssistantRequest): Promise<AssistantResponse>;
}

export type AiProvider = AIProvider;
