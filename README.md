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

The project is hosted on **Render** as a Static Site.

> This is a Node project, so its dependency manifest is `package.json` — there
> is no `requirements.txt` (that is a Python file, and adding one would confuse
> Render's runtime detection).

### Render

[`render.yaml`](render.yaml) is a Blueprint, so Render configures itself:

1. Push this repository to GitHub or GitLab.
2. Render Dashboard → **New** → **Blueprint** → select the repository.
3. Render reads `render.yaml`, runs `npm ci && npm run build`, and serves `out/`
   from its CDN. Every push to the default branch redeploys automatically.

Setting it up by hand instead (**New → Static Site**) needs exactly two fields:

| Field | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Publish directory | `out` |

After the first deploy, set `NEXT_PUBLIC_SITE_URL` in the Render dashboard to
the live URL (e.g. `https://codelibrary.onrender.com`) so `sitemap.xml` contains
absolute URLs, then redeploy. Nothing else depends on it.

**Static Site, not Web Service.** A Static Site is free, has no cold starts and
serves from a CDN. A Web Service would spin up a Node process for no reason —
this site has no server-side code. It would also fail, because `next start` does
not work with `output: "export"`.

Render serves `/python/intro/` from `out/python/intro/index.html` and the export
includes a `404.html` for unknown paths.

### Local preview of the production build

```bash
npm run build
npm start            # serves ./out on http://localhost:3000
```

### GitHub Pages (optional, disabled)

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) can publish a
copy to GitHub Pages. It is set to **manual only** (Actions tab → Run workflow)
so it does not run alongside Render; delete the file if you do not want it.

It handles the two things that normally break Next.js on Pages: the sub-path
prefix (`NEXT_PUBLIC_BASE_PATH` → `basePath`/`assetPrefix` in
[`next.config.ts`](next.config.ts), derived from the repository name) and the
`.nojekyll` marker, without which Jekyll strips Next's `_next/` asset folder.

To preview a sub-path build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/Code_library npm run build
npm start            # visit http://localhost:3000/Code_library/
```

### Other static hosts

Cloudflare Pages, Netlify and Vercel all work with zero configuration: build
command `npm run build`, output directory `out`. Like Render, they serve from a
domain root, so `NEXT_PUBLIC_BASE_PATH` stays unset.
