import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdSense";
import { CourseSidebar } from "@/components/CourseSidebar";
import { LessonBlocks } from "@/components/LessonBlocks";
import { LessonFooter } from "@/components/LessonFooter";
import { TableOfContents } from "@/components/TableOfContents";
import { AD_SLOTS } from "@/lib/ads";
import { availableCourses, getCourse, getLessonRef, getLessonRefs } from "@/lib/courses";
import { plainText, slugify } from "@/lib/inline";

type Params = { params: Promise<{ course: string; slug: string }> };

export function generateStaticParams() {
  return availableCourses().flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        course: course.slug,
        slug: lesson.slug,
      })),
    ),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course: courseSlug, slug } = await params;
  const course = getCourse(courseSlug);
  const ref = course && getLessonRef(course, slug);
  if (!course || !ref) return {};
  return {
    title: `${ref.lesson.title} — ${course.title}`,
    description: plainText(ref.lesson.summary),
  };
}

export default async function LessonPage({ params }: Params) {
  const { course: courseSlug, slug } = await params;
  const course = getCourse(courseSlug);
  if (!course || course.status !== "available") notFound();

  const ref = getLessonRef(course, slug);
  if (!ref) notFound();

  const { lesson, module, index, prev, next } = ref;
  const total = getLessonRefs(course).length;

  const headings = lesson.blocks
    .filter((block) => block.type === "heading")
    .map((block) => ({
      id: slugify((block as { text: string }).text),
      text: (block as { text: string }).text,
    }));

  return (
    <div className="mx-auto w-full max-w-[1500px] px-0 sm:px-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_220px] lg:gap-10">
      <CourseSidebar
        courseSlug={course.slug}
        modules={course.modules.map((entry) => ({
          id: entry.id,
          title: entry.title,
          lessons: entry.lessons.map((item) => ({
            slug: item.slug,
            title: item.title,
            minutes: item.minutes,
          })),
        }))}
      />

      <article className="min-w-0 px-4 py-10 sm:px-0 lg:py-14">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link href={`/${course.slug}`} className="hover:text-fg">
            {course.title}
          </Link>
          <span>/</span>
          <span>{module.title}</span>
        </nav>

        <header className="mt-4 border-b border-line pb-7">
          <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-[2.35rem] sm:leading-tight">
            {lesson.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {lesson.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span className="rounded-full border border-line px-2.5 py-1">
              Lesson {index + 1} of {total}
            </span>
            <span>{lesson.minutes} min read</span>
          </div>
        </header>

        {/* Mobile "on this page" */}
        {headings.length > 1 && (
          <details className="mt-6 rounded-xl border border-line bg-surface p-4 xl:hidden">
            <summary className="cursor-pointer text-sm font-medium text-fg">
              On this page
            </summary>
            <ul className="mt-3 space-y-1.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="text-sm text-muted hover:text-accent"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        <AdUnit slot={AD_SLOTS.lessonTop} format="horizontal" />

        <div className="mt-2">
          <LessonBlocks blocks={lesson.blocks} />
        </div>

        <AdUnit slot={AD_SLOTS.lessonBottom} format="horizontal" />

        <LessonFooter
          courseSlug={course.slug}
          slug={lesson.slug}
          prev={prev}
          next={next}
        />
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-24 py-14">
          <TableOfContents items={headings} />
        </div>
      </aside>
    </div>
  );
}
