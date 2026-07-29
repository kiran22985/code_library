import Link from "next/link";
import { courseStats } from "@/lib/courses";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  const isLive = course.status === "available";
  const stats = courseStats(course);

  return (
    <Link
      href={isLive ? `/${course.slug}` : "/roadmap"}
      className={`group flex flex-col rounded-2xl border p-5 transition ${
        isLive
          ? "border-accent-line bg-surface hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
          : "border-line bg-surface/50 hover:border-line-strong"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl" aria-hidden="true">
          {course.icon}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            isLive ? "bg-success/12 text-success" : "bg-surface-2 text-muted"
          }`}
        >
          {isLive ? "Available" : "Coming soon"}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-fg group-hover:text-accent">
        {course.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {course.description}
      </p>

      <p className="mt-auto border-t border-line pt-3 text-xs text-muted [margin-block-start:1rem]">
        {isLive
          ? `${stats.lessons} lessons · ${stats.modules} modules · ${course.level}`
          : course.level}
      </p>
    </Link>
  );
}
