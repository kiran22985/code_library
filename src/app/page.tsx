import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { CourseCard } from "@/components/CourseCard";
import { courses, courseStats, getCourse } from "@/lib/courses";

const HERO_SNIPPET = `# Your first steps, straight from lesson one
def greet(name: str) -> str:
    return f"Hello, {name}!"

learners = ["Ada", "Linus", "Guido"]
for person in learners:
    print(greet(person))`;

export default function HomePage() {
  const python = getCourse("python")!;
  const stats = courseStats(python);
  const hours = Math.round(stats.minutes / 60);

  return (
    <>
      {/* Hero ----------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-backdrop pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-rise">
            <Link
              href="/python"
              className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
            >
              <span className="size-1.5 rounded-full bg-accent" />
              New: the complete Python course is live
            </Link>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-[3.4rem]">
              Learn programming
              <span className="block bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                one clear lesson at a time.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              CodeLibrary is a free, structured library of tutorials for
              languages and frameworks. Every lesson is short, every example
              runs, and every module ends with practice.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/python/intro"
                className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-on-accent shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
              >
                Start the Python course
                <ArrowIcon />
              </Link>
              <Link
                href="/courses"
                className="rounded-xl border border-line px-5 py-3 text-sm font-medium text-fg-soft transition hover:border-line-strong hover:text-fg"
              >
                Browse all courses
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              <Stat value={stats.lessons} label="Lessons" />
              <Stat value={stats.modules} label="Modules" />
              <Stat value={`${hours}h`} label="Of material" />
              <Stat value="Free" label="Forever" />
            </div>
          </div>

          <div className="animate-rise lg:pl-4">
            <CodeBlock
              code={HERO_SNIPPET}
              filename="hello.py"
              output={"Hello, Ada!\nHello, Linus!\nHello, Guido!"}
            />
          </div>
        </div>
      </section>

      {/* Why ------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Built the way people actually learn to code
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          No four-hour videos, no paywall, no sign-up. Just a clear path from
          your first line of code to the patterns used in production.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon="🧭"
            title="A real curriculum"
            body="Modules build on each other in a deliberate order, so you always know what to learn next."
          />
          <Feature
            icon="⌨️"
            title="Examples that run"
            body="Every snippet is complete and copy-pasteable, with the expected output shown right below it."
          />
          <Feature
            icon="🧩"
            title="Practice built in"
            body="Exercises with revealable solutions and quick quizzes to check your understanding."
          />
          <Feature
            icon="📈"
            title="Progress that sticks"
            body="Mark lessons complete and pick up exactly where you left off — stored on your device."
          />
        </div>
      </section>

      {/* Courses --------------------------------------------------------- */}
      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                The library
              </h2>
              <p className="mt-2 text-muted">
                One course is complete today. The rest are on the way.
              </p>
            </div>
            <Link href="/courses" className="text-sm font-medium text-accent hover:underline">
              View all →
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Python spotlight ------------------------------------------------ */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Featured course
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Python, from hello world to production
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              {stats.lessons} lessons across {stats.modules} modules covering the
              whole language: syntax, data structures, functions, OOP, errors,
              files, the standard library, typing, concurrency, testing and
              packaging.
            </p>
            <Link
              href="/python"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
            >
              See the full syllabus
              <ArrowIcon />
            </Link>
          </div>

          <ol className="grid gap-2 sm:grid-cols-2">
            {python.modules.map((module, index) => (
              <li
                key={module.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
              >
                <span className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-fg-soft">{module.title}</span>
                <span className="ml-auto text-xs text-muted">
                  {module.lessons.length}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight text-fg">{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold text-fg">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
