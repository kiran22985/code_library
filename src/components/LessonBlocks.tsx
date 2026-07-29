import { inlineMd, slugify } from "@/lib/inline";
import type { Block } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { Exercise } from "./Exercise";
import { Quiz } from "./Quiz";

/** Renders a lesson's block list. Everything here is server-rendered. */
export function LessonBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <p className="my-4 text-[15.5px] leading-[1.75] text-fg-soft">
          {inlineMd(block.md)}
        </p>
      );

    case "heading":
      return (
        <h2
          id={slugify(block.text)}
          className="group mt-12 mb-3 scroll-mt-28 text-xl font-semibold tracking-tight text-fg"
        >
          <a href={`#${slugify(block.text)}`} className="no-underline">
            {block.text}
            <span className="ml-2 text-accent opacity-0 transition group-hover:opacity-100">
              #
            </span>
          </a>
        </h2>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`my-4 space-y-2 pl-1 text-[15.5px] leading-[1.7] text-fg-soft ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-accent ml-5`}
        >
          {block.items.map((item, index) => (
            <li key={index} className="pl-1.5">
              {inlineMd(item)}
            </li>
          ))}
        </Tag>
      );
    }

    case "code":
      return (
        <CodeBlock
          code={block.code}
          lang={block.lang}
          filename={block.filename}
          output={block.output}
        />
      );

    case "callout": {
      const style = CALLOUT[block.variant];
      return (
        <aside className={`my-6 rounded-xl border-l-4 p-4 ${style.box}`}>
          <p className={`flex items-center gap-2 text-sm font-semibold ${style.title}`}>
            <span aria-hidden="true">{style.icon}</span>
            {block.title ?? style.label}
          </p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-fg-soft">
            {inlineMd(block.md)}
          </p>
        </aside>
      );
    }

    case "table":
      return (
        <div className="scroll-thin my-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-2">
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    className="border-b border-line px-4 py-2.5 font-semibold text-fg"
                  >
                    {inlineMd(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-line last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2.5 align-top text-fg-soft"
                    >
                      {inlineMd(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "exercise":
      return (
        <Exercise
          prompt={inlineMd(block.prompt)}
          hint={block.hint ? inlineMd(block.hint) : undefined}
          solution={<CodeBlock code={block.solution} lang="python" filename="solution.py" />}
        />
      );

    case "quiz":
      return (
        <Quiz
          question={inlineMd(block.question)}
          options={block.options}
          answer={block.answer}
          explanation={inlineMd(block.explanation)}
        />
      );
  }
}

const CALLOUT = {
  note: {
    label: "Note",
    icon: "📘",
    box: "border-l-accent bg-accent-soft",
    title: "text-accent",
  },
  tip: {
    label: "Tip",
    icon: "💡",
    box: "border-l-success bg-success/8",
    title: "text-success",
  },
  warn: {
    label: "Watch out",
    icon: "⚠️",
    box: "border-l-warn bg-warn/8",
    title: "text-warn",
  },
  gotcha: {
    label: "Common mistake",
    icon: "🐛",
    box: "border-l-danger bg-danger/8",
    title: "text-danger",
  },
} as const;
