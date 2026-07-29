import { pythonCourse } from "@/content/python";
import { plainText } from "./inline";
import type { Course, Lesson, LessonRef, Module } from "./types";

/**
 * The course registry. Adding a course later (FastAPI, Django, TypeScript…)
 * means writing its content module and appending it here — every page, the
 * search index and the sitemap pick it up automatically.
 */
export const courses: Course[] = [
  pythonCourse,
  {
    slug: "fastapi",
    title: "FastAPI",
    tagline: "Modern Python APIs",
    description:
      "Build production-grade REST APIs with FastAPI: path operations, Pydantic models, dependency injection, async database access, auth and deployment.",
    level: "Intermediate",
    icon: "⚡",
    status: "coming-soon",
    modules: [],
  },
  {
    slug: "django",
    title: "Django",
    tagline: "Batteries-included web apps",
    description:
      "Models, views, templates, the ORM, admin, forms, auth and everything else you need to ship a full-stack Django application.",
    level: "Intermediate",
    icon: "🎸",
    status: "coming-soon",
    modules: [],
  },
  {
    slug: "javascript",
    title: "JavaScript",
    tagline: "The language of the web",
    description:
      "From variables and the DOM to closures, promises, async/await, modules and modern ES2024 features.",
    level: "Beginner to Advanced",
    icon: "🟨",
    status: "coming-soon",
    modules: [],
  },
  {
    slug: "react",
    title: "React",
    tagline: "Component-driven UI",
    description:
      "Components, props, state, hooks, context, data fetching, performance and patterns used in real codebases.",
    level: "Intermediate",
    icon: "⚛️",
    status: "coming-soon",
    modules: [],
  },
  {
    slug: "sql",
    title: "SQL",
    tagline: "Query any database",
    description:
      "SELECT to window functions: joins, aggregation, subqueries, indexes, transactions and schema design.",
    level: "Beginner to Advanced",
    icon: "🗄️",
    status: "coming-soon",
    modules: [],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function availableCourses(): Course[] {
  return courses.filter((course) => course.status === "available");
}

/** Every lesson in course order, with its module and neighbours attached. */
export function getLessonRefs(course: Course): LessonRef[] {
  const flat: { lesson: Lesson; module: Module }[] = course.modules.flatMap(
    (module) => module.lessons.map((lesson) => ({ lesson, module })),
  );

  return flat.map((entry, index) => ({
    ...entry,
    index,
    prev: flat[index - 1]
      ? { slug: flat[index - 1].lesson.slug, title: flat[index - 1].lesson.title }
      : undefined,
    next: flat[index + 1]
      ? { slug: flat[index + 1].lesson.slug, title: flat[index + 1].lesson.title }
      : undefined,
  }));
}

export function getLessonRef(course: Course, slug: string): LessonRef | undefined {
  return getLessonRefs(course).find((ref) => ref.lesson.slug === slug);
}

export function courseStats(course: Course) {
  const lessons = course.modules.flatMap((module) => module.lessons);
  return {
    modules: course.modules.length,
    lessons: lessons.length,
    minutes: lessons.reduce((total, lesson) => total + lesson.minutes, 0),
    exercises: lessons.reduce(
      (total, lesson) =>
        total +
        lesson.blocks.filter((block) => block.type === "exercise").length,
      0,
    ),
  };
}

export interface SearchItem {
  href: string;
  title: string;
  summary: string;
  course: string;
  module: string;
  /** Lower-cased haystack the client matches against. */
  haystack: string;
}

/** Built at build time and shipped to the client search dialog. */
export function buildSearchIndex(): SearchItem[] {
  return availableCourses().flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => {
        const headings = lesson.blocks
          .filter((block) => block.type === "heading")
          .map((block) => (block as { text: string }).text)
          .join(" ");
        return {
          href: `/${course.slug}/${lesson.slug}`,
          title: lesson.title,
          summary: lesson.summary,
          course: course.title,
          module: module.title,
          haystack: plainText(
            `${lesson.title} ${lesson.summary} ${module.title} ${headings} ${course.title}`,
          ).toLowerCase(),
        };
      }),
    ),
  );
}
