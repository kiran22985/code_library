import type { Module } from "@/lib/types";

export const stdlib: Module = {
  id: "stdlib",
  title: "Standard library and advanced features",
  description:
    "Iterators, context managers, collections, itertools, regex, typing, enums and randomness.",
  lessons: [
    {
      slug: "iterators",
      title: "Iterators and the iteration protocol",
      summary:
        "What really happens in a for loop, and how to make your own objects iterable.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "A `for` loop is syntactic sugar. Python calls `iter()` on the object to get an **iterator**, then calls `next()` on it until `StopIteration` is raised.",
        },
        {
          type: "code",
          code: `numbers = [1, 2, 3]
iterator = iter(numbers)

print(next(iterator))
print(next(iterator))
print(next(iterator))

try:
    next(iterator)
except StopIteration:
    print("exhausted")`,
          output: "1\n2\n3\nexhausted",
        },
        {
          type: "code",
          code: `# What "for value in numbers" actually does
iterator = iter([1, 2, 3])
while True:
    try:
        value = next(iterator)
    except StopIteration:
        break
    print(value)`,
          output: "1\n2\n3",
        },
        { type: "heading", text: "Iterable vs iterator" },
        {
          type: "table",
          head: ["", "Iterable", "Iterator"],
          rows: [
            ["Defines", "`__iter__`", "`__iter__` **and** `__next__`"],
            ["Examples", "list, str, dict, set", "generator, `iter(list)`, file object"],
            ["Reusable", "Yes — a fresh iterator each time", "No — consumed once"],
          ],
        },
        {
          type: "code",
          code: `numbers = [1, 2]

print(list(numbers), list(numbers))     # a list can be iterated repeatedly

gen = (n for n in numbers)
print(list(gen), list(gen))             # a generator cannot`,
          output: "[1, 2] [1, 2]\n[1, 2] []",
        },
        { type: "heading", text: "Making a class iterable" },
        {
          type: "code",
          code: `class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        current = self.start
        while current > 0:
            yield current           # a generator makes this trivial
            current -= 1


for value in Countdown(3):
    print(value, end=" ")
print()
print(list(Countdown(5)))`,
          output: "3 2 1 \n[5, 4, 3, 2, 1]",
        },
        {
          type: "code",
          code: `class Fibonacci:
    """The explicit protocol, without a generator."""

    def __init__(self, limit):
        self.limit = limit

    def __iter__(self):
        self.a, self.b, self.count = 0, 1, 0
        return self

    def __next__(self):
        if self.count >= self.limit:
            raise StopIteration
        value = self.a
        self.a, self.b = self.b, self.a + self.b
        self.count += 1
        return value


print(list(Fibonacci(8)))`,
          output: "[0, 1, 1, 2, 3, 5, 8, 13]",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Writing `__iter__` as a generator is almost always simpler than implementing `__next__` by hand — and it gets the `StopIteration` handling right for free.",
        },
      ],
    },

    {
      slug: "context-managers",
      title: "Context managers",
      summary:
        "The with statement, writing your own with __enter__/__exit__ or @contextmanager.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "A context manager guarantees that setup and cleanup happen as a pair, even when an exception interrupts the block.",
        },
        {
          type: "code",
          code: `# Without: the file stays open if an exception is raised
file = open("data.txt", "w")
file.write("risky")
file.close()

# With: closed no matter what happens
with open("data.txt", "w") as file:
    file.write("safe")`,
        },
        { type: "heading", text: "Writing one with a class" },
        {
          type: "code",
          code: `class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self                # whatever "as" receives

    def __exit__(self, exc_type, exc_value, traceback):
        import time
        self.elapsed = time.perf_counter() - self.start
        print(f"took {self.elapsed:.3f}s")
        return False               # False -> exceptions propagate


with Timer() as timer:
    total = sum(range(1_000_000))

print(total)`,
          output: "took 0.021s\n499999500000",
        },
        {
          type: "callout",
          variant: "note",
          md: "`__exit__` receives the exception details if one was raised. Returning `True` swallows it — do that only when suppressing is genuinely what you mean.",
        },
        { type: "heading", text: "The decorator version" },
        {
          type: "code",
          code: `from contextlib import contextmanager


@contextmanager
def working_directory(path):
    import os
    previous = os.getcwd()
    os.chdir(path)
    try:
        yield path              # everything before yield is __enter__
    finally:
        os.chdir(previous)      # everything after is __exit__


with working_directory("/tmp") as here:
    print("inside", here)

print("back where we started")`,
          output: "inside /tmp\nback where we started",
        },
        {
          type: "text",
          md: "The `try/finally` around the `yield` is what makes the cleanup unconditional. Leaving it out means an exception in the body skips the restore.",
        },
        { type: "heading", text: "Useful ones from contextlib" },
        {
          type: "code",
          code: `from contextlib import suppress, redirect_stdout
import io

# Ignore a specific exception
with suppress(FileNotFoundError):
    open("nope.txt")
print("still running")

# Capture printed output
buffer = io.StringIO()
with redirect_stdout(buffer):
    print("captured")
print(f"got: {buffer.getvalue().strip()}")`,
          output: "still running\ngot: captured",
        },
        {
          type: "code",
          code: `# Several managers in one statement
with open("in.txt") as source, open("out.txt", "w") as target:
    target.write(source.read().upper())`,
        },
        {
          type: "exercise",
          prompt:
            "Write a `@contextmanager` called `tag(name)` that prints an opening tag, yields, then prints a closing tag.",
          hint: "`print(f\"<{name}>\")` before the yield and the closing form after it.",
          solution: `from contextlib import contextmanager


@contextmanager
def tag(name):
    print(f"<{name}>")
    try:
        yield
    finally:
        print(f"</{name}>")


with tag("div"):
    with tag("p"):
        print("Hello")`,
        },
      ],
    },

    {
      slug: "collections-module",
      title: "The collections module",
      summary:
        "Counter, defaultdict, deque, namedtuple and OrderedDict — better containers for common jobs.",
      minutes: 7,
      blocks: [
        { type: "heading", text: "Counter" },
        {
          type: "code",
          code: `from collections import Counter

text = "the quick brown fox jumps over the lazy dog the end"
words = Counter(text.split())

print(words.most_common(3))
print(words["the"])
print(sum(words.values()), "words total")

letters = Counter("mississippi")
print(letters.most_common(2))

# Counters do arithmetic
print(Counter("aab") + Counter("abc"))
print(Counter("aab") - Counter("abc"))`,
          output: `[('the', 3), ('quick', 1), ('brown', 1)]
3
11 words total
[('i', 4), ('s', 4)]
Counter({'a': 3, 'b': 2, 'c': 1})
Counter({'a': 1})`,
        },
        { type: "heading", text: "defaultdict" },
        {
          type: "code",
          code: `from collections import defaultdict

# Without: you must guard every key
groups_manual = {}
for word in ["apple", "avocado", "banana"]:
    groups_manual.setdefault(word[0], []).append(word)

# With: missing keys create the default automatically
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)

print(dict(groups))

counts = defaultdict(int)
for char in "hello":
    counts[char] += 1
print(dict(counts))`,
          output:
            "{'a': ['apple', 'avocado'], 'b': ['banana']}\n{'h': 1, 'e': 1, 'l': 2, 'o': 1}",
        },
        {
          type: "callout",
          variant: "gotcha",
          md: "Reading a missing key from a `defaultdict` **creates** it. If you only want to check, use `key in data` — otherwise your dictionary grows silently.",
        },
        { type: "heading", text: "deque — fast at both ends" },
        {
          type: "code",
          code: `from collections import deque

queue = deque(["a", "b", "c"])

queue.append("d")          # add right
queue.appendleft("z")      # add left — O(1), unlike list.insert(0, x)
print(queue)

print(queue.pop(), queue.popleft())
print(queue)

# A fixed-size window that discards old entries
recent = deque(maxlen=3)
for value in range(6):
    recent.append(value)
print(recent)`,
          output: `deque(['z', 'a', 'b', 'c', 'd'])
d z
deque(['a', 'b', 'c'])
deque([3, 4, 5], maxlen=3)`,
        },
        {
          type: "text",
          md: "Inserting at the front of a list is O(n) because every element shifts. A `deque` does it in constant time, which matters for queues, BFS and sliding windows.",
        },
        { type: "heading", text: "namedtuple" },
        {
          type: "code",
          code: `from collections import namedtuple

Colour = namedtuple("Colour", "red green blue")

sky = Colour(70, 130, 180)
print(sky.red, sky[0])
print(sky._asdict())

red, green, blue = sky          # still unpacks like a tuple
print(green)`,
          output:
            "70 70\n{'red': 70, 'green': 130, 'blue': 180}\n130",
        },
        {
          type: "callout",
          variant: "tip",
          md: "For new code, a frozen `@dataclass` usually beats `namedtuple`: it supports type hints, defaults and methods more naturally. `namedtuple` still wins when you need tuple behaviour and minimal memory.",
        },
      ],
    },

    {
      slug: "itertools",
      title: "itertools and functools",
      summary:
        "Combinatorics, infinite iterators, grouping, chaining, caching, reduce and partial.",
      minutes: 7,
      blocks: [
        { type: "heading", text: "Combining and slicing iterables" },
        {
          type: "code",
          code: `from itertools import chain, islice, zip_longest

print(list(chain([1, 2], [3, 4], [5])))
print(list(islice(range(100), 3, 10, 2)))     # start, stop, step
print(list(zip_longest([1, 2, 3], "ab", fillvalue="-")))`,
          output:
            "[1, 2, 3, 4, 5]\n[3, 5, 7, 9]\n[(1, 'a'), (2, 'b'), (3, '-')]",
        },
        { type: "heading", text: "Infinite iterators" },
        {
          type: "code",
          code: `from itertools import count, cycle, repeat, islice

print(list(islice(count(10, 5), 4)))      # 10, 15, 20, 25
print(list(islice(cycle("ab"), 5)))
print(list(repeat("x", 3)))`,
          output:
            "[10, 15, 20, 25]\n['a', 'b', 'a', 'b', 'a']\n['x', 'x', 'x']",
        },
        {
          type: "callout",
          variant: "warn",
          md: "`count()` and `cycle()` never end. Always bound them with `islice()`, a `break` or `zip()` against a finite sequence.",
        },
        { type: "heading", text: "Combinatorics" },
        {
          type: "code",
          code: `from itertools import product, permutations, combinations

print(list(product("ab", [1, 2])))
print(list(permutations("abc", 2)))       # order matters
print(list(combinations("abc", 2)))       # order does not
print(len(list(combinations(range(10), 3))))`,
          output: `[('a', 1), ('a', 2), ('b', 1), ('b', 2)]
[('a', 'b'), ('a', 'c'), ('b', 'a'), ('b', 'c'), ('c', 'a'), ('c', 'b')]
[('a', 'b'), ('a', 'c'), ('b', 'c')]
120`,
        },
        { type: "heading", text: "groupby and accumulate" },
        {
          type: "code",
          code: `from itertools import groupby, accumulate

people = [
    {"name": "Ada", "team": "core"},
    {"name": "Grace", "team": "core"},
    {"name": "Linus", "team": "kernel"},
]

# groupby needs the data SORTED by the same key
people.sort(key=lambda person: person["team"])
for team, members in groupby(people, key=lambda person: person["team"]):
    print(team, [member["name"] for member in members])

print(list(accumulate([1, 2, 3, 4])))          # running total
print(list(accumulate([3, 1, 4], max)))        # running maximum`,
          output: `core ['Ada', 'Grace']
kernel ['Linus']
[1, 3, 6, 10]
[3, 3, 4]`,
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "groupby only groups adjacent items",
          md: "Unsorted input produces one group per run, not per key. Sort by the grouping key first — or use a `defaultdict(list)`, which does not care about order.",
        },
        { type: "heading", text: "functools" },
        {
          type: "code",
          code: `from functools import reduce, partial, cache, lru_cache

print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))    # 24

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
print(square(7))


@lru_cache(maxsize=128)
def slow_double(n):
    print("computing")
    return n * 2

print(slow_double(5), slow_double(5))
print(slow_double.cache_info())`,
          output: `24
49
computing
10 10
CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)`,
        },
        {
          type: "text",
          md: "`reduce` is rarely the clearest option — `sum()`, `min()`, `max()` and a plain loop usually beat it. `cache` and `partial`, on the other hand, earn their place constantly.",
        },
      ],
    },

    {
      slug: "regex",
      title: "Regular expressions",
      summary:
        "Pattern matching with re: search, findall, groups, substitution and the patterns worth knowing.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "Regular expressions describe patterns in text. Use them for validation, extraction and search-and-replace that plain string methods cannot express.",
        },
        {
          type: "code",
          code: `import re

text = "Contact us at hello@example.com or sales@shop.co.uk"

match = re.search(r"\\w+@\\w+\\.\\w+", text)
print(match.group())
print(match.start(), match.end())

print(re.findall(r"[\\w.]+@[\\w.]+", text))`,
          output:
            "hello@example.com\n14 31\n['hello@example.com', 'sales@shop.co.uk']",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Always use raw strings",
          md: "Write patterns as `r\"\\d+\"`. Without the `r`, Python interprets the backslashes first and your pattern quietly becomes something else.",
        },
        { type: "heading", text: "The syntax you will actually use" },
        {
          type: "table",
          head: ["Pattern", "Matches"],
          rows: [
            ["`.`", "Any character except newline"],
            ["`\\d` / `\\D`", "A digit / not a digit"],
            ["`\\w` / `\\W`", "Word character `[a-zA-Z0-9_]` / not"],
            ["`\\s` / `\\S`", "Whitespace / not"],
            ["`[abc]` / `[^abc]`", "One of / none of"],
            ["`*` `+` `?`", "0+, 1+, 0 or 1"],
            ["`{2,4}`", "Between 2 and 4 repeats"],
            ["`^` / `$`", "Start / end of string"],
            ["`\\b`", "Word boundary"],
            ["`(...)`", "Capturing group"],
            ["`a|b`", "a or b"],
          ],
        },
        { type: "heading", text: "The main functions" },
        {
          type: "code",
          code: `import re

print(bool(re.match(r"\\d+", "123abc")))     # anchored at the START
print(bool(re.search(r"\\d+", "abc123")))    # anywhere
print(re.findall(r"\\d+", "a1b22c333"))      # every match
print(re.sub(r"\\s+", " ", "too   many    spaces"))
print(re.split(r"[,;]\\s*", "a, b; c"))`,
          output:
            "True\nTrue\n['1', '22', '333']\ntoo many spaces\n['a', 'b', 'c']",
        },
        { type: "heading", text: "Groups" },
        {
          type: "code",
          code: `import re

log = "2026-07-29 14:30:05 ERROR Database timeout"
pattern = r"(\\d{4})-(\\d{2})-(\\d{2}) (\\S+) (\\w+) (.*)"

match = re.match(pattern, log)
print(match.group(1), match.group(5))
print(match.groups())

# Named groups are far more readable
named = r"(?P<date>\\S+) (?P<time>\\S+) (?P<level>\\w+) (?P<message>.*)"
found = re.match(named, log)
print(found.group("level"), "-", found.group("message"))
print(found.groupdict()["date"])`,
          output: `2026 ERROR
('2026', '07', '29', '14:30:05', 'ERROR', 'Database timeout')
ERROR - Database timeout
2026-07-29`,
        },
        { type: "heading", text: "Compile patterns you reuse" },
        {
          type: "code",
          code: `import re

EMAIL = re.compile(r"^[\\w.+-]+@[\\w-]+\\.[\\w.]+$")

for candidate in ["user@example.com", "not-an-email", "a@b.co"]:
    print(candidate, bool(EMAIL.match(candidate)))`,
          output:
            "user@example.com True\nnot-an-email False\na@b.co True",
        },
        { type: "heading", text: "Greedy vs lazy" },
        {
          type: "code",
          code: `import re

html = "<b>bold</b> and <i>italic</i>"

print(re.findall(r"<.*>", html))     # greedy — one huge match
print(re.findall(r"<.*?>", html))    # lazy — each tag`,
          output: `['<b>bold</b> and <i>italic</i>']
['<b>', '</b>', '<i>', '</i>']`,
        },
        {
          type: "callout",
          variant: "warn",
          title: "Do not parse HTML with regex",
          md: "Use an HTML parser such as BeautifulSoup or lxml. Regex cannot handle nesting, and every attempt eventually breaks on real-world markup.",
        },
        {
          type: "exercise",
          prompt:
            "Extract every hashtag from a string of social media text and return them lowercased without the `#`.",
          hint: "`re.findall(r\"#(\\w+)\", text)` — the capture group excludes the hash.",
          solution: `import re

text = "Loving #Python and #FastAPI. Also #python again!"
tags = {tag.lower() for tag in re.findall(r"#(\\w+)", text)}

print(sorted(tags))`,
        },
      ],
    },

    {
      slug: "typing",
      title: "Type hints",
      summary:
        "Annotating variables, functions and collections, plus Optional, Union, generics and mypy.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "Type hints document intent and let tools catch mistakes before you run the code. Python itself ignores them at runtime — they are for humans, editors and type checkers.",
        },
        {
          type: "code",
          code: `def greet(name: str, times: int = 1) -> str:
    return f"Hello {name}! " * times


age: int = 30
price: float = 19.99
names: list[str] = ["ada", "linus"]
scores: dict[str, int] = {"ada": 92}
point: tuple[int, int] = (3, 4)

print(greet("Ada", 2))`,
          output: "Hello Ada! Hello Ada! ",
        },
        { type: "heading", text: "Optional and unions" },
        {
          type: "code",
          code: `def find_user(user_id: int) -> dict | None:      # 3.10+ syntax
    users = {1: {"name": "Ada"}}
    return users.get(user_id)


def parse(value: str | int) -> int:
    return int(value)


user = find_user(1)
if user is not None:          # the type checker requires this guard
    print(user["name"])

print(parse("42") + parse(8))`,
          output: "Ada\n50",
        },
        {
          type: "text",
          md: "Older code writes `Optional[dict]` and `Union[str, int]` from the `typing` module — they mean exactly the same thing.",
        },
        { type: "heading", text: "Callables, aliases and literals" },
        {
          type: "code",
          code: `from typing import Callable, Literal, TypedDict

Handler = Callable[[str, int], bool]      # takes (str, int), returns bool
UserId = int                              # a readable alias


def apply(handler: Handler, text: str) -> bool:
    return handler(text, 1)


def set_mode(mode: Literal["light", "dark"]) -> str:
    return f"mode={mode}"


class User(TypedDict):
    name: str
    age: int


user: User = {"name": "Ada", "age": 36}

print(apply(lambda text, n: len(text) > n, "hello"))
print(set_mode("dark"), user["name"])`,
          output: "True\nmode=dark Ada",
        },
        { type: "heading", text: "Generics" },
        {
          type: "code",
          code: `def first(items: list[str]) -> str:
    return items[0]


# Works for any type, and preserves it — 3.12+ syntax
def first_of[T](items: list[T]) -> T:
    return items[0]


print(first(["a", "b"]))
print(first_of([1, 2]), first_of(["x"]))`,
          output: "a\n1 x",
        },
        { type: "heading", text: "Checking your types" },
        {
          type: "code",
          lang: "bash",
          code: `pip install mypy
mypy app.py`,
          output: `app.py:7: error: Argument 1 to "greet" has incompatible type "int"; expected "str"
Found 1 error in 1 file (checked 1 source file)`,
        },
        {
          type: "callout",
          variant: "note",
          md: "Hints are not enforced at runtime — `greet(42)` still runs and produces nonsense. `mypy`, `pyright` and your editor are what turn them into real safety. Pydantic and FastAPI go further and validate against them at runtime.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Where hints pay off most",
          md: "Annotate function signatures and public APIs. Skip obvious local variables — `count = 0` does not need `: int`.",
        },
      ],
    },

    {
      slug: "enums",
      title: "Enums and constants",
      summary:
        "Named constant sets with Enum, IntEnum, StrEnum and auto().",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "Enums replace loose strings and magic numbers with a fixed, self-documenting set of values that your editor can autocomplete and a type checker can verify.",
        },
        {
          type: "code",
          code: `from enum import Enum


class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    CLOSED = "closed"


order_status = Status.ACTIVE

print(order_status)
print(order_status.name, order_status.value)
print(Status("pending"))          # look up by value
print(Status["CLOSED"])           # look up by name
print(list(Status))`,
          output: `Status.ACTIVE
ACTIVE active
Status.PENDING
Status.CLOSED
[<Status.PENDING: 'pending'>, <Status.ACTIVE: 'active'>, <Status.CLOSED: 'closed'>]`,
        },
        { type: "heading", text: "Why not just strings?" },
        {
          type: "code",
          code: `# With plain strings, a typo is a silent bug
status = "activ"          # oops
if status == "active":
    print("never runs")

# With an enum, it fails immediately
from enum import Enum

class Status(Enum):
    ACTIVE = "active"

try:
    Status("activ")
except ValueError as error:
    print("Caught:", error)`,
          output: "Caught: 'activ' is not a valid Status",
        },
        { type: "heading", text: "auto(), IntEnum and StrEnum" },
        {
          type: "code",
          code: `from enum import Enum, IntEnum, StrEnum, auto


class Direction(Enum):
    NORTH = auto()            # values assigned automatically: 1, 2, 3, 4
    SOUTH = auto()
    EAST = auto()
    WEST = auto()


class Priority(IntEnum):      # comparable and usable as an int
    LOW = 1
    MEDIUM = 5
    HIGH = 10


class Colour(StrEnum):        # 3.11+, behaves like a str
    RED = "red"
    BLUE = "blue"


print(Direction.NORTH.value)
print(Priority.HIGH > Priority.LOW, Priority.HIGH + 5)
print("Colour is " + Colour.RED, Colour.RED == "red")`,
          output: "1\nTrue 15\nColour is red True",
        },
        { type: "heading", text: "Methods on enums" },
        {
          type: "code",
          code: `from enum import Enum


class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    CLOSED = "closed"

    @property
    def is_final(self) -> bool:
        return self is Status.CLOSED

    def label(self) -> str:
        return self.value.title()


print(Status.CLOSED.is_final, Status.ACTIVE.is_final)
print(Status.PENDING.label())`,
          output: "True False\nPending",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Compare enum members with `is`, and use them in `match` statements — `case Status.ACTIVE:` is exactly the dotted-name pattern that structural matching wants.",
        },
      ],
    },

    {
      slug: "math-random",
      title: "Maths, randomness and statistics",
      summary:
        "The math, random and statistics modules — and why random is not secure.",
      minutes: 5,
      blocks: [
        { type: "heading", text: "math" },
        {
          type: "code",
          code: `import math

print(math.sqrt(144), math.pow(2, 10))
print(math.floor(3.7), math.ceil(3.2), math.trunc(-3.7))
print(math.pi, math.e, math.inf)
print(math.factorial(6), math.gcd(48, 18))
print(math.log(100, 10), math.log2(1024))
print(round(math.degrees(math.pi), 1))
print(math.isclose(0.1 + 0.2, 0.3))`,
          output: `12.0 1024.0
3 4 -3
3.141592653589793 2.718281828459045 inf
720 6
2.0 10.0
180.0
True`,
        },
        { type: "heading", text: "random" },
        {
          type: "code",
          code: `import random

random.seed(42)          # makes the sequence reproducible

print(random.random())              # 0.0 <= x < 1.0
print(random.randint(1, 6))         # inclusive on both ends
print(random.randrange(0, 100, 5))
print(random.uniform(1.5, 3.5))

colours = ["red", "green", "blue", "yellow"]
print(random.choice(colours))
print(random.sample(colours, 2))            # without replacement
print(random.choices(colours, k=3))         # with replacement

deck = list(range(1, 6))
random.shuffle(deck)                        # shuffles in place
print(deck)`,
          output: `0.6394267984578837
1
70
2.4436241949695454
blue
['yellow', 'red']
['red', 'blue', 'blue']
[2, 1, 5, 3, 4]`,
        },
        {
          type: "callout",
          variant: "warn",
          title: "random is predictable",
          md: "The `random` module is a pseudo-random generator — fine for games, sampling and simulations, unsafe for anything security related. Use `secrets` for tokens, passwords and keys.",
        },
        {
          type: "code",
          code: `import secrets
import string

print(secrets.token_hex(16))
print(secrets.token_urlsafe(16))

alphabet = string.ascii_letters + string.digits
password = "".join(secrets.choice(alphabet) for _ in range(12))
print(len(password))`,
          output:
            "8f14e45fceea167a5a36dedd4bea2543\nq1w2e3r4t5y6u7i8o9p0aA\n12",
        },
        { type: "heading", text: "statistics" },
        {
          type: "code",
          code: `import statistics as stats

data = [12, 15, 11, 15, 18, 22, 15]

print(stats.mean(data))
print(stats.median(data))
print(stats.mode(data))
print(round(stats.stdev(data), 2))
print(round(stats.variance(data), 2))
print(stats.quantiles(data, n=4))`,
          output: `15.428571428571429
15
15
3.55
12.62
[12.0, 15.0, 18.0]`,
        },
        {
          type: "exercise",
          prompt:
            "Simulate rolling two dice 10,000 times and print how often each total from 2 to 12 occurred, as a percentage to one decimal place.",
          hint: "`Counter` plus `random.randint(1, 6)` twice per roll.",
          solution: `import random
from collections import Counter

rolls = Counter(
    random.randint(1, 6) + random.randint(1, 6)
    for _ in range(10_000)
)

for total in range(2, 13):
    percent = rolls[total] / 100
    print(f"{total:>2}: {percent:>5.1f}%  {'#' * int(percent)}")`,
        },
      ],
    },
  ],
};
