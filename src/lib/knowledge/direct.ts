import { listPublishedCourses } from "@/lib/courses/queries";
import { formatPrice } from "@/lib/courses/present";
import { db } from "@/lib/db";

import type { KnowledgeAnswer } from "./answer";
import { mentionedTitle } from "./context";

function priceSentence(title: string, price: number, currency: string, url: string): string {
  if (price > 0) {
    return `Price of ${title}: ${price} ${currency} (${formatPrice(price, currency)}).`;
  }
  return `Price of ${title}: the published course page does not list a numeric price. Use the enrollment page ${url}.`;
}

export async function directAnswer(question: string): Promise<KnowledgeAnswer | null> {
  const text = question.toLowerCase();
  const courses = await listPublishedCourses();
  if (courses.length === 0) {
    return null;
  }
  const title = mentionedTitle(question, courses.map((course) => course.title));
  const course = courses.find((item) => item.title === title);

  if (/\b(courses|course list|catalog)\b/.test(text) && /\b(offer|available|list|which|what)\b/.test(text)) {
    return {
      content: `Infozub offers ${courses.length} courses: ${courses.map((item) => item.title).join("; ")}.`,
      sources: courses
        .filter((item) => item.enrollmentUrl.startsWith("http"))
        .map((item) => ({ title: item.title, url: item.enrollmentUrl })),
      fallback: false,
    };
  }

  if (course && /\b(price|cost|fee|fees|tuition)\b/.test(text)) {
    return {
      content: priceSentence(course.title, course.price, course.currency, course.enrollmentUrl),
      sources: [{ title: course.title, url: course.enrollmentUrl }],
      fallback: false,
    };
  }

  if (course && /\b(duration|how long|lifetime|life-time)\b/.test(text)) {
    return {
      content: `Duration of ${course.title}: ${course.duration}.`,
      sources: [{ title: course.title, url: course.enrollmentUrl }],
      fallback: false,
    };
  }

  if (course && /\b(enroll|enrol|join|buy|signup|sign up)\b/.test(text)) {
    return {
      content: `Enrollment for ${course.title}: ${course.enrollmentUrl}.`,
      sources: [{ title: course.title, url: course.enrollmentUrl }],
      fallback: false,
    };
  }

  if (/\b(instructor|founder|mentor|who teaches|who is logesh)\b/.test(text)) {
    const person = course?.instructor ?? courses[0]?.instructor;
    if (!person) {
      return null;
    }
    const named = course ?? courses[0];
    return {
      content: `Instructor for ${named?.title}: ${person.name}, ${person.title}. ${person.bio}`,
      sources: named ? [{ title: named.title, url: named.enrollmentUrl }] : [],
      fallback: false,
    };
  }

  if (/\b(refund|money back)\b/.test(text) || /\b(phone|email|office|address|contact|located|where)\b/.test(text) || /\b(who should enroll|who is this for|freshers|freelancers)\b/.test(text)) {
    const entries = await db.customKnowledge.findMany({ orderBy: { title: "asc" } });
    const matched = entries.filter((entry) => {
      const blob = `${entry.title} ${entry.content}`.toLowerCase();
      if (/\brefund\b/.test(text)) return blob.includes("refund");
      if (/\boffice|address|located\b/.test(text)) return blob.includes("office") || blob.includes("palladam");
      if (/\bwho should|freshers|freelancers\b/.test(text)) return blob.includes("enroll");
      return blob.includes("phone") || blob.includes("academy@infozub.com");
    });
    if (matched.length === 0) {
      return null;
    }
    return {
      content: matched.map((entry) => entry.content).join("\n"),
      sources: [],
      fallback: false,
    };
  }

  return null;
}
