import type { MetadataRoute } from "next";

import { listCourses } from "@/data/catalog";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/courses", "/about", "/contact", "/chat", "/privacy", "/terms", "/refund"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
    }),
  );

  const courseRoutes = listCourses().map((course) => ({
    url: `${site.url}/courses/${course.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...courseRoutes];
}
