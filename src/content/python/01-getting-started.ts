import type { Module } from "@/lib/types";

export const gettingStarted: Module = {
  id: "getting-started",
  title: "Getting started",
  description:
    "What Python is, how to install it, and how to run your first program.",
  lessons: [
    {
      slug: "intro",
      title: "What is Python?",
      summary:
        "Why Python is the most-taught first language, what it is used for, and what you will learn in this course.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "Python is a general-purpose programming language created by Guido van Rossum and released in 1991. Its design goal was readability: code that looks close to plain English and stays understandable months after you write it.",
        },
        {
          type: "text",
          md: "Compare a line of Python with the equivalent in a more ceremonious language. Both print a message, but one of them you can read out loud:",
        },
        {
          type: "code",
          code: `print("Hello, world!")`,
          output: "Hello, world!",
        },
        { type: "heading", text: "What people build with it" },
        {
          type: "list",
          items: [
            "**Web backends** — Django, Flask and FastAPI power sites from Instagram to Netflix's internal tooling.",
            "**Data analysis and science** — pandas, NumPy and Jupyter are the standard toolkit for working with data.",
            "**Machine learning and AI** — PyTorch, TensorFlow and scikit-learn are all Python-first.",
            "**Automation and scripting** — renaming 10,000 files, calling APIs, scraping pages, gluing systems together.",
            "**DevOps and infrastructure** — Ansible, cloud SDKs and deployment tooling.",
          ],
        },
        { type: "heading", text: "What makes Python different" },
        {
          type: "table",
          head: ["Trait", "What it means for you"],
          rows: [
            [
              "Interpreted",
              "Code runs line by line — no compile step, so you see results immediately.",
            ],
            [
              "Dynamically typed",
              "You do not declare types; a variable holds whatever you put in it.",
            ],
            [
              "Indentation-based",
              "Blocks are defined by whitespace instead of `{ }`, which forces readable layout.",
            ],
            [
              "Batteries included",
              "The standard library ships with JSON, HTTP, dates, testing, databases and more.",
            ],
            [
              "Huge ecosystem",
              "PyPI hosts 500,000+ packages installable with a single `pip install`.",
            ],
          ],
        },
        {
          type: "callout",
          variant: "note",
          title: "Python 2 vs Python 3",
          md: "Python 2 reached end of life in 2020. Everything in this course is **Python 3** (specifically 3.10+, and features from 3.12 are flagged where they appear). If a tutorial elsewhere writes `print \"hello\"` without parentheses, it is Python 2 — skip it.",
        },
        { type: "heading", text: "How this course works" },
        {
          type: "text",
          md: "Lessons are short and ordered. Each one introduces an idea, shows runnable code with its output, points out the mistake people usually make, then gives you something to practise. You are not expected to memorise anything — you are expected to type the examples and see what happens.",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Read with an editor open. The difference between people who learn to program and people who do not is almost entirely how much code they typed themselves.",
        },
      ],
    },

    {
      slug: "install",
      title: "Installing Python",
      summary:
        "Get Python 3 running on macOS, Windows or Linux, and check the version from your terminal.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "You need two things: the Python interpreter, and somewhere to write code. Start with the interpreter.",
        },
        { type: "heading", text: "Check what you already have" },
        {
          type: "code",
          lang: "bash",
          code: `python3 --version`,
          output: "Python 3.12.4",
        },
        {
          type: "text",
          md: "If that prints a version of 3.10 or newer, you are ready — skip to the next lesson. If it says *command not found*, install it below.",
        },
        { type: "heading", text: "macOS" },
        {
          type: "text",
          md: "macOS ships an old system Python that you should not use for your own projects. Install a current version with [Homebrew](https://brew.sh):",
        },
        {
          type: "code",
          lang: "bash",
          code: `brew install python@3.12
python3 --version`,
        },
        { type: "heading", text: "Windows" },
        {
          type: "list",
          ordered: true,
          items: [
            "Download the installer from [python.org/downloads](https://www.python.org/downloads/).",
            "**Tick “Add python.exe to PATH”** on the first screen — this is the step people skip and then spend an hour debugging.",
            "Click *Install Now*, then open PowerShell and run `python --version`.",
          ],
        },
        { type: "heading", text: "Linux" },
        {
          type: "code",
          lang: "bash",
          code: `# Debian / Ubuntu
sudo apt update && sudo apt install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip`,
        },
        { type: "heading", text: "An editor" },
        {
          type: "text",
          md: "Use [VS Code](https://code.visualstudio.com/) with the official Python extension — it gives you syntax highlighting, autocomplete, error squiggles and a debugger for free. PyCharm is the heavier, all-in-one alternative.",
        },
        {
          type: "callout",
          variant: "warn",
          title: "python vs python3",
          md: "On macOS and Linux, `python` may point at Python 2 or at nothing at all, while `python3` is the real one. On Windows it is usually just `python`. Use whichever prints a 3.x version on your machine — this course writes `python3`.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "No install, no problem",
          md: "You can run every example in this course in the browser at [python.org/shell](https://www.python.org/shell/) or on [replit.com](https://replit.com) while you get set up.",
        },
      ],
    },

    {
      slug: "first-program",
      title: "Your first program",
      summary:
        "Write and run a Python file, use the interactive shell, and understand what the interpreter is doing.",
      minutes: 6,
      blocks: [
        { type: "heading", text: "The interactive shell (REPL)" },
        {
          type: "text",
          md: "Type `python3` in your terminal and you get a prompt where each line runs the moment you press Enter. It is the fastest way to test an idea.",
        },
        {
          type: "code",
          lang: "text",
          code: `$ python3
Python 3.12.4 (main, Jun  7 2024, 10:11:12)
>>> 2 + 2
4
>>> "Python" * 3
'PythonPythonPython'
>>> exit()`,
        },
        {
          type: "callout",
          variant: "note",
          md: "`>>>` is the shell's prompt, not something you type. In this course, code blocks without `>>>` are files you save and run.",
        },
        { type: "heading", text: "Your first script" },
        {
          type: "text",
          md: "Create a file called `hello.py` and put this in it:",
        },
        {
          type: "code",
          filename: "hello.py",
          code: `name = "world"
print("Hello,", name)
print("Python is", 2026 - 1991, "years old")`,
          output: "Hello, world\nPython is 35 years old",
        },
        { type: "text", md: "Run it from the folder containing the file:" },
        {
          type: "code",
          lang: "bash",
          code: `python3 hello.py`,
        },
        { type: "heading", text: "What just happened" },
        {
          type: "list",
          ordered: true,
          items: [
            "The interpreter read your file top to bottom.",
            "Line 1 stored the text `\"world\"` in a variable named `name`.",
            "Line 2 called the built-in `print()` function, which writes to the terminal.",
            "`print()` separates its arguments with a space and adds a newline at the end.",
          ],
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "SyntaxError on the very first run",
          md: "Nine times out of ten it is a missing closing quote or parenthesis. Python reports the line where it *noticed* the problem, which is often one line after the real mistake — so check the line above too.",
        },
        {
          type: "exercise",
          prompt:
            "Write a script that prints your name on one line and, on the next line, the result of `7 * 6`. Use two `print()` calls.",
          hint: "Numbers do not need quotes; text does.",
          solution: `print("Kiran")
print(7 * 6)`,
        },
        {
          type: "quiz",
          question: "What does `print(\"5\" * 2)` output?",
          options: ["10", "55", "5 5", "TypeError"],
          answer: 1,
          explanation:
            "`\"5\"` is a string, and multiplying a string by an integer repeats it — so you get `55`. `5 * 2` (no quotes) would give `10`.",
        },
      ],
    },

    {
      slug: "syntax",
      title: "Syntax and indentation",
      summary:
        "Statements, blocks, whitespace rules and line continuation — the shape of Python code.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "Most languages mark blocks with braces. Python uses **indentation**: the amount of leading whitespace decides which lines belong together. This is not a style preference, it is the syntax.",
        },
        {
          type: "code",
          code: `temperature = 31

if temperature > 30:
    print("It is hot")
    print("Drink water")

print("Done")`,
          output: "It is hot\nDrink water\nDone",
        },
        {
          type: "text",
          md: "The two indented lines run only when the condition is true. `print(\"Done\")` sits back at the left margin, so it always runs. Move it four spaces right and the meaning changes completely.",
        },
        { type: "heading", text: "The rules" },
        {
          type: "list",
          items: [
            "A line ending in `:` starts a block — the next line must be indented.",
            "Use **4 spaces** per level. That is what PEP 8 says and what every editor does by default.",
            "Never mix tabs and spaces in one file; Python raises `TabError`.",
            "Every line in the same block must have the *same* indentation.",
          ],
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "IndentationError",
          md: "`IndentationError: expected an indented block` means you wrote `if x:` and then left the next line at the margin. `IndentationError: unexpected indent` means you indented a line that should not be. Configure your editor to insert spaces for the Tab key and both mostly disappear.",
        },
        { type: "heading", text: "One statement per line" },
        {
          type: "text",
          md: "Python needs no semicolons. A newline ends a statement. If a line gets long, break it inside brackets — Python keeps reading until they close:",
        },
        {
          type: "code",
          code: `# Implicit continuation inside ( ) [ ] { } — preferred
total = (
    1_000
    + 2_500
    + 3_750
)

languages = [
    "Python",
    "Go",
    "Rust",
]

# Explicit continuation with a backslash — avoid when you can
message = "first part " \\
    "second part"

print(total, languages, message)`,
          output: "7250 ['Python', 'Go', 'Rust'] first part second part",
        },
        { type: "heading", text: "Case sensitivity and naming" },
        {
          type: "code",
          code: `name = "Ada"
Name = "Grace"   # a completely different variable
print(name, Name)`,
          output: "Ada Grace",
        },
        {
          type: "text",
          md: "Names may contain letters, digits and underscores, but cannot start with a digit. The community convention is `snake_case` for variables and functions, `PascalCase` for classes, and `UPPER_SNAKE` for constants.",
        },
        {
          type: "heading",
          text: "The empty block: pass",
        },
        {
          type: "code",
          code: `def not_written_yet():
    pass   # a placeholder that does nothing but keeps the block valid`,
        },
        {
          type: "quiz",
          question: "How many spaces does PEP 8 recommend per indentation level?",
          options: ["1 tab", "2 spaces", "4 spaces", "Any amount, if consistent"],
          answer: 2,
          explanation:
            "4 spaces. Python itself only requires consistency, but every Python codebase and tool assumes 4.",
        },
      ],
    },

    {
      slug: "comments",
      title: "Comments and docstrings",
      summary:
        "Leave notes for humans with `#`, and document functions, classes and modules with docstrings.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "Everything after a `#` on a line is ignored by Python. Comments explain *why* code does something — the code already says *what* it does.",
        },
        {
          type: "code",
          code: `# Rates are quoted per 1000 units by the supplier
RATE_PER_1000 = 4.75

units = 2500
cost = units / 1000 * RATE_PER_1000  # convert to thousands first

print(cost)`,
          output: "11.875",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Good comments explain intent",
          md: "`x += 1  # add one to x` is noise. `x += 1  # page numbers are 1-based in the API` is useful.",
        },
        { type: "heading", text: "There is no block comment" },
        {
          type: "text",
          md: "Python has no `/* ... */`. Comment several lines by prefixing each with `#` — your editor does it with Ctrl+/ (Cmd+/ on macOS).",
        },
        { type: "heading", text: "Docstrings" },
        {
          type: "text",
          md: "A string literal as the first statement of a module, function or class becomes its **docstring**: documentation that stays attached to the object at runtime and is what `help()` prints.",
        },
        {
          type: "code",
          filename: "geometry.py",
          code: `"""Small helpers for working with rectangles."""


def area(width: float, height: float) -> float:
    """Return the area of a rectangle.

    Args:
        width: Length of the horizontal side.
        height: Length of the vertical side.

    Returns:
        The area, in the same square units as the inputs.
    """
    return width * height


print(area(3, 4))
print(area.__doc__.splitlines()[0])`,
          output: "12\nReturn the area of a rectangle.",
        },
        {
          type: "text",
          md: "Editors show docstrings on hover, `help(area)` prints them in the shell, and tools like Sphinx turn them into a documentation site. Comments do none of that — which is why public functions get docstrings, not `#` notes.",
        },
        {
          type: "callout",
          variant: "note",
          md: "A triple-quoted string on its own line that is *not* the first statement is just a string that gets created and thrown away. It works as a fake block comment, but a run of `#` lines is the honest way.",
        },
        {
          type: "exercise",
          prompt:
            "Write a function `celsius_to_fahrenheit(c)` with a one-line docstring, then print the function's docstring using `__doc__`.",
          hint: "The formula is `c * 9 / 5 + 32`.",
          solution: `def celsius_to_fahrenheit(c):
    """Convert a Celsius temperature to Fahrenheit."""
    return c * 9 / 5 + 32


print(celsius_to_fahrenheit(100))
print(celsius_to_fahrenheit.__doc__)`,
        },
      ],
    },
  ],
};
