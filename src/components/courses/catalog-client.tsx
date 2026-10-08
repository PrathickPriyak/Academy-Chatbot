"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from "react";

import { CourseCard } from "@/components/courses/course-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HoverMedia } from "@/components/ui/hover-media";
import { Input } from "@/components/ui/input";
import { LoadingDots } from "@/components/ui/loading-dots";
import {
  catalog,
  countActiveFilters,
  filterCourses,
  listCategories,
  listCourses,
  listDurations,
  listInstructors,
  listLevels,
  type CourseSort,
  type PriceFilter,
} from "@/data/catalog";
import { useChromeOverlayLock } from "@/hooks/use-chrome-overlay-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { duration as motionDuration, easeOutPremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

const sorts: { value: CourseSort; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "title", label: "Title A–Z" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "modules", label: "Most modules" },
];

export function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterSheetRef = useRef<HTMLDivElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);
  const filtersTitleId = useId();
  useChromeOverlayLock(filtersOpen);

  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  useFocusTrap(filtersOpen, filterSheetRef, {
    onEscape: closeFilters,
    initialFocusRef: filterCloseRef,
  });

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const level = searchParams.get("level") ?? "all";
  const price = (searchParams.get("price") as PriceFilter | null) ?? "all";
  const durationFilter = searchParams.get("duration") ?? "all";
  const instructor = searchParams.get("instructor") ?? "all";
  const sort = (searchParams.get("sort") as CourseSort | null) ?? "popular";

  const [searchDraft, setSearchDraft] = useState(query);

  useEffect(() => {
    setSearchDraft(query);
  }, [query]);

  const categories = listCategories();
  const levels = listLevels();
  const durations = listDurations();
  const instructors = listInstructors();

  const courses = useMemo(
    () =>
      filterCourses({
        query,
        category,
        level,
        price,
        duration: durationFilter,
        instructor,
        sort,
      }),
    [query, category, level, price, durationFilter, instructor, sort],
  );

  const activeFilterCount = countActiveFilters({
    query,
    category,
    level,
    price,
    duration: durationFilter,
    instructor,
  });

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "popular")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function resetFilters() {
    setSearchDraft("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
    setFiltersOpen(false);
  }

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  const filterPanelProps = {
    category,
    level,
    price,
    durationFilter,
    instructor,
    sort,
    categories,
    levels,
    durations,
    instructors,
    updateParams,
    resetFilters,
    reduceMotion: !!reduceMotion,
  };

  const mosaic = listCourses().slice(0, 4);

  return (
    <Section spacing="md">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">Catalog</p>
            <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-[3.25rem]">Courses</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
              Browse all {catalog.courses.length} published Infozub Digital Academy courses. Search by name, category,
              instructor, skill, or topic — then open a course for modules and enrollment.
            </p>
            <p className="text-muted-foreground mt-4 flex items-center gap-2 text-sm font-medium" aria-live="polite">
              {pending ? (
                <>
                  Updating
                  <LoadingDots label="Updating results" />
                </>
              ) : (
                `${courses.length} course${courses.length === 1 ? "" : "s"}`
              )}
            </p>
          </div>
          <div className="hidden gap-2 sm:grid sm:grid-cols-2" aria-hidden>
            {mosaic.map((course, index) => (
              <motion.div
                key={course.slug}
                className="overflow-hidden rounded-2xl ring-1 ring-border/70"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : motionDuration.base,
                  delay: reduceMotion ? 0 : index * 0.05,
                  ease: easeOutPremium,
                }}
              >
                <HoverMedia
                  src={course.thumbnail}
                  alt=""
                  fill
                  sizes="220px"
                  className="aspect-[16/10]"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div id="categories" className="scroll-mt-28">
        <div className="relative mt-8 lg:hidden">
          <div
            role="group"
            aria-label="Filter by category"
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <FilterChip
              active={category === "all"}
              onClick={() => updateParams({ category: "all" })}
              label="All"
              reduceMotion={!!reduceMotion}
            />
            {categories.map((item) => (
              <FilterChip
                key={item.slug}
                active={category === item.slug}
                onClick={() => updateParams({ category: item.slug })}
                label={item.name}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </div>
          <div
            aria-hidden
            className="from-background pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent sm:hidden"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row">
          <form
            className="relative flex-1"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              updateParams({ q: searchDraft.trim() || null });
            }}
          >
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              name="q"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search courses, skills and topics..."
              aria-label="Search courses"
              className="pl-10"
            />
          </form>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="catalog-sort-top">
              Sort courses
            </label>
            <select
              id="catalog-sort-top"
              className="border-border bg-card focus-visible:ring-ring hidden h-11 min-w-48 rounded-xl border px-3 text-sm outline-none focus-visible:ring-2 md:block"
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value })}
            >
              {sorts.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              aria-expanded={filtersOpen}
              aria-controls="catalog-filters-dialog"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter aria-hidden />
              Filters
              {activeFilterCount > 0 ? (
                <span className="bg-primary text-primary-foreground ml-1 inline-flex size-5 items-center justify-center rounded-full text-[11px]">
                  <span className="sr-only">{activeFilterCount} active, </span>
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Active</span>
            {query ? (
              <ActiveChip label={`Search: ${query}`} onClear={() => updateParams({ q: null })} />
            ) : null}
            {category !== "all" ? (
              <ActiveChip
                label={categories.find((item) => item.slug === category)?.name ?? category}
                onClear={() => updateParams({ category: "all" })}
              />
            ) : null}
            {level !== "all" ? (
              <ActiveChip
                label={level.charAt(0) + level.slice(1).toLowerCase()}
                onClear={() => updateParams({ level: "all" })}
              />
            ) : null}
            {price !== "all" ? (
              <ActiveChip
                label={price === "priced" ? "Published price" : "See course page"}
                onClear={() => updateParams({ price: "all" })}
              />
            ) : null}
            {durationFilter !== "all" ? (
              <ActiveChip label={durationFilter} onClear={() => updateParams({ duration: "all" })} />
            ) : null}
            {instructor !== "all" ? (
              <ActiveChip label={instructor} onClear={() => updateParams({ instructor: "all" })} />
            ) : null}
            <button
              type="button"
              className="text-primary inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside className="bg-card sticky top-24 hidden h-fit rounded-[1.35rem] p-5 ring-1 ring-border/80 shadow-[0_1px_2px_rgb(11_31_42/0.04),0_10px_28px_rgb(11_31_42/0.05)] lg:block">
            <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase">Filters</h2>
            <FilterPanel {...filterPanelProps} sortId="catalog-sort-desktop" />
          </aside>

          <div>
            {courses.length === 0 ? (
              <EmptyState
                title="No courses found for your search."
                description="Try another keyword, clear filters, or browse the full catalog."
                action={
                  <Button type="button" onClick={resetFilters}>
                    Reset filters
                  </Button>
                }
              />
            ) : (
              <div className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-3", pending && "opacity-80")}>
                {courses.map((course, index) => (
                  <motion.div
                    key={course.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: motionDuration.fast,
                      ease: easeOutPremium,
                      delay: Math.min(index, 8) * 0.02,
                    }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            )}

            <p className="text-muted-foreground mt-8 text-sm">
              Looking for help choosing a program?{" "}
              <Link href="/chat" className="text-primary font-semibold underline-offset-4 hover:underline">
                Ask the Academy Assistant
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-primary font-semibold underline-offset-4 hover:underline">
                contact Infozub
              </Link>
              .
            </p>
          </div>
        </div>
        </div>
      </Container>

      <AnimatePresence>
        {filtersOpen ? (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="bg-foreground/40 absolute inset-0 backdrop-blur-[2px]"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              onClick={closeFilters}
            />
            <motion.div
              ref={filterSheetRef}
              id="catalog-filters-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={filtersTitleId}
              className="border-border bg-card absolute inset-x-0 bottom-0 max-h-[min(85vh,100dvh)] overflow-y-auto rounded-t-3xl border-t p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-hero"
              initial={reduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: "100%" }}
              transition={{ duration: motionDuration.base, ease: easeOutPremium }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 id={filtersTitleId} className="text-lg font-semibold">
                  Filters & sort
                </h2>
                <Button
                  ref={filterCloseRef}
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close filters"
                  onClick={closeFilters}
                >
                  <X aria-hidden />
                </Button>
              </div>
              <FilterPanel {...filterPanelProps} sortId="catalog-sort-mobile" />
              <Button type="button" className="mt-2 w-full" onClick={closeFilters}>
                Show {courses.length} course{courses.length === 1 ? "" : "s"}
              </Button>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}

function FilterPanel({
  category,
  level,
  price,
  durationFilter,
  instructor,
  sort,
  categories,
  levels,
  durations,
  instructors,
  updateParams,
  resetFilters,
  reduceMotion,
  sortId,
}: {
  category: string;
  level: string;
  price: PriceFilter;
  durationFilter: string;
  instructor: string;
  sort: CourseSort;
  categories: ReturnType<typeof listCategories>;
  levels: ReturnType<typeof listLevels>;
  durations: ReturnType<typeof listDurations>;
  instructors: ReturnType<typeof listInstructors>;
  updateParams: (next: Record<string, string | null>) => void;
  resetFilters: () => void;
  reduceMotion: boolean;
  sortId: string;
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-foreground mb-2 text-sm font-semibold">Category</legend>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={category === "all"}
            onClick={() => updateParams({ category: "all" })}
            label="All"
            reduceMotion={reduceMotion}
          />
          {categories.map((item) => (
            <FilterChip
              key={item.slug}
              active={category === item.slug}
              onClick={() => updateParams({ category: item.slug })}
              label={item.name}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-foreground mb-2 text-sm font-semibold">Level</legend>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={level === "all"}
            onClick={() => updateParams({ level: "all" })}
            label="All levels"
            reduceMotion={reduceMotion}
          />
          {levels.map((value) => (
            <FilterChip
              key={value}
              active={level === value}
              onClick={() => updateParams({ level: value })}
              label={value.charAt(0) + value.slice(1).toLowerCase()}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-foreground mb-2 text-sm font-semibold">Price</legend>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={price === "all"}
            onClick={() => updateParams({ price: "all" })}
            label="All"
            reduceMotion={reduceMotion}
          />
          <FilterChip
            active={price === "priced"}
            onClick={() => updateParams({ price: "priced" })}
            label="Published price"
            reduceMotion={reduceMotion}
          />
          <FilterChip
            active={price === "request"}
            onClick={() => updateParams({ price: "request" })}
            label="See course page"
            reduceMotion={reduceMotion}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-foreground mb-2 text-sm font-semibold">Duration</legend>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={durationFilter === "all"}
            onClick={() => updateParams({ duration: "all" })}
            label="All"
            reduceMotion={reduceMotion}
          />
          {durations.map((value) => (
            <FilterChip
              key={value}
              active={durationFilter === value}
              onClick={() => updateParams({ duration: value })}
              label={value}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-foreground mb-2 text-sm font-semibold">Instructor</legend>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={instructor === "all"}
            onClick={() => updateParams({ instructor: "all" })}
            label="All"
            reduceMotion={reduceMotion}
          />
          {instructors.map((name) => (
            <FilterChip
              key={name}
              active={instructor === name}
              onClick={() => updateParams({ instructor: name })}
              label={name}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={sortId} className="text-foreground mb-2 block text-sm font-semibold">
          Sort
        </label>
        <select
          id={sortId}
          className="border-border bg-card focus-visible:ring-ring h-11 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-2"
          value={sort}
          onChange={(event) => updateParams({ sort: event.target.value })}
        >
          {sorts.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          Rating and newest sorts are unavailable — those fields are not published in the catalog. Popular ranks
          published-price courses first, then curriculum depth.
        </p>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={resetFilters}>
        Reset filters
      </Button>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  reduceMotion,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  reduceMotion: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className={cn(
        "relative inline-flex min-h-11 shrink-0 items-center rounded-xl px-3.5 text-sm font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "bg-secondary/80 text-foreground hover:bg-secondary",
      )}
    >
      {label}
    </motion.button>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="border-border/80 bg-card inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold"
    >
      <span className="max-w-[14rem] truncate">{label}</span>
      <X className="size-3.5" aria-hidden />
      <span className="sr-only">Remove {label}</span>
    </button>
  );
}
