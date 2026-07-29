# CodeLibrary

A free learning platform for programming languages and frameworks, built with
**Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Postgres**.

Lesson pages are prerendered at build time and served as static HTML; only the
`/api/*` routes are dynamic. Accounts are optional — every lesson is readable
without signing in.

The first course — **Python**, 76 lessons across 12 modules — is complete.
FastAPI, Django, JavaScript, React and SQL are stubbed in the catalogue and
listed on the roadmap.

## Getting started

```bash
npm install
cp .env.example .env.local        # then point DATABASE_URL at a Postgres

# A throwaway database for local development:
docker run --name codelibrary-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=codelibrary -p 5432:5432 -d postgres:16

npm run migrate                   # creates users, sessions, progress
npm run dev                       # http://localhost:3000
```

Without `DATABASE_URL` the site still builds and every lesson works — only
signing in fails.

```bash
npm run build        # prerenders every lesson page
npm start            # production server on :3000
npm run migrate      # create/update the database schema (idempotent)
npm run lint
npm run typecheck
```

## What is in the box

| Feature | Notes |
| --- | --- |
| Lesson reader | Sticky course sidebar, prev/next pager, "on this page" scroll spy |
| Search | ⌘K / `/` command palette over every lesson, index built at build time |
| Progress tracking | Mark lessons complete; stored per course in `localStorage` |
| Syntax highlighting | Custom Python/bash/JSON tokenizer, runs at build time — zero runtime JS |
| Practice | Collapsible exercises with revealable solutions, plus quizzes |
| Accounts | Username + password sign-up, sessions in httpOnly cookies |
| Progress sync | Signed out: localStorage. Signed in: saved per account, on every device |
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
│   ├── [course]/[slug]/page.tsx# lesson reader    (/python/decorators)
│   ├── login|signup|account/   # auth pages
│   └── api/
│       ├── auth/{signup,login,logout,me}/route.ts
│       └── progress/{,merge}/route.ts
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
    ├── db.ts                   # Postgres pool
    ├── progressStore.ts        # progress: localStorage + server sync
    ├── useProgress.ts          # React binding for the store
    └── auth/
        ├── password.ts         # scrypt hashing (server only)
        ├── session.ts          # cookie sessions
        ├── validate.ts         # shared input rules
        └── rateLimit.ts        # login throttle

scripts/migrate.mjs             # creates the schema; safe to re-run
```

## Accounts

Accounts are optional and exist for one reason: so lesson progress follows you
between devices. Nothing is gated behind sign-in.

### How it works

- **Passwords** are hashed with **scrypt** from Node's standard library
  (N=32768, r=8, p=1, random 16-byte salt). No password is ever stored or
  logged in readable form, and there is no native dependency to compile.
- **Sessions** are server-side. The browser holds a random 256-bit token in an
  `httpOnly`, `SameSite=Lax` cookie (`Secure` in production); the database
  stores only its SHA-256 hash. JavaScript cannot read the cookie, a database
  leak yields no usable sessions, and signing out revokes the token immediately.
- **Login failures** return one generic message and spend the same time whether
  or not the username exists, so the endpoint does not leak which accounts are
  real. Repeated attempts from one IP are throttled (10 per 15 minutes).
- **All SQL is parameterised** — no user input is ever concatenated into a query.
- **Progress merges rather than overwrites.** Someone who works through lessons
  signed out and then creates an account keeps that progress.

### Schema

```
users     id, username, username_key (lower-cased, unique), password_hash, created_at
sessions  token_hash (PK), user_id, expires_at, created_at
progress  (user_id, course_slug, lesson_slug) PK, completed_at
```

### API

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/auth/signup/` | POST | Create an account and start a session |
| `/api/auth/login/` | POST | Start a session |
| `/api/auth/logout/` | POST | Revoke the current session |
| `/api/auth/me/` | GET | Who is signed in (`{ user: null }` when nobody) |
| `/api/progress/` | GET / POST / DELETE | Read, set, or clear progress |
| `/api/progress/merge/` | POST | Union local progress into the account |

The trailing slashes are required: `trailingSlash: true` makes them canonical,
so calling them without one costs a 308 redirect.

### Known limits

- The login throttle is in-process, so it resets on restart and is not shared
  between instances. Fine for one web service; move it into Postgres or Redis
  before scaling out.
- There is no password reset or email verification — usernames are not email
  addresses, so there is nowhere to send a reset link. Adding either means
  collecting an email address and wiring up a mail provider.
- No account deletion in the UI yet. `DELETE FROM users WHERE id = …` cascades
  to sessions and progress.

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

Hosted on **Render** as a Node Web Service plus a managed Postgres database.

> This is a Node project, so its dependency manifest is `package.json` — there
> is no `requirements.txt` (that is a Python file, and adding one would confuse
> Render's runtime detection).

### Render

[`render.yaml`](render.yaml) is a Blueprint, so Render provisions both pieces:

1. Push this repository to GitHub or GitLab.
2. Render Dashboard → **New** → **Blueprint** → select the repository.
3. Render creates the web service and the database, wires `DATABASE_URL`
   between them, builds, runs the migrations and starts the server.

| Step | Command |
| --- | --- |
| Build | `npm ci --include=dev && npm run build` |
| Start | `npm run migrate && npm start` |

`--include=dev` matters: Render sets `NODE_ENV=production`, which would
otherwise skip the devDependencies the build needs. Migrations run on every
boot and are idempotent, so a fresh database is ready before the first request.

After the first deploy, set `NEXT_PUBLIC_SITE_URL` in the dashboard to the live
URL so `sitemap.xml` contains absolute URLs.

### Free-tier caveats

- **The web service sleeps** after ~15 minutes of inactivity, so the first
  request afterwards takes roughly a minute. Lesson pages are prerendered, so
  once awake everything is fast.
- **A free Postgres instance expires 30 days after creation.** Before then,
  either upgrade the database to a paid plan or point `DATABASE_URL` at a free
  external Postgres (Neon and Supabase both have durable free tiers) — the code
  does not care which, it only needs a connection string.
- Sessions live in the database, not in memory, so a restart or redeploy does
  not sign anybody out.

### Anywhere else

Any host that runs Node and provides a Postgres connection string works
unchanged — Railway, Fly.io, a VPS, or Vercel with a hosted database. Set
`DATABASE_URL`, run `npm run migrate`, then `npm run build && npm start`.

Note that the site can no longer be hosted on a purely static host such as
GitHub Pages: sign-in needs a server. Removing the `/api` routes and the
`AuthProvider` would restore that option.

### Local preview of the production build

```bash
npm run build
npm start            # http://localhost:3000
```
