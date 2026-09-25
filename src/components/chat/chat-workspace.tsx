"use client";

import { Menu, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Button } from "@/components/ui/button";
import { askAssistant } from "@/lib/ai/ask";
import type { AssistantMessage } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

interface ChatMessage extends AssistantMessage {
  id: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const suggestions = [
  "What courses are available?",
  "Tell me about the Full Stack course.",
  "What is the course duration?",
  "What topics are covered?",
  "How can I enroll?",
];

const starter: Conversation[] = [
  {
    id: "welcome",
    title: "New conversation",
    messages: [
      {
        id: "intro",
        role: "assistant",
        content:
          "I answer questions about Infozub Digital Academy courses, curriculum, and enrollment. What would you like to know?",
      },
    ],
  },
];

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatWorkspace({ initialQuestion }: { initialQuestion?: string }) {
  const [conversations, setConversations] = useState<Conversation[]>(starter);
  const [activeId, setActiveId] = useState(starter[0]?.id ?? "welcome");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);

  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [active?.messages, typing]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || typing || !active) {
      return;
    }

    const userMessage: ChatMessage = { id: createId(), role: "user", content };
    const history = [...active.messages, userMessage];
    const title = active.messages.some((message) => message.role === "user")
      ? active.title
      : content.slice(0, 42);

    setDraft("");
    setTyping(true);
    setConversations((current) =>
      current.map((item) =>
        item.id === active.id ? { ...item, title, messages: history } : item,
      ),
    );

    const answer = await askAssistant(
      history.map(({ role, content: message }) => ({ role, content: message })),
    );

    setConversations((current) =>
      current.map((item) =>
        item.id === active.id
          ? {
              ...item,
              messages: [
                ...history,
                { id: createId(), role: "assistant", content: answer },
              ],
            }
          : item,
      ),
    );
    setTyping(false);
  }

  useEffect(() => {
    if (!initialQuestion || sentInitial.current) {
      return;
    }
    sentInitial.current = true;
    void send(initialQuestion);
    // The first suggested question should send once when the page opens with ?q=
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  function startNew() {
    const next: Conversation = {
      id: createId(),
      title: "New conversation",
      messages: starter[0]?.messages ?? [],
    };
    setConversations((current) => [next, ...current]);
    setActiveId(next.id);
    setHistoryOpen(false);
  }

  return (
    <div className="bg-background flex h-dvh">
      {historyOpen ? (
        <button
          type="button"
          aria-label="Close conversation history"
          className="bg-foreground/30 fixed inset-0 z-30 lg:hidden"
          onClick={() => setHistoryOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r p-4 transition-transform lg:static lg:translate-x-0",
          historyOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight">
            Infozub
          </Link>
          <Button
            variant="outline"
            size="icon"
            aria-label="New conversation"
            onClick={startNew}
          >
            <Plus />
          </Button>
        </div>
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Conversation history
        </p>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                setActiveId(conversation.id);
                setHistoryOpen(false);
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-sm",
                conversation.id === active?.id
                  ? "bg-muted font-medium"
                  : "hover:bg-muted/70",
              )}
            >
              {conversation.title}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open conversation history"
              onClick={() => setHistoryOpen(true)}
            >
              <Menu />
            </Button>
            <div>
              <p className="font-display text-lg leading-none tracking-tight">
                Infozub AI Assistant
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Course knowledge preview
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div
          ref={scroller}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-8"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {active?.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "border-border bg-card rounded-bl-md border shadow-xs",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="border-border bg-card mr-auto flex gap-1 rounded-2xl border px-4 py-3">
                <span className="bg-muted-foreground size-2 animate-bounce rounded-full [animation-delay:-0.2s]" />
                <span className="bg-muted-foreground size-2 animate-bounce rounded-full [animation-delay:-0.1s]" />
                <span className="bg-muted-foreground size-2 animate-bounce rounded-full" />
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-border border-t px-4 py-4 sm:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="border-border bg-card hover:bg-muted shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium"
                  onClick={() => void send(question)}
                >
                  {question}
                </button>
              ))}
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void send(draft);
              }}
            >
              <label className="sr-only" htmlFor="chat-input">
                Ask about Infozub courses
              </label>
              <textarea
                id="chat-input"
                rows={1}
                value={draft}
                placeholder="Ask about Infozub courses..."
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(draft);
                  }
                }}
                className="border-border bg-card focus-visible:ring-ring min-h-11 flex-1 resize-none rounded-xl border px-3 py-3 text-sm outline-none focus-visible:ring-2"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={typing}
              >
                <Send />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
