import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseProgressPanel } from "@/components/CourseProgressPanel";
import { availableCourses, courseStats, getCourse } from "@/lib/courses";

type Params = { params: Promise<{ course: string }> };

export function generateStaticParams() {
  return availableCourses().map((course) => ({ course: course.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  const stats = courseStats(course);
  return {
    title: `${course.title} tutorial — ${stats.lessons} free lessons`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: Params) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course || course.status !== "available") notFound();

  const stats = courseStats(course);
  const hours = Math.round(stats.minutes / 60);
  const allLessons = course.modules.flatMap((module) => module.lessons);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
      {/* Header --------------------------------------------------------- */}
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <header>
          <nav className="flex items-center gap-2 text-xs text-muted">
            <Link href="/courses" className="hover:text-fg">
              Courses
            </Link>
            <span>/</span>
            <span className="text-fg-soft">{course.title}</span>
          </nav>

          <div className="mt-5 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface text-2xl">
              {course.icon}
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                {course.title}
              </h1>
              <p className="text-sm text-muted">{course.tagline}</p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {course.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-xs">
            <Chip>{stats.lessons} lessons</Chip>
            <Chip>{stats.modules} modules</Chip>
            <Chip>~{hours} hours</Chip>
            <Chip>{stats.exercises} exercises</Chip>
            <Chip>{course.level}</Chip>
          </div>
        </header>

        <aside className="lg:pt-12">
          <CourseProgressPanel
            courseSlug={course.slug}
            lessons={allLessons.map((lesson) => ({
              slug: lesson.slug,
              title: lesson.title,
            }))}
          />
        </aside>
      </div>

      {/* Syllabus -------------------------------------------------------- */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          Course contents
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Work through it top to bottom, or jump straight to what you need.
        </p>

        <div className="mt-8 space-y-4">
          {course.modules.map((module, moduleIndex) => (
            <section
              key={module.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="border-b border-line bg-surface-2/60 px-5 py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-sm text-accent">
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold text-fg">
                    {module.title}
                  </h3>
                  <span className="ml-auto text-xs text-muted">
                    {module.lessons.length} lessons
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted">{module.description}</p>
              </div>

              <ul className="divide-y divide-[var(--line)]">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/${course.slug}/${lesson.slug}`}
                      className="group flex items-center gap-4 px-5 py-3 transition hover:bg-surface-2"
                    >
                      <span className="w-6 shrink-0 font-mono text-xs text-muted">
                        {moduleIndex + 1}.{lessonIndex + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-fg group-hover:text-accent">
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {lesson.summary}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-xs text-muted sm:block">
                        {lesson.minutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface px-3 py-1 text-muted">
      {children}
    </span>
  );
}
