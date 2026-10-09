import type { Metadata } from "next";
import { Suspense } from "react";

import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { LoadingScreen } from "@/components/loading/loading-screen";

export const metadata: Metadata = {
  title: "Chat",
  description: "Ask the Infozub assistant about courses, curriculum, duration, and enrollment.",
};

function ChatPageContent({ question }: { question?: string }) {
  return <ChatWorkspace initialQuestion={question} />;
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ChatPageContent question={params.q} />
    </Suspense>
  );
}
