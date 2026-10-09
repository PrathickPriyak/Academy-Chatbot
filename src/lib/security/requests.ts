import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export const chatRequestSchema = z.object({
  conversationId: z.string().trim().min(1).max(64).optional(),
  messages: z.array(messageSchema).min(1).max(16),
});

export async function readJson(request: Request, maxBytes = 32_000): Promise<unknown> {
  const text = await request.text();
  if (text.length > maxBytes) {
    throw new Error("Request body is too large.");
  }
  return JSON.parse(text) as unknown;
}
