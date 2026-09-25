import type { AssistantMessage } from "@/lib/ai/types";
import { answerConversation } from "@/lib/knowledge/answer";
import { recordConversationTurn } from "@/lib/knowledge/conversations";

export const runtime = "nodejs";

interface ChatRequest {
  messages?: AssistantMessage[];
  conversationId?: string;
}

function isMessage(value: unknown): value is AssistantMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const message = value as { role?: unknown; content?: unknown };
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as ChatRequest;
  const messages = (body.messages ?? []).filter(isMessage);
  const result = await answerConversation(messages);
  const latestUser = [...messages].reverse().find((message) => message.role === "user");
  const conversationId = latestUser
    ? await recordConversationTurn({
        conversationId: typeof body.conversationId === "string" ? body.conversationId : undefined,
        title: latestUser.content,
        userContent: latestUser.content,
        assistantContent: result.content,
        fallback: result.fallback,
      })
    : null;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      if (conversationId) {
        send({ type: "conversation", id: conversationId });
      }
      send({ type: "sources", sources: result.sources, fallback: result.fallback });
      const text = result.content;
      const size = 24;
      for (let index = 0; index < text.length; index += size) {
        send({ type: "token", text: text.slice(index, index + size) });
      }
      send({ type: "done" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
