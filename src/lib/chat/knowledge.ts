import {
  categoryNameForCourse,
  formatCoursePrice,
  listCategories,
  listCourses,
  listPlatformKnowledge,
} from "@/data/catalog";
import { aboutContent, audiences, founder, highlights, navLinks, site } from "@/data/site";

export type KnowledgeChunk = {
  id: string;
  title: string;
  text: string;
  href?: string;
  scoreBoost?: number;
};

export function buildKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [
    {
      id: "site-overview",
      title: "Academy overview",
      text: `${site.name}. ${site.tagline}. ${site.description} Website: ${site.url}. LMS: ${site.lms}. Navigation: ${navLinks.map((link) => link.label).join(", ")}.`,
      href: "/",
    },
    {
      id: "contact",
      title: "Contact",
      text: `Email ${site.email}. Phone ${site.phone}. ${site.offices.registered.label}: ${site.offices.registered.lines.join(", ")}. ${site.offices.corporate.label}: ${site.offices.corporate.lines.join(", ")}. Social: ${site.social.map((item) => item.label).join(", ")}.`,
      href: "/contact",
    },
    {
      id: "about-mission",
      title: "About mission and vision",
      text: `${aboutContent.mission.title}: ${aboutContent.mission.text} ${aboutContent.vision.title}: ${aboutContent.vision.text} ${aboutContent.philosophy.title}: ${aboutContent.philosophy.text} Started ${aboutContent.started}.`,
      href: "/about",
    },
    {
      id: "about-background",
      title: "INFOZUB background",
      text: aboutContent.background.join(" "),
      href: "/about",
    },
    {
      id: "about-introduction",
      title: "Academy introduction",
      text: aboutContent.introduction.join(" "),
      href: "/about",
    },
    {
      id: "instructor",
      title: "Instructor",
      text: `${founder.name}, ${founder.title}. ${founder.story.join(" ")} Stats: ${founder.stats.map((stat) => `${stat.value} ${stat.label}`).join("; ")}.`,
      href: "/about",
    },
    {
      id: "highlights",
      title: "Learning options and highlights",
      text: `Course highlights: ${highlights.join("; ")}.`,
      href: "/courses",
    },
    {
      id: "audiences",
      title: "Who should enroll",
      text: audiences.map((item) => `${item.title}: ${item.text}`).join(" "),
      href: "/about",
    },
    {
      id: "navigation",
      title: "Website navigation",
      text: `Main pages: ${navLinks.map((link) => `${link.label} (${link.href})`).join("; ")}; Chat /chat; Privacy /privacy; Terms /terms; Refund /refund.`,
      href: "/",
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
    const courseTitles = listCourses()
      .filter((course) => course.category === category.slug)
      .map((course) => course.title);
    chunks.push({
      id: `category-${category.slug}`,
      title: `${category.name} category`,
      text: `${category.name}: ${category.description} Courses: ${courseTitles.join("; ")}.`,
      href: `/courses?category=${category.slug}`,
      scoreBoost: 1,
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
    .filter((token) => token.length > 1);
}

export type ScoredChunk = { chunk: KnowledgeChunk; score: number };

export function retrieveKnowledgeScored(question: string, limit = 6): ScoredChunk[] {
  const tokens = tokenize(question);
  if (!tokens.length) return [];

  return buildKnowledgeChunks()
    .map((chunk) => {
      const haystack = `${chunk.title} ${chunk.text}`.toLowerCase();
      let score = chunk.scoreBoost ?? 0;
      for (const token of tokens) {
        if (haystack.includes(token)) score += token.length <= 2 ? 1.5 : 1;
      }
      if (tokens.some((token) => chunk.title.toLowerCase().includes(token))) score += 2;
      if (/\bai\b/i.test(question) && /ai|artificial/i.test(haystack)) score += 3;
      if (/\bmarketing\b/i.test(question) && /marketing/i.test(haystack)) score += 2;
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function retrieveKnowledge(question: string, limit = 6): KnowledgeChunk[] {
  return retrieveKnowledgeScored(question, limit).map((item) => item.chunk);
}
