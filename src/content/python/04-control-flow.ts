import type { Module } from "@/lib/types";

export const controlFlow: Module = {
  id: "control-flow",
  title: "Control flow",
  description:
    "Making decisions and repeating work: if/elif/else, match, for, while and loop control.",
  lessons: [
    {
      slug: "if-else",
      title: "if, elif and else",
      summary:
        "Branching on conditions, nesting, the ternary expression and guard clauses.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          code: `score = 87

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(grade)`,
          output: "B",
        },
        {
          type: "text",
          md: "Python checks each branch in order and runs the **first** one that is true, then skips the rest. `elif` and `else` are both optional, and you can have as many `elif` branches as you need.",
        },
        { type: "heading", text: "Combining conditions" },
        {
          type: "code",
          code: `age = 25
has_ticket = True
is_banned = False

if age >= 18 and has_ticket and not is_banned:
    print("Welcome in")

if age < 13 or age > 64:
    print("Discounted ticket")
else:
    print("Standard ticket")`,
          output: "Welcome in\nStandard ticket",
        },
        { type: "heading", text: "Truthiness in conditions" },
        {
          type: "code",
          code: `items = []
name = "Kiran"

if items:
    print("Cart has items")
else:
    print("Cart is empty")

if name:
    print(f"Hello {name}")`,
          output: "Cart is empty\nHello Kiran",
        },
        { type: "heading", text: "The conditional expression" },
        {
          type: "code",
          code: `age = 20

status = "adult" if age >= 18 else "minor"
print(status)

# Useful inline, but do not nest them
count = 1
print(f"{count} item{'s' if count != 1 else ''}")`,
          output: "adult\n1 item",
        },
        { type: "heading", text: "Guard clauses beat nesting" },
        {
          type: "code",
          code: `def process(order):
    # Nested version — hard to follow as rules accumulate
    if order is not None:
        if order["paid"]:
            if order["items"]:
                return "shipping"
            return "no items"
        return "unpaid"
    return "no order"


def process_better(order):
    # Handle the exits first, keep the happy path unindented
    if order is None:
        return "no order"
    if not order["paid"]:
        return "unpaid"
    if not order["items"]:
        return "no items"
    return "shipping"


print(process_better({"paid": True, "items": ["book"]}))
print(process_better({"paid": False, "items": []}))`,
          output: "shipping\nunpaid",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Deep nesting is a smell. Return early for the invalid cases and your main logic stays at one indentation level.",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "= vs ==",
          md: "`if x = 5:` is a `SyntaxError` — `=` assigns, `==` compares. Python deliberately makes this an error, unlike C where it silently “works”.",
        },
        {
          type: "exercise",
          prompt:
            "Write a program that classifies a year as a leap year. A year is a leap year if it is divisible by 4, except centuries, which must be divisible by 400.",
          hint: "`year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`",
          solution: `year = 2000

if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
    print(f"{year} is a leap year")
else:
    print(f"{year} is not a leap year")`,
        },
      ],
    },

    {
      slug: "match-case",
      title: "Structural pattern matching",
      summary:
        "The match statement (Python 3.10+): matching literals, sequences, dicts, classes and guards.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "`match` compares a value against a series of **patterns**. In its simplest form it looks like a switch statement, but it can also destructure data as it matches.",
        },
        {
          type: "code",
          code: `def describe(status):
    match status:
        case 200 | 201 | 204:
            return "success"
        case 301 | 302:
            return "redirect"
        case 404:
            return "not found"
        case _:
            return "unknown"


print(describe(201), describe(404), describe(500))`,
          output: "success not found unknown",
        },
        {
          type: "callout",
          variant: "note",
          md: "`case _:` is the wildcard — the equivalent of `default`. Without it, a value matching nothing simply falls through and the `match` does nothing.",
        },
        { type: "heading", text: "Destructuring sequences" },
        {
          type: "code",
          code: `def handle(command):
    match command.split():
        case ["quit"]:
            return "Goodbye"
        case ["move", direction]:
            return f"Moving {direction}"
        case ["set", key, value]:
            return f"{key} = {value}"
        case ["add", *items]:
            return f"Adding {len(items)} items"
        case _:
            return "Unrecognised command"


print(handle("quit"))
print(handle("move north"))
print(handle("set theme dark"))
print(handle("add a b c"))`,
          output:
            "Goodbye\nMoving north\ntheme = dark\nAdding 3 items",
        },
        { type: "heading", text: "Matching dictionaries" },
        {
          type: "code",
          code: `def route(event):
    match event:
        case {"type": "click", "x": x, "y": y}:
            return f"Click at ({x}, {y})"
        case {"type": "key", "key": key}:
            return f"Key {key}"
        case {"type": _}:
            return "Other event"
        case _:
            return "Not an event"


print(route({"type": "click", "x": 10, "y": 20}))
print(route({"type": "key", "key": "Esc"}))
print(route({"type": "scroll", "delta": 3}))`,
          output: "Click at (10, 20)\nKey Esc\nOther event",
        },
        {
          type: "text",
          md: "A dict pattern matches if the listed keys are present — extra keys are allowed, which makes it perfect for API payloads.",
        },
        { type: "heading", text: "Guards" },
        {
          type: "code",
          code: `def category(point):
    match point:
        case (0, 0):
            return "origin"
        case (x, 0) if x > 0:
            return "positive x-axis"
        case (0, y):
            return "y-axis"
        case (x, y) if x == y:
            return "diagonal"
        case _:
            return "somewhere else"


print(category((0, 0)), category((5, 0)), category((3, 3)))`,
          output: "origin positive x-axis diagonal",
        },
        {
          type: "callout",
          variant: "warn",
          title: "A bare name always matches",
          md: "`case status:` does not compare against a variable called `status` — it *captures* the value into a new variable and matches everything. To compare against a constant, use a dotted name such as `case Status.OK:`.",
        },
        {
          type: "text",
          md: "For two or three simple branches, `if/elif` is still clearer. Reach for `match` when you are picking apart structured data.",
        },
      ],
    },

    {
      slug: "for-loops",
      title: "for loops",
      summary:
        "Iterating over sequences, using range, enumerate and zip, and looping over dictionaries.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "A `for` loop walks through the items of any **iterable** — a list, string, dict, file, range or generator. There is no index counter to manage.",
        },
        {
          type: "code",
          code: `for language in ["Python", "Go", "Rust"]:
    print(f"I am learning {language}")

for char in "hi":
    print(char)`,
          output: "I am learning Python\nI am learning Go\nI am learning Rust\nh\ni",
        },
        { type: "heading", text: "range()" },
        {
          type: "code",
          code: `for i in range(3):
    print(i, end=" ")          # 0 1 2
print()

for i in range(1, 6):
    print(i, end=" ")          # 1..5 — stop is exclusive
print()

for i in range(0, 20, 5):
    print(i, end=" ")          # step
print()

for i in range(5, 0, -1):
    print(i, end=" ")          # countdown`,
          output: "0 1 2 \n1 2 3 4 5 \n0 5 10 15 \n5 4 3 2 1 ",
        },
        { type: "heading", text: "enumerate() — index and value" },
        {
          type: "code",
          code: `tasks = ["write", "review", "deploy"]

for index, task in enumerate(tasks, start=1):
    print(f"{index}. {task}")`,
          output: "1. write\n2. review\n3. deploy",
        },
        { type: "heading", text: "zip() — several sequences at once" },
        {
          type: "code",
          code: `names = ["Ada", "Linus", "Guido"]
langs = ["Analytical Engine", "C", "Python"]

for name, lang in zip(names, langs):
    print(f"{name:<7} {lang}")

# zip stops at the shortest input
print(list(zip([1, 2, 3], "ab")))`,
          output:
            "Ada     Analytical Engine\nLinus   C\nGuido   Python\n[(1, 'a'), (2, 'b')]",
        },
        { type: "heading", text: "Looping over dictionaries" },
        {
          type: "code",
          code: `stock = {"apples": 12, "pears": 0, "figs": 5}

for item, count in stock.items():
    state = "in stock" if count else "sold out"
    print(f"{item:<8} {state}")`,
          output: "apples   in stock\npears    sold out\nfigs     in stock",
        },
        { type: "heading", text: "Nested loops" },
        {
          type: "code",
          code: `for row in range(1, 4):
    for col in range(1, 4):
        print(f"{row * col:3}", end="")
    print()`,
          output: "  1  2  3\n  2  4  6\n  3  6  9",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Do not loop over range(len(x))",
          md: "`for i in range(len(items)): print(items[i])` works but is noisy. Loop over the items directly, or use `enumerate()` when you need the index.",
        },
        {
          type: "exercise",
          prompt:
            "Print the FizzBuzz sequence for 1 to 20: multiples of 3 print `Fizz`, multiples of 5 print `Buzz`, multiples of both print `FizzBuzz`, everything else prints the number.",
          hint: "Check the 15 case first, or build the word by concatenation.",
          solution: `for n in range(1, 21):
    word = ""
    if n % 3 == 0:
        word += "Fizz"
    if n % 5 == 0:
        word += "Buzz"
    print(word or n)`,
        },
      ],
    },

    {
      slug: "while-loops",
      title: "while loops",
      summary:
        "Repeating until a condition changes, avoiding infinite loops, and the read-until-sentinel pattern.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "Use `for` when you know what you are iterating over, and `while` when you repeat until something becomes true.",
        },
        {
          type: "code",
          code: `countdown = 3

while countdown > 0:
    print(countdown)
    countdown -= 1

print("Liftoff!")`,
          output: "3\n2\n1\nLiftoff!",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "The infinite loop",
          md: "If nothing inside the loop can make the condition false, it never ends. Forgetting `countdown -= 1` above hangs the program — press Ctrl+C to stop it.",
        },
        { type: "heading", text: "Loop until valid input" },
        {
          type: "code",
          code: `attempts = 0
password = ""

while password != "secret" and attempts < 3:
    password = input("Password: ")
    attempts += 1

print("Access granted" if password == "secret" else "Locked out")`,
          output: "Password: guess\nPassword: secret\nAccess granted",
        },
        { type: "heading", text: "while True with break" },
        {
          type: "text",
          md: "When the exit condition is easiest to check in the middle of the body, loop forever and break out explicitly:",
        },
        {
          type: "code",
          code: `menu = """
1. Add item
2. List items
3. Quit
"""

items = []
while True:
    choice = input("Choose: ").strip()

    if choice == "3":
        print("Bye")
        break
    elif choice == "1":
        items.append(input("Item name: "))
    elif choice == "2":
        print(items or "nothing yet")
    else:
        print("Invalid choice")`,
          output:
            "Choose: 1\nItem name: milk\nChoose: 2\n['milk']\nChoose: 3\nBye",
        },
        { type: "heading", text: "Accumulating with a condition" },
        {
          type: "code",
          code: `balance = 1000
rate = 0.05
years = 0

while balance < 2000:
    balance *= 1 + rate
    years += 1

print(f"Doubled after {years} years ({balance:.2f})")`,
          output: "Doubled after 15 years (2078.93)",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Anything you can write with `while` and a counter, you can usually write more clearly with `for` and `range()`. Prefer `for` when the number of iterations is known up front.",
        },
        {
          type: "exercise",
          prompt:
            "Ask the user for numbers repeatedly until they type `done`, then print how many numbers they entered and their total.",
          hint: "Break out of `while True` when the input equals `\"done\"`.",
          solution: `total = 0
count = 0

while True:
    raw = input("Number (or 'done'): ").strip().lower()
    if raw == "done":
        break
    if not raw.replace(".", "", 1).isdigit():
        print("Not a number")
        continue
    total += float(raw)
    count += 1

print(f"{count} numbers, total {total}")`,
        },
      ],
    },

    {
      slug: "loop-control",
      title: "break, continue and else",
      summary:
        "Exiting early, skipping an iteration, and the loop-else clause nobody knows about.",
      minutes: 5,
      blocks: [
        { type: "heading", text: "break — leave the loop" },
        {
          type: "code",
          code: `haystack = [3, 7, 12, 5, 9]

for number in haystack:
    if number > 10:
        print(f"Found {number}, stopping")
        break
    print("checked", number)`,
          output: "checked 3\nchecked 7\nFound 12, stopping",
        },
        { type: "heading", text: "continue — skip to the next iteration" },
        {
          type: "code",
          code: `lines = ["data", "", "# comment", "more data"]

for line in lines:
    if not line or line.startswith("#"):
        continue
    print("processing:", line)`,
          output: "processing: data\nprocessing: more data",
        },
        {
          type: "callout",
          variant: "tip",
          md: "`continue` at the top of a loop body is the loop equivalent of a guard clause: skip what you do not care about, then handle the real work without extra indentation.",
        },
        { type: "heading", text: "break only exits one level" },
        {
          type: "code",
          code: `found = None

for row in range(3):
    for col in range(3):
        if row * col == 4:
            found = (row, col)
            break          # exits the inner loop only
    if found:
        break              # then the outer one

print(found)`,
          output: "(2, 2)",
        },
        { type: "heading", text: "The loop else clause" },
        {
          type: "text",
          md: "A loop's `else` runs when the loop finished **without** hitting `break`. It is the natural way to express “I searched everything and found nothing”.",
        },
        {
          type: "code",
          code: `users = ["ada", "linus", "guido"]
target = "grace"

for user in users:
    if user == target:
        print("Found", user)
        break
else:
    print(f"{target} is not in the list")`,
          output: "grace is not in the list",
        },
        {
          type: "code",
          code: `def is_prime(n):
    if n < 2:
        return False
    for divisor in range(2, int(n ** 0.5) + 1):
        if n % divisor == 0:
            return False
    else:
        return True


print([n for n in range(2, 30) if is_prime(n)])`,
          output: "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]",
        },
        {
          type: "callout",
          variant: "note",
          md: "Read `else` here as “no break”. It confuses enough people that many teams avoid it — but you will meet it in other codebases.",
        },
        {
          type: "quiz",
          question:
            "In `for x in [1,2,3]: if x == 2: break` followed by `else: print(\"done\")`, what prints?",
          options: ["done", "nothing", "2", "an error"],
          answer: 1,
          explanation:
            "The loop hit `break`, so the `else` clause is skipped and nothing prints.",
        },
      ],
    },
  ],
};
