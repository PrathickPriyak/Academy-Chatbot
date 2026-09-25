import type { AssistantMessage } from "@/lib/ai/types";
import { answerConversation } from "@/lib/knowledge/answer";
import { recordConversationTurn } from "@/lib/knowledge/conversations";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/security/rate-limit";
import { chatRequestSchema, readJson } from "@/lib/security/requests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const limit = rateLimit(clientKey(request, "chat"), 20, 60_000);
  if (!limit.ok) {
    return tooManyRequests(limit.retryAfter);
  }

  let payload: unknown;
  try {
    payload = await readJson(request);
  } catch {
    return Response.json({ error: "Invalid chat request." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.messages.some((message) => message.role === "user")) {
    return Response.json({ error: "A user question is required." }, { status: 400 });
  }

  const messages: AssistantMessage[] = parsed.data.messages;
  let result: Awaited<ReturnType<typeof answerConversation>>;
  try {
    result = await answerConversation(messages);
  } catch (error) {
    console.error("Chat failed:", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "The assistant is unavailable." }, { status: 503 });
  }

  const latestUser = [...messages].reverse().find((message) => message.role === "user");
  const conversationId = latestUser
    ? await recordConversationTurn({
        conversationId: parsed.data.conversationId,
        title: latestUser.content,
        userContent: latestUser.content,
        assistantContent: result.content,
        fallback: result.fallback,
        courseTitles: result.fallback ? [] : result.sources.map((source) => source.title),
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
      "X-Accel-Buffering": "no",
    },
  });
}
