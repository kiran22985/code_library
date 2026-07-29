/**
 * Content model for every course on the platform.
 *
 * Lessons are authored as typed blocks rather than raw HTML/MDX so that:
 *  - all user-facing text is escaped by React automatically,
 *  - code samples keep their exact whitespace (no markdown indentation traps),
 *  - the same lesson data can feed the reader, the search index and the sitemap.
 */

export type Lang = "python" | "bash" | "text" | "json";

export type Block =
  /** A paragraph. Supports inline `code`, **bold**, *italic* and [links](/url). */
  | { type: "text"; md: string }
  /** A section heading inside a lesson. Gets an anchor id + shows in "On this page". */
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "code";
      code: string;
      lang?: Lang;
      /** Optional filename shown in the code block header. */
      filename?: string;
      /** Expected stdout, rendered as an attached terminal panel. */
      output?: string;
    }
  | {
      type: "callout";
      variant: "note" | "tip" | "warn" | "gotcha";
      title?: string;
      md: string;
    }
  | { type: "table"; head: string[]; rows: string[][] }
  /** Collapsible practice task with a revealable solution. */
  | { type: "exercise"; prompt: string; hint?: string; solution: string }
  /** Single-answer quiz used at the end of most lessons. */
  | {
      type: "quiz";
      question: string;
      options: string[];
      /** Index into `options`. */
      answer: number;
      explanation: string;
    };

export interface Lesson {
  slug: string;
  title: string;
  /** One-line summary used in cards, search results and meta description. */
  summary: string;
  /** Estimated reading time in minutes. */
  minutes: number;
  blocks: Block[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  /** Short label, e.g. "Python 3.12". */
  tagline: string;
  description: string;
  level: "Beginner to Advanced" | "Intermediate" | "Advanced";
  icon: string;
  status: "available" | "coming-soon";
  modules: Module[];
}

/** A lesson flattened with its position in the course, used by the reader. */
export interface LessonRef {
  lesson: Lesson;
  module: Module;
  index: number;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}
