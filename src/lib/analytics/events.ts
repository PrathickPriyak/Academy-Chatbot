import { db } from "@/lib/db";

import { redactPersonalDetails } from "./privacy";

export const analyticsEventTypes = [
  "chat_started",
  "question_asked",
  "answer_generated",
  "fallback_triggered",
  "course_clicked",
  "contact_clicked",
] as const;

export type AnalyticsEventType = (typeof analyticsEventTypes)[number];

export async function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  conversationId?: string | null;
  question?: string | null;
  courseTitle?: string | null;
}): Promise<void> {
  await db.analyticsEvent.create({
    data: {
      type: input.type,
      conversationId: input.conversationId ?? null,
      question: input.question ? redactPersonalDetails(input.question) : null,
      courseTitle: input.courseTitle?.trim() || null,
    },
  });
}
