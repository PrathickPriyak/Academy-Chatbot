import { listPublishedCourses } from "@/lib/courses/queries";
import type { AssistantMessage } from "@/lib/ai/types";

function phrasesFor(title: string): string[] {
  const lower = title.toLowerCase();
  const phrases = [lower];
  if (lower.includes("master course")) {
    phrases.push(lower.replace(" master course", "").trim());
  }
  if (lower.includes("photoshop")) phrases.push("photoshop");
  if (lower.includes("premiere")) phrases.push("premiere", "premiere pro");
  if (lower.includes("canva")) phrases.push("canva");
  if (lower.includes("google ads")) phrases.push("google ads");
  if (lower.includes("seo") || lower.includes("search engine")) phrases.push("seo");
  if (lower.includes("wordpress") || lower.includes("webdesign")) phrases.push("wordpress", "web design");
  if (lower.includes("social media")) phrases.push("social media marketing");
  if (lower.includes("interview")) phrases.push("interview");
  if (lower.includes("business success")) phrases.push("business success");
  if (lower.includes("mobile app video")) phrases.push("mobile video editing", "video editing");
  if (lower.includes("ai website")) phrases.push("ai website", "website builder");
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
