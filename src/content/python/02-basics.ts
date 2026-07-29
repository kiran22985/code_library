import type { Module } from "@/lib/types";

export const basics: Module = {
  id: "basics",
  title: "Core basics",
  description:
    "Variables, the built-in data types, strings, numbers, operators and getting input.",
  lessons: [
    {
      slug: "variables",
      title: "Variables",
      summary:
        "Binding names to values, multiple assignment, naming rules and what really happens in memory.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "A variable is a **name bound to a value**. You do not declare a type and you do not allocate memory — you assign, and Python does the rest.",
        },
        {
          type: "code",
          code: `course = "Python"
lessons = 78
rating = 4.9
is_free = True

print(course, lessons, rating, is_free)`,
          output: "Python 78 4.9 True",
        },
        { type: "heading", text: "Names point at objects" },
        {
          type: "text",
          md: "Assignment does not copy a value into a box. It makes a name refer to an object. Rebinding the name leaves the original object untouched:",
        },
        {
          type: "code",
          code: `a = [1, 2, 3]
b = a          # b refers to the SAME list
b.append(4)
print(a)       # a sees the change

b = [9, 9]     # rebinding b only moves the name
print(a, b)`,
          output: "[1, 2, 3, 4]\n[1, 2, 3, 4] [9, 9]",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "The classic surprise",
          md: "`b = a` never copies a list, dict or set. If you need an independent copy, use `a.copy()` or `list(a)` — covered in the *Copying and mutability* lesson.",
        },
        { type: "heading", text: "Multiple assignment" },
        {
          type: "code",
          code: `x, y, z = 1, 2, 3
print(x, y, z)

# Swap without a temporary variable
x, y = y, x
print(x, y)

# Same value to several names
width = height = 10
print(width, height)`,
          output: "1 2 3\n2 1\n10 10",
        },
        { type: "heading", text: "Naming rules and conventions" },
        {
          type: "table",
          head: ["Rule", "Good", "Bad"],
          rows: [
            ["Letters, digits, underscores only", "`user_name`", "`user-name`"],
            ["Cannot start with a digit", "`item2`", "`2item`"],
            ["Case sensitive", "`age` ≠ `Age`", "—"],
            ["Not a keyword", "`class_name`", "`class`"],
            ["Descriptive, snake_case", "`total_price`", "`tp`"],
          ],
        },
        {
          type: "callout",
          variant: "note",
          title: "Constants",
          md: "Python has no `const`. The convention is `UPPER_SNAKE_CASE` at module level to signal “do not reassign this” — it is a promise between developers, not enforced by the language.",
        },
        {
          type: "code",
          code: `# A name that does not exist yet raises NameError
print(undefined_name)`,
          output: 'NameError: name \'undefined_name\' is not defined',
        },
        {
          type: "exercise",
          prompt:
            "Create variables for a product name, its price and its quantity, then print a line like `3 x Keyboard = 149.85`.",
          hint: "You can pass several arguments to `print()`, or build the text with an f-string (next lessons).",
          solution: `product = "Keyboard"
price = 49.95
quantity = 3

print(quantity, "x", product, "=", round(price * quantity, 2))`,
        },
      ],
    },

    {
      slug: "data-types",
      title: "Built-in data types",
      summary:
        "The types you will use every day: int, float, str, bool, list, tuple, dict, set and None.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "Every value in Python is an object with a type. `type()` tells you which one, and you rarely need to declare anything.",
        },
        {
          type: "code",
          code: `print(type(42))
print(type(3.14))
print(type("hello"))
print(type(True))
print(type([1, 2]))
print(type((1, 2)))
print(type({"a": 1}))
print(type({1, 2}))
print(type(None))`,
          output: `<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'list'>
<class 'tuple'>
<class 'dict'>
<class 'set'>
<class 'NoneType'>`,
        },
        { type: "heading", text: "The map" },
        {
          type: "table",
          head: ["Type", "Example", "Mutable?", "Use it for"],
          rows: [
            ["`int`", "`42`, `-7`, `1_000_000`", "No", "Whole numbers, counts, indexes"],
            ["`float`", "`3.14`, `2.0`, `1e-5`", "No", "Measurements, averages, money*"],
            ["`str`", "`\"hello\"`", "No", "Text of any length"],
            ["`bool`", "`True`, `False`", "No", "Conditions and flags"],
            ["`list`", "`[1, 2, 3]`", "**Yes**", "Ordered collections you change"],
            ["`tuple`", "`(1, 2, 3)`", "No", "Fixed records, dict keys, returns"],
            ["`dict`", "`{\"id\": 1}`", "**Yes**", "Key → value lookups"],
            ["`set`", "`{1, 2, 3}`", "**Yes**", "Unique items, membership tests"],
            ["`NoneType`", "`None`", "—", "“No value here”"],
          ],
        },
        {
          type: "callout",
          variant: "warn",
          title: "*Money and floats",
          md: "`0.1 + 0.2` is `0.30000000000000004` because floats are binary approximations. For currency use `decimal.Decimal` — see the *Numbers* lesson.",
        },
        { type: "heading", text: "Mutable vs immutable" },
        {
          type: "text",
          md: "This distinction drives a lot of Python behaviour. **Immutable** objects (`int`, `float`, `str`, `tuple`) can never change — operations return new objects. **Mutable** objects (`list`, `dict`, `set`) can be modified in place.",
        },
        {
          type: "code",
          code: `text = "hello"
upper = text.upper()
print(text, upper)      # the original is unchanged

items = [1, 2]
items.append(3)          # modified in place, returns None
print(items)`,
          output: "hello HELLO\n[1, 2, 3]",
        },
        { type: "heading", text: "None is not zero" },
        {
          type: "code",
          code: `result = None
print(result is None)
print(result == 0)      # None is not equal to 0, "" or False`,
          output: "True\nFalse",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Always compare with `is None` / `is not None`, never `== None`. `is` checks identity, which is exactly what you mean.",
        },
        {
          type: "quiz",
          question: "Which of these is immutable?",
          options: ["list", "dict", "tuple", "set"],
          answer: 2,
          explanation:
            "Tuples cannot be changed after creation — which is why they can be used as dictionary keys while lists cannot.",
        },
      ],
    },

    {
      slug: "numbers",
      title: "Numbers and arithmetic",
      summary:
        "Integers, floats, the division operators, rounding, and why 0.1 + 0.2 is not 0.3.",
      minutes: 7,
      blocks: [
        {
          type: "code",
          code: `count = 12          # int, unlimited size
price = 19.99       # float
big = 9_000_000     # underscores are ignored, they aid reading
scientific = 1.5e3  # 1500.0

print(count, price, big, scientific)`,
          output: "12 19.99 9000000 1500.0",
        },
        { type: "heading", text: "The operators" },
        {
          type: "code",
          code: `a, b = 17, 5

print(a + b)    # 22
print(a - b)    # 12
print(a * b)    # 85
print(a / b)    # 3.4    true division, ALWAYS a float
print(a // b)   # 3      floor division, drops the remainder
print(a % b)    # 2      modulo, the remainder
print(a ** b)   # 1419857  power`,
          output: "22\n12\n85\n3.4\n3\n2\n1419857",
        },
        {
          type: "callout",
          variant: "note",
          title: "`/` vs `//`",
          md: "`10 / 2` gives `5.0` (a float), not `5`. Use `//` when you want a whole number, such as computing an index or a page count.",
        },
        { type: "heading", text: "Modulo is more useful than it looks" },
        {
          type: "code",
          code: `for n in range(1, 8):
    kind = "even" if n % 2 == 0 else "odd"
    print(n, kind)

seconds = 3725
print(seconds // 3600, "h", seconds % 3600 // 60, "m")`,
          output:
            "1 odd\n2 even\n3 odd\n4 even\n5 odd\n6 even\n7 odd\n1 h 2 m",
        },
        { type: "heading", text: "Augmented assignment" },
        {
          type: "code",
          code: `total = 10
total += 5    # same as total = total + 5
total -= 3
total *= 2
total /= 4
print(total)`,
          output: "6.0",
        },
        { type: "heading", text: "Float precision" },
        {
          type: "code",
          code: `print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)

# Compare with a tolerance instead
import math
print(math.isclose(0.1 + 0.2, 0.3))

# Or use Decimal for exact decimal arithmetic (money!)
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))`,
          output: "0.30000000000000004\nFalse\nTrue\n0.3",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Never compare floats with ==",
          md: "Binary floating point cannot represent 0.1 exactly, so tiny errors accumulate. Use `math.isclose()` for comparisons and `Decimal` for money.",
        },
        { type: "heading", text: "Rounding and built-ins" },
        {
          type: "code",
          code: `print(round(3.14159, 2))   # 3.14
print(round(2.5))          # 2  — banker's rounding, ties go to even
print(abs(-8))             # 8
print(min(4, 9, 1), max(4, 9, 1))
print(sum([1, 2, 3, 4]))
print(divmod(17, 5))       # (quotient, remainder)`,
          output: "3.14\n2\n8\n1 9\n10\n(3, 2)",
        },
        {
          type: "exercise",
          prompt:
            "A shop sells items at 12.50 each. Given `budget = 100`, print how many whole items you can buy and how much money is left over.",
          hint: "Floor division and modulo work on floats too.",
          solution: `budget = 100
price = 12.50

count = int(budget // price)
left = round(budget % price, 2)

print(count, "items, ", left, "left over")`,
        },
        {
          type: "quiz",
          question: "What is `7 // 2`?",
          options: ["3.5", "3", "4", "1"],
          answer: 1,
          explanation:
            "Floor division discards the fractional part and returns the integer `3`. `7 / 2` would give `3.5`.",
        },
      ],
    },

    {
      slug: "strings",
      title: "Strings",
      summary:
        "Creating text, quotes, escapes, indexing, slicing, concatenation and immutability.",
      minutes: 8,
      blocks: [
        {
          type: "code",
          code: `single = 'Python'
double = "Python"          # identical; pick one and stay consistent
apostrophe = "it's fine"   # double quotes avoid escaping
multi = """Line one
Line two"""

print(single, double, apostrophe)
print(multi)`,
          output: "Python Python it's fine\nLine one\nLine two",
        },
        { type: "heading", text: "Escape sequences" },
        {
          type: "code",
          code: `print("Tab\\there")
print("New\\nline")
print("A quote: \\"quoted\\"")
print("Backslash: \\\\")
print(r"Raw string: C:\\Users\\new")   # r prefix disables escapes`,
          output:
            'Tab\there\nNew\nline\nA quote: "quoted"\nBackslash: \\\nRaw string: C:\\Users\\new',
        },
        { type: "heading", text: "Indexing" },
        {
          type: "text",
          md: "Characters are numbered from `0`. Negative indexes count from the end, so `-1` is the last character.",
        },
        {
          type: "code",
          code: `word = "Python"
#        012345
#       -654321

print(word[0])    # P
print(word[5])    # n
print(word[-1])   # n
print(word[-6])   # P
print(len(word))  # 6`,
          output: "P\nn\nn\nP\n6",
        },
        { type: "heading", text: "Slicing" },
        {
          type: "text",
          md: "`text[start:stop:step]` returns a new string from `start` up to *but not including* `stop`.",
        },
        {
          type: "code",
          code: `text = "programming"

print(text[0:7])    # program
print(text[:7])     # same — start defaults to 0
print(text[7:])     # ming — stop defaults to the end
print(text[-4:])    # ming
print(text[::2])    # pormig  — every second character
print(text[::-1])   # gnimmargorp — reversed`,
          output: "program\nprogram\nming\nming\npormig\ngnimmargorp",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Slices never raise IndexError",
          md: "`\"abc\"[10:20]` returns `''` instead of crashing, while `\"abc\"[10]` raises `IndexError`. Handy, but it can hide bugs.",
        },
        { type: "heading", text: "Combining and repeating" },
        {
          type: "code",
          code: `first = "Hello"
second = "World"

print(first + ", " + second)   # concatenation
print(first * 3)               # repetition
print("-" * 30)                # a quick separator line

# Joining a list is faster and cleaner than += in a loop
parts = ["2026", "07", "29"]
print("-".join(parts))`,
          output:
            "Hello, World\nHelloHelloHello\n------------------------------\n2026-07-29",
        },
        { type: "heading", text: "Strings are immutable" },
        {
          type: "code",
          code: `word = "python"
# word[0] = "P"          # TypeError: 'str' object does not support item assignment

word = "P" + word[1:]    # build a new string instead
print(word)`,
          output: "Python",
        },
        { type: "heading", text: "Membership and iteration" },
        {
          type: "code",
          code: `sentence = "learning python is fun"

print("python" in sentence)
print("java" not in sentence)

for char in "abc":
    print(char, end=" ")`,
          output: "True\nTrue\na b c ",
        },
        {
          type: "exercise",
          prompt:
            "Given `email = \"kiran@example.com\"`, print the username and the domain separately using slicing and `index()`.",
          hint: "`email.index(\"@\")` gives the position of the @ sign.",
          solution: `email = "kiran@example.com"
at = email.index("@")

print(email[:at])
print(email[at + 1:])`,
        },
        {
          type: "quiz",
          question: 'What does `"python"[1:4]` return?',
          options: ['"pyt"', '"yth"', '"ytho"', '"tho"'],
          answer: 1,
          explanation:
            "Slicing starts at index 1 (`y`) and stops before index 4, giving `yth`.",
        },
      ],
    },

    {
      slug: "string-methods",
      title: "String methods",
      summary:
        "The 20 string methods you will actually use: case, trimming, splitting, searching and testing.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "Strings come with around 45 methods. Every one of them returns a **new** string — none modify the original. These are the ones worth knowing by heart.",
        },
        { type: "heading", text: "Case" },
        {
          type: "code",
          code: `name = "ada LOVELACE"

print(name.upper())
print(name.lower())
print(name.title())
print(name.capitalize())
print(name.swapcase())`,
          output: "ADA LOVELACE\nada lovelace\nAda Lovelace\nAda lovelace\nADA lovelace",
        },
        { type: "heading", text: "Trimming whitespace" },
        {
          type: "code",
          code: `raw = "   user@example.com  \\n"

print(repr(raw.strip()))    # both ends
print(repr(raw.lstrip()))   # left only
print(repr(raw.rstrip()))   # right only
print("banana".strip("ba")) # strips those characters, not a prefix`,
          output:
            "'user@example.com'\n'user@example.com  \\n'\n'   user@example.com'\nn",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Cleaning user input is almost always `value.strip().lower()`. Do it once, at the boundary of your program.",
        },
        { type: "heading", text: "Splitting and joining" },
        {
          type: "code",
          code: `line = "name,age,city"
print(line.split(","))

sentence = "  the   quick brown   fox "
print(sentence.split())        # no argument: splits on any whitespace run

print("2026-07-29".split("-", 1))   # maxsplit
print(" | ".join(["a", "b", "c"]))

print("line1\\nline2\\nline3".splitlines())`,
          output: `['name', 'age', 'city']
['the', 'quick', 'brown', 'fox']
['2026', '07-29']
a | b | c
['line1', 'line2', 'line3']`,
        },
        { type: "heading", text: "Searching and replacing" },
        {
          type: "code",
          code: `text = "the rain in spain"

print(text.find("rain"))       # 4   (-1 when missing)
print(text.find("snow"))       # -1
print(text.count("in"))        # 3
print(text.replace("ain", "AIN"))
print(text.replace("in", "IN", 1))   # only the first occurrence
print(text.startswith("the"), text.endswith("spain"))`,
          output:
            "4\n-1\n3\nthe rAIN in spAIN\nthe raIN in spain\nTrue True",
        },
        {
          type: "callout",
          variant: "note",
          md: "`find()` returns `-1` when the substring is missing; `index()` raises `ValueError`. Use `find()` when absence is expected, `index()` when it is a bug.",
        },
        { type: "heading", text: "Testing content" },
        {
          type: "code",
          code: `print("12345".isdigit())
print("abc".isalpha())
print("abc123".isalnum())
print("   ".isspace())
print("Hello World".istitle())
print("HELLO".isupper())`,
          output: "True\nTrue\nTrue\nTrue\nTrue\nTrue",
        },
        {
          type: "text",
          md: "These are the cheapest way to validate simple input before converting it:",
        },
        {
          type: "code",
          code: `raw = "42"
if raw.isdigit():
    print(int(raw) * 2)
else:
    print("Please enter a number")`,
          output: "84",
        },
        { type: "heading", text: "Padding and alignment" },
        {
          type: "code",
          code: `print("7".zfill(3))
print("left".ljust(10, ".") + "|")
print("right".rjust(10, ".") + "|")
print("mid".center(11, "-"))`,
          output: "007\nleft......|\n.....right|\n----mid----",
        },
        {
          type: "exercise",
          prompt:
            'Given `raw = "  John , Doe ,  london "`, produce the list `["John", "Doe", "London"]`.',
          hint: "Split on the comma, then strip and title-case each piece.",
          solution: `raw = "  John , Doe ,  london "

parts = [piece.strip().title() for piece in raw.split(",")]
print(parts)`,
        },
      ],
    },

    {
      slug: "string-formatting",
      title: "String formatting with f-strings",
      summary:
        "Build readable text with f-strings, control decimals, padding, thousands separators and dates.",
      minutes: 7,
      blocks: [
        {
          type: "text",
          md: "An **f-string** is a string prefixed with `f` where anything inside `{ }` is evaluated as Python. It has been the recommended way to build text since 3.6.",
        },
        {
          type: "code",
          code: `name = "Kiran"
lessons = 78

print(f"Hi {name}, you have {lessons} lessons left.")
print(f"Half of them is {lessons / 2}.")
print(f"{name.upper()} — {lessons > 50}")`,
          output:
            "Hi Kiran, you have 78 lessons left.\nHalf of them is 39.0.\nKIRAN — True",
        },
        { type: "heading", text: "Format specifiers" },
        {
          type: "text",
          md: "After a colon you can describe *how* to render the value: `{value:spec}`.",
        },
        {
          type: "code",
          code: `price = 1234.5678
ratio = 0.8734

print(f"{price:.2f}")        # 2 decimal places
print(f"{price:,.2f}")       # thousands separator
print(f"{price:10.1f}|")     # width 10, right aligned
print(f"{ratio:.1%}")        # percentage
print(f"{42:05d}")           # zero padded
print(f"{255:b} {255:o} {255:x}")   # binary, octal, hex`,
          output:
            "1234.57\n1,234.57\n    1234.6|\n87.3%\n00042\n11111111 377 ff",
        },
        { type: "heading", text: "Alignment for tables" },
        {
          type: "code",
          code: `rows = [("Python", 1991), ("Rust", 2010), ("Go", 2009)]

print(f"{'Language':<10}{'Year':>6}")
print("-" * 16)
for language, year in rows:
    print(f"{language:<10}{year:>6}")`,
          output:
            "Language    Year\n----------------\nPython      1991\nRust        2010\nGo          2009",
        },
        {
          type: "table",
          head: ["Spec", "Meaning"],
          rows: [
            ["`<`", "Left align"],
            ["`>`", "Right align"],
            ["`^`", "Centre"],
            ["`.2f`", "Fixed point, 2 decimals"],
            ["`,`", "Thousands separator"],
            ["`%`", "Percentage (multiplies by 100)"],
            ["`e`", "Scientific notation"],
          ],
        },
        { type: "heading", text: "Debugging with `=`" },
        {
          type: "code",
          code: `width, height = 3, 4
print(f"{width * height = }")`,
          output: "width * height = 12",
        },
        {
          type: "callout",
          variant: "tip",
          md: "`f\"{expr = }\"` prints both the expression and its value — the fastest print-debugging trick in Python.",
        },
        { type: "heading", text: "The older ways" },
        {
          type: "code",
          code: `name, age = "Ada", 36

print("Hello {}, you are {}".format(name, age))   # .format(), still common
print("Hello %s, you are %d" % (name, age))       # %-style, legacy
print(f"Hello {name}, you are {age}")             # prefer this`,
          output:
            "Hello Ada, you are 36\nHello Ada, you are 36\nHello Ada, you are 36",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Never f-string user input into SQL or shell commands",
          md: "`f\"SELECT * FROM users WHERE id = {user_id}\"` is an injection hole. Use parameterised queries — the database driver escapes values for you.",
        },
        {
          type: "exercise",
          prompt:
            "Print a receipt line for 3 items at 19.99 each: the name left-aligned in 12 characters, the total right-aligned in 8 with 2 decimals and a thousands separator.",
          hint: "`f\"{name:<12}{total:>8,.2f}\"`",
          solution: `name = "Keyboard"
quantity, price = 3, 19.99
total = quantity * price

print(f"{name:<12}{total:>8,.2f}")`,
        },
      ],
    },

    {
      slug: "type-conversion",
      title: "Type conversion",
      summary:
        "Converting between strings, numbers and collections — and handling values that will not convert.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "Python does not silently convert types for you. `\"5\" + 5` is an error, not `10` — which prevents a whole family of bugs. Convert explicitly.",
        },
        {
          type: "code",
          code: `print(int("42"))        # str -> int
print(float("3.14"))    # str -> float
print(str(99))          # int -> str
print(int(9.99))        # float -> int, truncates toward zero
print(bool(""), bool("a"), bool(0), bool(3))`,
          output: "42\n3.14\n99\n9\nFalse True False True",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "int() truncates, it does not round",
          md: "`int(9.99)` is `9` and `int(-9.99)` is `-9`. Use `round()` when you want the nearest whole number.",
        },
        { type: "heading", text: "When conversion fails" },
        {
          type: "code",
          code: `print(int("42"))
print(int("42.5"))   # ValueError: invalid literal for int() with base 10`,
          output: "42\nValueError: invalid literal for int() with base 10: '42.5'",
        },
        {
          type: "code",
          code: `raw = "not a number"

try:
    value = int(raw)
except ValueError:
    value = 0
    print("Could not convert, defaulting to 0")

print(value)`,
          output: "Could not convert, defaulting to 0\n0",
        },
        { type: "heading", text: "Between collections" },
        {
          type: "code",
          code: `text = "hello"

print(list(text))
print(set("banana"))          # duplicates removed
print(tuple([1, 2, 3]))
print(list({"a": 1, "b": 2}))          # keys
print(dict([("a", 1), ("b", 2)]))      # pairs -> dict`,
          output: `['h', 'e', 'l', 'l', 'o']
{'b', 'a', 'n'}
(1, 2, 3)
['a', 'b']
{'a': 1, 'b': 2}`,
        },
        { type: "heading", text: "Numbers to strings and back" },
        {
          type: "code",
          code: `n = 255
print(bin(n), oct(n), hex(n))
print(int("ff", 16))     # parse hex
print(int("1010", 2))    # parse binary`,
          output: "0b11111111 0o377 0xff\n255\n10",
        },
        {
          type: "quiz",
          question: 'What does `int("7") + int(7.9)` evaluate to?',
          options: ["14", "14.9", "15", "TypeError"],
          answer: 0,
          explanation:
            "`int(\"7\")` is 7 and `int(7.9)` truncates to 7, so the result is 14.",
        },
      ],
    },

    {
      slug: "booleans",
      title: "Booleans and truthiness",
      summary:
        "True and False, which values count as falsy, and how `and`/`or` really behave.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          code: `is_active = True
is_admin = False

print(type(is_active))
print(is_active and is_admin)
print(is_active or is_admin)
print(not is_active)`,
          output: "<class 'bool'>\nFalse\nTrue\nFalse",
        },
        { type: "heading", text: "Truthiness" },
        {
          type: "text",
          md: "Every object can be used in a condition. These are the only **falsy** values in Python — everything else is truthy:",
        },
        {
          type: "code",
          code: `falsy = [False, None, 0, 0.0, "", [], (), {}, set()]

for value in falsy:
    print(repr(value), "->", bool(value))`,
          output: `False -> False
None -> False
0 -> False
0.0 -> False
'' -> False
[] -> False
() -> False
{} -> False
set() -> False`,
        },
        {
          type: "text",
          md: "This lets you write conditions that read naturally:",
        },
        {
          type: "code",
          code: `items = []

if not items:
    print("The cart is empty")

name = "  "
if not name.strip():
    print("Name is required")`,
          output: "The cart is empty\nName is required",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "0 is falsy — and that bites",
          md: "`if count:` is False when `count` is `0`, which may be a perfectly valid value. When zero is legitimate, be explicit: `if count is not None:`.",
        },
        { type: "heading", text: "and / or return operands, not booleans" },
        {
          type: "code",
          code: `print(0 or "default")       # first truthy value, or the last one
print("set" or "default")
print(1 and 2)              # last value if all truthy
print(0 and 2)              # first falsy value

# The common idiom: a fallback value
user_input = ""
name = user_input or "anonymous"
print(name)`,
          output: "default\nset\n2\n0\nanonymous",
        },
        { type: "heading", text: "Short-circuiting" },
        {
          type: "code",
          code: `def expensive():
    print("expensive() ran")
    return True

print(False and expensive())   # expensive() never runs
print(True or expensive())     # nor here`,
          output: "False\nTrue",
        },
        {
          type: "text",
          md: "This is what makes guard conditions safe: `if items and items[0] == \"x\":` never indexes an empty list.",
        },
        { type: "heading", text: "bool is a subclass of int" },
        {
          type: "code",
          code: `print(True + True)          # 2
print(sum([True, False, True]))   # counts the Trues

flags = [True, False, True, True]
print(f"{sum(flags)} of {len(flags)} enabled")`,
          output: "2\n2\n3 of 4 enabled",
        },
        {
          type: "quiz",
          question: 'What does `[] or "fallback"` return?',
          options: ["True", "[]", '"fallback"', "False"],
          answer: 2,
          explanation:
            "`[]` is falsy, so `or` evaluates and returns the right-hand operand — the string `\"fallback\"`.",
        },
      ],
    },

    {
      slug: "operators",
      title: "Operators reference",
      summary:
        "Comparison, logical, membership, identity and bitwise operators, plus precedence and walrus.",
      minutes: 6,
      blocks: [
        { type: "heading", text: "Comparison" },
        {
          type: "code",
          code: `a, b = 10, 3

print(a == b, a != b)
print(a > b, a < b, a >= b, a <= b)

# Chaining reads like maths and evaluates once
age = 25
print(18 <= age < 65)`,
          output: "False True\nTrue False True False\nTrue",
        },
        { type: "heading", text: "Membership: in / not in" },
        {
          type: "code",
          code: `print("py" in "python")
print(3 in [1, 2, 3])
print("key" in {"key": 1})     # checks KEYS
print(5 not in {1, 2, 3})`,
          output: "True\nTrue\nTrue\nTrue",
        },
        { type: "heading", text: "Identity: is / is not" },
        {
          type: "code",
          code: `a = [1, 2]
b = [1, 2]
c = a

print(a == b)   # same contents
print(a is b)   # different objects
print(a is c)   # same object
print(a is not b)`,
          output: "True\nFalse\nTrue\nTrue",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Use `is` only for None, True and False",
          md: "`x is 1000` may be False even when `x == 1000`, because Python only caches small integers. Compare values with `==` and identity with `is`.",
        },
        { type: "heading", text: "Bitwise" },
        {
          type: "code",
          code: `a, b = 0b1100, 0b1010   # 12 and 10

print(bin(a & b))    # AND  -> 0b1000
print(bin(a | b))    # OR   -> 0b1110
print(bin(a ^ b))    # XOR  -> 0b110
print(bin(a << 1))   # left shift, doubles
print(bin(a >> 2))   # right shift`,
          output: "0b1000\n0b1110\n0b110\n0b11000\n0b11",
        },
        { type: "heading", text: "Precedence" },
        {
          type: "text",
          md: "From tightest to loosest: `**` → unary `-` → `* / // %` → `+ -` → comparisons → `not` → `and` → `or`. When in doubt, add parentheses — nobody has ever complained about clarity.",
        },
        {
          type: "code",
          code: `print(2 + 3 * 4)        # 14, not 20
print((2 + 3) * 4)      # 20
print(2 ** 3 ** 2)      # 512 — ** is right-associative
print(not True and False)   # (not True) and False -> False`,
          output: "14\n20\n512\nFalse",
        },
        { type: "heading", text: "The walrus operator :=" },
        {
          type: "text",
          md: "Assigns *and* returns a value inside an expression, which avoids computing something twice:",
        },
        {
          type: "code",
          code: `values = [3, 8, 12, 4]

if (total := sum(values)) > 20:
    print(f"Total {total} exceeds the limit")

# Common in loops that read until a sentinel
line = "data"
while (length := len(line)) > 0:
    print(length)
    line = line[:-2]`,
          output: "Total 27 exceeds the limit\n4\n2",
        },
      ],
    },

    {
      slug: "user-input",
      title: "Input and output",
      summary:
        "Reading from the keyboard with `input()`, validating it, and controlling how `print()` writes.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "`input()` pauses the program, waits for the user to press Enter, and returns what they typed — **always as a string**.",
        },
        {
          type: "code",
          code: `name = input("What is your name? ")
age = input("How old are you? ")

print(f"Hello {name}, next year you will be {int(age) + 1}")`,
          output:
            "What is your name? Kiran\nHow old are you? 30\nHello Kiran, next year you will be 31",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "input() never returns a number",
          md: "`input() * 2` doubles the *text*. Convert with `int()` or `float()` before doing arithmetic — and be ready for the conversion to fail.",
        },
        { type: "heading", text: "Validating input" },
        {
          type: "code",
          code: `while True:
    raw = input("Enter your age: ").strip()
    if raw.isdigit() and 0 < int(raw) < 130:
        age = int(raw)
        break
    print("Please enter a whole number between 1 and 129.")

print(f"Thanks — {age}")`,
          output:
            "Enter your age: abc\nPlease enter a whole number between 1 and 129.\nEnter your age: 30\nThanks — 30",
        },
        { type: "heading", text: "Controlling print()" },
        {
          type: "code",
          code: `print("a", "b", "c")                 # default separator is a space
print("a", "b", "c", sep="-")
print("no newline...", end="")
print(" continued on the same line")
print("x", "y", sep="", end="!\\n")`,
          output: "a b c\na-b-c\nno newline... continued on the same line\nxy!",
        },
        { type: "heading", text: "A tiny complete program" },
        {
          type: "code",
          filename: "tip.py",
          code: `bill = float(input("Bill amount: "))
percent = float(input("Tip %: "))

tip = bill * percent / 100
total = bill + tip

print(f"Tip:   {tip:>8.2f}")
print(f"Total: {total:>8.2f}")`,
          output: "Bill amount: 84.50\nTip %: 15\nTip:      12.68\nTotal:    97.18",
        },
        {
          type: "exercise",
          prompt:
            "Ask for two numbers and print their sum, difference, product and quotient, each to 2 decimal places. Handle division by zero gracefully.",
          hint: "Check whether the second number is 0 before dividing.",
          solution: `a = float(input("First number: "))
b = float(input("Second number: "))

print(f"Sum:        {a + b:.2f}")
print(f"Difference: {a - b:.2f}")
print(f"Product:    {a * b:.2f}")

if b == 0:
    print("Quotient:   undefined (cannot divide by zero)")
else:
    print(f"Quotient:   {a / b:.2f}")`,
        },
      ],
    },
  ],
};
