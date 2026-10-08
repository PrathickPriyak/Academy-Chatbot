import type { Metadata } from "next";

import { ChatWorkspacePage } from "@/components/assistant/chat-workspace";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Academy Assistant",
  description: `Ask the ${site.name} assistant about published courses, programs, instructors, and contact details. Answers stay grounded in academy content.`,
  alternates: { canonical: "/chat" },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ChatPage() {
  return <ChatWorkspacePage />;
}
