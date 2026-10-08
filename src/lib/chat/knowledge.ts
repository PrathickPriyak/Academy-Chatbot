import {
  categoryNameForCourse,
  formatCoursePrice,
  listCategories,
  listCourses,
  listPlatformKnowledge,
} from "@/data/catalog";
import { site } from "@/data/site";

export type KnowledgeChunk = {
  id: string;
  title: string;
  text: string;
  href?: string;
};

export function buildKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [
    {
      id: "site-overview",
      title: "Academy overview",
      text: `${site.name}. ${site.tagline}. ${site.description} Website: ${site.url}. LMS: ${site.lms}.`,
      href: "/",
    },
    {
      id: "contact",
      title: "Contact",
      text: `Email ${site.email}. Phone ${site.phone}. ${site.offices.registered.label}: ${site.offices.registered.lines.join(", ")}. ${site.offices.corporate.label}: ${site.offices.corporate.lines.join(", ")}.`,
      href: "/contact",
    },
  ];

  for (const item of listPlatformKnowledge()) {
    chunks.push({
      id: `platform-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
      title: item.title,
      text: item.content,
      href: item.title.toLowerCase().includes("refund")
        ? "/refund"
        : item.title.toLowerCase().includes("contact") || item.title.toLowerCase().includes("phone")
          ? "/contact"
          : item.title.toLowerCase().includes("about")
            ? "/about"
            : undefined,
    });
  }

  for (const category of listCategories()) {
    chunks.push({
      id: `category-${category.slug}`,
      title: `${category.name} category`,
      text: `${category.name}: ${category.description}`,
      href: `/courses?category=${category.slug}`,
    });
  }

  for (const course of listCourses()) {
    const modules = course.modules.map((module, index) => `Module ${index + 1}: ${module.title}`).join("; ");
    chunks.push({
      id: `course-${course.slug}`,
      title: course.title,
      text: [
        course.title,
        categoryNameForCourse(course),
        course.shortDescription,
        course.description,
        `Level: ${course.level}`,
        `Duration: ${course.duration}`,
        `Price: ${formatCoursePrice(course)}`,
        `Enrollment: ${course.enrollmentUrl}`,
        modules,
      ].join(" "),
      href: `/courses/${course.slug}`,
    });
  }

  return chunks;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function retrieveKnowledge(question: string, limit = 5): KnowledgeChunk[] {
  const tokens = tokenize(question);
  if (!tokens.length) return [];

  const scored = buildKnowledgeChunks()
    .map((chunk) => {
      const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) score += 1;
      }
      if (tokens.some((token) => chunk.title.toLowerCase().includes(token))) score += 2;
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.chunk);
}
