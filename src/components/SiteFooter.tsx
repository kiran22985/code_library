import Link from "next/link";
import { courses } from "@/lib/courses";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-soft">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-fg">
            Code<span className="text-accent">Library</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            A free, open learning platform for programming languages and
            frameworks — written for people who learn by building.
          </p>
        </div>

        <FooterColumn title="Learn">
          <FooterLink href="/courses">All courses</FooterLink>
          <FooterLink href="/python">Python tutorial</FooterLink>
          <FooterLink href="/python/intro">Start from zero</FooterLink>
          <FooterLink href="/roadmap">Roadmap</FooterLink>
          <FooterLink href="/privacy">Privacy policy</FooterLink>
        </FooterColumn>

        <FooterColumn title="Courses">
          {courses.slice(0, 5).map((course) => (
            <FooterLink
              key={course.slug}
              href={course.status === "available" ? `/${course.slug}` : "/roadmap"}
            >
              {course.title}
              {course.status === "coming-soon" && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wide text-muted">
                  soon
                </span>
              )}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Reference">
          <FooterLink href="https://docs.python.org/3/" external>
            Python docs
          </FooterLink>
          <FooterLink href="https://peps.python.org/pep-0008/" external>
            PEP 8 style guide
          </FooterLink>
          <FooterLink href="https://pypi.org" external>
            PyPI
          </FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} CodeLibrary. Built for learners.</p>
          <p className="sm:ml-auto">
            Code samples target Python 3.12+ and are free to reuse.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-fg">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm text-muted transition hover:text-fg"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-sm text-muted transition hover:text-fg">
          {children}
        </Link>
      )}
    </li>
  );
}
