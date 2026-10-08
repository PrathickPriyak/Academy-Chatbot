"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
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

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <Section spacing="md">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl tracking-tight">Academy Assistant</h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed">
          Ask about published Infozub Digital Academy courses, categories, instructors, refunds, and contact details.
          I won’t invent facts or answer off-topic questions.
        </p>

        <div className="border-border bg-card mt-8 flex min-h-[28rem] flex-col rounded-3xl border shadow-soft">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
            {loading ? <p className="text-muted-foreground text-sm">Assistant is typing…</p> : null}
            {error ? (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="border-border flex flex-wrap gap-2 border-t px-4 py-3">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="border-border hover:bg-muted rounded-full border px-3 py-1.5 text-xs font-medium"
                onClick={() => void ask(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border-border flex items-end gap-2 border-t p-4">
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
    </Section>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16">Loading assistant…</div>}>
      <ChatWorkspace />
    </Suspense>
  );
}
