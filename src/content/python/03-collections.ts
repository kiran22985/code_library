import type { Module } from "@/lib/types";

export const collections: Module = {
  id: "collections",
  title: "Data structures",
  description:
    "Lists, tuples, sets and dictionaries — how to choose between them and how to use each well.",
  lessons: [
    {
      slug: "lists",
      title: "Lists",
      summary:
        "Ordered, changeable collections: creating, indexing, slicing, nesting and iterating.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "A list is an ordered, mutable sequence. It is the workhorse collection of Python and can hold any mix of types.",
        },
        {
          type: "code",
          code: `languages = ["Python", "Go", "Rust"]
mixed = [1, "two", 3.0, True, None]
empty = []
from_range = list(range(5))

print(languages)
print(mixed)
print(from_range, len(from_range))`,
          output:
            "['Python', 'Go', 'Rust']\n[1, 'two', 3.0, True, None]\n[0, 1, 2, 3, 4] 5",
        },
        { type: "heading", text: "Indexing and slicing" },
        {
          type: "code",
          code: `items = ["a", "b", "c", "d", "e"]

print(items[0], items[-1])
print(items[1:4])      # ['b', 'c', 'd']
print(items[:2])
print(items[::-1])     # reversed copy

items[0] = "A"         # lists are mutable
print(items)

items[1:3] = ["X", "Y", "Z"]   # slice assignment can change the length
print(items)`,
          output: `a e
['b', 'c', 'd']
['a', 'b']
['e', 'd', 'c', 'b', 'a']
['A', 'b', 'c', 'd', 'e']
['A', 'X', 'Y', 'Z', 'd', 'e']`,
        },
        { type: "heading", text: "Iterating" },
        {
          type: "code",
          code: `scores = [88, 92, 79]

for score in scores:
    print(score)

# When you need the position too
for index, score in enumerate(scores, start=1):
    print(f"{index}. {score}")`,
          output: "88\n92\n79\n1. 88\n2. 92\n3. 79",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Iterate over the list itself, not `range(len(items))`. You only need indexes when you genuinely need the position — and then `enumerate()` gives you both.",
        },
        { type: "heading", text: "Nested lists" },
        {
          type: "code",
          code: `grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(grid[1])       # [4, 5, 6]
print(grid[1][2])    # 6

for row in grid:
    print(" ".join(str(cell) for cell in row))`,
          output: "[4, 5, 6]\n6\n1 2 3\n4 5 6\n7 8 9",
        },
        { type: "heading", text: "Useful built-ins" },
        {
          type: "code",
          code: `nums = [5, 2, 9, 1, 9]

print(len(nums), sum(nums))
print(min(nums), max(nums))
print(sorted(nums))            # new sorted list
print(sorted(nums, reverse=True))
print(nums.count(9))
print(9 in nums)
print(list(reversed(nums)))`,
          output:
            "5 26\n1 9\n[1, 2, 5, 9, 9]\n[9, 9, 5, 2, 1]\n2\nTrue\n[9, 1, 9, 2, 5]",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Never modify a list while looping over it",
          md: "Removing items shifts every later element, so the loop skips entries. Build a new list instead: `kept = [x for x in items if x != target]`.",
        },
        {
          type: "exercise",
          prompt:
            "Given `temps = [18, 22, 31, 27, 15]`, print the highest, the lowest and the average rounded to one decimal place.",
          hint: "`sum()` and `len()` give you the average.",
          solution: `temps = [18, 22, 31, 27, 15]

print("High:", max(temps))
print("Low: ", min(temps))
print("Avg: ", round(sum(temps) / len(temps), 1))`,
        },
      ],
    },

    {
      slug: "list-methods",
      title: "List methods",
      summary:
        "Adding, removing, sorting and searching — and the difference between sort() and sorted().",
      minutes: 7,
      blocks: [
        { type: "heading", text: "Adding items" },
        {
          type: "code",
          code: `stack = ["a", "b"]

stack.append("c")            # add one item at the end
stack.insert(0, "start")     # add at a position
stack.extend(["d", "e"])     # add every item from an iterable

print(stack)

# append vs extend — a classic mix-up
a = [1, 2]
a.append([3, 4])
print(a)                     # [1, 2, [3, 4]]

b = [1, 2]
b.extend([3, 4])
print(b)                     # [1, 2, 3, 4]`,
          output:
            "['start', 'a', 'b', 'c', 'd', 'e']\n[1, 2, [3, 4]]\n[1, 2, 3, 4]",
        },
        { type: "heading", text: "Removing items" },
        {
          type: "code",
          code: `items = ["a", "b", "c", "b", "d"]

items.remove("b")      # removes the FIRST match, raises ValueError if absent
print(items)

last = items.pop()     # removes and returns the last item
first = items.pop(0)   # or by index
print(last, first, items)

del items[0]           # delete by index
print(items)

items.clear()
print(items)`,
          output: "['a', 'c', 'b', 'd']\nd a ['c', 'b']\n['b']\n[]",
        },
        {
          type: "table",
          head: ["Method", "Removes by", "Returns"],
          rows: [
            ["`remove(value)`", "value", "`None`"],
            ["`pop(index)`", "index (default last)", "the item"],
            ["`del list[i]`", "index or slice", "nothing"],
            ["`clear()`", "everything", "`None`"],
          ],
        },
        { type: "heading", text: "Sorting" },
        {
          type: "code",
          code: `nums = [5, 2, 9, 1]

nums.sort()                    # sorts IN PLACE, returns None
print(nums)

nums.sort(reverse=True)
print(nums)

# sorted() leaves the original alone
original = [3, 1, 2]
copy = sorted(original)
print(original, copy)`,
          output: "[1, 2, 5, 9]\n[9, 5, 2, 1]\n[3, 1, 2] [1, 2, 3]",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "`numbers = numbers.sort()` sets numbers to None",
          md: "`sort()` mutates and returns `None`. Either call `numbers.sort()` on its own line, or use `numbers = sorted(numbers)`.",
        },
        { type: "heading", text: "Sorting by a key" },
        {
          type: "code",
          code: `words = ["banana", "kiwi", "apple", "fig"]

print(sorted(words, key=len))
print(sorted(words, key=str.lower))

people = [("Ada", 36), ("Linus", 54), ("Guido", 68)]
print(sorted(people, key=lambda person: person[1], reverse=True))`,
          output: `['fig', 'kiwi', 'apple', 'banana']
['apple', 'banana', 'fig', 'kiwi']
[('Guido', 68), ('Linus', 54), ('Ada', 36)]`,
        },
        { type: "heading", text: "Searching and reversing" },
        {
          type: "code",
          code: `items = ["a", "b", "c", "b"]

print(items.index("b"))      # first position
print(items.index("b", 2))   # start searching at index 2
print(items.count("b"))

items.reverse()              # in place
print(items)`,
          output: "1\n3\n2\n['b', 'c', 'b', 'a']",
        },
        {
          type: "exercise",
          prompt:
            'Given `tasks = ["write", "test", "deploy"]`, add "review" after "test", remove "write", then print the list sorted alphabetically without changing the original order of `tasks`.',
          hint: "`insert()` takes the index to insert *before*; `sorted()` returns a new list.",
          solution: `tasks = ["write", "test", "deploy"]

tasks.insert(2, "review")
tasks.remove("write")

print(tasks)
print(sorted(tasks))
print(tasks)   # unchanged by sorted()`,
        },
      ],
    },

    {
      slug: "tuples",
      title: "Tuples",
      summary:
        "Immutable sequences: packing, unpacking, when to prefer them over lists, and named tuples.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "A tuple is an immutable sequence. Once created it cannot be changed — which makes it safe to share, hashable, and a signal to readers that the contents are a fixed record.",
        },
        {
          type: "code",
          code: `point = (3, 4)
single = (42,)        # the trailing comma is what makes it a tuple
not_a_tuple = (42)    # this is just the number 42
no_parens = 1, 2, 3   # parentheses are optional

print(type(single), type(not_a_tuple))
print(point[0], point[-1], len(point))
print(no_parens)`,
          output: "<class 'tuple'> <class 'int'>\n3 4 2\n(1, 2, 3)",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "The one-element tuple",
          md: "`(42)` is a number in parentheses. You need `(42,)`. This trips people up when building single-item tuples programmatically.",
        },
        { type: "heading", text: "Unpacking" },
        {
          type: "code",
          code: `point = (3, 4)
x, y = point
print(x, y)

# Star unpacking collects the rest into a list
first, *middle, last = (1, 2, 3, 4, 5)
print(first, middle, last)

# Ignore values you do not need by convention
_, important, _ = ("skip", "keep", "skip")
print(important)`,
          output: "3 4\n1 [2, 3, 4] 5\nkeep",
        },
        { type: "heading", text: "Why tuples exist" },
        {
          type: "list",
          items: [
            "**Fixed records** — an (x, y) coordinate or an (host, port) pair has a fixed shape.",
            "**Dictionary keys** — mutable objects cannot be hashed, so lists cannot be keys, but tuples can.",
            "**Multiple return values** — `return name, age` returns a tuple.",
            "**Safety** — nobody can modify it by accident, including you.",
          ],
        },
        {
          type: "code",
          code: `# Tuples as dictionary keys
grid = {(0, 0): "origin", (1, 2): "target"}
print(grid[(1, 2)])

# Multiple return values are just tuples
def min_max(values):
    return min(values), max(values)

low, high = min_max([4, 8, 1])
print(low, high)`,
          output: "target\n1 8",
        },
        { type: "heading", text: "Immutable, with an asterisk" },
        {
          type: "code",
          code: `data = (1, [2, 3])
# data[0] = 99          # TypeError

data[1].append(4)       # the LIST inside is still mutable
print(data)`,
          output: "(1, [2, 3, 4])",
        },
        { type: "heading", text: "Named tuples read better" },
        {
          type: "code",
          code: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)

print(p.x, p.y)      # names instead of p[0], p[1]
print(p)
print(p._replace(x=10))   # returns a new tuple`,
          output: "3 4\nPoint(x=3, y=4)\nPoint(x=10, y=4)",
        },
        {
          type: "quiz",
          question: "Which is a valid dictionary key?",
          options: ["`[1, 2]`", "`{1, 2}`", "`(1, 2)`", "`{\"a\": 1}`"],
          answer: 2,
          explanation:
            "Keys must be hashable, which means immutable. Only the tuple qualifies here.",
        },
      ],
    },

    {
      slug: "sets",
      title: "Sets",
      summary:
        "Unordered collections of unique items, fast membership tests and set algebra.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          code: `unique = {"a", "b", "c", "a"}
print(unique)                 # duplicates dropped

empty = set()                 # {} would create a dict!
from_list = set([1, 2, 2, 3])
print(empty, from_list)

# Deduplicate a list while keeping it a list
names = ["ada", "linus", "ada", "guido"]
print(list(set(names)))`,
          output:
            "{'a', 'b', 'c'}\nset() {1, 2, 3}\n['linus', 'guido', 'ada']",
        },
        {
          type: "callout",
          variant: "note",
          md: "Sets have no order, so printing one may show the items in any arrangement. If order matters, sort the result: `sorted(set(names))`.",
        },
        { type: "heading", text: "Membership is the superpower" },
        {
          type: "text",
          md: "Checking `x in collection` scans a list item by item, but a set uses hashing and answers in roughly constant time. With 100,000 items that is the difference between milliseconds and microseconds.",
        },
        {
          type: "code",
          code: `banned = {"spam@example.com", "bot@example.com"}

email = "user@example.com"
if email not in banned:
    print("Allowed")`,
          output: "Allowed",
        },
        { type: "heading", text: "Modifying a set" },
        {
          type: "code",
          code: `tags = {"python", "web"}

tags.add("api")
tags.update(["async", "web"])    # add many, duplicates ignored
tags.discard("web")              # no error if missing
tags.remove("api")               # KeyError if missing
print(sorted(tags))

popped = tags.pop()              # removes an arbitrary item
print(popped in {"python", "async"})`,
          output: "['async', 'python']\nTrue",
        },
        { type: "heading", text: "Set algebra" },
        {
          type: "code",
          code: `frontend = {"html", "css", "js", "git"}
backend = {"python", "sql", "git", "js"}

print(frontend | backend)    # union — everything
print(frontend & backend)    # intersection — in both
print(frontend - backend)    # difference — only frontend
print(frontend ^ backend)    # symmetric difference — not shared`,
          output: `{'css', 'git', 'html', 'js', 'python', 'sql'}
{'git', 'js'}
{'css', 'html'}
{'css', 'html', 'python', 'sql'}`,
        },
        {
          type: "text",
          md: "The methods `union()`, `intersection()`, `difference()` and `symmetric_difference()` do the same and accept any iterable, not just another set.",
        },
        { type: "heading", text: "Comparing sets" },
        {
          type: "code",
          code: `required = {"read", "write"}
granted = {"read", "write", "admin"}

print(required.issubset(granted))
print(granted.issuperset(required))
print({"a"}.isdisjoint({"b"}))`,
          output: "True\nTrue\nTrue",
        },
        {
          type: "exercise",
          prompt:
            "Two lists hold the students who attended each of two workshops. Print how many attended both, and the names that attended only the first.",
          hint: "Convert both to sets, then use `&` and `-`.",
          solution: `day1 = ["ada", "linus", "guido", "grace"]
day2 = ["guido", "grace", "rob"]

a, b = set(day1), set(day2)

print("Both:", len(a & b))
print("Only day 1:", sorted(a - b))`,
        },
      ],
    },

    {
      slug: "dictionaries",
      title: "Dictionaries",
      summary:
        "Key–value mapping: creating, reading safely, updating, nesting and iterating.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "A dictionary maps **keys** to **values**. It is how you model records, configuration, counts, lookups and JSON — probably the most useful type in Python.",
        },
        {
          type: "code",
          code: `user = {
    "name": "Kiran",
    "age": 30,
    "languages": ["Python", "JavaScript"],
    "active": True,
}

print(user["name"])
print(user["languages"][0])
print(len(user))`,
          output: "Kiran\nPython\n4",
        },
        { type: "heading", text: "Reading safely" },
        {
          type: "code",
          code: `user = {"name": "Kiran"}

print(user["name"])
# print(user["email"])        # KeyError!

print(user.get("email"))                  # None instead of an error
print(user.get("email", "not provided"))  # with a default
print("email" in user)`,
          output: "Kiran\nNone\nnot provided\nFalse",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Use `[]` when a missing key means your program is broken, and `.get()` when a missing key is normal. That choice documents your intent.",
        },
        { type: "heading", text: "Adding, updating, removing" },
        {
          type: "code",
          code: `config = {"debug": False}

config["port"] = 8000            # add
config["debug"] = True           # update
config.update({"host": "0.0.0.0", "port": 9000})
print(config)

removed = config.pop("debug")    # remove and return
print(removed, config)

config.setdefault("timeout", 30) # only sets if absent
config.setdefault("port", 1)     # port already exists, ignored
print(config)`,
          output: `{'debug': True, 'port': 9000, 'host': '0.0.0.0'}
True {'port': 9000, 'host': '0.0.0.0'}
{'port': 9000, 'host': '0.0.0.0', 'timeout': 30}`,
        },
        { type: "heading", text: "Iterating" },
        {
          type: "code",
          code: `scores = {"ada": 92, "linus": 78, "guido": 88}

for name in scores:                    # keys by default
    print(name, end=" ")
print()

for score in scores.values():
    print(score, end=" ")
print()

for name, score in scores.items():     # the usual way
    print(f"{name}: {score}")`,
          output: "ada linus guido \n92 78 88 \nada: 92\nlinus: 78\nguido: 88",
        },
        { type: "heading", text: "Sorting a dictionary" },
        {
          type: "code",
          code: `scores = {"ada": 92, "linus": 78, "guido": 88}

by_name = dict(sorted(scores.items()))
by_score = dict(sorted(scores.items(), key=lambda item: item[1], reverse=True))

print(by_name)
print(by_score)
print(max(scores, key=scores.get))   # the top scorer's key`,
          output: `{'ada': 92, 'guido': 88, 'linus': 78}
{'ada': 92, 'guido': 88, 'linus': 78}
ada`,
        },
        { type: "heading", text: "Nested data" },
        {
          type: "text",
          md: "This is the shape of almost every API response you will ever parse:",
        },
        {
          type: "code",
          code: `response = {
    "status": "ok",
    "results": [
        {"id": 1, "title": "Lists", "tags": ["basics"]},
        {"id": 2, "title": "Sets", "tags": ["basics", "advanced"]},
    ],
}

for item in response["results"]:
    print(item["id"], item["title"], ", ".join(item["tags"]))

# Digging safely through several levels
print(response.get("meta", {}).get("page", 1))`,
          output: "1 Lists basics\n2 Sets basics, advanced\n1",
        },
        {
          type: "callout",
          variant: "note",
          title: "Key rules",
          md: "Keys must be hashable (strings, numbers, tuples) and unique — assigning an existing key overwrites it. Since Python 3.7, dictionaries preserve insertion order.",
        },
        {
          type: "exercise",
          prompt:
            "Count how many times each word appears in `text = \"the cat and the hat and the bat\"` and print the counts sorted from most to least frequent.",
          hint: "`counts[word] = counts.get(word, 0) + 1` is the classic one-liner.",
          solution: `text = "the cat and the hat and the bat"

counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

for word, count in sorted(counts.items(), key=lambda item: item[1], reverse=True):
    print(f"{word:<5} {count}")`,
        },
      ],
    },

    {
      slug: "dict-methods",
      title: "Dictionary techniques",
      summary:
        "Merging, inverting, grouping, counting and the patterns that replace manual loops.",
      minutes: 6,
      blocks: [
        { type: "heading", text: "Merging" },
        {
          type: "code",
          code: `defaults = {"host": "localhost", "port": 8000, "debug": False}
overrides = {"port": 9000, "debug": True}

merged = defaults | overrides        # 3.9+, right side wins
print(merged)

merged_old = {**defaults, **overrides}   # works everywhere
print(merged_old == merged)

defaults |= overrides                # update in place
print(defaults)`,
          output: `{'host': 'localhost', 'port': 9000, 'debug': True}
True
{'host': 'localhost', 'port': 9000, 'debug': True}`,
        },
        { type: "heading", text: "Building from pairs" },
        {
          type: "code",
          code: `names = ["ada", "linus", "guido"]
scores = [92, 78, 88]

print(dict(zip(names, scores)))
print(dict.fromkeys(names, 0))       # same default for every key`,
          output: `{'ada': 92, 'linus': 78, 'guido': 88}
{'ada': 0, 'linus': 0, 'guido': 0}`,
        },
        { type: "heading", text: "Inverting" },
        {
          type: "code",
          code: `codes = {"gb": "United Kingdom", "np": "Nepal"}

inverted = {value: key for key, value in codes.items()}
print(inverted)`,
          output: "{'United Kingdom': 'gb', 'Nepal': 'np'}",
        },
        { type: "heading", text: "Grouping" },
        {
          type: "code",
          code: `people = [
    {"name": "Ada", "team": "core"},
    {"name": "Linus", "team": "kernel"},
    {"name": "Grace", "team": "core"},
]

teams = {}
for person in people:
    teams.setdefault(person["team"], []).append(person["name"])

print(teams)`,
          output: "{'core': ['Ada', 'Grace'], 'kernel': ['Linus']}",
        },
        {
          type: "text",
          md: "`defaultdict` removes the `setdefault` dance entirely — see the *collections module* lesson.",
        },
        { type: "heading", text: "Counting" },
        {
          type: "code",
          code: `from collections import Counter

votes = ["python", "go", "python", "rust", "python", "go"]
tally = Counter(votes)

print(tally)
print(tally.most_common(2))
print(tally["python"], tally["missing"])   # missing keys give 0`,
          output: `Counter({'python': 3, 'go': 2, 'rust': 1})
[('python', 3), ('go', 2)]
3 0`,
        },
        { type: "heading", text: "Views stay live" },
        {
          type: "code",
          code: `data = {"a": 1}
keys = data.keys()

data["b"] = 2
print(keys)          # the view reflects the change
print(list(keys))`,
          output: "dict_keys(['a', 'b'])\n['a', 'b']",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Do not add or delete keys while iterating",
          md: "It raises `RuntimeError: dictionary changed size during iteration`. Loop over `list(data.items())` if you must modify the dictionary inside the loop.",
        },
      ],
    },

    {
      slug: "comprehensions",
      title: "Comprehensions",
      summary:
        "Build lists, dicts and sets in one readable line — with filtering, transforming and nesting.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "A comprehension expresses “make a new collection from an existing one” as a single expression. It is faster than the equivalent loop and, kept short, easier to read.",
        },
        {
          type: "code",
          code: `numbers = [1, 2, 3, 4, 5]

# The loop version
squares = []
for n in numbers:
    squares.append(n ** 2)

# The comprehension
squares = [n ** 2 for n in numbers]
print(squares)`,
          output: "[1, 4, 9, 16, 25]",
        },
        { type: "heading", text: "The shape" },
        {
          type: "code",
          lang: "text",
          code: `[ expression   for item in iterable   if condition ]
      |              |                  |
   what to keep   where it comes    optional filter
                     from`,
        },
        { type: "heading", text: "Filtering" },
        {
          type: "code",
          code: `numbers = range(1, 11)

evens = [n for n in numbers if n % 2 == 0]
print(evens)

words = ["  Python ", "", "  go", "   "]
cleaned = [word.strip() for word in words if word.strip()]
print(cleaned)`,
          output: "[2, 4, 6, 8, 10]\n['Python', 'go']",
        },
        { type: "heading", text: "if/else inside the expression" },
        {
          type: "code",
          code: `numbers = [1, 2, 3, 4]

labels = ["even" if n % 2 == 0 else "odd" for n in numbers]
print(labels)`,
          output: "['odd', 'even', 'odd', 'even']",
        },
        {
          type: "callout",
          variant: "note",
          md: "A filter goes **after** the loop (`... for n in nums if cond`). A choice of value goes **before** it (`a if cond else b for n in nums`). Different positions, different jobs.",
        },
        { type: "heading", text: "Dict and set comprehensions" },
        {
          type: "code",
          code: `words = ["apple", "banana", "fig"]

lengths = {word: len(word) for word in words}
print(lengths)

initials = {word[0] for word in words}
print(initials)

prices = {"tea": 2.5, "coffee": 3.8, "juice": 4.2}
cheap = {name: price for name, price in prices.items() if price < 4}
print(cheap)`,
          output: `{'apple': 5, 'banana': 6, 'fig': 3}
{'a', 'b', 'f'}
{'tea': 2.5, 'coffee': 3.8}`,
        },
        { type: "heading", text: "Nested loops" },
        {
          type: "code",
          code: `pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
print(pairs)

grid = [[1, 2], [3, 4], [5, 6]]
flat = [cell for row in grid for cell in row]
print(flat)`,
          output: "[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]\n[1, 2, 3, 4, 5, 6]",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Readability beats cleverness",
          md: "If a comprehension needs two filters and a nested loop, write the plain `for` loop. Comprehensions are for expressing a simple transformation, not for winning code golf.",
        },
        { type: "heading", text: "Generator expressions" },
        {
          type: "code",
          code: `numbers = range(1_000_000)

# Round brackets create a lazy generator — no giant list in memory
total = sum(n ** 2 for n in numbers if n % 3 == 0)
print(total)

print(any(n > 100 for n in [5, 200, 7]))
print(all(len(word) > 2 for word in ["abc", "de"]))`,
          output: "111111333333000000\nTrue\nFalse",
        },
        {
          type: "exercise",
          prompt:
            'From `people = [{"name": "Ada", "age": 36}, {"name": "Tim", "age": 17}]`, build a list of the uppercase names of everyone 18 or older.',
          hint: "Filter with `if person[\"age\"] >= 18` and transform with `.upper()`.",
          solution: `people = [{"name": "Ada", "age": 36}, {"name": "Tim", "age": 17}]

adults = [person["name"].upper() for person in people if person["age"] >= 18]
print(adults)`,
        },
        {
          type: "quiz",
          question: "What does `[x for x in range(6) if x % 2][::-1]` produce?",
          options: ["[0, 2, 4]", "[5, 3, 1]", "[1, 3, 5]", "[4, 2, 0]"],
          answer: 1,
          explanation:
            "`x % 2` is truthy for odd numbers, giving `[1, 3, 5]`, and `[::-1]` reverses it.",
        },
      ],
    },

    {
      slug: "copying",
      title: "Copying and mutability",
      summary:
        "Why b = a shares the same object, and how shallow and deep copies differ.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "This lesson explains the single most common source of confusing bugs for new Python programmers.",
        },
        {
          type: "code",
          code: `original = [1, 2, 3]
alias = original          # NOT a copy — another name for the same list

alias.append(4)
print(original)
print(original is alias)`,
          output: "[1, 2, 3, 4]\nTrue",
        },
        { type: "heading", text: "Shallow copies" },
        {
          type: "code",
          code: `original = [1, 2, 3]

a = original.copy()
b = list(original)
c = original[:]

a.append(99)
print(original, a)
print(original is b, original == b)`,
          output: "[1, 2, 3] [1, 2, 3, 99]\nFalse True",
        },
        {
          type: "text",
          md: "All three make a new outer list — but the items inside are still shared references. With nested data that matters:",
        },
        {
          type: "code",
          code: `matrix = [[1, 2], [3, 4]]
shallow = matrix.copy()

shallow[0].append(99)     # mutating the INNER list
print(matrix)             # the original sees it too`,
          output: "[[1, 2, 99], [3, 4]]",
        },
        { type: "heading", text: "Deep copies" },
        {
          type: "code",
          code: `import copy

matrix = [[1, 2], [3, 4]]
deep = copy.deepcopy(matrix)

deep[0].append(99)
print(matrix)
print(deep)`,
          output: "[[1, 2], [3, 4]]\n[[1, 2, 99], [3, 4]]",
        },
        {
          type: "table",
          head: ["Approach", "Outer object", "Nested objects"],
          rows: [
            ["`b = a`", "shared", "shared"],
            ["`a.copy()`, `list(a)`, `a[:]`", "new", "shared"],
            ["`copy.deepcopy(a)`", "new", "new (recursively)"],
          ],
        },
        { type: "heading", text: "The mutable default argument trap" },
        {
          type: "code",
          code: `def add_item(item, basket=[]):     # evaluated ONCE, at definition time
    basket.append(item)
    return basket

print(add_item("a"))
print(add_item("b"))     # the same list is still there!`,
          output: "['a']\n['a', 'b']",
        },
        {
          type: "code",
          code: `def add_item(item, basket=None):   # the fix
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(add_item("a"))
print(add_item("b"))`,
          output: "['a']\n['b']",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Never use a mutable default argument",
          md: "Default values are created once when the function is defined, not per call. Use `None` as the default and build the real value inside the function.",
        },
        {
          type: "quiz",
          question:
            "After `a = [[1]]; b = a.copy(); b[0].append(2)`, what is `a`?",
          options: ["`[[1]]`", "`[[1, 2]]`", "`[[1], [2]]`", "`[[2]]`"],
          answer: 1,
          explanation:
            "`copy()` is shallow: `b[0]` is the same inner list as `a[0]`, so appending is visible through both names.",
        },
      ],
    },
  ],
};
