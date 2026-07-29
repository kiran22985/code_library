import type { Lang } from "./types";

/**
 * A tiny, dependency-free syntax highlighter.
 *
 * It runs inside a Server Component at build time, so highlighting costs the
 * visitor nothing: the browser only ever receives pre-coloured markup. Keeping
 * it in-house (instead of Shiki/Prism) also means the site has zero runtime
 * highlighting deps and the token classes map straight onto our theme tokens.
 */

export interface Token {
  /** CSS class suffix — rendered as `tok-${cls}`. */
  cls:
    | "plain"
    | "comment"
    | "keyword"
    | "string"
    | "number"
    | "builtin"
    | "fn"
    | "class"
    | "decorator"
    | "op"
    | "punct"
    | "self";
  value: string;
}

const PY_KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
  "match", "case",
]);

const PY_BUILTINS = new Set([
  "abs", "aiter", "all", "any", "anext", "ascii", "bin", "bool", "breakpoint",
  "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex",
  "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter",
  "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash",
  "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter",
  "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object",
  "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed",
  "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum",
  "super", "tuple", "type", "vars", "zip",
  // exceptions people meet early
  "Exception", "BaseException", "ValueError", "TypeError", "KeyError",
  "IndexError", "NameError", "ZeroDivisionError", "AttributeError",
  "FileNotFoundError", "StopIteration", "RuntimeError", "ImportError",
  "NotImplementedError", "OSError", "PermissionError", "TimeoutError",
  "ArithmeticError", "AssertionError", "RecursionError", "UnicodeDecodeError",
]);

const IDENT_START = /[A-Za-z_]/;
const IDENT_PART = /[A-Za-z0-9_]/;
const DIGIT = /[0-9]/;
const OPERATOR_CHARS = "+-*/%<>=!&|^~@";
const PUNCT_CHARS = "()[]{},:;.";

function isSpace(c: string) {
  return c === " " || c === "\t" || c === "\r" || c === "\n";
}

/** Appends a token, merging with the previous one when the class matches. */
function makePush(out: Token[]) {
  return (cls: Token["cls"], value: string) => {
    if (!value) return;
    const last = out[out.length - 1];
    if (last && last.cls === cls) last.value += value;
    else out.push({ cls, value });
  };
}

function readString(src: string, start: number): number {
  // `start` points at the opening quote. Returns the index just past the close.
  const quote = src[start];
  const triple = src.slice(start, start + 3) === quote.repeat(3);
  const delim = triple ? quote.repeat(3) : quote;
  let i = start + delim.length;

  while (i < src.length) {
    if (src[i] === "\\") {
      i += 2;
      continue;
    }
    if (src.startsWith(delim, i)) return i + delim.length;
    // An unterminated single-quoted string ends at the newline.
    if (!triple && src[i] === "\n") return i;
    i += 1;
  }
  return src.length;
}

function tokenizePython(src: string): Token[] {
  const out: Token[] = [];
  const push = makePush(out);
  let i = 0;
  /** Last non-whitespace identifier/keyword, used for `def foo` / `class Foo`. */
  let prevWord = "";

  while (i < src.length) {
    const c = src[i];

    if (isSpace(c)) {
      let j = i;
      while (j < src.length && isSpace(src[j])) j += 1;
      push("plain", src.slice(i, j));
      i = j;
      continue;
    }

    if (c === "#") {
      let j = i;
      while (j < src.length && src[j] !== "\n") j += 1;
      push("comment", src.slice(i, j));
      i = j;
      continue;
    }

    // String literals, including prefixed ones like f"...", rb'...'
    if (c === '"' || c === "'") {
      const end = readString(src, i);
      push("string", src.slice(i, end));
      i = end;
      continue;
    }
    if (IDENT_START.test(c)) {
      // A short identifier directly followed by a quote is a string prefix.
      let p = i;
      while (p < src.length && IDENT_PART.test(src[p])) p += 1;
      const word = src.slice(i, p);
      const nextChar = src[p];
      if (
        word.length <= 2 &&
        (nextChar === '"' || nextChar === "'") &&
        /^[rRbBuUfF]+$/.test(word)
      ) {
        const end = readString(src, p);
        push("string", src.slice(i, end));
        i = end;
        prevWord = "";
        continue;
      }

      // Plain identifier / keyword / builtin.
      let cls: Token["cls"] = "plain";
      if (PY_KEYWORDS.has(word)) {
        // `match`/`case` are soft keywords: only colour them at statement start.
        const soft = word === "match" || word === "case";
        const atStatementStart = /(^|\n)[ \t]*$/.test(src.slice(0, i));
        cls = !soft || atStatementStart ? "keyword" : "plain";
      } else if (word === "self" || word === "cls") {
        cls = "self";
      } else if (prevWord === "def") {
        cls = "fn";
      } else if (prevWord === "class") {
        cls = "class";
      } else if (PY_BUILTINS.has(word)) {
        cls = "builtin";
      } else if (nextChar === "(") {
        cls = "fn";
      } else if (/^[A-Z][A-Za-z0-9_]*$/.test(word)) {
        cls = "class";
      }
      push(cls, word);
      prevWord = word;
      i = p;
      continue;
    }

    if (c === "@") {
      // Decorator only when it starts a line (otherwise it is matrix-multiply).
      const atLineStart = /(^|\n)[ \t]*$/.test(src.slice(0, i));
      if (atLineStart && IDENT_START.test(src[i + 1] ?? "")) {
        let j = i + 1;
        while (j < src.length && (IDENT_PART.test(src[j]) || src[j] === ".")) j += 1;
        push("decorator", src.slice(i, j));
        i = j;
        prevWord = "";
        continue;
      }
    }

    if (DIGIT.test(c) || (c === "." && DIGIT.test(src[i + 1] ?? ""))) {
      let j = i;
      while (j < src.length && /[0-9a-fA-FxXoObB_.]/.test(src[j])) j += 1;
      if (/[eE]/.test(src[j] ?? "") && /[0-9+-]/.test(src[j + 1] ?? "")) {
        j += 2;
        while (j < src.length && DIGIT.test(src[j])) j += 1;
      }
      if (/[jJ]/.test(src[j] ?? "")) j += 1;
      push("number", src.slice(i, j));
      prevWord = "";
      i = j;
      continue;
    }

    if (OPERATOR_CHARS.includes(c)) {
      let j = i;
      while (j < src.length && OPERATOR_CHARS.includes(src[j])) j += 1;
      push("op", src.slice(i, j));
      prevWord = "";
      i = j;
      continue;
    }

    if (PUNCT_CHARS.includes(c)) {
      push("punct", c);
      // Keep `prevWord` across `.` so `self.name` still reads naturally, but a
      // comma or paren ends the def/class context.
      if (c !== ".") prevWord = "";
      i += 1;
      continue;
    }

    push("plain", c);
    i += 1;
  }

  return out;
}

function tokenizeBash(src: string): Token[] {
  const out: Token[] = [];
  const push = makePush(out);
  const lines = src.split("\n");

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) push("plain", "\n");

    const commentAt = line.indexOf("#");
    const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
    const comment = commentAt >= 0 ? line.slice(commentAt) : "";
    let first = true;

    // Split into words while preserving whitespace runs.
    for (const part of code.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        push("plain", part);
        continue;
      }
      if (part === "$" || part.startsWith("$")) push("builtin", part);
      else if (part.startsWith("-")) push("number", part);
      else if (/^["'].*["']$/.test(part)) push("string", part);
      else if (first) push("fn", part);
      else if (["|", "&&", "||", ">", ">>", "<"].includes(part)) push("op", part);
      else push("plain", part);
      first = false;
    }

    if (comment) push("comment", comment);
  });

  return out;
}

function tokenizeJson(src: string): Token[] {
  const out: Token[] = [];
  const push = makePush(out);
  let i = 0;

  while (i < src.length) {
    const c = src[i];
    if (c === '"') {
      const end = readString(src, i);
      // A string followed by ":" is a key.
      let k = end;
      while (k < src.length && isSpace(src[k])) k += 1;
      push(src[k] === ":" ? "fn" : "string", src.slice(i, end));
      i = end;
      continue;
    }
    if (DIGIT.test(c) || (c === "-" && DIGIT.test(src[i + 1] ?? ""))) {
      let j = i + 1;
      while (j < src.length && /[0-9.eE+-]/.test(src[j])) j += 1;
      push("number", src.slice(i, j));
      i = j;
      continue;
    }
    if (IDENT_START.test(c)) {
      let j = i;
      while (j < src.length && IDENT_PART.test(src[j])) j += 1;
      push("keyword", src.slice(i, j));
      i = j;
      continue;
    }
    if (PUNCT_CHARS.includes(c)) {
      push("punct", c);
      i += 1;
      continue;
    }
    push("plain", c);
    i += 1;
  }

  return out;
}

export function highlight(code: string, lang: Lang = "python"): Token[] {
  switch (lang) {
    case "python":
      return tokenizePython(code);
    case "bash":
      return tokenizeBash(code);
    case "json":
      return tokenizeJson(code);
    default:
      return [{ cls: "plain", value: code }];
  }
}
