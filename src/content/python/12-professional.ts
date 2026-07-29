import type { Module } from "@/lib/types";

export const professional: Module = {
  id: "professional",
  title: "Professional Python",
  description:
    "Testing, logging, style, performance, packaging and a project to tie everything together.",
  lessons: [
    {
      slug: "testing",
      title: "Testing with pytest",
      summary:
        "Writing tests, assertions, fixtures, parametrising and testing that errors are raised.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "Tests let you change code without fear. `pytest` is the de-facto standard: plain functions, plain `assert`, no boilerplate.",
        },
        {
          type: "code",
          lang: "bash",
          code: `pip install pytest
pytest              # discovers test_*.py files and test_* functions
pytest -v           # one line per test
pytest -k "email"   # only tests matching a name`,
        },
        {
          type: "code",
          filename: "calculator.py",
          code: `def add(a, b):
    return a + b


def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b`,
        },
        {
          type: "code",
          filename: "test_calculator.py",
          code: `import pytest
from calculator import add, divide


def test_add_positive_numbers():
    assert add(2, 3) == 5


def test_add_negative_numbers():
    assert add(-1, -1) == -2


def test_divide():
    assert divide(10, 2) == 5


def test_divide_by_zero_raises():
    with pytest.raises(ValueError, match="Cannot divide"):
        divide(1, 0)`,
          output: `============ test session starts ============
collected 4 items

test_calculator.py ....                 [100%]

============= 4 passed in 0.02s =============`,
        },
        { type: "heading", text: "Parametrising" },
        {
          type: "code",
          code: `import pytest


def is_even(n):
    return n % 2 == 0


@pytest.mark.parametrize(
    "value,expected",
    [
        (2, True),
        (3, False),
        (0, True),
        (-4, True),
    ],
)
def test_is_even(value, expected):
    assert is_even(value) is expected`,
          output: "test_math.py ....                        [100%]",
        },
        {
          type: "text",
          md: "One test function, four independent cases — and a failure tells you exactly which input broke.",
        },
        { type: "heading", text: "Fixtures" },
        {
          type: "code",
          code: `import pytest


@pytest.fixture
def sample_users():
    """Fresh data for every test that asks for it."""
    return [
        {"name": "Ada", "age": 36},
        {"name": "Tim", "age": 17},
    ]


@pytest.fixture
def temp_file(tmp_path):          # tmp_path is built in
    path = tmp_path / "data.txt"
    path.write_text("hello")
    return path


def test_adults(sample_users):
    adults = [u for u in sample_users if u["age"] >= 18]
    assert len(adults) == 1


def test_file_contents(temp_file):
    assert temp_file.read_text() == "hello"`,
        },
        { type: "heading", text: "What to test" },
        {
          type: "list",
          items: [
            "The **happy path** — the normal case works.",
            "**Edge cases** — empty input, zero, one item, very large values.",
            "**Error cases** — invalid input raises what you promised it would.",
            "**Regressions** — every bug you fix gets a test so it cannot come back.",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Arrange, Act, Assert",
          md: "Structure each test in three blocks: set up the data, call the thing, check the result. One behaviour per test — the name should tell you what broke without opening the file.",
        },
        {
          type: "code",
          lang: "bash",
          code: `pip install pytest-cov
pytest --cov=myapp --cov-report=term-missing`,
          output: `Name              Stmts   Miss  Cover   Missing
-----------------------------------------------
myapp/core.py        48      4    92%   61-64
myapp/utils.py       23      0   100%
-----------------------------------------------
TOTAL                71      4    94%`,
        },
        {
          type: "exercise",
          prompt:
            "Write pytest tests for a `slugify(text)` function: normal text, text with punctuation, an empty string, and text that is already a slug.",
          hint: "Use `@pytest.mark.parametrize` to keep it to one test function.",
          solution: `import re
import pytest


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("Hello World", "hello-world"),
        ("Python 3.12: what's new?", "python-3-12-what-s-new"),
        ("", ""),
        ("already-a-slug", "already-a-slug"),
    ],
)
def test_slugify(raw, expected):
    assert slugify(raw) == expected`,
        },
      ],
    },

    {
      slug: "logging",
      title: "Logging",
      summary:
        "Replacing print with a configurable logger: levels, formats, files and per-module loggers.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "`print()` is for programs talking to a user. **Logging** is for programs talking to you about themselves — with levels, timestamps and destinations you can change without touching the code.",
        },
        {
          type: "code",
          code: `import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)

logger = logging.getLogger(__name__)

logger.debug("not shown — below the configured level")
logger.info("server starting on port %s", 8000)
logger.warning("cache miss rate is high")
logger.error("failed to reach the database")
logger.critical("shutting down")`,
          output: `10:15:02 INFO     __main__: server starting on port 8000
10:15:02 WARNING  __main__: cache miss rate is high
10:15:02 ERROR    __main__: failed to reach the database
10:15:02 CRITICAL __main__: shutting down`,
        },
        {
          type: "table",
          head: ["Level", "Use for"],
          rows: [
            ["`DEBUG`", "Detailed diagnostics while developing"],
            ["`INFO`", "Normal milestones — started, processed, finished"],
            ["`WARNING`", "Something unexpected, but still working"],
            ["`ERROR`", "An operation failed"],
            ["`CRITICAL`", "The program cannot continue"],
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Use %s, not an f-string",
          md: "`logger.info(\"user %s\", user_id)` only formats the message if that level is enabled, and log aggregators can group by the template. An f-string is formatted every time, even when the message is discarded.",
        },
        { type: "heading", text: "Logging exceptions" },
        {
          type: "code",
          code: `import logging

logger = logging.getLogger(__name__)

try:
    1 / 0
except ZeroDivisionError:
    logger.exception("calculation failed")   # includes the full traceback`,
          output: `ERROR __main__: calculation failed
Traceback (most recent call last):
  File "app.py", line 6, in <module>
    1 / 0
    ~~^~~
ZeroDivisionError: division by zero`,
        },
        { type: "heading", text: "Files and multiple destinations" },
        {
          type: "code",
          code: `import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)

console = logging.StreamHandler()
console.setLevel(logging.INFO)

file_handler = RotatingFileHandler("app.log", maxBytes=1_000_000, backupCount=3)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
)

logger.addHandler(console)
logger.addHandler(file_handler)

logger.debug("only in the file")
logger.info("console and file")`,
          output: "console and file",
        },
        {
          type: "callout",
          variant: "note",
          title: "One logger per module",
          md: "`logger = logging.getLogger(__name__)` at the top of every module gives you names like `myapp.services.email`, so you can raise or lower the level for one part of the system.",
        },
      ],
    },

    {
      slug: "style",
      title: "Style, PEP 8 and clean code",
      summary:
        "Naming, layout, idioms and the tools that keep a codebase consistent automatically.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "PEP 8 is Python's style guide. Following it is not about being fussy — it is about making every Python file in the world feel familiar.",
        },
        {
          type: "table",
          head: ["Thing", "Convention", "Example"],
          rows: [
            ["Variables, functions", "`snake_case`", "`total_price`, `send_email()`"],
            ["Classes", "`PascalCase`", "`BankAccount`"],
            ["Constants", "`UPPER_SNAKE`", "`MAX_RETRIES`"],
            ["Internal use", "leading underscore", "`_cache`"],
            ["Modules", "short, lowercase", "`utils.py`"],
            ["Indentation", "4 spaces", "—"],
            ["Line length", "79–88 characters", "—"],
          ],
        },
        { type: "heading", text: "Write idiomatic Python" },
        {
          type: "code",
          code: `items = ["a", "b", "c"]
value = ""

# Not Pythonic                     # Pythonic
if len(items) > 0: pass            # if items:
if value == "": pass               # if not value:
for i in range(len(items)): pass   # for item in items:
temp = a; a = b; b = temp          # a, b = b, a
result = []                        # result = [f(x) for x in items]
for x in items:
    result.append(x)`,
        },
        {
          type: "code",
          code: `# Comparisons
if value is None: ...           # not: if value == None
if isinstance(x, int): ...      # not: if type(x) == int

# Context managers instead of manual cleanup
with open("f.txt") as file:
    data = file.read()

# Unpacking instead of indexing
first, second = pair            # not: first = pair[0]; second = pair[1]

# join instead of += in a loop
line = ", ".join(str(item) for item in items)`,
        },
        { type: "heading", text: "Let tools do it" },
        {
          type: "code",
          lang: "bash",
          code: `pip install ruff

ruff format .        # formats every file (Black-compatible)
ruff check .         # lints for bugs, unused imports, style
ruff check --fix .   # fixes what it safely can`,
          output: `Found 12 errors (9 fixed, 3 remaining).
app.py:14:1: F401 'os' imported but unused
app.py:31:5: E722 do not use bare 'except'`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Automate style, then stop discussing it",
          md: "Run `ruff format` on save and add it to CI. Formatting arguments in code review are a waste of a team's attention — a tool settles them in milliseconds.",
        },
        {
          type: "code",
          filename: "pyproject.toml",
          lang: "text",
          code: `[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]   # errors, pyflakes, imports, upgrades, bugbear`,
        },
        {
          type: "heading",
          text: "The Zen of Python",
        },
        {
          type: "code",
          code: `import this`,
          output: `Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Flat is better than nested.
Readability counts.
Errors should never pass silently.
There should be one-- and preferably only one --obvious way to do it.
Now is better than never.`,
        },
      ],
    },

    {
      slug: "performance",
      title: "Performance",
      summary:
        "Measuring before optimising, choosing the right data structure, and the changes that actually help.",
      minutes: 6,
      blocks: [
        {
          type: "callout",
          variant: "warn",
          title: "Measure first",
          md: "Programmer intuition about what is slow is famously wrong. Profile, find the real hot spot, change it, then measure again.",
        },
        { type: "heading", text: "Timing" },
        {
          type: "code",
          code: `import timeit

concat = timeit.timeit(
    'result = ""\\nfor n in range(1000): result += str(n)',
    number=1000,
)
join = timeit.timeit(
    'result = "".join(str(n) for n in range(1000))',
    number=1000,
)

print(f"+=   {concat:.3f}s")
print(f"join {join:.3f}s")`,
          output: "+=   0.182s\njoin 0.114s",
        },
        {
          type: "code",
          lang: "bash",
          code: `python3 -m cProfile -s cumtime app.py | head -12`,
          output: `   ncalls  tottime  cumtime  filename:lineno(function)
        1    0.001    3.412  app.py:40(main)
     1000    0.012    3.102  app.py:22(fetch_row)
     1000    3.090    3.090  {method 'execute' of 'Cursor'}
     1000    0.008    0.210  app.py:31(parse)`,
        },
        { type: "heading", text: "Pick the right structure" },
        {
          type: "code",
          code: `import timeit

setup = "data = list(range(100_000)); lookup = set(data)"

print(timeit.timeit("99_999 in data", setup, number=100))
print(timeit.timeit("99_999 in lookup", setup, number=100))`,
          output: "0.412\n0.000",
        },
        {
          type: "table",
          head: ["Operation", "list", "set / dict", "deque"],
          rows: [
            ["`x in collection`", "O(n)", "**O(1)**", "O(n)"],
            ["Append at end", "O(1)", "O(1)", "O(1)"],
            ["Insert at front", "O(n)", "—", "**O(1)**"],
            ["Index access", "**O(1)**", "—", "O(n)"],
          ],
        },
        { type: "heading", text: "Changes that usually pay off" },
        {
          type: "list",
          items: [
            "Replace repeated `in list` membership tests with a `set`.",
            "Build strings with `\"\".join(...)`, not `+=` in a loop.",
            "Use comprehensions and built-ins (`sum`, `min`, `any`) — they run in C.",
            "Cache expensive pure functions with `@functools.cache`.",
            "Stream with generators instead of materialising large lists.",
            "Move work out of loops — compute constants once, hoist attribute lookups.",
          ],
        },
        {
          type: "code",
          code: `# Before: repeated attribute lookup and recomputation inside the loop
import math

def slow(points):
    result = []
    for x, y in points:
        result.append(math.sqrt(x ** 2 + y ** 2) * math.pi)
    return result


# After: bind the lookups once, use a comprehension
def fast(points, _sqrt=math.sqrt, _pi=math.pi):
    return [_sqrt(x * x + y * y) * _pi for x, y in points]


points = [(3, 4)] * 3
print(slow(points) == fast(points))`,
          output: "True",
        },
        {
          type: "callout",
          variant: "note",
          title: "When Python is genuinely too slow",
          md: "Reach for NumPy for numeric arrays, or move the hot loop into C, Rust (PyO3) or Cython. But that is the last 5% of cases — most “slow Python” is an O(n²) algorithm or an unnecessary database call in a loop.",
        },
      ],
    },

    {
      slug: "packaging",
      title: "Packaging and distribution",
      summary:
        "Turning your code into an installable package with pyproject.toml, and publishing it.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          lang: "text",
          code: `weathercli/
├── src/
│   └── weathercli/
│       ├── __init__.py
│       └── cli.py
├── tests/
│   └── test_cli.py
├── pyproject.toml
├── README.md
└── LICENSE`,
        },
        {
          type: "code",
          filename: "pyproject.toml",
          lang: "text",
          code: `[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "weathercli"
version = "0.1.0"
description = "Check the weather from your terminal"
readme = "README.md"
requires-python = ">=3.10"
license = { text = "MIT" }
authors = [{ name = "Kiran Giri" }]
dependencies = ["httpx>=0.27"]

[project.optional-dependencies]
dev = ["pytest>=8", "ruff>=0.5"]

[project.scripts]
weather = "weathercli.cli:main"     # creates the 'weather' command`,
        },
        { type: "heading", text: "Install it locally while you work" },
        {
          type: "code",
          lang: "bash",
          code: `python3 -m venv .venv && source .venv/bin/activate

pip install -e ".[dev]"    # editable install — code changes apply immediately

weather --city Kathmandu   # the console script defined above
pytest`,
        },
        { type: "heading", text: "Build and publish" },
        {
          type: "code",
          lang: "bash",
          code: `pip install build twine

python3 -m build           # creates dist/*.whl and dist/*.tar.gz

twine upload --repository testpypi dist/*    # try TestPyPI first
twine upload dist/*                          # then the real thing`,
          output: `Successfully built weathercli-0.1.0-py3-none-any.whl
View at: https://pypi.org/project/weathercli/0.1.0/`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Even for private code",
          md: "A `pyproject.toml` and a `src/` layout are worth it inside a company too — imports stop depending on the current directory, and `pip install -e .` beats fiddling with `sys.path`.",
        },
        {
          type: "callout",
          variant: "note",
          title: "Ship a CLI without publishing",
          md: "`pipx install .` installs your tool into an isolated environment and puts the command on your PATH, so it never conflicts with other projects.",
        },
      ],
    },

    {
      slug: "project-cli",
      title: "Project: a task manager CLI",
      summary:
        "Put the whole course together: classes, JSON persistence, argparse, errors and tests.",
      minutes: 12,
      blocks: [
        {
          type: "text",
          md: "This project uses almost everything from the course: dataclasses, JSON files, pathlib, exceptions, type hints, `argparse` and pytest. Build it file by file.",
        },
        { type: "heading", text: "The data model" },
        {
          type: "code",
          filename: "tasks/models.py",
          code: `from dataclasses import dataclass, field, asdict
from datetime import date
from enum import StrEnum


class Priority(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class Task:
    id: int
    title: str
    priority: Priority = Priority.MEDIUM
    done: bool = False
    tags: list[str] = field(default_factory=list)
    created: str = field(default_factory=lambda: date.today().isoformat())

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "Task":
        return cls(**{**data, "priority": Priority(data["priority"])})

    def __str__(self) -> str:
        mark = "x" if self.done else " "
        tags = f" [{', '.join(self.tags)}]" if self.tags else ""
        return f"[{mark}] {self.id:>3} {self.title}{tags} ({self.priority})"`,
        },
        { type: "heading", text: "Storage" },
        {
          type: "code",
          filename: "tasks/storage.py",
          code: `import json
from pathlib import Path

from .models import Task

STORE = Path.home() / ".tasks.json"


class StorageError(Exception):
    """Raised when the task file cannot be read or written."""


def load(path: Path = STORE) -> list[Task]:
    if not path.exists():
        return []
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise StorageError(f"{path} is corrupted") from error
    return [Task.from_dict(item) for item in raw]


def save(tasks: list[Task], path: Path = STORE) -> None:
    payload = [task.to_dict() for task in tasks]
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")`,
        },
        { type: "heading", text: "Operations" },
        {
          type: "code",
          filename: "tasks/service.py",
          code: `from .models import Priority, Task
from .storage import load, save


class TaskNotFound(Exception):
    pass


def add(title: str, priority: str = "medium", tags: list[str] | None = None) -> Task:
    tasks = load()
    next_id = max((task.id for task in tasks), default=0) + 1
    task = Task(id=next_id, title=title, priority=Priority(priority), tags=tags or [])
    tasks.append(task)
    save(tasks)
    return task


def complete(task_id: int) -> Task:
    tasks = load()
    for task in tasks:
        if task.id == task_id:
            task.done = True
            save(tasks)
            return task
    raise TaskNotFound(f"No task with id {task_id}")


def listing(show_done: bool = False, tag: str | None = None) -> list[Task]:
    tasks = load()
    if not show_done:
        tasks = [task for task in tasks if not task.done]
    if tag:
        tasks = [task for task in tasks if tag in task.tags]
    order = {Priority.HIGH: 0, Priority.MEDIUM: 1, Priority.LOW: 2}
    return sorted(tasks, key=lambda task: (order[task.priority], task.id))`,
        },
        { type: "heading", text: "The command line interface" },
        {
          type: "code",
          filename: "tasks/cli.py",
          code: `import argparse
import sys

from . import service
from .storage import StorageError


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="tasks", description="A tiny task manager")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="add a task")
    add.add_argument("title")
    add.add_argument("-p", "--priority", choices=["low", "medium", "high"], default="medium")
    add.add_argument("-t", "--tag", action="append", dest="tags", default=[])

    done = sub.add_parser("done", help="mark a task complete")
    done.add_argument("id", type=int)

    listing = sub.add_parser("list", help="list tasks")
    listing.add_argument("-a", "--all", action="store_true")
    listing.add_argument("-t", "--tag")

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)

    try:
        match args.command:
            case "add":
                task = service.add(args.title, args.priority, args.tags)
                print(f"Added {task}")
            case "done":
                task = service.complete(args.id)
                print(f"Completed {task}")
            case "list":
                tasks = service.listing(show_done=args.all, tag=args.tag)
                if not tasks:
                    print("Nothing to do.")
                for task in tasks:
                    print(task)
    except service.TaskNotFound as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    except StorageError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())`,
        },
        {
          type: "code",
          lang: "bash",
          code: `python3 -m tasks.cli add "Write the FastAPI course" -p high -t work
python3 -m tasks.cli add "Buy milk" -t home
python3 -m tasks.cli list
python3 -m tasks.cli done 2`,
          output: `Added [ ]   1 Write the FastAPI course [work] (high)
Added [ ]   2 Buy milk [home] (medium)
[ ]   1 Write the FastAPI course [work] (high)
[ ]   2 Buy milk [home] (medium)
Completed [x]   2 Buy milk [home] (medium)`,
        },
        { type: "heading", text: "Tests" },
        {
          type: "code",
          filename: "tests/test_service.py",
          code: `import pytest

from tasks import service, storage
from tasks.models import Priority


@pytest.fixture(autouse=True)
def temp_store(tmp_path, monkeypatch):
    """Point the storage at a temp file so tests never touch real data."""
    monkeypatch.setattr(storage, "STORE", tmp_path / "tasks.json")


def test_add_assigns_incrementing_ids():
    first = service.add("one")
    second = service.add("two")
    assert (first.id, second.id) == (1, 2)


def test_complete_marks_done():
    task = service.add("finish me")
    assert service.complete(task.id).done is True


def test_complete_unknown_id_raises():
    with pytest.raises(service.TaskNotFound):
        service.complete(999)


def test_listing_sorts_by_priority():
    service.add("low one", priority="low")
    service.add("urgent", priority="high")
    assert service.listing()[0].priority is Priority.HIGH`,
        },
        {
          type: "exercise",
          prompt:
            "Extend the project: add a `remove <id>` command, a `--due DATE` option on `add` that stores an ISO date, and a test for each.",
          hint: "Add a subparser in `build_parser()`, a function in `service.py`, and a field on the `Task` dataclass with a default of `None`.",
          solution: `# tasks/models.py — add the field
# due: str | None = None

# tasks/service.py
def remove(task_id: int) -> None:
    tasks = load()
    remaining = [task for task in tasks if task.id != task_id]
    if len(remaining) == len(tasks):
        raise TaskNotFound(f"No task with id {task_id}")
    save(remaining)


# tasks/cli.py — inside build_parser()
# remove = sub.add_parser("remove", help="delete a task")
# remove.add_argument("id", type=int)

# tests/test_service.py
def test_remove_deletes_task():
    task = service.add("temporary")
    service.remove(task.id)
    assert service.listing() == []`,
        },
      ],
    },

    {
      slug: "next-steps",
      title: "Where to go next",
      summary:
        "Choosing a path after the fundamentals: web, data, automation or systems — and how to keep improving.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "You now know the language. What separates people who *know Python* from people who *build things with Python* is picking a direction and shipping something in it.",
        },
        { type: "heading", text: "Pick a path" },
        {
          type: "table",
          head: ["Path", "Learn next", "Build"],
          rows: [
            [
              "**Web / APIs**",
              "FastAPI or Django, SQL, HTTP, Docker",
              "A REST API with auth and a database",
            ],
            [
              "**Data**",
              "pandas, NumPy, Matplotlib, Jupyter",
              "An analysis of a dataset you actually care about",
            ],
            [
              "**Automation**",
              "requests/httpx, BeautifulSoup, schedulers",
              "A script that removes a chore from your week",
            ],
            [
              "**AI / ML**",
              "scikit-learn, PyTorch, the Anthropic or OpenAI SDKs",
              "A small model or an LLM-powered tool",
            ],
            [
              "**Systems**",
              "asyncio, profiling, C extensions, packaging",
              "A CLI tool published to PyPI",
            ],
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "FastAPI is the natural next step here",
          md: "It builds directly on what you learned: type hints become request validation, `async def` becomes route handlers, decorators become routing. The FastAPI course on CodeLibrary is next in the queue — see the [roadmap](/roadmap).",
        },
        { type: "heading", text: "Habits that compound" },
        {
          type: "list",
          items: [
            "**Read source code.** The standard library is on your machine — open `pathlib.py` and see how it works.",
            "**Write tests for your own projects.** It is the fastest way to learn what good structure feels like.",
            "**Use type hints and a linter** from day one on new projects.",
            "**Rebuild something you already wrote** six months later. The gap between the two versions is your progress.",
            "**Explain a concept to someone else.** If you cannot, you have found your next thing to study.",
          ],
        },
        { type: "heading", text: "Reference worth bookmarking" },
        {
          type: "list",
          items: [
            "[docs.python.org](https://docs.python.org/3/) — the official documentation and tutorial.",
            "[PEP 8](https://peps.python.org/pep-0008/) — the style guide.",
            "[Real Python](https://realpython.com) — deep, well-edited articles.",
            "[PyPI](https://pypi.org) — before you write it, check whether it exists.",
          ],
        },
        {
          type: "text",
          md: "Finished every lesson? Go back to the [course page](/python) and check your progress — then start building something that does not exist yet.",
        },
      ],
    },
  ],
};
