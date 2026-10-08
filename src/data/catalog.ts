import catalogJson from "@/data/infozub-catalog.json";

export type CatalogCategory = (typeof catalogJson.categories)[number];
export type CatalogCourse = (typeof catalogJson.courses)[number];
export type CatalogModule = CatalogCourse["modules"][number];
export type PlatformKnowledge = (typeof catalogJson.platform)[number];

export const catalog = catalogJson;

export function listPlatformKnowledge(): PlatformKnowledge[] {
  return catalog.platform;
}

export function listCategories(): CatalogCategory[] {
  return catalog.categories;
}

export function listCourses(): CatalogCourse[] {
  return [...catalog.courses].sort((a, b) => a.title.localeCompare(b.title));
}

export function getCourseBySlug(slug: string): CatalogCourse | undefined {
  return catalog.courses.find((course) => course.slug === slug);
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return catalog.categories.find((category) => category.slug === slug);
}

export function categoryNameForCourse(course: CatalogCourse): string {
  return getCategoryBySlug(course.category)?.name ?? course.category;
}

export function formatCoursePrice(course: CatalogCourse): string {
  if (course.price > 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(course.price);
  }
  return "See course page";
}

export function levelLabel(level: string): string {
  if (level === "BEGINNER") return "Beginner";
  if (level === "INTERMEDIATE") return "Intermediate";
  if (level === "ADVANCED") return "Advanced";
  return level;
}

export type SearchHit =
  | { kind: "course"; course: CatalogCourse; label: string; href: string }
  | { kind: "category"; category: CatalogCategory; label: string; href: string };

export function searchCatalog(query: string, limit = 8): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const courseHits: SearchHit[] = listCourses()
    .filter((course) => {
      const haystack = [
        course.title,
        course.shortDescription,
        course.description,
        categoryNameForCourse(course),
        catalog.instructor.name,
        ...course.modules.map((module) => `${module.title} ${module.description}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, limit)
    .map((course) => ({
      kind: "course" as const,
      course,
      label: course.title,
      href: `/courses/${course.slug}`,
    }));

  const categoryHits: SearchHit[] = listCategories()
    .filter((category) => {
      const haystack = `${category.name} ${category.description}`.toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 4)
    .map((category) => ({
      kind: "category" as const,
      category,
      label: category.name,
      href: `/courses?category=${category.slug}`,
    }));

  return [...categoryHits, ...courseHits].slice(0, limit);
}

export type CourseSort = "title" | "price-asc" | "price-desc";

export function filterCourses(options: {
  query?: string;
  category?: string;
  level?: string;
  sort?: CourseSort;
}): CatalogCourse[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  let results = listCourses().filter((course) => {
    if (options.category && options.category !== "all" && course.category !== options.category) {
      return false;
    }
    if (options.level && options.level !== "all" && course.level !== options.level) {
      return false;
    }
    if (!query) return true;
    const haystack = [
      course.title,
      course.shortDescription,
      categoryNameForCourse(course),
      catalog.instructor.name,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  if (options.sort === "price-asc") {
    results = [...results].sort((a, b) => a.price - b.price || a.title.localeCompare(b.title));
  } else if (options.sort === "price-desc") {
    results = [...results].sort((a, b) => b.price - a.price || a.title.localeCompare(b.title));
  }

  return results;
}
