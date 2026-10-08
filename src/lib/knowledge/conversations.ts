import { recordAnalyticsEvent } from "@/lib/analytics/events";
import { redactPersonalDetails } from "@/lib/analytics/privacy";
import { db } from "@/lib/db";

export async function recordConversationTurn(input: {
  conversationId?: string;
  title: string;
  userContent: string;
  assistantContent: string;
  fallback: boolean;
  courseTitles?: string[];
}): Promise<string> {
  const question = redactPersonalDetails(input.userContent);
  const existing = input.conversationId
    ? await db.conversation.findUnique({ where: { id: input.conversationId } })
    : null;
  const conversation =
    existing ??
    (await db.conversation.create({
      data: { title: redactPersonalDetails(input.title).slice(0, 80) || "Conversation" },
    }));

  await recordAnalyticsEvent({
    type: "question_asked",
    conversationId: conversation.id,
    question,
  });
  const titles = [...new Set((input.courseTitles ?? []).map((title) => title.trim()).filter(Boolean))];
  if (titles.length === 0) {
    await recordAnalyticsEvent({
      type: "answer_generated",
      conversationId: conversation.id,
    });
  }
  for (const courseTitle of titles) {
    await recordAnalyticsEvent({
      type: "answer_generated",
      conversationId: conversation.id,
      courseTitle,
    });
  }
  if (input.fallback) {
    await recordAnalyticsEvent({
      type: "fallback_triggered",
      conversationId: conversation.id,
      question,
    });
  }

  await db.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: question,
      fallback: false,
    },
  });
  await db.conversationMessage.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: redactPersonalDetails(input.assistantContent),
      fallback: input.fallback,
    },
  });

  return conversation.id;
}
