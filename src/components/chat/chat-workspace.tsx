"use client";

import { ArrowRight, Check, Copy, Menu, Plus, RefreshCw, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/providers/theme-toggle";
import { BrandLogo } from "@/components/site/brand-logo";
import { Button } from "@/components/ui/button";
import { fallbackMessage } from "@/lib/knowledge/fallback";
import { cn } from "@/lib/utils";

const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL;
const replyError = "The assistant could not reply just now. Check your connection and try again.";

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
  error?: boolean;
}

interface Conversation {
  id: string;
  serverId?: string;
  title: string;
  messages: ChatMessage[];
}

const suggestions = [
  "What courses are available?",
  "Tell me about the Social Media Marketing course.",
  "What is the course duration?",
  "What topics are covered?",
  "How can I enroll?",
  "What is the refund policy?",
  "Where is the Infozub office?",
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

function trackAnalytics(type: "chat_started" | "course_clicked" | "contact_clicked", courseTitle?: string) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, courseTitle }),
  });
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ChatWorkspace({ initialQuestion }: { initialQuestion?: string }) {
  const [conversations, setConversations] = useState<Conversation[]>(starter);
  const [activeId, setActiveId] = useState(starter[0]?.id ?? "welcome");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);
  const sentInitial = useRef(false);
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];
  const hasUserMessage = active?.messages.some((message) => message.role === "user") ?? false;

  useEffect(() => {
    trackAnalytics("chat_started");
  }, []);

  useEffect(() => {
    if (!stickToBottom.current) {
      return;
    }
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [active?.messages, typing]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      const target = event.target as HTMLElement | null;
      const typingInField = target?.tagName === "TEXTAREA" || target?.tagName === "INPUT";

      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        startNew();
        return;
      }
      if (event.key === "Escape") {
        setHistoryOpen(false);
        setShortcutsOpen(false);
        return;
      }
      if (meta && event.key === "/") {
        event.preventDefault();
        setShortcutsOpen((open) => !open);
        return;
      }
      if (event.key === "/" && !typingInField) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function updateActive(
    conversationId: string,
    messages: ChatMessage[],
    title?: string,
    serverId?: string,
  ) {
    setConversations((current) =>
      current.map((item) =>
        item.id === conversationId
          ? {
              ...item,
              messages,
              title: title ?? item.title,
              serverId: serverId ?? item.serverId,
            }
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
    stickToBottom.current = true;
    updateActive(conversationId, [...history, pending]);
    setTyping(true);

    let response: Response;
    try {
      response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationsRef.current.find((item) => item.id === conversationId)?.serverId,
          messages: history
            .filter((message) => message.id !== "intro")
            .map(({ role, content }) => ({ role, content })),
        }),
      });
    } catch {
      updateActive(conversationId, [...history, { ...pending, content: replyError, error: true }]);
      setTyping(false);
      return;
    }

    if (!response.ok || !response.body) {
      updateActive(conversationId, [...history, { ...pending, content: replyError, error: true }]);
      setTyping(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let content = "";
    let shown = "";
    let sources: ChatSource[] = [];
    let fallback = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function reveal(next: string) {
      if (reducedMotion) {
        shown = next;
        updateActive(conversationId, [...history, { ...pending, content: shown, sources, fallback }]);
        return;
      }
      while (shown.length < next.length) {
        shown = next.slice(0, shown.length + 2);
        updateActive(conversationId, [...history, { ...pending, content: shown, sources, fallback }]);
        await new Promise((resolve) => window.setTimeout(resolve, 16));
      }
    }

    try {
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
            id?: string;
            sources?: ChatSource[];
            fallback?: boolean;
          };
          if (payload.type === "conversation" && payload.id) {
            updateActive(conversationId, [...history, { ...pending, content, sources, fallback }], undefined, payload.id);
          }
          if (payload.type === "sources") {
            fallback = payload.fallback === true;
            sources = (payload.sources ?? []).filter(
              (source) => source.url.startsWith("http") && source.title.length > 0,
            );
          }
          if (payload.type === "token" && payload.text) {
            content += payload.text;
            setTyping(false);
            await reveal(content);
          }
        }
      }
    } catch {
      updateActive(conversationId, [...history, { ...pending, content: content || replyError, error: !content }]);
      setTyping(false);
      return;
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
    const history = [...active.messages.filter((message) => !message.error), userMessage];
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
    const previousUser = [...history].reverse().find((message) => message.role === "user");
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
    setConversations((current) =>
      current.map((item) =>
        item.id === active.id
          ? {
              ...item,
              serverId: undefined,
              title: "New conversation",
              messages: starter[0]?.messages ?? [],
            }
          : item,
      ),
    );
    inputRef.current?.focus();
  }

  function startNew() {
    const next: Conversation = {
      id: createId(),
      title: "New conversation",
      messages: starter[0]?.messages ?? [],
    };
    setConversations((current) => [next, ...current]);
    setActiveId(next.id);
    setHistoryOpen(false);
    setShortcutsOpen(false);
    trackAnalytics("chat_started");
    inputRef.current?.focus();
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

  async function copyAnswer(message: ChatMessage) {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="bg-background text-foreground flex h-dvh">
      {historyOpen ? (
        <button
          type="button"
          aria-label="Close conversation history"
          className="bg-foreground/40 fixed inset-0 z-30 lg:hidden"
          onClick={() => setHistoryOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-40 flex w-[min(100%,18rem)] flex-col border-r p-4 shadow-xl transition-transform lg:static lg:w-72 lg:translate-x-0 lg:shadow-none",
          historyOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <Link href="/" aria-label="Infozub home">
            <BrandLogo className="h-8" />
          </Link>
          <Button variant="outline" size="icon" aria-label="New conversation" onClick={startNew}>
            <Plus />
          </Button>
        </div>
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-[0.16em] uppercase">
          Conversations
        </p>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto" role="list">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              role="listitem"
              onClick={() => {
                setActiveId(conversation.id);
                setHistoryOpen(false);
              }}
              className={cn(
                "focus-visible:ring-ring rounded-xl px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                conversation.id === active?.id ? "bg-muted font-medium" : "hover:bg-muted/70",
              )}
            >
              {conversation.title}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 hidden text-xs lg:block">Ctrl or ⌘ K starts a new chat</p>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/90 supports-[backdrop-filter]:bg-background/75 flex h-16 items-center justify-between border-b px-3 backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open conversation history"
              aria-expanded={historyOpen}
              onClick={() => setHistoryOpen(true)}
            >
              <Menu />
            </Button>
            <div className="min-w-0">
              <p className="font-display truncate text-lg leading-none tracking-tight">Infozub AI Assistant</p>
              <p className="text-muted-foreground mt-1 truncate text-xs">Answers from published course knowledge</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={clearConversation} disabled={typing} aria-label="Clear conversation">
              <Trash2 />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Keyboard shortcuts" onClick={() => setShortcutsOpen(true)}>
              ?
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div
          ref={scroller}
          className="flex-1 overflow-y-auto px-3 py-6 sm:px-8"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          onScroll={(event) => {
            const node = event.currentTarget;
            stickToBottom.current = node.scrollHeight - node.scrollTop - node.clientHeight < 96;
          }}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {!hasUserMessage ? (
              <div className="message-enter px-1 py-8 text-center sm:py-16">
                <BrandLogo className="mx-auto h-12" />
                <p className="text-primary mt-4 text-xs font-semibold tracking-[0.18em] uppercase">Infozub course assistant</p>
                <h1 className="font-display mt-3 text-3xl tracking-tight text-balance sm:text-5xl">
                  Ask about a course
                </h1>
                <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm leading-6 sm:text-base">
                  Duration, curriculum, price, and enrollment come from the academy catalog. If it is not stored, I will say so.
                </p>
              </div>
            ) : null}
            {active?.messages.map((message) => {
              if (message.id === "intro") {
                return null;
              }
              const isUser = message.role === "user";
              return (
                <div key={message.id} className={cn("message-enter flex", isUser ? "justify-end" : "justify-start")}>
                  <article
                    className={cn(
                      "max-w-[92%] rounded-3xl px-4 py-3 text-[15px] leading-7 sm:max-w-[78%]",
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-lg shadow-md"
                        : "border-border bg-card text-card-foreground rounded-bl-lg border shadow-sm",
                      message.error ? "border-destructive/50" : "",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={cn("mt-2 text-[11px]", isUser ? "text-primary-foreground/75" : "text-muted-foreground")}>
                      <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
                    </p>
                    {message.role === "assistant" ? (
                      <div className="mt-3 grid gap-3">
                        {message.error ? (
                          <p className="text-destructive text-sm" role="alert">
                            The reply did not finish. You can try the same question again.
                          </p>
                        ) : null}
                        {message.fallback && contactUrl ? (
                          <a
                            href={contactUrl}
                            onClick={() => trackAnalytics("contact_clicked")}
                            className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
                          >
                            Contact Us
                          </a>
                        ) : null}
                        {message.sources && message.sources.length > 0 ? (
                          <div className="grid gap-2">
                            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Source</p>
                            {message.sources.map((source) => (
                              <a
                                key={source.url}
                                href={source.url}
                                onClick={() => trackAnalytics("course_clicked", source.title)}
                                className="border-border bg-background hover:border-primary/50 focus-visible:ring-ring group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                              >
                                <span className="font-medium">{source.title}</span>
                                <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold whitespace-nowrap">
                                  View Course
                                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </a>
                            ))}
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-1">
                          <Button type="button" variant="ghost" size="sm" onClick={() => void copyAnswer(message)} aria-label="Copy answer">
                            {copiedId === message.id ? <Check /> : <Copy />}
                            {copiedId === message.id ? "Copied" : "Copy"}
                          </Button>
                          {message.id === active?.messages.at(-1)?.id ? (
                            <Button type="button" variant="ghost" size="sm" onClick={() => void regenerate()} disabled={typing}>
                              <RefreshCw />
                              Regenerate
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </article>
                </div>
              );
            })}
            {typing ? (
              <div className="border-border bg-card text-muted-foreground mr-auto flex items-center gap-3 rounded-3xl rounded-bl-lg border px-4 py-3 text-sm shadow-sm" role="status">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.2s]" />
                  <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.1s]" />
                  <span className="bg-primary size-2 animate-bounce rounded-full" />
                </span>
                Looking through course knowledge
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-border bg-background border-t px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={typing}
                  className="border-border bg-card hover:bg-muted focus-visible:ring-ring shrink-0 rounded-full border px-3 py-2 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                  onClick={() => void send(question)}
                >
                  {question}
                </button>
              ))}
            </div>
            <form
              className="border-border bg-card focus-within:ring-ring flex items-end gap-2 rounded-2xl border p-2 shadow-sm focus-within:ring-2"
              onSubmit={(event) => {
                event.preventDefault();
                void send(draft);
              }}
            >
              <label className="sr-only" htmlFor="chat-input">
                Ask about Infozub courses
              </label>
              <textarea
                ref={inputRef}
                id="chat-input"
                rows={1}
                value={draft}
                placeholder="Ask about Infozub courses"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(draft);
                  }
                }}
                className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-6 outline-none"
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={typing || draft.trim().length === 0}>
                <Send />
              </Button>
            </form>
            <p className="text-muted-foreground mt-2 text-center text-[11px]">Enter sends. Shift Enter adds a line.</p>
          </div>
        </div>
      </section>

      {shortcutsOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="shortcut-title">
          <button type="button" className="bg-foreground/40 absolute inset-0" aria-label="Close keyboard shortcuts" onClick={() => setShortcutsOpen(false)} />
          <div className="bg-card border-border relative w-full max-w-md rounded-2xl border p-5 shadow-xl">
            <h2 id="shortcut-title" className="font-display text-2xl tracking-tight">
              Keyboard shortcuts
            </h2>
            <ul className="mt-4 grid gap-2 text-sm">
              <li className="flex justify-between gap-4"><span>Send</span><kbd>Enter</kbd></li>
              <li className="flex justify-between gap-4"><span>New line</span><kbd>Shift Enter</kbd></li>
              <li className="flex justify-between gap-4"><span>New conversation</span><kbd>Ctrl or ⌘ K</kbd></li>
              <li className="flex justify-between gap-4"><span>Focus the question box</span><kbd>/</kbd></li>
              <li className="flex justify-between gap-4"><span>Close panels</span><kbd>Esc</kbd></li>
            </ul>
            <Button className="mt-5" type="button" onClick={() => setShortcutsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
