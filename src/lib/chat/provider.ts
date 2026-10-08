import type { KnowledgeChunk } from "./knowledge";

/**
 * Optional LLM rewrite over retrieved academy chunks.
 * Never called without grounded context. Secrets stay server-side via env.
 */
export async function maybeRewriteWithProvider(options: {
  question: string;
  groundedAnswer: string;
  chunks: KnowledgeChunk[];
}): Promise<string | null> {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const apiKey = process.env.AI_API_KEY?.trim();
  const baseUrl = (process.env.AI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";

  if (!provider || provider === "none" || provider === "off") {
    return null;
  }

  if (!apiKey && provider !== "ollama") {
    return null;
  }

  const context = options.chunks
    .slice(0, 5)
    .map((chunk) => `### ${chunk.title}\n${chunk.text}`)
    .join("\n\n");

  const system = [
    "You are the Infozub Digital Academy Assistant.",
    "Answer ONLY using the provided context about Infozub Digital Academy.",
    "If the context is insufficient, say you do not have enough information and suggest contacting the team.",
    "Never invent prices, ratings, student counts, or course facts.",
    "Keep answers concise and helpful.",
  ].join(" ");

  const user = `Question: ${options.question}\n\nContext:\n${context}\n\nDraft answer to refine (do not add new facts):\n${options.groundedAnswer}`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI provider error", response.status, await response.text());
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (error) {
    console.error("AI provider request failed", error);
    return null;
  }
}
