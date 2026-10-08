"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { fallbackMessage } from "@/lib/knowledge/fallback";

interface Source {
  title: string;
  url: string;
}

export function AssistantWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);

  async function ask(event: FormEvent) {
    event.preventDefault();
    const question = draft.trim();
    if (!question || busy) {
      return;
    }
    setBusy(true);
    setAnswer("");
    setSources([]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
      });
      if (!response.ok || !response.body) {
        setAnswer("The assistant could not reply just now. You can try again.");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      let fallback = false;
      let nextSources: Source[] = [];
      while (true) {
        const step = await reader.read();
        if (step.done) {
          break;
        }
        buffer += decoder.decode(step.value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const item of events) {
          const line = item
            .split("\n")
            .filter((part) => part.startsWith("data: "))
            .map((part) => part.slice(6))
            .join("");
          if (!line) {
            continue;
          }
          const payload = JSON.parse(line) as {
            type?: string;
            text?: string;
            fallback?: boolean;
            sources?: Source[];
          };
          if (payload.type === "sources") {
            fallback = payload.fallback === true;
            nextSources = payload.sources ?? [];
          }
          if (payload.type === "token" && payload.text) {
            text += payload.text;
            setAnswer(text);
          }
        }
      }
      if (fallback || text.trim() === fallbackMessage) {
        router.push("/contact?from=assistant");
        return;
      }
      setSources(nextSources.filter((source) => source.url.startsWith("http")));
      setDraft("");
    } catch {
      setAnswer("The assistant could not reply just now. You can try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section className="border-border bg-card w-[min(100vw-2rem,22rem)] rounded-2xl border shadow-xl">
          <header className="border-border flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Ask Infozub</p>
              <p className="text-muted-foreground text-xs">Courses, enrollment, and academy details</p>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </header>
          <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm leading-6">
            {answer ? <p className="whitespace-pre-wrap">{answer}</p> : <p className="text-muted-foreground">Ask about a course, the price, duration, refund, or office.</p>}
            {sources.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {sources.slice(0, 3).map((source) => (
                  <a key={source.url} href={source.url} className="text-primary text-xs font-semibold">
                    {source.title}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <form className="border-border flex gap-2 border-t p-3" onSubmit={(event) => void ask(event)}>
            <label className="sr-only" htmlFor="assistant-question">
              Question
            </label>
            <input
              id="assistant-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question"
              className="border-border bg-background h-10 flex-1 rounded-lg border px-3 text-sm outline-none"
            />
            <Button type="submit" size="icon" aria-label="Send question" disabled={busy || draft.trim().length === 0}>
              <Send />
            </Button>
          </form>
        </section>
      ) : null}
      <Button type="button" size="lg" className="shadow-lg" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <MessageCircle />
        {open ? "Close chat" : "Chat with us"}
      </Button>
    </div>
  );
}
