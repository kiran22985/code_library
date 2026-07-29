import type { Metadata } from "next";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "All courses",
  description:
    "Every course in the CodeLibrary: the complete Python tutorial, with FastAPI, Django, JavaScript, React and SQL on the way.",
};

export default function CoursesPage() {
  const live = courses.filter((course) => course.status === "available");
  const soon = courses.filter((course) => course.status === "coming-soon");

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Catalogue
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Courses
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Each course is a full curriculum, not a cheat sheet — ordered modules,
          runnable examples and practice at the end of every lesson.
        </p>
      </header>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg">
          <span className="size-2 rounded-full bg-success" />
          Available now
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
          <span className="size-2 rounded-full bg-line-strong" />
          In production
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {soon.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
