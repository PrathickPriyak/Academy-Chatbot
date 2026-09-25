import { db } from "@/lib/db";

export async function recordConversationTurn(input: {
  conversationId?: string;
  title: string;
  userContent: string;
  assistantContent: string;
  fallback: boolean;
}): Promise<string> {
  const existing = input.conversationId
    ? await db.conversation.findUnique({ where: { id: input.conversationId } })
    : null;
  const conversation =
    existing ??
    (await db.conversation.create({
      data: { title: input.title.slice(0, 80) || "Conversation" },
    }));

  await db.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: input.userContent,
      fallback: false,
    },
  });
  await db.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: input.assistantContent,
      fallback: input.fallback,
    },
  });

  return conversation.id;
}
