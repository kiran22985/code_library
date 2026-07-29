import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Minimal inline markdown for lesson prose: `code`, **bold**, *italic* and
 * [links](/url). Anything else is rendered verbatim, so authors never have to
 * think about escaping — React does it.
 */

const INLINE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;

export function inlineMd(md: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of md.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(md.slice(last, start));
    const token = match[0];

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else {
      const split = token.indexOf("](");
      const text = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      const external = /^https?:\/\//.test(href);
      nodes.push(
        external ? (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-accent underline decoration-accent-line underline-offset-4 hover:decoration-accent"
          >
            {text}
          </a>
        ) : (
          <Link
            key={key++}
            href={href}
            className="font-medium text-accent underline decoration-accent-line underline-offset-4 hover:decoration-accent"
          >
            {text}
          </Link>
        ),
      );
    }
    last = start + token.length;
  }

  if (last < md.length) nodes.push(md.slice(last));
  return nodes;
}

/** Strips inline markers — for `<title>`, meta descriptions and search text. */
export function plainText(md: string): string {
  return md
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}

/** Turns a heading into a stable anchor id. */
export function slugify(text: string): string {
  return plainText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
