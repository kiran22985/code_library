import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[700px] flex-col items-center px-4 py-28 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
        This page has not been written yet
      </h1>
      <p className="mt-4 text-muted">
        The lesson or course you are looking for does not exist. Try the Python
        syllabus, or search with{" "}
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs">
          ⌘K
        </kbd>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/python"
          className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
        >
          Python course
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-line px-5 py-3 text-sm font-medium text-fg-soft transition hover:border-line-strong hover:text-fg"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
