import { db } from "../src/lib/db";
import { answerConversation } from "../src/lib/knowledge/answer";
import { fallbackMessage } from "../src/lib/knowledge/fallback";

async function main() {
  const course = await db.course.findUnique({
    where: { slug: "full-stack-web-development" },
    include: { instructor: true },
  });
  const instructors = await db.instructor.findMany();
  if (!course) {
    throw new Error("Full Stack course is missing.");
  }

  const hostel = await answerConversation([
    { role: "user", content: "Do you provide hostel accommodation?" },
  ]);
  const cricket = await answerConversation([
    { role: "user", content: "Who won yesterday's cricket match?" },
  ]);
  const duration = await answerConversation([
    { role: "user", content: "What is the Full Stack course duration?" },
  ]);
  const instructor = await answerConversation([
    { role: "user", content: "Who is the instructor?" },
  ]);

  console.log("hostel", hostel.fallback, hostel.content);
  console.log("cricket", cricket.fallback, cricket.content);
  console.log("duration", duration.fallback, duration.content);
  console.log("instructor", instructor.fallback, instructor.content);

  if (
    !hostel.fallback ||
    hostel.content !== fallbackMessage ||
    hostel.sources.length > 0
  ) {
    throw new Error("Hostel question should use the contact fallback.");
  }
  if (!cricket.fallback || cricket.content !== fallbackMessage) {
    throw new Error("Unrelated question should use the contact fallback.");
  }
  if (
    duration.fallback ||
    !duration.content.toLowerCase().includes(course.duration.toLowerCase())
  ) {
    throw new Error("Full Stack duration should come from the database.");
  }
  const namedInstructor = instructors.some((person) =>
    instructor.content.includes(person.name),
  );
  if (instructor.fallback || !namedInstructor) {
    throw new Error("Instructor answer should use a stored instructor name.");
  }

  console.log("Fallback checks passed.");
  await db.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
