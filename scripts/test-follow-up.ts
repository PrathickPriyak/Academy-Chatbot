import { db } from "../src/lib/db";
import { answerConversation } from "../src/lib/knowledge/answer";

async function main() {
  const course = await db.course.findUnique({
    where: { slug: "social-media-marketing" },
  });
  if (!course) {
    throw new Error("Social Media Marketing course is missing from the database.");
  }

  const first = await answerConversation([
    { role: "user", content: "Tell me about the Social Media Marketing course." },
  ]);
  console.log("First:", first.content);
  console.log("Sources:", first.sources);
  if (!first.content.toLowerCase().includes("social media marketing")) {
    throw new Error("The first answer did not use the Social Media Marketing course.");
  }
  if (!first.sources.some((source) => source.url === course.enrollmentUrl)) {
    throw new Error("View Course URL was not the stored enrollment URL.");
  }

  const second = await answerConversation([
    { role: "user", content: "Tell me about the Social Media Marketing course." },
    { role: "assistant", content: first.content },
    { role: "user", content: "What is its duration?" },
  ]);
  console.log("Follow-up:", second.content);
  console.log("Follow-up sources:", second.sources);
  if (!second.content.toLowerCase().includes(course.duration.toLowerCase())) {
    throw new Error("Follow-up did not use the stored Social Media Marketing duration.");
  }
  if (!second.sources.some((source) => source.url === course.enrollmentUrl)) {
    throw new Error("Follow-up source URL was not stored in the database.");
  }

  console.log("Follow-up check passed.");
  await db.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
