"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, FolderOpen, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";

import { searchCatalog, type SearchHit } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function CourseSearch({
  className,
  autoFocus = false,
  onNavigate,
  size = "default",
}: {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hits = useMemo(() => searchCatalog(query, 8), [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      go("/courses");
      return;
    }
    if (hits[activeIndex]) {
      go(hits[activeIndex].href);
      return;
    }
    go(`/courses?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={onSubmit}
        className={cn(
          "border-border bg-card focus-within:ring-ring flex items-center gap-2 rounded-2xl border shadow-soft transition-shadow focus-within:ring-2",
          size === "lg" ? "h-14 px-4" : "h-11 px-3",
        )}
      >
        <Search className="text-muted-foreground size-4 shrink-0" aria-hidden />
        <label className="sr-only" htmlFor={`course-search-${listId}`}>
          Search courses, skills and topics
        </label>
        <input
          id={`course-search-${listId}`}
          ref={inputRef}
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && hits.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={hits[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          placeholder="Search courses, skills and topics..."
          className="placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(event) => {
            if (!hits.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => (index + 1) % hits.length);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => (index - 1 + hits.length) % hits.length);
            }
            if (event.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
        />
        {query ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground rounded-lg p-1"
            aria-label="Clear search"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </form>

      <AnimatePresence>
        {open && query.trim() ? (
          <motion.div
            id={listId}
            role="listbox"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="border-border bg-card absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 overflow-hidden rounded-2xl border shadow-lift"
          >
            {hits.length === 0 ? (
              <p className="text-muted-foreground px-4 py-4 text-sm">
                No courses or categories match “{query.trim()}”. Try another skill or browse all courses.
              </p>
            ) : (
              <ul className="max-h-80 overflow-auto py-1">
                {hits.map((hit, index) => (
                  <SuggestionRow
                    key={`${hit.kind}-${hit.label}`}
                    id={`${listId}-${index}`}
                    hit={hit}
                    active={index === activeIndex}
                    onSelect={() => go(hit.href)}
                  />
                ))}
              </ul>
            )}
            <div className="border-border border-t px-3 py-2">
              <Link
                href={query.trim() ? `/courses?q=${encodeURIComponent(query.trim())}` : "/courses"}
                className="text-primary hover:bg-muted block rounded-lg px-2 py-2 text-sm font-semibold"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                View all results in Courses
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SuggestionRow({
  hit,
  active,
  onSelect,
  id,
}: {
  hit: SearchHit;
  active: boolean;
  onSelect: () => void;
  id: string;
}) {
  const Icon = hit.kind === "category" ? FolderOpen : BookOpen;
  return (
    <li role="option" id={id} aria-selected={active}>
      <button
        type="button"
        className={cn(
          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
          active ? "bg-muted" : "hover:bg-muted/70",
        )}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onSelect}
      >
        <Icon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{hit.label}</span>
          <span className="text-muted-foreground block truncate text-xs">
            {hit.kind === "category" ? "Category" : hit.course.shortDescription}
          </span>
        </span>
      </button>
    </li>
  );
}
