# CodeLibrary

A free learning platform for programming languages and frameworks, built with
**Next.js 16 (App Router), TypeScript and Tailwind CSS v4**, and exported as a
fully static site.

The first course — **Python**, 76 lessons across 12 modules — is complete.
FastAPI, Django, JavaScript, React and SQL are stubbed in the catalogue and
listed on the roadmap.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # static export -> ./out
npm run lint
npx tsc --noEmit
```

`next.config.ts` sets `output: "export"`, so `npm run build` produces a plain
`out/` directory you can host on GitHub Pages, Netlify, Cloudflare Pages, S3 or
any web server. There is no server runtime and no database.

## What is in the box

| Feature | Notes |
| --- | --- |
| Lesson reader | Sticky course sidebar, prev/next pager, "on this page" scroll spy |
| Search | ⌘K / `/` command palette over every lesson, index built at build time |
| Progress tracking | Mark lessons complete; stored per course in `localStorage` |
| Syntax highlighting | Custom Python/bash/JSON tokenizer, runs at build time — zero runtime JS |
| Practice | Collapsible exercises with revealable solutions, plus quizzes |
| Theming | Light/dark with no flash of the wrong theme on first paint |
| SEO | Per-lesson titles and descriptions, generated `sitemap.xml` |

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # shell: header, footer, theme script
│   ├── page.tsx                # landing page
│   ├── courses/page.tsx        # catalogue
│   ├── roadmap/page.tsx        # what is shipped / being written
│   ├── [course]/page.tsx       # course syllabus  (/python)
│   └── [course]/[slug]/page.tsx# lesson reader    (/python/decorators)
├── components/                 # UI: sidebar, code block, quiz, search, …
├── content/
│   └── python/                 # the course, one file per module
│       ├── index.ts            # assembles the Course
│       ├── 01-getting-started.ts
│       └── … 12-professional.ts
└── lib/
    ├── types.ts                # Block / Lesson / Module / Course model
    ├── courses.ts              # registry, navigation, search index
    ├── highlight.ts            # syntax highlighter
    ├── inline.tsx              # inline markdown for prose
    └── useProgress.ts          # localStorage progress store
```

## Writing content

Lessons are **typed data**, not MDX. A lesson is a list of blocks, so all text
is escaped by React automatically and code samples keep their exact whitespace.

```ts
{
  slug: "decorators",
  title: "Decorators",
  summary: "Wrapping functions to add behaviour.",
  minutes: 8,
  blocks: [
    { type: "text", md: "A decorator takes a function and returns a new one." },
    { type: "heading", text: "A timing decorator" },
    { type: "code", lang: "python", code: "...", output: "...", filename: "timer.py" },
    { type: "callout", variant: "gotcha", title: "…", md: "…" },
    { type: "table", head: ["Decorator", "Does"], rows: [["@cache", "Memoises"]] },
    { type: "list", items: ["…"], ordered: false },
    { type: "exercise", prompt: "…", hint: "…", solution: "…" },
    { type: "quiz", question: "…", options: ["a", "b"], answer: 1, explanation: "…" },
  ],
}
```

Prose (`md`, `prompt`, table cells, list items) supports `` `code` ``,
`**bold**`, `*italic*` and `[links](/python/intro)`.

### Adding the FastAPI course

1. Create `src/content/fastapi/` with one file per module, each exporting a
   `Module`, and an `index.ts` exporting the `Course` with
   `status: "available"`.
2. Replace the FastAPI placeholder in `src/lib/courses.ts` with that import.

Nothing else needs touching: the catalogue, syllabus page, lesson routes,
search index and sitemap all derive from the registry. Lesson slugs must be
unique within a course, since the route is `/[course]/[slug]`.

## Deployment

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build   # then serve out/
```

`NEXT_PUBLIC_SITE_URL` only affects the absolute URLs in `sitemap.xml`.
`trailingSlash: true` is already enabled so directory-style URLs work on any
static host.

### GitHub Pages

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
publishes on every push to `main`. To turn it on: **Settings → Pages → Build and
deployment → Source: GitHub Actions**, then push.

The workflow handles the two things that normally break Next.js on Pages:

- **Sub-path hosting.** A project site is served from
  `username.github.io/repo-name`, so assets and links need that prefix. The
  workflow derives it from the repository name and passes it as
  `NEXT_PUBLIC_BASE_PATH`, which `next.config.ts` applies as `basePath` /
  `assetPrefix`. A `username.github.io` repository gets an empty prefix
  automatically. Local `npm run dev` is unaffected.
- **Jekyll.** Pages runs Jekyll by default, and Jekyll ignores directories that
  start with an underscore — which would delete Next's entire `_next/` asset
  folder. The workflow writes an `.nojekyll` marker to disable it.

To preview a sub-path build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/Code_library npm run build
npx serve out          # visit http://localhost:3000/Code_library/
```

### Other static hosts

Cloudflare Pages, Netlify and Vercel all work with zero configuration: build
command `npm run build`, output directory `out`. None of them need
`NEXT_PUBLIC_BASE_PATH`, since they serve from a domain root.
