"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading-dots";
import { suggestionPrompts, welcomeMessage } from "@/lib/chat/prompts";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  contactSuggested?: boolean;
  contactCtaLabel?: string;
  sources?: Array<{ title: string; href?: string }>;
};

function ChatWorkspace() {
  const searchParams = useSearchParams();
  const bootstrapped = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: welcomeMessage },
  ]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as {
        answer?: string;
        contactSuggested?: boolean;
        contactCtaLabel?: string;
        sources?: Array<{ title: string; href?: string }>;
        error?: string;
      };
      if (!response.ok || !data.answer) throw new Error(data.error || "Request failed");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer!,
          contactSuggested: data.contactSuggested,
          contactCtaLabel: data.contactCtaLabel,
          sources: data.sources,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || bootstrapped.current) return;
    bootstrapped.current = true;
    void ask(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col sm:min-h-[calc(100svh-4.25rem)]">
      <Container className="flex max-w-3xl flex-1 flex-col py-6 sm:py-10">
        <div className="shrink-0">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Academy Assistant</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base">
            Ask about published Infozub Digital Academy courses, categories, instructors, refunds, and contact details.
            I won’t invent facts or answer off-topic questions.
          </p>
        </div>

        <div className="border-border bg-card mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border shadow-soft sm:mt-8">
          <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words sm:max-w-[90%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.sources?.length ? (
                    <ul className="mt-2 space-y-1">
                      {message.sources.map((source) =>
                        source.href ? (
                          <li key={`${source.title}-${source.href}`}>
                            <Link href={source.href} className="underline underline-offset-2">
                              {source.title}
                            </Link>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  ) : null}
                  {message.contactSuggested ? (
                    <div className="mt-3">
                      <Button asChild size="sm" variant="secondary">
                        <Link href="/contact">{message.contactCtaLabel ?? "Contact Us"}</Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {loading ? (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                Assistant is typing
                <LoadingDots label="Assistant is typing" />
              </p>
            ) : null}
            {error ? (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="border-border flex max-h-32 shrink-0 flex-wrap gap-2 overflow-y-auto border-t px-3 py-3 sm:px-4">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="border-border hover:bg-muted inline-flex min-h-11 items-center rounded-full border px-3.5 py-2 text-xs font-medium"
                onClick={() => void ask(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-border flex shrink-0 items-end gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
          >
            <textarea
              value={input}
              rows={2}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about courses, skills, refunds, contact…"
              className="border-border bg-background min-h-11 flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Message the assistant"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={loading || !input.trim()}>
              <Send />
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[50svh] max-w-3xl items-center px-4 py-16">Loading assistant…</div>
      }
    >
      <ChatWorkspace />
    </Suspense>
  );
}
