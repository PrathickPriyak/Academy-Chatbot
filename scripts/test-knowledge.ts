import { listPublishedCourses } from "../src/lib/courses/queries";
import { answerFromKnowledge } from "../src/lib/knowledge/answer";
import { fallbackMessage } from "../src/lib/knowledge/fallback";

const questions = [
  "What courses do you offer?",
  "What is the Social Media Marketing course?",
  "What is the duration of the Social Media Marketing course?",
  "What topics are covered in the Social Media Marketing course?",
  "What is the price of the Social Media Marketing course?",
];

function digits(value: string): string[] {
  return (value.match(/\d[\d,]*/g) ?? []).map((item) => item.replace(/,/g, ""));
}

async function main() {
  const courses = await listPublishedCourses();
  const titles = courses.map((course) => course.title);
  const durations = courses.map((course) => course.duration.toLowerCase());
  const topics = courses.flatMap((course) =>
    course.modules.flatMap((module) => [
      module.title.toLowerCase(),
      ...module.lessons.map((lesson) => lesson.title.toLowerCase()),
    ]),
  );
  const allowedDigits = new Set([
    String(courses.length),
    ...courses.flatMap((course) => [
      String(course.price),
      ...digits(course.duration),
      ...digits(course.description),
      ...digits(course.shortDescription),
      ...digits(course.instructor.bio),
      ...course.features.flatMap((feature) => digits(`${feature.title} ${feature.description}`)),
      ...course.faqs.flatMap((faq) => digits(`${faq.question} ${faq.answer}`)),
      ...course.modules.flatMap((module) => digits(`${module.title} ${module.description}`)),
    ]),
  ]);

  const answers = new Map<string, string>();
  for (const question of questions) {
    const answer = await answerFromKnowledge(question);
    answers.set(question, answer);
    console.log("\nQ:", question);
    console.log("A:", answer);
    if (answer === fallbackMessage) {
      throw new Error(`Expected stored knowledge for: ${question}`);
    }
    const unexpected = digits(answer).filter(
      (value) => value.length >= 2 && !allowedDigits.has(value),
    );
    if (unexpected.length > 0) {
      throw new Error(
        `Answer invented numbers ${unexpected.join(", ")} for: ${question}`,
      );
    }
  }

  const catalog = answers.get(questions[0] ?? "") ?? "";
  if (!titles.some((title) => catalog.includes(title))) {
    throw new Error("Catalog answer did not include a stored course title.");
  }

  const social = answers.get("What is the Social Media Marketing course?") ?? "";
  if (!social.toLowerCase().includes("social media marketing")) {
    throw new Error("Social Media Marketing answer did not name the stored course.");
  }

  const duration = (answers.get("What is the duration of the Social Media Marketing course?") ?? "").toLowerCase();
  if (!durations.some((value) => duration.includes(value)) && !duration.includes("life-time") && !duration.includes("lifetime")) {
    throw new Error("Duration answer did not include a stored duration.");
  }

  const topicsAnswer = (answers.get("What topics are covered in the Social Media Marketing course?") ?? "").toLowerCase();
  const mentioned = topics.some((topic) => {
    const stripped = topic.replace(/^module \d+:\s*/, "");
    return topicsAnswer.includes(topic) || (stripped.length >= 8 && topicsAnswer.includes(stripped));
  });
  if (!mentioned) {
    throw new Error("Topics answer did not include a stored module or lesson.");
  }

  const price = (answers.get("What is the price of the Social Media Marketing course?") ?? "").replace(/,/g, "");
  if (!price.includes("999")) {
    throw new Error("Price answer did not include the stored Social Media Marketing price.");
  }

  const missing = await answerFromKnowledge("Do you provide hostel accommodation?");
  console.log("\nQ: placement");
  console.log("A:", missing);
  if (missing !== fallbackMessage) {
    throw new Error("Unavailable information should return the contact fallback.");
  }

  console.log("\nKnowledge checks passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
