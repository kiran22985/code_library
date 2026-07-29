import type { Module } from "@/lib/types";

export const functions: Module = {
  id: "functions",
  title: "Functions",
  description:
    "Defining reusable behaviour: parameters, scope, lambdas, recursion, closures, decorators and generators.",
  lessons: [
    {
      slug: "functions",
      title: "Defining functions",
      summary:
        "def, arguments, return values, and why functions are the main tool for organising code.",
      minutes: 7,
      blocks: [
        {
          type: "code",
          code: `def greet(name):
    """Return a greeting for the given name."""
    return f"Hello, {name}!"


message = greet("Kiran")
print(message)
print(greet("Ada"))`,
          output: "Hello, Kiran!\nHello, Ada!",
        },
        {
          type: "list",
          items: [
            "`def` starts the definition, followed by the name and parentheses.",
            "Names inside the parentheses are **parameters**; the values you pass are **arguments**.",
            "The indented body runs only when the function is called.",
            "`return` sends a value back and ends the function immediately.",
          ],
        },
        { type: "heading", text: "Return values" },
        {
          type: "code",
          code: `def add(a, b):
    return a + b


def shout(text):
    print(text.upper())      # prints, but returns nothing


total = add(2, 3)
nothing = shout("hello")

print(total)
print(nothing)               # every function without return gives None`,
          output: "HELLO\n5\nNone",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "print() is not return",
          md: "A function that prints shows text to the user; a function that returns gives a value you can use. `total = shout(\"hi\")` sets `total` to `None`. When in doubt, return the value and let the caller decide whether to print it.",
        },
        { type: "heading", text: "Returning several values" },
        {
          type: "code",
          code: `def stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)


low, high, average = stats([4, 8, 15, 16])
print(low, high, round(average, 2))`,
          output: "4 16 10.75",
        },
        { type: "heading", text: "Early returns" },
        {
          type: "code",
          code: `def safe_divide(a, b):
    if b == 0:
        return None          # leave immediately
    return a / b


print(safe_divide(10, 2))
print(safe_divide(10, 0))`,
          output: "5.0\nNone",
        },
        { type: "heading", text: "Type hints" },
        {
          type: "text",
          md: "Annotations document what a function expects and returns. Python does not enforce them at runtime, but editors and type checkers use them to catch mistakes before you run the code.",
        },
        {
          type: "code",
          code: `def repeat(text: str, times: int = 2) -> str:
    return text * times


print(repeat("ab"))
print(repeat("ab", 3))`,
          output: "abab\nababab",
        },
        {
          type: "callout",
          variant: "tip",
          title: "One function, one job",
          md: "If you cannot name a function without using “and”, it is doing too much. Small functions are easier to name, test and reuse.",
        },
        {
          type: "exercise",
          prompt:
            "Write `is_palindrome(text)` that returns True when the text reads the same backwards, ignoring case and spaces.",
          hint: "Normalise first: `cleaned = text.lower().replace(\" \", \"\")`.",
          solution: `def is_palindrome(text: str) -> bool:
    cleaned = text.lower().replace(" ", "")
    return cleaned == cleaned[::-1]


print(is_palindrome("Never odd or even"))
print(is_palindrome("python"))`,
        },
      ],
    },

    {
      slug: "parameters",
      title: "Parameters and arguments",
      summary:
        "Positional and keyword arguments, defaults, *args, **kwargs and argument order.",
      minutes: 8,
      blocks: [
        { type: "heading", text: "Positional and keyword arguments" },
        {
          type: "code",
          code: `def book(room, nights, breakfast):
    return f"{room} for {nights} nights, breakfast={breakfast}"


print(book("deluxe", 3, True))                       # positional
print(book(room="deluxe", nights=3, breakfast=True)) # keyword — order free
print(book("deluxe", breakfast=False, nights=1))     # mixed`,
          output:
            "deluxe for 3 nights, breakfast=True\ndeluxe for 3 nights, breakfast=True\ndeluxe for 1 nights, breakfast=False",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Keyword arguments make calls self-documenting. `create_user(\"ada\", True, False)` tells you nothing; `create_user(\"ada\", is_admin=True, notify=False)` tells you everything.",
        },
        { type: "heading", text: "Default values" },
        {
          type: "code",
          code: `def connect(host, port=5432, timeout=30):
    return f"{host}:{port} (timeout {timeout}s)"


print(connect("db.internal"))
print(connect("db.internal", 5433))
print(connect("db.internal", timeout=5))`,
          output:
            "db.internal:5432 (timeout 30s)\ndb.internal:5433 (timeout 30s)\ndb.internal:5432 (timeout 5s)",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Mutable defaults are shared",
          md: "`def f(items=[])` creates the list once, at definition time, and every call shares it. Use `items=None` and build the list inside the function.",
        },
        { type: "heading", text: "*args — any number of positional arguments" },
        {
          type: "code",
          code: `def total(*numbers):
    print(type(numbers), numbers)
    return sum(numbers)


print(total(1, 2, 3))
print(total())

values = [4, 5, 6]
print(total(*values))      # unpack a list into arguments`,
          output:
            "<class 'tuple'> (1, 2, 3)\n6\n<class 'tuple'> ()\n0\n<class 'tuple'> (4, 5, 6)\n15",
        },
        { type: "heading", text: "**kwargs — any number of keyword arguments" },
        {
          type: "code",
          code: `def configure(**options):
    for key, value in options.items():
        print(f"{key} = {value}")


configure(debug=True, port=8000)

settings = {"host": "localhost", "retries": 3}
configure(**settings)      # unpack a dict into keyword arguments`,
          output: "debug = True\nport = 8000\nhost = localhost\nretries = 3",
        },
        { type: "heading", text: "Putting it together" },
        {
          type: "code",
          code: `def log(level, *messages, timestamp=None, **extra):
    parts = " ".join(str(m) for m in messages)
    return f"[{level}] {parts} {timestamp or 'now'} {extra}"


print(log("INFO", "server", "started", timestamp="12:00", user="ada"))`,
          output: "[INFO] server started 12:00 {'user': 'ada'}",
        },
        {
          type: "table",
          head: ["Order", "Kind"],
          rows: [
            ["1", "Positional parameters"],
            ["2", "Parameters with defaults"],
            ["3", "`*args`"],
            ["4", "Keyword-only parameters"],
            ["5", "`**kwargs`"],
          ],
        },
        { type: "heading", text: "Forcing keyword-only arguments" },
        {
          type: "code",
          code: `def create_user(name, *, is_admin=False, notify=True):
    return f"{name} admin={is_admin} notify={notify}"


print(create_user("ada", is_admin=True))
# create_user("ada", True)   # TypeError: takes 1 positional argument`,
          output: "ada admin=True notify=True",
        },
        {
          type: "text",
          md: "Everything after a bare `*` must be passed by name. There is a mirror feature: parameters before a `/` are positional-only.",
        },
        {
          type: "exercise",
          prompt:
            "Write `make_tag(name, *children, **attributes)` that returns an HTML-ish string, e.g. `make_tag(\"a\", \"click\", href=\"/x\")` → `<a href=\"/x\">click</a>`.",
          hint: 'Build the attribute string with a generator expression and `" ".join(...)`.',
          solution: `def make_tag(name, *children, **attributes):
    attrs = "".join(f' {key}="{value}"' for key, value in attributes.items())
    inner = "".join(children)
    return f"<{name}{attrs}>{inner}</{name}>"


print(make_tag("a", "click", href="/x"))
print(make_tag("p", "hello ", "world"))`,
        },
      ],
    },

    {
      slug: "scope",
      title: "Scope and namespaces",
      summary:
        "Local, enclosing, global and built-in scope — the LEGB rule, plus global and nonlocal.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "When Python meets a name it searches four scopes in order — **L**ocal, **E**nclosing, **G**lobal, **B**uilt-in — and uses the first match.",
        },
        {
          type: "code",
          code: `message = "global"          # global scope


def outer():
    message = "enclosing"    # enclosing scope for inner()

    def inner():
        message = "local"    # local scope
        print(message)

    inner()
    print(message)


outer()
print(message)`,
          output: "local\nenclosing\nglobal",
        },
        { type: "heading", text: "Reading vs writing" },
        {
          type: "code",
          code: `count = 0


def show():
    print(count)      # reading a global is fine


def broken():
    print(count)      # UnboundLocalError!
    count = 1         # assigning anywhere makes count local everywhere


show()`,
          output: "0",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "UnboundLocalError",
          md: "If you assign to a name *anywhere* in a function, Python treats it as local for the whole function — even on lines before the assignment. That is why `broken()` fails on a line that only reads.",
        },
        { type: "heading", text: "global and nonlocal" },
        {
          type: "code",
          code: `counter = 0


def increment():
    global counter       # rebind the module-level name
    counter += 1


increment()
increment()
print(counter)


def make_counter():
    count = 0

    def bump():
        nonlocal count   # rebind the enclosing function's name
        count += 1
        return count

    return bump


tick = make_counter()
print(tick(), tick(), tick())`,
          output: "2\n1 2 3",
        },
        {
          type: "callout",
          variant: "warn",
          title: "global is usually the wrong answer",
          md: "Functions that mutate module state are hard to test and reason about. Pass values in as arguments and return results instead — reach for `global` only for genuine module configuration.",
        },
        { type: "heading", text: "Mutating is not rebinding" },
        {
          type: "code",
          code: `items = []


def add(value):
    items.append(value)     # mutating the object — no global needed


add("a")
add("b")
print(items)`,
          output: "['a', 'b']",
        },
        {
          type: "quiz",
          question: "What does the LEGB rule stand for?",
          options: [
            "List, Element, Group, Block",
            "Local, Enclosing, Global, Built-in",
            "Lambda, Except, Generator, Base",
            "Loop, Environment, Global, Bind",
          ],
          answer: 1,
          explanation:
            "Python resolves names by searching Local, then Enclosing, then Global, then Built-in scope.",
        },
      ],
    },

    {
      slug: "lambda",
      title: "Lambda functions",
      summary:
        "Small anonymous functions, where they shine as sort keys and callbacks, and when not to use them.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "A `lambda` is a one-expression function with no name. The expression's value is returned automatically.",
        },
        {
          type: "code",
          code: `square = lambda x: x ** 2      # equivalent to a def...


def square_def(x):
    return x ** 2


print(square(5), square_def(5))

add = lambda a, b: a + b
print(add(2, 3))`,
          output: "25 25\n5",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Do not assign a lambda to a name",
          md: "`square = lambda x: ...` gives you all the downsides of a function with none of the benefits — no docstring and a useless name in tracebacks. If it needs a name, use `def`. PEP 8 says so explicitly.",
        },
        { type: "heading", text: "Where lambdas earn their place" },
        {
          type: "code",
          code: `people = [("Ada", 36), ("Linus", 54), ("Grace", 45)]

print(sorted(people, key=lambda person: person[1]))

words = ["banana", "kiwi", "apple"]
print(sorted(words, key=lambda word: word[-1]))

items = [{"name": "b", "qty": 2}, {"name": "a", "qty": 9}]
print(max(items, key=lambda item: item["qty"]))`,
          output: `[('Ada', 36), ('Grace', 45), ('Linus', 54)]
['banana', 'apple', 'kiwi']
{'name': 'a', 'qty': 9}`,
        },
        { type: "heading", text: "With map and filter" },
        {
          type: "code",
          code: `numbers = [1, 2, 3, 4, 5, 6]

print(list(map(lambda n: n * 10, numbers)))
print(list(filter(lambda n: n % 2 == 0, numbers)))

# A comprehension usually reads better
print([n * 10 for n in numbers])
print([n for n in numbers if n % 2 == 0])`,
          output: `[10, 20, 30, 40, 50, 60]
[2, 4, 6]
[10, 20, 30, 40, 50, 60]
[2, 4, 6]`,
        },
        { type: "heading", text: "The limits" },
        {
          type: "list",
          items: [
            "One expression only — no statements, no `if/else` blocks, no loops.",
            "No docstring, no annotations, no meaningful name in a traceback.",
            "Anything longer than one short line belongs in a `def`.",
          ],
        },
        {
          type: "code",
          code: `# The conditional EXPRESSION is allowed
classify = lambda n: "even" if n % 2 == 0 else "odd"
print(classify(4), classify(7))`,
          output: "even odd",
        },
        {
          type: "exercise",
          prompt:
            'Sort `files = ["b.txt", "a.py", "c.md"]` by file extension using a lambda.',
          hint: 'Split on "." and take the last piece.',
          solution: `files = ["b.txt", "a.py", "c.md"]

print(sorted(files, key=lambda name: name.split(".")[-1]))`,
        },
      ],
    },

    {
      slug: "recursion",
      title: "Recursion",
      summary:
        "Functions that call themselves: base cases, the call stack, and when recursion is the right tool.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "A recursive function solves a problem by calling itself on a smaller version of the same problem. Every recursive function needs a **base case** that stops the recursion.",
        },
        {
          type: "code",
          code: `def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case


print(factorial(5))     # 5 * 4 * 3 * 2 * 1`,
          output: "120",
        },
        {
          type: "code",
          lang: "text",
          code: `factorial(4)
└─ 4 * factorial(3)
      └─ 3 * factorial(2)
            └─ 2 * factorial(1)
                  └─ 1          <- base case
        = 2 * 1 = 2
     = 3 * 2 = 6
  = 4 * 6 = 24`,
        },
        { type: "heading", text: "Where recursion shines: nested data" },
        {
          type: "code",
          code: `def total_size(node):
    """Sum sizes in an arbitrarily nested folder structure."""
    if isinstance(node, int):
        return node
    return sum(total_size(child) for child in node)


tree = [10, [20, 30, [5, 5]], [40]]
print(total_size(tree))`,
          output: "110",
        },
        {
          type: "code",
          code: `def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


print(flatten([1, [2, [3, [4, 5]]], 6]))`,
          output: "[1, 2, 3, 4, 5, 6]",
        },
        { type: "heading", text: "The recursion limit" },
        {
          type: "code",
          code: `import sys
print(sys.getrecursionlimit())

def countdown(n):
    if n == 0:
        return "done"
    return countdown(n - 1)

# countdown(5000)   # RecursionError: maximum recursion depth exceeded`,
          output: "1000",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Python does not optimise tail calls",
          md: "Every recursive call adds a stack frame, and the default limit is about 1000. Deep recursion on large inputs will crash — use a loop instead.",
        },
        { type: "heading", text: "Recursion vs iteration" },
        {
          type: "code",
          code: `def fib_recursive(n):
    if n < 2:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)   # exponential!


def fib_iterative(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


from functools import cache

@cache
def fib_cached(n):
    return n if n < 2 else fib_cached(n - 1) + fib_cached(n - 2)


print(fib_recursive(10), fib_iterative(10), fib_cached(90))`,
          output: "55 55 2880067194370816120",
        },
        {
          type: "callout",
          variant: "tip",
          md: "`@cache` from `functools` memoises results and turns the exponential Fibonacci into a linear one. It works on any pure function with hashable arguments.",
        },
        {
          type: "exercise",
          prompt:
            "Write a recursive `count_down(n)` that prints each number from n to 1 and then prints `Liftoff!`.",
          hint: "The base case is `n == 0`.",
          solution: `def count_down(n):
    if n == 0:
        print("Liftoff!")
        return
    print(n)
    count_down(n - 1)


count_down(3)`,
        },
      ],
    },

    {
      slug: "closures",
      title: "First-class functions and closures",
      summary:
        "Passing functions around, returning them, and how a closure remembers its enclosing state.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "Functions in Python are ordinary objects: you can store them in variables, pass them as arguments and return them from other functions.",
        },
        {
          type: "code",
          code: `def shout(text):
    return text.upper()


def whisper(text):
    return text.lower()


def apply(func, value):
    return func(value)


print(apply(shout, "Hello"))
print(apply(whisper, "Hello"))

transforms = {"loud": shout, "quiet": whisper}
print(transforms["loud"]("hey"))`,
          output: "HELLO\nhello\nHEY",
        },
        { type: "heading", text: "Closures" },
        {
          type: "text",
          md: "A closure is a function that remembers variables from the scope where it was created — even after that scope has finished running.",
        },
        {
          type: "code",
          code: `def multiplier(factor):
    def multiply(value):
        return value * factor      # 'factor' is remembered
    return multiply


double = multiplier(2)
triple = multiplier(3)

print(double(10), triple(10))
print(double.__closure__[0].cell_contents)`,
          output: "20 30\n2",
        },
        { type: "heading", text: "A practical closure" },
        {
          type: "code",
          code: `def make_validator(minimum, maximum):
    def validate(value):
        if not minimum <= value <= maximum:
            return f"must be between {minimum} and {maximum}"
        return None
    return validate


check_age = make_validator(0, 130)
check_percent = make_validator(0, 100)

print(check_age(200))
print(check_percent(50))`,
          output: "must be between 0 and 130\nNone",
        },
        { type: "heading", text: "The late-binding trap" },
        {
          type: "code",
          code: `funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])          # all 2 — i is looked up when called

fixed = [lambda i=i: i for i in range(3)]
print([f() for f in fixed])          # bind at definition time`,
          output: "[2, 2, 2]\n[0, 1, 2]",
        },
        {
          type: "callout",
          variant: "gotcha",
          md: "Closures capture **variables**, not values. If the variable changes later, the closure sees the new value. Capture with a default argument or `functools.partial` when you need the value frozen.",
        },
        {
          type: "code",
          code: `from functools import partial

def power(base, exponent):
    return base ** exponent


square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5), cube(2))`,
          output: "25 8",
        },
      ],
    },

    {
      slug: "decorators",
      title: "Decorators",
      summary:
        "Wrapping functions to add behaviour: timing, logging, caching, and writing your own.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "A decorator is a function that takes a function and returns a new one with extra behaviour around it. The `@` syntax is just shorthand for reassignment.",
        },
        {
          type: "code",
          code: `def announce(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper


@announce
def work():
    print("Working")


work()

# @announce is exactly this:
# work = announce(work)`,
          output: "Before\nWorking\nAfter",
        },
        { type: "heading", text: "Handling arguments and return values" },
        {
          type: "code",
          code: `import functools


def logged(func):
    @functools.wraps(func)              # keeps __name__ and __doc__
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}{args}")
        result = func(*args, **kwargs)
        print(f"  -> {result}")
        return result
    return wrapper


@logged
def add(a, b):
    """Add two numbers."""
    return a + b


add(2, 3)
print(add.__name__, "-", add.__doc__)`,
          output:
            "calling add(2, 3)\n  -> 5\nadd - Add two numbers.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Always use functools.wraps",
          md: "Without it, the decorated function reports the wrapper's name and loses its docstring, which breaks `help()`, debuggers and some frameworks.",
        },
        { type: "heading", text: "A timing decorator" },
        {
          type: "code",
          code: `import functools
import time


def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper


@timed
def slow_sum(n):
    return sum(range(n))


slow_sum(1_000_000)`,
          output: "slow_sum took 0.0231s",
        },
        { type: "heading", text: "Decorators that take arguments" },
        {
          type: "text",
          md: "One more layer: a function that returns a decorator.",
        },
        {
          type: "code",
          code: `import functools


def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator


@repeat(times=3)
def ping():
    print("ping")


ping()`,
          output: "ping\nping\nping",
        },
        { type: "heading", text: "Decorators you get for free" },
        {
          type: "code",
          code: `from functools import cache


@cache
def slow_square(n):
    print(f"computing {n}")
    return n ** 2


print(slow_square(4))
print(slow_square(4))     # cached, no recomputation`,
          output: "computing 4\n16\n16",
        },
        {
          type: "table",
          head: ["Decorator", "What it does"],
          rows: [
            ["`@functools.cache`", "Memoises results by arguments"],
            ["`@functools.wraps`", "Copies metadata onto a wrapper"],
            ["`@property`", "Turns a method into a computed attribute"],
            ["`@staticmethod` / `@classmethod`", "Changes how a method is bound"],
            ["`@dataclass`", "Generates `__init__`, `__repr__` and more"],
          ],
        },
        {
          type: "text",
          md: "Frameworks lean on decorators heavily — `@app.get(\"/items\")` in FastAPI and `@pytest.fixture` in pytest are the same mechanism you just learned.",
        },
        {
          type: "exercise",
          prompt:
            "Write a `retry(attempts)` decorator that re-runs a function when it raises an exception, up to `attempts` times, and re-raises if all attempts fail.",
          hint: "Loop over `range(attempts)` inside the wrapper and use `try/except`.",
          solution: `import functools


def retry(attempts):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as error:
                    print(f"attempt {attempt} failed: {error}")
                    if attempt == attempts:
                        raise
        return wrapper
    return decorator


@retry(attempts=3)
def flaky():
    raise ValueError("boom")`,
        },
      ],
    },

    {
      slug: "generators",
      title: "Generators and yield",
      summary:
        "Producing values lazily with yield, generator expressions, and streaming large data.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "A generator produces values **one at a time, on demand**. Instead of building a whole list in memory, it pauses at each `yield` and resumes where it left off.",
        },
        {
          type: "code",
          code: `def countdown(n):
    while n > 0:
        yield n
        n -= 1


gen = countdown(3)
print(gen)
print(next(gen))
print(next(gen))
print(list(gen))     # the rest`,
          output:
            "<generator object countdown at 0x10a3c2f80>\n3\n2\n[1]",
        },
        { type: "heading", text: "Memory: the whole point" },
        {
          type: "code",
          code: `import sys

as_list = [n ** 2 for n in range(100_000)]
as_generator = (n ** 2 for n in range(100_000))

print(sys.getsizeof(as_list), "bytes")
print(sys.getsizeof(as_generator), "bytes")`,
          output: "800984 bytes\n200 bytes",
        },
        {
          type: "text",
          md: "The generator stores only its current position. This is what lets you process a 10 GB log file on a laptop:",
        },
        {
          type: "code",
          code: `def read_errors(path):
    with open(path) as file:
        for line in file:            # files are iterators already
            if "ERROR" in line:
                yield line.strip()


# Nothing is read until you iterate
for error in read_errors("app.log"):
    print(error)`,
        },
        { type: "heading", text: "Generators are single-use" },
        {
          type: "code",
          code: `numbers = (n for n in range(3))

print(list(numbers))
print(list(numbers))     # exhausted — empty the second time`,
          output: "[0, 1, 2]\n[]",
        },
        { type: "heading", text: "Infinite sequences" },
        {
          type: "code",
          code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


from itertools import islice
print(list(islice(fibonacci(), 10)))`,
          output: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
        },
        { type: "heading", text: "yield from" },
        {
          type: "code",
          code: `def inner():
    yield 1
    yield 2


def outer():
    yield "start"
    yield from inner()      # delegate to another generator
    yield "end"


print(list(outer()))`,
          output: "['start', 1, 2, 'end']",
        },
        { type: "heading", text: "Building pipelines" },
        {
          type: "code",
          code: `def numbers():
    yield from range(1, 11)


def squared(source):
    for value in source:
        yield value ** 2


def only_even(source):
    for value in source:
        if value % 2 == 0:
            yield value


pipeline = only_even(squared(numbers()))
print(list(pipeline))`,
          output: "[4, 16, 36, 64, 100]",
        },
        {
          type: "callout",
          variant: "note",
          md: "Each stage pulls one value at a time from the previous one — no intermediate lists are ever created, no matter how long the pipeline is.",
        },
        {
          type: "exercise",
          prompt:
            "Write a generator `chunks(items, size)` that yields lists of at most `size` items from `items`.",
          hint: "Accumulate into a buffer and yield it when it reaches `size`; do not forget the leftover.",
          solution: `def chunks(items, size):
    buffer = []
    for item in items:
        buffer.append(item)
        if len(buffer) == size:
            yield buffer
            buffer = []
    if buffer:
        yield buffer


print(list(chunks(range(7), 3)))`,
        },
      ],
    },

    {
      slug: "functional-tools",
      title: "map, filter, zip and friends",
      summary:
        "The built-ins that operate on iterables: map, filter, zip, any, all, sorted and reversed.",
      minutes: 6,
      blocks: [
        { type: "heading", text: "map and filter" },
        {
          type: "code",
          code: `numbers = [1, 2, 3, 4, 5]

doubled = map(lambda n: n * 2, numbers)
print(list(doubled))

evens = filter(lambda n: n % 2 == 0, numbers)
print(list(evens))

# map over several iterables at once
print(list(map(lambda a, b: a + b, [1, 2, 3], [10, 20, 30])))

# map with an existing function is the readable case
print(list(map(str.upper, ["a", "b"])))`,
          output:
            "[2, 4, 6, 8, 10]\n[2, 4]\n[11, 22, 33]\n['A', 'B']",
        },
        {
          type: "callout",
          variant: "tip",
          md: "`map`/`filter` with a `lambda` is usually less readable than a comprehension. Use them when you already have a named function to apply.",
        },
        { type: "heading", text: "any and all" },
        {
          type: "code",
          code: `scores = [55, 78, 91]

print(any(score > 90 for score in scores))
print(all(score >= 50 for score in scores))
print(any([]))     # False
print(all([]))     # True — vacuously`,
          output: "True\nTrue\nFalse\nTrue",
        },
        {
          type: "code",
          code: `password = "Secret123"

checks = {
    "length": len(password) >= 8,
    "digit": any(char.isdigit() for char in password),
    "upper": any(char.isupper() for char in password),
}

print(checks)
print("Valid" if all(checks.values()) else "Invalid")`,
          output:
            "{'length': True, 'digit': True, 'upper': True}\nValid",
        },
        { type: "heading", text: "zip and unzip" },
        {
          type: "code",
          code: `names = ["ada", "linus"]
scores = [92, 78]

pairs = list(zip(names, scores))
print(pairs)

# Unzip with the * operator
back_names, back_scores = zip(*pairs)
print(back_names, back_scores)

# strict=True catches length mismatches (3.10+)
try:
    list(zip([1, 2, 3], [1], strict=True))
except ValueError as error:
    print("mismatch:", error)`,
          output: `[('ada', 92), ('linus', 78)]
('ada', 'linus') (92, 78)
mismatch: zip() argument 2 is shorter than argument 1`,
        },
        { type: "heading", text: "sorted with keys" },
        {
          type: "code",
          code: `from operator import itemgetter

records = [
    {"name": "ada", "score": 92},
    {"name": "linus", "score": 78},
    {"name": "grace", "score": 92},
]

print([r["name"] for r in sorted(records, key=itemgetter("score"), reverse=True)])

# Sort by several keys: score descending, then name ascending
ranked = sorted(records, key=lambda r: (-r["score"], r["name"]))
print([r["name"] for r in ranked])`,
          output: `['ada', 'grace', 'linus']
['ada', 'grace', 'linus']`,
        },
        { type: "heading", text: "reversed, sum, min, max" },
        {
          type: "code",
          code: `values = [3, 1, 4, 1, 5]

print(list(reversed(values)))
print(sum(values), min(values), max(values))
print(max(["apple", "fig"], key=len))
print(sum([2.5, 3.5], start=10))`,
          output: "[5, 1, 4, 1, 3]\n14 1 5\napple\n16.0",
        },
      ],
    },
  ],
};
