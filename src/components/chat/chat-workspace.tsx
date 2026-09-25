"use client";

import { Check, Copy, Menu, Plus, RefreshCw, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Button } from "@/components/ui/button";
import { fallbackMessage } from "@/lib/knowledge/fallback";
import { cn } from "@/lib/utils";

const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL;

interface ChatSource {
  title: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources?: ChatSource[];
  fallback?: boolean;
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
        createdAt: new Date().toISOString(),
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [active?.messages, typing]);

  function updateActive(conversationId: string, messages: ChatMessage[], title?: string) {
    setConversations((current) =>
      current.map((item) =>
        item.id === conversationId
          ? { ...item, messages, title: title ?? item.title }
          : item,
      ),
    );
  }

  async function streamReply(conversationId: string, history: ChatMessage[]) {
    const assistantId = createId();
    const pending: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      sources: [],
      fallback: false,
    };
    updateActive(conversationId, [...history, pending]);
    setTyping(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history
          .filter((message) => message.id !== "intro")
          .map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok || !response.body) {
      updateActive(conversationId, [
        ...history,
        { ...pending, content: fallbackMessage, fallback: true },
      ]);
      setTyping(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let content = "";
    let sources: ChatSource[] = [];
    let fallback = false;

    while (true) {
      const step = await reader.read();
      if (step.done) {
        break;
      }
      buffer += decoder.decode(step.value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const line = event
          .split("\n")
          .filter((item) => item.startsWith("data: "))
          .map((item) => item.slice(6))
          .join("");
        if (!line) {
          continue;
        }
        const payload = JSON.parse(line) as {
          type?: string;
          text?: string;
          sources?: ChatSource[];
          fallback?: boolean;
        };
        if (payload.type === "sources") {
          fallback = payload.fallback === true;
          sources = (payload.sources ?? []).filter(
            (source) => source.url.startsWith("http") && source.title.length > 0,
          );
        }
        if (payload.type === "token" && payload.text) {
          content += payload.text;
          setTyping(false);
          updateActive(conversationId, [
            ...history,
            { ...pending, content, sources, fallback },
          ]);
        }
      }
    }

    updateActive(conversationId, [
      ...history,
      {
        ...pending,
        content: content || fallbackMessage,
        sources,
        fallback: fallback || !content,
      },
    ]);
    setTyping(false);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || typing || !active) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    const history = [...active.messages, userMessage];
    const title = active.messages.some((message) => message.role === "user")
      ? active.title
      : content.slice(0, 42);

    setDraft("");
    updateActive(active.id, history, title);
    await streamReply(active.id, history);
  }

  async function regenerate() {
    if (!active || typing) {
      return;
    }
    const history = [...active.messages];
    const last = history[history.length - 1];
    if (last?.role !== "assistant") {
      return;
    }
    history.pop();
    const previousUser = [...history]
      .reverse()
      .find((message) => message.role === "user");
    if (!previousUser) {
      return;
    }
    updateActive(active.id, history);
    await streamReply(active.id, history);
  }

  function clearConversation() {
    if (!active || typing) {
      return;
    }
    updateActive(active.id, starter[0]?.messages ?? [], "New conversation");
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
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearConversation}
              disabled={typing}
            >
              <Trash2 />
              Clear conversation
            </Button>
            <ThemeToggle />
          </div>
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      "mt-2 text-[11px]",
                      message.role === "user"
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  {message.role === "assistant" && message.id !== "intro" ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {message.fallback && contactUrl ? (
                        <a
                          href={contactUrl}
                          className="bg-primary text-primary-foreground inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold"
                        >
                          Contact Us
                        </a>
                      ) : null}
                      {message.sources?.map((source) => (
                        <div
                          key={source.url}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="text-muted-foreground text-xs">
                            Source: {source.title}
                          </span>
                          <a
                            href={source.url}
                            className="text-primary text-xs font-semibold underline"
                          >
                            View Course
                          </a>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            void navigator.clipboard
                              .writeText(message.content)
                              .then(() => {
                                setCopiedId(message.id);
                                window.setTimeout(() => setCopiedId(null), 1500);
                              });
                          }}
                        >
                          {copiedId === message.id ? <Check /> : <Copy />}
                          {copiedId === message.id ? "Copied" : "Copy answer"}
                        </Button>
                        {message.id === active?.messages.at(-1)?.id ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => void regenerate()}
                            disabled={typing}
                          >
                            <RefreshCw />
                            Regenerate answer
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
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
