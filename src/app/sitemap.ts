import type { MetadataRoute } from "next";
import { availableCourses } from "@/lib/courses";

/** Set NEXT_PUBLIC_SITE_URL at build time to get absolute URLs. */
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/courses", "/roadmap", "/privacy"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const courseRoutes = availableCourses().flatMap((course) => [
    { url: `${BASE}/${course.slug}`, changeFrequency: "weekly" as const, priority: 0.9 },
    ...course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        url: `${BASE}/${course.slug}/${lesson.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
  ]);

  return [...staticRoutes, ...courseRoutes];
}
