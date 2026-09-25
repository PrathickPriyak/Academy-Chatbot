export interface AiRuntimeConfig {
  provider: string;
  ollamaUrl: string;
  ollamaModel: string;
  embedModel: string;
}

export function getAiConfig(): AiRuntimeConfig {
  return {
    provider: process.env.AI_PROVIDER ?? "ollama",
    ollamaUrl: process.env.OLLAMA_URL ?? "http://127.0.0.1:11434",
    ollamaModel: process.env.OLLAMA_MODEL ?? "qwen2.5:1.5b",
    embedModel: "nomic-embed-text",
  };
}
