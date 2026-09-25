import { listPublishedCourses } from "@/lib/courses/queries";
import type { AssistantMessage } from "@/lib/ai/types";

function phrasesFor(title: string): string[] {
  const lower = title.toLowerCase();
  const phrases = [lower];
  if (lower.includes("full stack")) phrases.push("full stack");
  if (lower.includes("data analytics")) phrases.push("data analytics");
  if (lower.includes("ui/ux")) phrases.push("ui/ux");
  if (lower.includes("product design")) phrases.push("product design");
  if (lower.includes("digital marketing")) phrases.push("digital marketing");
  return phrases;
}

function mentionedTitle(text: string, titles: string[]): string | undefined {
  const lower = text.toLowerCase();
  return titles.find((title) =>
    phrasesFor(title).some((phrase) => lower.includes(phrase)),
  );
}

export async function standaloneQuestion(messages: AssistantMessage[]): Promise<string> {
  const latest = [...messages].reverse().find((message) => message.role === "user");
  const question = latest?.content.trim() ?? "";
  if (!question) {
    return "";
  }

  const courses = await listPublishedCourses();
  const titles = courses.map((course) => course.title);
  if (mentionedTitle(question, titles)) {
    return question;
  }

  const pronoun = /\b(it|its|it's|that|this|the course)\b/i.test(question);
  if (!pronoun) {
    return question;
  }

  const priorMessages = messages.filter((message) => message !== latest).reverse();
  for (const message of priorMessages) {
    const course = mentionedTitle(message.content, titles);
    if (course) {
      return `${question} This refers to the ${course}.`;
    }
  }

  return question;
}
