"use client";

import dynamic from "next/dynamic";

const AssistantWidget = dynamic(
  () =>
    import("@/components/assistant/assistant-widget").then((mod) => ({
      default: mod.AssistantWidget,
    })),
  { ssr: false, loading: () => null },
);

export function LazyAssistantWidget() {
  return <AssistantWidget />;
}
