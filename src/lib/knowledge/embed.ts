import { getAiConfig } from "@/lib/ai/config";

const embeddingSize = 768;
const cache = new Map<string, number[]>();

interface OllamaEmbedResponse {
  embeddings?: number[][];
}

export async function embedText(text: string): Promise<number[]> {
  const cached = cache.get(text);
  if (cached) {
    return cached;
  }
  const config = getAiConfig();
  const response = await fetch(`${config.ollamaUrl}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      model: config.embedModel,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embeddings failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as OllamaEmbedResponse;
  const vector = payload.embeddings?.[0];
  if (!vector || vector.length !== embeddingSize) {
    throw new Error("Ollama returned an unexpected embedding size.");
  }
  if (cache.size > 80) {
    const oldest = cache.keys().next().value;
    if (oldest) {
      cache.delete(oldest);
    }
  }
  cache.set(text, vector);
  return vector;
}

export function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}
