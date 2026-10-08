import { formatCoursePrice, listCategories, listCourses } from "@/data/catalog";
import { site } from "@/data/site";

import { retrieveKnowledgeScored, type KnowledgeChunk } from "./knowledge";
import { maybeRewriteWithProvider } from "./provider";

export type ChatReply = {
  answer: string;
  outOfScope: boolean;
  unknown: boolean;
  contactSuggested: boolean;
  contactCtaLabel: string;
  sources: Array<{ title: string; href?: string }>;
};

const OFF_TOPIC_HINTS =
  /\b(prime minister|president|weather|stock|crypto|bitcoin|recipe|joke|code this|write a poem|who won|cricket score|movie|celebrity|capital of|who is the)\b/i;

const ACADEMY_HINTS =
  /\b(infozub|academy|course|courses|class|learn|learning|marketing|seo|photoshop|canva|wordpress|ads|refund|enroll|instructor|logesh|contact|price|module|category|tamil|certificate|lms|design|video|web|business|career|premiere|interview)\b/i;

const MIN_RELEVANCE_SCORE = 2;

function isLikelyOffTopic(question: string): boolean {
  if (OFF_TOPIC_HINTS.test(question) && !ACADEMY_HINTS.test(question)) return true;
  return false;
}

function listCourseTitles(): string[] {
  return listCourses().map((course) => course.title);
}

function composeFromChunks(question: string, chunks: KnowledgeChunk[]): string {
  const courseChunks = chunks.filter((chunk) => chunk.id.startsWith("course-"));
  const categoryChunks = chunks.filter((chunk) => chunk.id.startsWith("category-"));
  const q = question.toLowerCase();

  if (/\b(what courses|which courses|list courses|offer)\b/.test(q) || q.includes("courses do you")) {
    return `Infozub Digital Academy currently lists these published courses: ${listCourseTitles().join("; ")}. Open any course page for modules, published pricing, and enrollment links.`;
  }

  if (/\b(ai courses?|show me ai)\b/.test(q)) {
    const aiCourses = listCourses().filter((course) =>
      `${course.title} ${course.shortDescription} ${course.description}`.toLowerCase().includes("ai"),
    );
    if (!aiCourses.length) {
      return "I don't have enough information to answer that accurately. Please contact our team for more details.";
    }
    return `Published courses that mention AI: ${aiCourses
      .map((course) => `${course.title} (${formatCoursePrice(course)}) — /courses/${course.slug}`)
      .join("; ")}.`;
  }

  if (/\b(digital marketing|marketing courses?)\b/.test(q)) {
    const marketing = listCourses().filter((course) => course.category === "marketing");
    const cats = listCategories()
      .filter((category) => category.slug === "marketing")
      .map((category) => category.name);
    return `${cats[0] ?? "Marketing"} courses published by Infozub: ${marketing
      .map((course) => `${course.title} — ${formatCoursePrice(course)}, ${course.duration}`)
      .join("; ")}. Browse them at /courses?category=marketing.`;
  }

  if (/\b(contact|phone|email|address|office)\b/.test(q)) {
    return `You can contact Infozub Digital Academy at ${site.email} or ${site.phone}. Registered office: ${site.offices.registered.lines.join(", ")}. Corporate office: ${site.offices.corporate.lines.join(", ")}.`;
  }

  if (/\b(about|academy|infozub)\b/.test(q) && !courseChunks.length) {
    const about = chunks.find((chunk) => chunk.id.startsWith("about") || chunk.id === "site-overview");
    if (about) return about.text;
  }

  if (categoryChunks.length && !courseChunks.length) {
    return categoryChunks.map((chunk) => `${chunk.title}: ${chunk.text}`).join("\n\n");
  }

  if (courseChunks.length === 1) {
    const course = courseChunks[0]!;
    return `${course.title}: ${course.text.slice(0, 480)}${course.text.length > 480 ? "…" : ""} Open the course page for the full curriculum and enrollment link.`;
  }

  if (courseChunks.length > 1) {
    return `Matching published courses: ${courseChunks
      .map((chunk) => chunk.title)
      .join("; ")}. ${courseChunks
      .slice(0, 2)
      .map((chunk) => `${chunk.title}: ${chunk.text.slice(0, 180)}…`)
      .join(" ")}`;
  }

  const summary = chunks
    .slice(0, 3)
    .map((chunk) => `${chunk.title}: ${chunk.text}`)
    .join("\n\n");

  return `Here’s what I can confirm from Infozub Digital Academy materials:\n\n${summary}`;
}

function baseReply(partial: Omit<ChatReply, "contactCtaLabel"> & { contactCtaLabel?: string }): ChatReply {
  return {
    ...partial,
    contactCtaLabel: partial.contactCtaLabel ?? (partial.unknown ? "Contact Infozub Team" : "Contact Us"),
  };
}

export async function answerQuestion(question: string): Promise<ChatReply> {
  const trimmed = question.trim().slice(0, 1000);
  if (!trimmed) {
    return baseReply({
      answer: "Please ask a question about Infozub Digital Academy, our courses, or how to get in touch.",
      outOfScope: false,
      unknown: false,
      contactSuggested: false,
      sources: [],
    });
  }

  if (isLikelyOffTopic(trimmed)) {
    return baseReply({
      answer:
        "That’s outside what I can help with. I can assist you with Infozub Digital Academy, our courses, programs and academy information.",
      outOfScope: true,
      unknown: false,
      contactSuggested: true,
      contactCtaLabel: "Contact Us",
      sources: [{ title: "Contact Us", href: "/contact" }],
    });
  }

  const scored = retrieveKnowledgeScored(trimmed, 6);
  const topScore = scored[0]?.score ?? 0;

  if (!scored.length || topScore < MIN_RELEVANCE_SCORE) {
    return baseReply({
      answer:
        "I don't have enough information to answer that accurately. Please contact our team for more details.",
      outOfScope: false,
      unknown: true,
      contactSuggested: true,
      contactCtaLabel: "Contact Infozub Team",
      sources: [{ title: "Contact Infozub Team", href: "/contact" }],
    });
  }

  const chunks = scored.map((item) => item.chunk);
  let answer = composeFromChunks(trimmed, chunks);

  if (answer.includes("I don't have enough information")) {
    return baseReply({
      answer,
      outOfScope: false,
      unknown: true,
      contactSuggested: true,
      contactCtaLabel: "Contact Infozub Team",
      sources: [{ title: "Contact Infozub Team", href: "/contact" }],
    });
  }

  const rewritten = await maybeRewriteWithProvider({
    question: trimmed,
    groundedAnswer: answer,
    chunks,
  });
  if (rewritten) {
    answer = rewritten;
  }

  const contactSuggested =
    /contact|refund|login|access|help|unclear|enough information/i.test(trimmed) ||
    /contact our team|enough information/i.test(answer);

  return baseReply({
    answer,
    outOfScope: false,
    unknown: false,
    contactSuggested,
    contactCtaLabel: contactSuggested ? "Contact Infozub Team" : "Contact Us",
    sources: chunks
      .filter((chunk) => chunk.href)
      .slice(0, 4)
      .map((chunk) => ({ title: chunk.title, href: chunk.href })),
  });
}

export { suggestionPrompts, welcomeMessage } from "./prompts";

export function contactFallbackNote() {
  return `You can reach the team at ${site.email} or ${site.phone}.`;
}
