import type { Metadata } from "next";
import Link from "next/link";
import { courses, courseStats } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What is live on CodeLibrary today and which courses are being written next.",
};

const UPCOMING: Record<string, string[]> = {
  fastapi: [
    "Path operations, query and path parameters",
    "Pydantic models, validation and response models",
    "Dependency injection and app structure",
    "Async SQLAlchemy, migrations and testing",
    "Auth with OAuth2 + JWT, and deployment",
  ],
  django: [
    "Projects, apps, settings and URLs",
    "Models, migrations and the ORM",
    "Views, templates and forms",
    "Admin, auth and permissions",
    "REST APIs with Django REST Framework",
  ],
  javascript: [
    "Values, types, scope and functions",
    "Arrays, objects and destructuring",
    "The DOM and events",
    "Closures, prototypes and classes",
    "Promises, async/await and modules",
  ],
  react: [
    "Components, JSX and props",
    "State, effects and refs",
    "Context, reducers and custom hooks",
    "Data fetching and suspense",
    "Performance and testing",
  ],
  sql: [
    "SELECT, filtering and sorting",
    "Joins and set operations",
    "Aggregation and window functions",
    "Indexes and query plans",
    "Schema design and transactions",
  ],
};

export default function RoadmapPage() {
  const live = courses.filter((course) => course.status === "available");
  const soon = courses.filter((course) => course.status === "coming-soon");

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-16 sm:px-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Roadmap
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          What is live, and what is next
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          CodeLibrary is built one complete course at a time. A course only ships
          when it covers its subject end to end — no half-written modules.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-success">
          <span className="size-2 rounded-full bg-success" />
          Shipped
        </h2>
        <div className="mt-4 space-y-3">
          {live.map((course) => {
            const stats = courseStats(course);
            return (
              <Link
                key={course.slug}
                href={`/${course.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-accent-line bg-surface p-5 transition hover:shadow-lg hover:shadow-black/5"
              >
                <span className="text-2xl">{course.icon}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">
                    {course.title}
                  </span>
                  <span className="block text-sm text-muted">
                    {stats.lessons} lessons · {stats.modules} modules · complete
                  </span>
                </span>
                <span className="ml-auto text-sm text-accent">Open →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
          <span className="size-2 rounded-full bg-line-strong" />
          Being written
        </h2>
        <ol className="mt-4 space-y-3">
          {soon.map((course, index) => (
            <li
              key={course.slug}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{course.icon}</span>
                <div>
                  <p className="font-semibold text-fg">{course.title}</p>
                  <p className="text-sm text-muted">{course.tagline}</p>
                </div>
                <span className="ml-auto rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
                  {index === 0 ? "Up next" : `Queued #${index + 1}`}
                </span>
              </div>
              <ul className="mt-4 grid gap-1.5 text-sm text-muted sm:grid-cols-2">
                {(UPCOMING[course.slug] ?? []).map((topic) => (
                  <li key={topic} className="flex gap-2">
                    <span className="text-accent">·</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-bg-soft p-6">
        <h2 className="font-semibold text-fg">Adding a course</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Courses live in <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">src/content/</code>{" "}
          as typed data. Write the lessons, register the course in{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">src/lib/courses.ts</code>, and the
          syllabus page, lesson reader, search index and sitemap all update
          themselves.
        </p>
      </section>
    </div>
  );
}
