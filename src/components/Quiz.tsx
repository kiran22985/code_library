"use client";

import { useState, type ReactNode } from "react";

export function Quiz({
  question,
  options,
  answer,
  explanation,
}: {
  question: ReactNode;
  options: string[];
  answer: number;
  explanation: ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === answer;

  return (
    <section className="my-7 rounded-xl border border-line bg-surface p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.6.2-.7.6-.7 1.1v.5" strokeLinecap="round" />
          <path d="M12 17h.01" strokeLinecap="round" strokeWidth="2.4" />
        </svg>
        Check yourself
      </p>
      <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-fg">
        {question}
      </p>

      <ul className="mt-4 space-y-2">
        {options.map((option, index) => {
          const isPicked = picked === index;
          const isAnswer = index === answer;
          const revealed = picked !== null;
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => setPicked(index)}
                disabled={revealed}
                className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${
                  revealed && isAnswer
                    ? "border-success/50 bg-success/10 text-fg"
                    : revealed && isPicked
                      ? "border-danger/50 bg-danger/10 text-fg"
                      : revealed
                        ? "border-line text-muted"
                        : "border-line text-fg-soft hover:border-line-strong hover:bg-surface-2"
                }`}
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-current text-[10px] font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-mono text-[13px]">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <div className="mt-4 rounded-lg border border-line bg-surface-2 p-3.5">
          <p
            className={`text-sm font-semibold ${correct ? "text-success" : "text-danger"}`}
          >
            {correct ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-fg-soft">{explanation}</p>
          {!correct && (
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="mt-3 text-xs font-medium text-accent hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </section>
  );
}
