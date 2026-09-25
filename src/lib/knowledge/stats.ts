import { db } from "@/lib/db";

export interface KnowledgeStats {
  courses: number;
  modules: number;
  lessons: number;
  faqs: number;
  indexedDocuments: number;
  lastKnowledgeUpdate: Date | null;
  conversations: number;
  fallbackQuestions: number;
}

export async function getKnowledgeStats(): Promise<KnowledgeStats> {
  const [courses, modules, lessons, faqs, indexedDocuments, lastRun, conversations, fallbackQuestions] =
    await Promise.all([
      db.course.count(),
      db.module.count(),
      db.lesson.count(),
      db.faq.count(),
      db.knowledgeChunk.count(),
      db.knowledgeIndexRun.findFirst({
        where: { status: "success", finishedAt: { not: null } },
        orderBy: { finishedAt: "desc" },
      }),
      db.conversation.count(),
      db.conversationMessage.count({ where: { fallback: true } }),
    ]);

  return {
    courses,
    modules,
    lessons,
    faqs,
    indexedDocuments,
    lastKnowledgeUpdate: lastRun?.finishedAt ?? null,
    conversations,
    fallbackQuestions,
  };
}
