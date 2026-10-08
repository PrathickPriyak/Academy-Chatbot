import { site } from "@/data/site";

import { retrieveKnowledge, type KnowledgeChunk } from "./knowledge";

export type ChatReply = {
  answer: string;
  outOfScope: boolean;
  unknown: boolean;
  contactSuggested: boolean;
  sources: Array<{ title: string; href?: string }>;
};

const OFF_TOPIC_HINTS =
  /\b(prime minister|president|weather|stock|crypto|bitcoin|recipe|joke|code this|write a poem|who won|cricket score|movie|celebrity)\b/i;

const ACADEMY_HINTS =
  /\b(infozub|academy|course|courses|class|learn|learning|marketing|seo|photoshop|canva|wordpress|ads|refund|enroll|instructor|logesh|contact|price|module|category|tamil|certificate|lms)\b/i;

function isLikelyOffTopic(question: string): boolean {
  if (OFF_TOPIC_HINTS.test(question) && !ACADEMY_HINTS.test(question)) return true;
  if (!ACADEMY_HINTS.test(question) && question.split(/\s+/).length > 4) {
    // Generic questions with no academy terms still get retrieval; only hard-block clear off-topic
    return OFF_TOPIC_HINTS.test(question);
  }
  return false;
}

function composeFromChunks(question: string, chunks: KnowledgeChunk[]): string {
  const courseChunks = chunks.filter((chunk) => chunk.id.startsWith("course-"));
  const q = question.toLowerCase();

  if (/\b(what courses|which courses|list courses|offer)\b/.test(q) || q.includes("courses do you")) {
    const titles = courseChunks.length
      ? courseChunks.map((chunk) => chunk.title)
      : retrieveKnowledge("course", 11).filter((c) => c.id.startsWith("course-")).map((c) => c.title);
    return `Infozub Digital Academy currently lists these published courses: ${titles.join("; ")}. Open any course page for modules, pricing details that are published, and enrollment links.`;
  }

  if (courseChunks.length === 1) {
    const course = courseChunks[0]!;
    return `${course.title}: ${course.text.slice(0, 420)}${course.text.length > 420 ? "…" : ""} You can open the course page for the full curriculum and enrollment link.`;
  }

  const summary = chunks
    .slice(0, 3)
    .map((chunk) => `${chunk.title}: ${chunk.text}`)
    .join("\n\n");

  return `Here’s what I can confirm from Infozub Digital Academy materials:\n\n${summary}`;
}

export function answerQuestion(question: string): ChatReply {
  const trimmed = question.trim().slice(0, 1000);
  if (!trimmed) {
    return {
      answer: "Please ask a question about Infozub Digital Academy, our courses, or how to get in touch.",
      outOfScope: false,
      unknown: false,
      contactSuggested: false,
      sources: [],
    };
  }

  if (isLikelyOffTopic(trimmed)) {
    return {
      answer:
        "That’s outside what I can help with. I can assist you with Infozub Digital Academy, our courses, programs, and academy information.",
      outOfScope: true,
      unknown: false,
      contactSuggested: true,
      sources: [{ title: "Contact Us", href: "/contact" }],
    };
  }

  const chunks = retrieveKnowledge(trimmed, 6);
  if (!chunks.length) {
    return {
      answer:
        "I don't have enough information to answer that accurately. Please contact our team for more details.",
      outOfScope: false,
      unknown: true,
      contactSuggested: true,
      sources: [{ title: "Contact Infozub Team", href: "/contact" }],
    };
  }

  const scoreThresholdMet = chunks.length > 0;
  if (!scoreThresholdMet) {
    return {
      answer:
        "I don't have enough information to answer that accurately. Please contact our team for more details.",
      outOfScope: false,
      unknown: true,
      contactSuggested: true,
      sources: [{ title: "Contact Infozub Team", href: "/contact" }],
    };
  }

  return {
    answer: composeFromChunks(trimmed, chunks),
    outOfScope: false,
    unknown: false,
    contactSuggested: /contact|refund|login|access|help/.test(trimmed.toLowerCase()),
    sources: chunks
      .filter((chunk) => chunk.href)
      .slice(0, 4)
      .map((chunk) => ({ title: chunk.title, href: chunk.href })),
  };
}

export const welcomeMessage =
  "Hi — I’m the Infozub Academy Assistant. I can help you explore our published courses, programs, instructors, and academy information. What would you like to know?";

export const suggestionPrompts = [
  "What courses do you offer?",
  "Show me marketing courses",
  "Tell me about digital marketing courses",
  "How can I contact Infozub?",
  "Tell me about the academy",
] as const;

export function contactFallbackNote() {
  return `You can reach the team at ${site.email} or ${site.phone}.`;
}
