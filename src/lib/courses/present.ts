import type { CourseLevel } from "@prisma/client";

export function levelLabel(level: CourseLevel): string {
  if (level === "BEGINNER") return "Beginner";
  if (level === "INTERMEDIATE") return "Intermediate";
  return "Advanced";
}

export function formatPrice(price: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export const courseInclude = {
  category: true,
  instructor: true,
  features: { orderBy: { createdAt: "asc" as const } },
  resources: { orderBy: { createdAt: "asc" as const } },
  faqs: { orderBy: { position: "asc" as const } },
  modules: {
    orderBy: { position: "asc" as const },
    include: { lessons: { orderBy: { position: "asc" as const } } },
  },
};
