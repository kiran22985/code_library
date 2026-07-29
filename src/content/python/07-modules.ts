import type { Module } from "@/lib/types";

export const modules: Module = {
  id: "modules",
  title: "Modules and packages",
  description:
    "Splitting code across files, importing, the main guard, pip and virtual environments.",
  lessons: [
    {
      slug: "modules-imports",
      title: "Modules and imports",
      summary:
        "Splitting code into files, the four import styles, and how Python finds a module.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "Any `.py` file is a module. Importing it runs the file once and gives you access to everything defined inside.",
        },
        {
          type: "code",
          filename: "geometry.py",
          code: `"""Geometry helpers."""

PI = 3.14159


def circle_area(radius):
    return PI * radius ** 2


def rectangle_area(width, height):
    return width * height`,
        },
        {
          type: "code",
          filename: "main.py",
          code: `import geometry

print(geometry.PI)
print(geometry.circle_area(2))`,
          output: "3.14159\n12.56636",
        },
        { type: "heading", text: "The four import styles" },
        {
          type: "code",
          code: `# 1. The whole module — keeps the origin visible
import math
print(math.sqrt(16))

# 2. Specific names — shorter at the call site
from math import sqrt, pi
print(sqrt(25), round(pi, 4))

# 3. With an alias — for long or conventional names
import statistics as stats
print(stats.mean([1, 2, 3]))

# 4. Everything — avoid this
# from math import *      # pollutes your namespace, hides conflicts`,
          output: "4.0\n5.0 3.1416\n2",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Never use `from module import *`",
          md: "It dumps every public name into your file, so you cannot tell where anything came from and a later import can silently shadow your own functions.",
        },
        { type: "heading", text: "How Python finds modules" },
        {
          type: "code",
          code: `import sys

for path in sys.path[:4]:
    print(path or "(current directory)")`,
          output:
            "(current directory)\n/usr/local/lib/python312.zip\n/usr/local/lib/python3.12\n/usr/local/lib/python3.12/site-packages",
        },
        {
          type: "text",
          md: "Python searches `sys.path` in order: the script's own directory first, then the standard library, then installed packages.",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Do not name your file after a library",
          md: "Saving a script as `random.py` or `json.py` shadows the standard library module, and `import random` then imports *your* file. The symptom is a baffling `AttributeError` — rename the file and delete the stale `__pycache__`.",
        },
        { type: "heading", text: "The standard library is huge" },
        {
          type: "code",
          code: `import math, random, datetime, json, os, re

print(math.factorial(5))
print(random.choice(["a", "b", "c"]) in "abc")
print(datetime.date(2026, 7, 29).strftime("%d %B %Y"))
print(json.dumps({"ok": True}))
print(os.path.basename("/tmp/report.csv"))
print(bool(re.match(r"\\d+", "123abc")))`,
          output:
            "120\nTrue\n29 July 2026\n{\"ok\": true}\nreport.csv\nTrue",
        },
        {
          type: "text",
          md: "Before installing a third-party package, check whether the standard library already does the job — it usually does.",
        },
      ],
    },

    {
      slug: "packages",
      title: "Packages and project layout",
      summary:
        "Grouping modules into packages with __init__.py, and structuring a real project.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "A package is a directory of modules. Adding an `__init__.py` marks it as a package and lets you control what the package exposes.",
        },
        {
          type: "code",
          lang: "text",
          code: `myapp/
├── __init__.py
├── main.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   └── order.py
└── utils/
    ├── __init__.py
    └── validators.py`,
        },
        {
          type: "code",
          code: `# Absolute imports — clear and preferred
from myapp.models.user import User
from myapp.utils.validators import is_email

# Relative imports — only inside a package
from .user import User          # same package
from ..utils import validators  # parent package`,
        },
        { type: "heading", text: "__init__.py as a front door" },
        {
          type: "code",
          filename: "myapp/models/__init__.py",
          code: `"""Data models."""

from .user import User
from .order import Order

__all__ = ["User", "Order"]`,
        },
        {
          type: "text",
          md: "Now callers write `from myapp.models import User` instead of reaching into the file layout, so you can reorganise the internals later without breaking them.",
        },
        { type: "heading", text: "A practical project layout" },
        {
          type: "code",
          lang: "text",
          code: `project/
├── src/
│   └── myapp/
│       ├── __init__.py
│       └── main.py
├── tests/
│   └── test_main.py
├── pyproject.toml
├── README.md
└── .gitignore`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Run modules with -m",
          md: "`python3 -m myapp.main` runs a module inside a package with imports resolved correctly. Running `python3 myapp/main.py` directly often breaks relative imports.",
        },
      ],
    },

    {
      slug: "main-guard",
      title: "The __name__ == \"__main__\" guard",
      summary:
        "Why almost every Python script ends with the same two lines.",
      minutes: 4,
      blocks: [
        {
          type: "text",
          md: "Python sets a variable called `__name__` in every module. It is `\"__main__\"` when the file is run directly, and the module's name when it is imported.",
        },
        {
          type: "code",
          filename: "tools.py",
          code: `def double(n):
    return n * 2


print("tools.py is being loaded, __name__ =", __name__)

if __name__ == "__main__":
    print("Running directly")
    print(double(21))`,
        },
        {
          type: "code",
          lang: "bash",
          code: `python3 tools.py`,
          output:
            "tools.py is being loaded, __name__ = __main__\nRunning directly\n42",
        },
        {
          type: "code",
          code: `import tools           # in another file

print(tools.double(5))`,
          output: "tools.py is being loaded, __name__ = tools\n10",
        },
        {
          type: "text",
          md: "Notice what did **not** happen on import: the demo code inside the guard never ran. Without the guard, importing a module would execute its script section — printing output, opening files, maybe starting a server.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "The standard shape of a script",
          md: "Put your logic in functions, and keep the guard as a thin entry point. That way the file is both a runnable program and an importable, testable module.",
        },
        {
          type: "code",
          filename: "report.py",
          code: `import sys


def build_report(rows):
    return f"{len(rows)} rows processed"


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    rows = argv or ["a", "b"]
    print(build_report(rows))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())`,
        },
        {
          type: "quiz",
          question:
            "What is `__name__` inside `utils.py` when another file runs `import utils`?",
          options: ['"__main__"', '"utils"', '"utils.py"', "`None`"],
          answer: 1,
          explanation:
            "On import, `__name__` is the module's name — `\"utils\"`. It is only `\"__main__\"` in the file you actually ran.",
        },
      ],
    },

    {
      slug: "pip-venv",
      title: "pip and virtual environments",
      summary:
        "Installing third-party packages safely, per project, and recording dependencies.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "PyPI hosts hundreds of thousands of packages, installable with `pip`. But installing them globally means every project shares one set of versions — and eventually two projects need different ones.",
        },
        { type: "heading", text: "Create an environment per project" },
        {
          type: "code",
          lang: "bash",
          code: `# Create it (once per project)
python3 -m venv .venv

# Activate it
source .venv/bin/activate        # macOS / Linux
.venv\\Scripts\\activate           # Windows

# Your prompt now shows the environment
(.venv) $ which python
/Users/you/project/.venv/bin/python

# Leave it
deactivate`,
        },
        {
          type: "callout",
          variant: "tip",
          md: "Add `.venv/` to your `.gitignore`. You commit the *list* of dependencies, never the installed packages themselves.",
        },
        { type: "heading", text: "Installing packages" },
        {
          type: "code",
          lang: "bash",
          code: `pip install requests
pip install "django>=5.0,<6.0"     # version constraints
pip install -U requests            # upgrade
pip uninstall requests

pip list                           # what is installed
pip show requests                  # details about one package`,
        },
        {
          type: "code",
          code: `import requests            # after pip install requests

response = requests.get("https://api.github.com/repos/python/cpython")
data = response.json()

print(response.status_code)
print(data["stargazers_count"] > 0)`,
          output: "200\nTrue",
        },
        { type: "heading", text: "Recording dependencies" },
        {
          type: "code",
          lang: "bash",
          code: `# Freeze the exact versions you are using
pip freeze > requirements.txt

# Someone else (or your server) reproduces the environment
pip install -r requirements.txt`,
        },
        {
          type: "code",
          filename: "requirements.txt",
          lang: "text",
          code: `requests==2.32.3
python-dateutil==2.9.0
rich==13.7.1`,
        },
        {
          type: "text",
          md: "Modern projects increasingly declare dependencies in `pyproject.toml` instead, and tools such as **uv** or **Poetry** manage the environment and lock file for you.",
        },
        {
          type: "code",
          filename: "pyproject.toml",
          lang: "text",
          code: `[project]
name = "myapp"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    "requests>=2.32",
]`,
        },
        {
          type: "callout",
          variant: "warn",
          title: "Never sudo pip install",
          md: "Installing into the system Python can break your operating system's own tooling. Use a virtual environment — always.",
        },
        {
          type: "callout",
          variant: "note",
          title: "uv, the fast newcomer",
          md: "`uv` does the same job as pip and venv, but 10–100× faster: `uv venv`, `uv pip install requests`, `uv run script.py`. It is a drop-in replacement worth knowing about.",
        },
      ],
    },
  ],
};
