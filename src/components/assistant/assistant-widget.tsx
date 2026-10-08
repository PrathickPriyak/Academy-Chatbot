"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Minimize2, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading-dots";
import { suggestionPrompts, welcomeMessage } from "@/lib/chat/prompts";
import { duration, easeOutPremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  contactSuggested?: boolean;
  contactCtaLabel?: string;
  sources?: Array<{ title: string; href?: string }>;
};

type ApiReply = {
  answer: string;
  contactSuggested?: boolean;
  contactCtaLabel?: string;
  sources?: Array<{ title: string; href?: string }>;
  error?: string;
};

export function AssistantWidget() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const inputId = `${panelId}-input`;
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: welcomeMessage },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelOpen = open && !minimized;
  const onCourseDetail = /^\/courses\/[^/]+$/.test(pathname);

  const closePanel = useCallback(() => {
    setOpen(false);
    setMinimized(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const minimizePanel = useCallback(() => {
    setMinimized(true);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, loading, open, reduceMotion]);

  useEffect(() => {
    const sync = () => setOverlayOpen(document.body.classList.contains("chrome-overlay-open"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setOpen(false);
    setMinimized(false);
  }, [pathname]);

  useEffect(() => {
    if (!panelOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [panelOpen, closePanel]);

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
      const data = (await response.json()) as ApiReply;
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          contactSuggested: data.contactSuggested,
          contactCtaLabel: data.contactCtaLabel,
          sources: data.sources,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  if (pathname === "/chat" || overlayOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-3 sm:p-5",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        onCourseDetail && "max-lg:pb-[calc(4.85rem+env(safe-area-inset-bottom))]",
      )}
    >
      <div className="pointer-events-auto flex w-full max-w-[min(100%,24rem)] flex-col items-end gap-3 sm:w-auto">
        <AnimatePresence>
          {panelOpen ? (
            <motion.section
              id={panelId}
              role="dialog"
              aria-label="Infozub Academy Assistant"
              aria-modal="false"
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: duration.base, ease: easeOutPremium }}
              className={cn(
                "border-border bg-card flex w-full flex-col overflow-hidden rounded-3xl border shadow-hero",
                onCourseDetail
                  ? "h-[min(30rem,calc(100dvh-12.5rem))]"
                  : "h-[min(32rem,calc(100dvh-9.5rem))]",
              )}
            >
              <header className="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Academy Assistant</p>
                  <p className="text-muted-foreground truncate text-xs">Grounded in published Infozub content</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Minimize chat"
                    className="size-11"
                    onClick={minimizePanel}
                  >
                    <Minimize2 aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close chat"
                    className="size-11"
                    onClick={closePanel}
                  >
                    <X aria-hidden />
                  </Button>
                </div>
              </header>

              <div
                ref={listRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-busy={loading}
                aria-label="Chat messages"
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: duration.fast, ease: easeOutPremium }}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      <p className="sr-only">{message.role === "user" ? "You said:" : "Assistant said:"}</p>
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
                  </motion.div>
                ))}
                {loading ? (
                  <p className="text-muted-foreground flex items-center gap-2 text-sm" role="status">
                    Assistant is typing
                    <LoadingDots label="Assistant is typing" />
                  </p>
                ) : null}
                {error ? (
                  <motion.p
                    className="text-destructive text-sm"
                    role="alert"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.p>
                ) : null}
              </div>

              {messages.length <= 1 ? (
                <div
                  className="border-border flex max-h-28 flex-wrap gap-2 overflow-y-auto border-t px-4 py-3"
                  role="group"
                  aria-label="Suggested questions"
                >
                  {suggestionPrompts.map((prompt, index) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      className="border-border hover:bg-muted inline-flex min-h-11 items-center rounded-full border px-3.5 py-2 text-left text-xs font-medium transition-colors"
                      onClick={() => void ask(prompt)}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: duration.fast, ease: easeOutPremium }}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="border-border flex items-end gap-2 border-t p-3">
                <label htmlFor={inputId} className="sr-only">
                  Message the assistant
                </label>
                <textarea
                  ref={inputRef}
                  id={inputId}
                  value={input}
                  rows={2}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about courses, pricing, contact…"
                  aria-describedby={`${panelId}-hint`}
                  className="border-border bg-background focus-visible:ring-ring max-h-28 min-h-11 flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none focus-visible:ring-2"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void ask(input);
                    }
                  }}
                />
                <p id={`${panelId}-hint`} className="sr-only">
                  Press Enter to send. Shift Enter for a new line. Escape closes the chat.
                </p>
                <Button type="submit" size="icon" aria-label="Send message" disabled={loading || !input.trim()}>
                  <Send aria-hidden />
                </Button>
              </form>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={reduceMotion ? undefined : { scale: panelOpen ? 0.98 : 1 }}
          transition={{ duration: duration.fast, ease: easeOutPremium }}
          className="shrink-0"
        >
          <Button
            ref={launcherRef}
            type="button"
            size="lg"
            className="min-h-12 rounded-full shadow-hero"
            aria-expanded={panelOpen}
            aria-controls={panelId}
            aria-haspopup="dialog"
            onClick={() => {
              if (open && minimized) {
                setMinimized(false);
                return;
              }
              if (panelOpen) {
                closePanel();
                return;
              }
              setOpen(true);
              setMinimized(false);
            }}
          >
            <MessageCircle aria-hidden />
            <span className="max-w-[10rem] truncate sm:max-w-none">
              {panelOpen ? "Close chat" : minimized ? "Open chat" : "Ask Infozub"}
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
