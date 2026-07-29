import type { Module } from "@/lib/types";

export const files: Module = {
  id: "files",
  title: "Files and data formats",
  description:
    "Reading and writing files, working with paths, and handling JSON, CSV and dates.",
  lessons: [
    {
      slug: "file-io",
      title: "Reading and writing files",
      summary:
        "open(), the with statement, modes, reading line by line and writing safely.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "Always open files with `with`. It closes the file automatically, even if an exception is raised in the middle of your code.",
        },
        {
          type: "code",
          code: `# Writing
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("First line\\n")
    file.write("Second line\\n")

# Reading it all back
with open("notes.txt", encoding="utf-8") as file:
    content = file.read()

print(content)`,
          output: "First line\nSecond line",
        },
        { type: "heading", text: "Modes" },
        {
          type: "table",
          head: ["Mode", "Meaning", "If the file exists", "If it does not"],
          rows: [
            ["`r`", "Read (default)", "Reads it", "`FileNotFoundError`"],
            ["`w`", "Write", "**Erases it**", "Creates it"],
            ["`a`", "Append", "Adds to the end", "Creates it"],
            ["`x`", "Exclusive create", "`FileExistsError`", "Creates it"],
            ["`r+`", "Read and write", "Opens at the start", "`FileNotFoundError`"],
            ["`rb` / `wb`", "Binary", "—", "—"],
          ],
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "`w` destroys data instantly",
          md: "Opening an existing file with `\"w\"` truncates it to zero bytes before you write anything. Use `\"a\"` to add to it, or `\"x\"` when the file must not already exist.",
        },
        { type: "heading", text: "Reading line by line" },
        {
          type: "code",
          code: `with open("notes.txt", encoding="utf-8") as file:
    for line in file:                  # streams — never loads the whole file
        print(line.rstrip())

with open("notes.txt", encoding="utf-8") as file:
    lines = file.readlines()           # list of lines, keeps the newlines
    first = lines[0].strip()

print(len(lines), repr(first))`,
          output: "First line\nSecond line\n2 'First line'",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Iterating over the file object is the memory-safe way to process logs and datasets of any size. `read()` and `readlines()` load everything into RAM.",
        },
        { type: "heading", text: "Appending" },
        {
          type: "code",
          code: `with open("log.txt", "a", encoding="utf-8") as file:
    file.write("2026-07-29 started\\n")

with open("log.txt", "a", encoding="utf-8") as file:
    file.writelines(["2026-07-29 step 1\\n", "2026-07-29 done\\n"])

with open("log.txt", encoding="utf-8") as file:
    print(file.read().strip())`,
          output:
            "2026-07-29 started\n2026-07-29 step 1\n2026-07-29 done",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Always pass encoding",
          md: "Without `encoding=\"utf-8\"`, Python uses a platform default, so a file that reads fine on Linux can raise `UnicodeDecodeError` on Windows. Be explicit and the problem disappears.",
        },
        { type: "heading", text: "Handling missing files" },
        {
          type: "code",
          code: `def read_or_default(path, default=""):
    try:
        with open(path, encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return default
    except PermissionError:
        print(f"No permission to read {path}")
        return default


print(repr(read_or_default("missing.txt", "(nothing)")))`,
          output: "'(nothing)'",
        },
        {
          type: "exercise",
          prompt:
            "Write a function that counts the lines, words and characters in a text file — the equivalent of `wc`.",
          hint: "Accumulate while iterating over the file object.",
          solution: `def word_count(path):
    lines = words = chars = 0
    with open(path, encoding="utf-8") as file:
        for line in file:
            lines += 1
            words += len(line.split())
            chars += len(line)
    return lines, words, chars


print(word_count("notes.txt"))`,
        },
      ],
    },

    {
      slug: "pathlib",
      title: "Paths with pathlib",
      summary:
        "Modern path handling: joining, globbing, checking existence and creating directories.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "`pathlib.Path` replaces string concatenation and most of `os.path`. Paths become objects with methods, and the `/` operator joins them — correctly on every platform.",
        },
        {
          type: "code",
          code: `from pathlib import Path

# Never do this:  "data" + "/" + "raw" + "/" + name
base = Path("data")
target = base / "raw" / "sales.csv"

print(target)
print(target.name, target.stem, target.suffix)
print(target.parent)
print(target.absolute().is_absolute())`,
          output:
            "data/raw/sales.csv\nsales.csv sales .csv\ndata/raw\nTrue",
        },
        { type: "heading", text: "Inspecting" },
        {
          type: "code",
          code: `from pathlib import Path

path = Path("notes.txt")

print(path.exists())
print(path.is_file(), path.is_dir())
print(path.stat().st_size, "bytes")

print(Path.cwd())
print(Path.home())`,
          output:
            "True\nTrue False\n24 bytes\n/Users/you/project\n/Users/you",
        },
        { type: "heading", text: "Reading and writing in one line" },
        {
          type: "code",
          code: `from pathlib import Path

path = Path("hello.txt")

path.write_text("Hi there\\n", encoding="utf-8")
print(path.read_text(encoding="utf-8").strip())

# Binary equivalents
path.write_bytes(b"raw")
print(path.read_bytes())`,
          output: "Hi there\nb'raw'",
        },
        { type: "heading", text: "Directories and globbing" },
        {
          type: "code",
          code: `from pathlib import Path

Path("output/reports").mkdir(parents=True, exist_ok=True)

for python_file in Path("src").glob("*.py"):
    print(python_file.name)

# Recursive search
for test in Path(".").rglob("test_*.py"):
    print(test)

# Sort by modification time, newest first
recent = sorted(Path(".").glob("*.log"), key=lambda p: p.stat().st_mtime, reverse=True)
print([p.name for p in recent[:3]])`,
          output: "main.py\nutils.py\ntests/test_main.py\n['app.log']",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Renaming and deleting",
          md: "`path.rename(new)` moves a file, `path.unlink(missing_ok=True)` deletes one, and `shutil.rmtree(path)` removes a whole directory tree. That last one has no undo — check the path before you run it.",
        },
        {
          type: "code",
          code: `from pathlib import Path

# A robust "path relative to this source file" idiom
HERE = Path(__file__).resolve().parent
CONFIG = HERE / "config" / "settings.toml"

print(CONFIG)`,
          output: "/Users/you/project/config/settings.toml",
        },
        {
          type: "callout",
          variant: "note",
          md: "`Path(__file__).parent` is how you locate data files next to your code, instead of depending on the directory the user happened to run the program from.",
        },
      ],
    },

    {
      slug: "json",
      title: "Working with JSON",
      summary:
        "Converting between Python objects and JSON, reading and writing files, and handling dates.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "JSON is the format of almost every web API and config file. The `json` module converts between JSON text and Python objects.",
        },
        {
          type: "code",
          code: `import json

data = {
    "name": "Kiran",
    "languages": ["Python", "JS"],
    "active": True,
    "score": None,
}

text = json.dumps(data)                     # object -> string
print(text)

pretty = json.dumps(data, indent=2, sort_keys=True)
print(pretty)

back = json.loads(text)                     # string -> object
print(back["languages"][0], type(back))`,
          output: `{"name": "Kiran", "languages": ["Python", "JS"], "active": true, "score": null}
{
  "active": true,
  "languages": [
    "Python",
    "JS"
  ],
  "name": "Kiran",
  "score": null
}
Python <class 'dict'>`,
        },
        {
          type: "table",
          head: ["Python", "JSON"],
          rows: [
            ["`dict`", "object"],
            ["`list`, `tuple`", "array"],
            ["`str`", "string"],
            ["`int`, `float`", "number"],
            ["`True` / `False`", "`true` / `false`"],
            ["`None`", "`null`"],
          ],
        },
        { type: "heading", text: "Files" },
        {
          type: "code",
          code: `import json
from pathlib import Path

config = {"host": "localhost", "port": 8000, "debug": False}

with open("config.json", "w", encoding="utf-8") as file:
    json.dump(config, file, indent=2)        # dump writes to a file

with open("config.json", encoding="utf-8") as file:
    loaded = json.load(file)                 # load reads from a file

print(loaded["port"])

# Or, with pathlib
print(json.loads(Path("config.json").read_text(encoding="utf-8"))["host"])`,
          output: "8000\nlocalhost",
        },
        {
          type: "callout",
          variant: "note",
          title: "dump vs dumps",
          md: "The `s` stands for *string*. `dumps`/`loads` work with strings; `dump`/`load` work with file objects.",
        },
        { type: "heading", text: "Types JSON does not know" },
        {
          type: "code",
          code: `import json
from datetime import datetime, date


def encode(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    raise TypeError(f"{type(value).__name__} is not JSON serialisable")


record = {"event": "signup", "at": datetime(2026, 7, 29, 10, 30)}
print(json.dumps(record, default=encode))`,
          output: '{"event": "signup", "at": "2026-07-29T10:30:00"}',
        },
        { type: "heading", text: "Handling malformed input" },
        {
          type: "code",
          code: `import json

for raw in ['{"ok": true}', "{broken}"]:
    try:
        print(json.loads(raw))
    except json.JSONDecodeError as error:
        print(f"Invalid JSON at line {error.lineno} col {error.colno}: {error.msg}")`,
          output:
            "{'ok': True}\nInvalid JSON at line 1 col 2: Expecting property name enclosed in double quotes",
        },
        {
          type: "callout",
          variant: "warn",
          md: "Never trust JSON from the network to have the shape you expect. Use `.get()` with defaults, or validate it with a library such as Pydantic before using the values.",
        },
      ],
    },

    {
      slug: "csv",
      title: "CSV files",
      summary:
        "Reading and writing spreadsheets with the csv module, including DictReader and DictWriter.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          filename: "sales.csv",
          lang: "text",
          code: `product,units,price
Keyboard,3,49.95
Monitor,1,229.00
Mouse,5,19.50`,
        },
        { type: "heading", text: "Reading" },
        {
          type: "code",
          code: `import csv

with open("sales.csv", newline="", encoding="utf-8") as file:
    reader = csv.reader(file)
    header = next(reader)               # skip and capture the header row
    for row in reader:
        print(row)                      # every value is a string`,
          output:
            "['Keyboard', '3', '49.95']\n['Monitor', '1', '229.00']\n['Mouse', '5', '19.50']",
        },
        {
          type: "code",
          code: `import csv

with open("sales.csv", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)       # rows become dicts keyed by header
    total = 0
    for row in reader:
        line_total = int(row["units"]) * float(row["price"])
        total += line_total
        print(f"{row['product']:<10} {line_total:>8.2f}")

print(f"{'TOTAL':<10} {total:>8.2f}")`,
          output: `Keyboard     149.85
Monitor      229.00
Mouse         97.50
TOTAL        476.35`,
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Pass newline=\"\"",
          md: "The csv module handles line endings itself. Without `newline=\"\"` you get blank rows between records on Windows.",
        },
        { type: "heading", text: "Writing" },
        {
          type: "code",
          code: `import csv

rows = [
    {"product": "Cable", "units": 10, "price": 4.99},
    {"product": "Dock", "units": 2, "price": 129.0},
]

with open("out.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["product", "units", "price"])
    writer.writeheader()
    writer.writerows(rows)

print(open("out.csv", encoding="utf-8").read().strip())`,
          output: "product,units,price\nCable,10,4.99\nDock,2,129.0",
        },
        { type: "heading", text: "Other delimiters and quoting" },
        {
          type: "code",
          code: `import csv, io

tsv = "name\\tcity\\nAda\\tLondon"
reader = csv.reader(io.StringIO(tsv), delimiter="\\t")
print(list(reader))

# Values containing the delimiter are quoted automatically
buffer = io.StringIO()
writer = csv.writer(buffer)
writer.writerow(["Smith, Ada", "London"])
print(buffer.getvalue().strip())`,
          output: `[['name', 'city'], ['Ada', 'London']]
"Smith, Ada",London`,
        },
        {
          type: "callout",
          variant: "tip",
          md: "For anything analytical — filtering, grouping, statistics across large files — reach for **pandas**: `df = pandas.read_csv(\"sales.csv\")`. The csv module is for simple, dependency-free reading and writing.",
        },
        {
          type: "exercise",
          prompt:
            "Read `sales.csv` and write a `report.csv` containing only the rows whose line total is above 100, with an added `total` column.",
          hint: "Compute the total inside the loop and pass the extended fieldnames to `DictWriter`.",
          solution: `import csv

with open("sales.csv", newline="", encoding="utf-8") as source:
    rows = list(csv.DictReader(source))

kept = []
for row in rows:
    row["total"] = round(int(row["units"]) * float(row["price"]), 2)
    if row["total"] > 100:
        kept.append(row)

with open("report.csv", "w", newline="", encoding="utf-8") as target:
    writer = csv.DictWriter(target, fieldnames=["product", "units", "price", "total"])
    writer.writeheader()
    writer.writerows(kept)`,
        },
      ],
    },

    {
      slug: "datetime",
      title: "Dates and times",
      summary:
        "Creating, formatting, parsing and doing arithmetic with dates, times and durations.",
      minutes: 7,
      blocks: [
        {
          type: "code",
          code: `from datetime import date, time, datetime, timedelta

today = date.today()
now = datetime.now()

print(today)
print(now.year, now.month, now.day, now.hour)

specific = datetime(2026, 7, 29, 14, 30)
print(specific)
print(date(2026, 12, 25) > today)`,
          output:
            "2026-07-29\n2026 7 29 10\n2026-07-29 14:30:00\nTrue",
        },
        { type: "heading", text: "Formatting with strftime" },
        {
          type: "code",
          code: `from datetime import datetime

moment = datetime(2026, 7, 29, 14, 5)

print(moment.strftime("%d/%m/%Y"))
print(moment.strftime("%d %B %Y at %H:%M"))
print(moment.strftime("%A"))
print(moment.isoformat())`,
          output:
            "29/07/2026\n29 July 2026 at 14:05\nWednesday\n2026-07-29T14:05:00",
        },
        {
          type: "table",
          head: ["Code", "Means", "Example"],
          rows: [
            ["`%Y` / `%y`", "Year", "2026 / 26"],
            ["`%m` / `%B` / `%b`", "Month", "07 / July / Jul"],
            ["`%d`", "Day of month", "29"],
            ["`%A` / `%a`", "Weekday", "Wednesday / Wed"],
            ["`%H:%M:%S`", "24-hour time", "14:05:00"],
            ["`%I:%M %p`", "12-hour time", "02:05 PM"],
          ],
        },
        { type: "heading", text: "Parsing" },
        {
          type: "code",
          code: `from datetime import datetime, date

parsed = datetime.strptime("29/07/2026", "%d/%m/%Y")
print(parsed)

# ISO strings parse without a format
print(datetime.fromisoformat("2026-07-29T14:30:00"))
print(date.fromisoformat("2026-07-29"))

try:
    datetime.strptime("not a date", "%d/%m/%Y")
except ValueError as error:
    print("Parse failed:", error)`,
          output: `2026-07-29 00:00:00
2026-07-29 14:30:00
2026-07-29
Parse failed: time data 'not a date' does not match format '%d/%m/%Y'`,
        },
        { type: "heading", text: "Arithmetic with timedelta" },
        {
          type: "code",
          code: `from datetime import date, timedelta

today = date(2026, 7, 29)

print(today + timedelta(days=7))
print(today - timedelta(weeks=2))

launch = date(2026, 12, 25)
remaining = launch - today
print(remaining.days, "days to go")
print(remaining.total_seconds() / 3600, "hours")`,
          output:
            "2026-08-05\n2026-07-15\n149 days to go\n3576.0 hours",
        },
        { type: "heading", text: "Time zones" },
        {
          type: "code",
          code: `from datetime import datetime, timezone
from zoneinfo import ZoneInfo

# Naive — no timezone attached, ambiguous
naive = datetime.now()

# Aware — always store and transmit these
utc = datetime.now(timezone.utc)
kathmandu = utc.astimezone(ZoneInfo("Asia/Kathmandu"))

print(utc.strftime("%H:%M %Z"))
print(kathmandu.strftime("%H:%M %Z"))`,
          output: "09:12 UTC\n14:57 +0545",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Store UTC, display local",
          md: "Keep every timestamp in UTC in your database and convert only when showing it to a user. Mixing naive and aware datetimes raises `TypeError: can't subtract offset-naive and offset-aware datetimes`.",
        },
        {
          type: "exercise",
          prompt:
            "Write `age_in_days(birthday)` that accepts a `\"DD/MM/YYYY\"` string and returns how many days old that person is.",
          hint: "Parse with `strptime(...).date()`, then subtract from `date.today()`.",
          solution: `from datetime import datetime, date


def age_in_days(birthday: str) -> int:
    born = datetime.strptime(birthday, "%d/%m/%Y").date()
    return (date.today() - born).days


print(age_in_days("15/03/1996"))`,
        },
      ],
    },
  ],
};
