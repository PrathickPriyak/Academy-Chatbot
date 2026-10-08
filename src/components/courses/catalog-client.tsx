"use client";

import { Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { CourseCard } from "@/components/courses/course-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  filterCourses,
  listCategories,
  type CourseSort,
} from "@/data/catalog";
import { cn } from "@/lib/utils";

const sorts: { value: CourseSort | "title"; label: string }[] = [
  { value: "title", label: "Title A–Z" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const level = searchParams.get("level") ?? "all";
  const sort = (searchParams.get("sort") as CourseSort | null) ?? "title";
  const categories = listCategories();

  const courses = useMemo(
    () => filterCourses({ query, category, level, sort }),
    [query, category, level, sort],
  );

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "title")) {
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
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
    setFiltersOpen(false);
  }

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-foreground mb-2 text-sm font-semibold">Category</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={category === "all"}
            onClick={() => updateParams({ category: "all" })}
            label="All"
          />
          {categories.map((item) => (
            <FilterChip
              key={item.slug}
              active={category === item.slug}
              onClick={() => updateParams({ category: item.slug })}
              label={item.name}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-foreground mb-2 text-sm font-semibold">Level</p>
        <div className="flex flex-wrap gap-2">
          {["all", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((value) => (
            <FilterChip
              key={value}
              active={level === value}
              onClick={() => updateParams({ level: value })}
              label={value === "all" ? "All levels" : value.charAt(0) + value.slice(1).toLowerCase()}
            />
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="catalog-sort" className="text-foreground mb-2 block text-sm font-semibold">
          Sort
        </label>
        <select
          id="catalog-sort"
          className="border-border bg-card h-11 w-full rounded-xl border px-3 text-sm"
          value={sort}
          onChange={(event) => updateParams({ sort: event.target.value })}
        >
          {sorts.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={resetFilters}>
        Reset filters
      </Button>
    </div>
  );

  return (
    <Section spacing="md">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Courses</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
              Search and filter the published Infozub Digital Academy catalog. Enrollment continues on the academy and
              LMS sites linked from each course.
            </p>
          </div>
          <p className="text-muted-foreground text-sm font-medium" aria-live="polite">
            {pending ? "Updating…" : `${courses.length} course${courses.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <form
            className="flex-1"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              updateParams({ q: String(form.get("q") ?? "") });
            }}
          >
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search courses, skills and topics..."
              aria-label="Search courses"
            />
          </form>
          <Button
            type="button"
            variant="outline"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter />
            Filters
          </Button>
        </div>

        <div id="categories" className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="border-border bg-card hidden h-fit rounded-2xl border p-5 shadow-soft lg:block">
            <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase">Filters</h2>
            {filterPanel}
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
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="border-border bg-card absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t p-5 shadow-hero">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button type="button" variant="ghost" size="icon" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                <X />
              </Button>
            </div>
            {filterPanel}
          </div>
        </div>
      ) : null}
    </Section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80",
      )}
    >
      {label}
    </button>
  );
}
