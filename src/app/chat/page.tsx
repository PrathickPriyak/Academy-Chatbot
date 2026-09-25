import { Suspense } from "react";

import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { LoadingScreen } from "@/components/loading/loading-screen";

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
