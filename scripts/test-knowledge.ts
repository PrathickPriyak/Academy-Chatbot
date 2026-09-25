import { listPublishedCourses } from "../src/lib/courses/queries";
import { answerFromKnowledge } from "../src/lib/knowledge/answer";

const questions = [
  "What courses do you offer?",
  "What is the Full Stack course?",
  "What is the duration?",
  "What topics are covered?",
  "What is the price?",
];

function digits(value: string): string[] {
  return (value.match(/\d[\d,]*/g) ?? []).map((item) => item.replace(/,/g, ""));
}

async function main() {
  const courses = await listPublishedCourses();
  const titles = courses.map((course) => course.title);
  const durations = courses.map((course) => course.duration.toLowerCase());
  const prices = courses.map((course) => String(course.price));
  const topics = courses.flatMap((course) =>
    course.modules.flatMap((module) => [
      module.title.toLowerCase(),
      ...module.lessons.map((lesson) => lesson.title.toLowerCase()),
    ]),
  );
  const allowedDigits = new Set(
    courses.flatMap((course) => [
      String(course.price),
      ...digits(course.duration),
      ...digits(course.description),
      ...digits(course.shortDescription),
    ]),
  );

  const answers = new Map<string, string>();
  for (const question of questions) {
    const answer = await answerFromKnowledge(question);
    answers.set(question, answer);
    console.log("\nQ:", question);
    console.log("A:", answer);
    if (answer === "NOT_FOUND") {
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

  const fullStack = answers.get("What is the Full Stack course?") ?? "";
  if (!fullStack.toLowerCase().includes("full stack")) {
    throw new Error("Full Stack answer did not name the stored course.");
  }

  const duration = (answers.get("What is the duration?") ?? "").toLowerCase();
  if (!durations.some((value) => duration.includes(value))) {
    throw new Error("Duration answer did not include a stored duration.");
  }

  const topicsAnswer = (answers.get("What topics are covered?") ?? "").toLowerCase();
  if (!topics.some((topic) => topicsAnswer.includes(topic))) {
    throw new Error("Topics answer did not include a stored module or lesson.");
  }

  const price = answers.get("What is the price?") ?? "";
  if (!prices.some((value) => price.replace(/,/g, "").includes(value))) {
    throw new Error("Price answer did not include a stored price.");
  }

  const missing = await answerFromKnowledge(
    "Do you guarantee job placement and a certificate?",
  );
  console.log("\nQ: placement");
  console.log("A:", missing);
  if (missing !== "NOT_FOUND") {
    throw new Error("Unavailable information should return NOT_FOUND.");
  }

  console.log("\nKnowledge checks passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
