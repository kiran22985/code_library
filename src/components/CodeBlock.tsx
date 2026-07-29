import { highlight } from "@/lib/highlight";
import type { Lang } from "@/lib/types";
import { CopyButton } from "./CopyButton";

/**
 * Server-rendered code block: highlighting happens at build time, only the
 * copy button ships JavaScript.
 */
export function CodeBlock({
  code,
  lang = "python",
  filename,
  output,
}: {
  code: string;
  lang?: Lang;
  filename?: string;
  output?: string;
}) {
  const source = code.replace(/\n+$/, "");
  const tokens = highlight(source, lang);
  const lineCount = source.split("\n").length;

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-code-line bg-code-bg shadow-sm">
      <figcaption className="flex items-center gap-2 border-b border-code-line px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-slate-400">
          {filename ?? LANG_LABEL[lang]}
        </span>
        <span className="ml-auto">
          <CopyButton text={source} />
        </span>
      </figcaption>

      <div className="scroll-thin overflow-x-auto">
        <pre className="flex min-w-full py-4 text-[13px] leading-[1.75]">
          {lineCount > 3 && (
            <span
              aria-hidden="true"
              className="sticky left-0 select-none border-r border-code-line bg-code-bg px-3 text-right font-mono text-slate-600"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i} className="block">
                  {i + 1}
                </span>
              ))}
            </span>
          )}
          <code className="block px-4 font-mono">
            {tokens.map((token, i) => (
              <span key={i} className={`tok-${token.cls}`}>
                {token.value}
              </span>
            ))}
          </code>
        </pre>
      </div>

      {output && (
        <div className="border-t border-code-line bg-black/25 px-4 py-3">
          <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 7 4 4-4 4M12 15h7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Output
          </p>
          <pre className="scroll-thin overflow-x-auto font-mono text-[12.5px] leading-relaxed text-slate-300">
            {output.replace(/\n+$/, "")}
          </pre>
        </div>
      )}
    </figure>
  );
}

const LANG_LABEL: Record<Lang, string> = {
  python: "python",
  bash: "terminal",
  json: "json",
  text: "text",
};
