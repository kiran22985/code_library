import type { Module } from "@/lib/types";

export const errors: Module = {
  id: "errors",
  title: "Errors and exceptions",
  description:
    "Reading tracebacks, handling exceptions, raising your own, and debugging effectively.",
  lessons: [
    {
      slug: "exceptions",
      title: "Handling exceptions",
      summary:
        "try, except, else and finally — catching failures without hiding bugs.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "When something goes wrong, Python raises an **exception**. Left unhandled, it stops the program and prints a traceback. `try`/`except` lets you respond instead.",
        },
        {
          type: "code",
          code: `try:
    number = int(input("Enter a number: "))
    print(100 / number)
except ValueError:
    print("That is not a number")
except ZeroDivisionError:
    print("Cannot divide by zero")`,
          output: "Enter a number: abc\nThat is not a number",
        },
        { type: "heading", text: "Reading a traceback" },
        {
          type: "code",
          lang: "text",
          code: `Traceback (most recent call last):
  File "app.py", line 12, in <module>
    main()
  File "app.py", line 8, in main
    total = compute(values)
  File "app.py", line 4, in compute
    return sum(values) / len(values)
           ~~~~~~~~~~~~^~~~~~~~~~~~~
ZeroDivisionError: division by zero`,
        },
        {
          type: "list",
          items: [
            "Read it **bottom up**: the last line is the actual error and its message.",
            "The frame just above it is where the error happened — `app.py`, line 4.",
            "The frames above that show how you got there, oldest call first.",
            "Python 3.11+ underlines the exact sub-expression that failed.",
          ],
        },
        { type: "heading", text: "The full statement" },
        {
          type: "code",
          code: `def read_config(path):
    try:
        file = open(path)
    except FileNotFoundError:
        print("No config, using defaults")
        return {}
    else:
        print("Opened successfully")     # runs only if no exception
        return {"loaded": True}
    finally:
        print("Cleanup runs no matter what")


print(read_config("missing.toml"))`,
          output:
            "No config, using defaults\nCleanup runs no matter what\n{}",
        },
        {
          type: "table",
          head: ["Clause", "Runs when"],
          rows: [
            ["`try`", "Always — the code being watched"],
            ["`except`", "A matching exception was raised"],
            ["`else`", "No exception was raised"],
            ["`finally`", "Always, even after `return` or an unhandled raise"],
          ],
        },
        { type: "heading", text: "Catching several, and inspecting the error" },
        {
          type: "code",
          code: `values = ["10", "abc", "0"]

for raw in values:
    try:
        result = 100 / int(raw)
    except (ValueError, ZeroDivisionError) as error:
        print(f"{raw}: {type(error).__name__} — {error}")
    else:
        print(f"{raw}: {result}")`,
          output: `10: 10.0
abc: ValueError — invalid literal for int() with base 10: 'abc'
0: ZeroDivisionError — division by zero`,
        },
        { type: "heading", text: "Catch narrowly" },
        {
          type: "code",
          code: `# Bad — swallows everything, including typos and Ctrl+C bugs
try:
    risky()
except:
    pass

# Also bad — too broad, and silent
try:
    risky()
except Exception:
    pass

# Good — the specific failure you expected, and you say something
try:
    risky()
except TimeoutError as error:
    logger.warning("Upstream timed out: %s", error)
    raise`,
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "A bare `except:` is almost always a bug",
          md: "It catches `KeyboardInterrupt` and `SystemExit` too, so Ctrl+C stops working. If you truly need a catch-all, use `except Exception:` and log what happened.",
        },
        { type: "heading", text: "Common exception types" },
        {
          type: "table",
          head: ["Exception", "Raised when"],
          rows: [
            ["`ValueError`", "Right type, wrong value — `int(\"abc\")`"],
            ["`TypeError`", "Wrong type — `\"a\" + 1`"],
            ["`KeyError`", "Missing dictionary key"],
            ["`IndexError`", "Index out of range"],
            ["`AttributeError`", "Object has no such attribute"],
            ["`FileNotFoundError`", "Path does not exist"],
            ["`ZeroDivisionError`", "Division by zero"],
            ["`StopIteration`", "An iterator is exhausted"],
          ],
        },
        {
          type: "exercise",
          prompt:
            "Write `safe_get(data, key)` that returns the value for a key in a dict, or the string `\"missing\"` if the key is absent — using try/except rather than `.get()`.",
          hint: "`KeyError` is the exception you want.",
          solution: `def safe_get(data, key):
    try:
        return data[key]
    except KeyError:
        return "missing"


print(safe_get({"a": 1}, "a"))
print(safe_get({"a": 1}, "b"))`,
        },
      ],
    },

    {
      slug: "raising",
      title: "Raising exceptions",
      summary:
        "Signalling errors with raise, re-raising, chaining with from, and failing fast.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          code: `def set_age(age):
    if not isinstance(age, int):
        raise TypeError(f"age must be an int, got {type(age).__name__}")
    if age < 0:
        raise ValueError(f"age cannot be negative: {age}")
    return age


print(set_age(30))

try:
    set_age(-5)
except ValueError as error:
    print("Caught:", error)`,
          output: "30\nCaught: age cannot be negative: -5",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Fail fast, fail loudly",
          md: "Validate inputs at the top of a function and raise immediately. An exception at the boundary is far easier to debug than corrupted data discovered three modules later.",
        },
        { type: "heading", text: "Re-raising" },
        {
          type: "code",
          code: `def process(path):
    try:
        return open(path).read()
    except FileNotFoundError:
        print(f"log: {path} is missing")
        raise            # bare raise keeps the original traceback


try:
    process("nope.txt")
except FileNotFoundError:
    print("handled higher up")`,
          output: "log: nope.txt is missing\nhandled higher up",
        },
        { type: "heading", text: "Chaining with `from`" },
        {
          type: "code",
          code: `class ConfigError(Exception):
    pass


def load(path):
    try:
        return open(path).read()
    except FileNotFoundError as error:
        raise ConfigError(f"Cannot start without {path}") from error


try:
    load("app.toml")
except ConfigError as error:
    print(error)
    print("caused by:", type(error.__cause__).__name__)`,
          output:
            "Cannot start without app.toml\ncaused by: FileNotFoundError",
        },
        {
          type: "text",
          md: "`raise X from error` records the original cause, so the traceback shows both — the low-level failure *and* the meaningful message. Use `from None` when the original is noise.",
        },
        { type: "heading", text: "Exception groups (3.11+)" },
        {
          type: "code",
          code: `def validate(data):
    problems = []
    if not data.get("name"):
        problems.append(ValueError("name is required"))
    if data.get("age", 0) < 0:
        problems.append(ValueError("age must be positive"))
    if problems:
        raise ExceptionGroup("validation failed", problems)


try:
    validate({"age": -1})
except* ValueError as group:
    for error in group.exceptions:
        print("-", error)`,
          output: "- name is required\n- age must be positive",
        },
        {
          type: "quiz",
          question:
            "What is the difference between `raise` and `raise error` inside an except block?",
          options: [
            "There is none",
            "A bare `raise` re-raises the current exception with its original traceback",
            "`raise` creates a new exception",
            "`raise error` is invalid syntax",
          ],
          answer: 1,
          explanation:
            "A bare `raise` re-raises the exception being handled, preserving the traceback. Re-raising the variable also works but can reset context in some cases.",
        },
      ],
    },

    {
      slug: "custom-exceptions",
      title: "Custom exceptions",
      summary:
        "Defining your own exception types and building a small hierarchy for an application.",
      minutes: 5,
      blocks: [
        {
          type: "text",
          md: "Custom exceptions let callers catch *your* errors specifically, instead of guessing which built-in you happened to reuse.",
        },
        {
          type: "code",
          code: `class AppError(Exception):
    """Base class for every error this application raises."""


class ValidationError(AppError):
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")


class NotFoundError(AppError):
    pass


def create_user(data):
    if "email" not in data:
        raise ValidationError("email", "is required")
    return data


try:
    create_user({})
except ValidationError as error:
    print(error)
    print("field:", error.field)     # structured data, not just a string
except AppError:
    print("some other application error")`,
          output: "email: is required\nfield: email",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Always define one base exception per project",
          md: "With `AppError` as the root, callers can write `except AppError:` to catch anything your library raises, without also swallowing unrelated bugs.",
        },
        { type: "heading", text: "Inherit from the closest built-in" },
        {
          type: "code",
          code: `class InvalidTemperature(ValueError):
    """More specific than ValueError, still catchable as one."""


try:
    raise InvalidTemperature("below absolute zero")
except ValueError as error:        # existing code keeps working
    print("caught as ValueError:", error)`,
          output: "caught as ValueError: below absolute zero",
        },
        {
          type: "list",
          items: [
            "Name them ending in `Error` — that is the convention.",
            "Give them docstrings; often that is the entire class body.",
            "Add attributes when the caller may want to react programmatically.",
            "Do not create dozens of them — a handful of meaningful ones beats an exception per line.",
          ],
        },
        {
          type: "exercise",
          prompt:
            "Define `InsufficientFundsError` carrying `balance` and `requested`, and raise it from a `withdraw()` function when the amount is too large.",
          hint: "Store both values on the instance and build a message with an f-string.",
          solution: `class InsufficientFundsError(Exception):
    def __init__(self, balance, requested):
        self.balance = balance
        self.requested = requested
        super().__init__(
            f"Cannot withdraw {requested}, balance is {balance}"
        )


def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount


try:
    withdraw(50, 80)
except InsufficientFundsError as error:
    print(error)
    print("short by", error.requested - error.balance)`,
        },
      ],
    },

    {
      slug: "debugging",
      title: "Debugging and assertions",
      summary:
        "print debugging done well, assert, breakpoint() and the pdb basics worth memorising.",
      minutes: 6,
      blocks: [
        { type: "heading", text: "print debugging, upgraded" },
        {
          type: "code",
          code: `values = [3, 7, 2]
target = 12

total = sum(values)
print(f"{values = }")
print(f"{total = }, {target = }, {total >= target = }")`,
          output:
            "values = [3, 7, 2]\ntotal = 12, target = 12, total >= target = True",
        },
        {
          type: "text",
          md: "The `=` suffix inside an f-string prints the expression *and* its value. For objects, `vars(obj)` and `repr(obj)` tell you far more than `str(obj)`.",
        },
        { type: "heading", text: "assert" },
        {
          type: "code",
          code: `def average(values):
    assert values, "average() requires at least one value"
    result = sum(values) / len(values)
    assert 0 <= result, "average should not be negative here"
    return result


print(average([2, 4]))

try:
    average([])
except AssertionError as error:
    print("AssertionError:", error)`,
          output: "3.0\nAssertionError: average() requires at least one value",
        },
        {
          type: "callout",
          variant: "warn",
          title: "assert is not input validation",
          md: "Running Python with `-O` removes every assert statement. Use them for internal invariants (“this should be impossible”), and raise real exceptions for anything a user could trigger.",
        },
        { type: "heading", text: "The built-in debugger" },
        {
          type: "code",
          code: `def compute(values):
    total = 0
    for value in values:
        breakpoint()        # execution stops here, drops you into pdb
        total += value
    return total`,
        },
        {
          type: "table",
          head: ["Command", "Does"],
          rows: [
            ["`n`", "Next line (step over)"],
            ["`s`", "Step into the call"],
            ["`c`", "Continue until the next breakpoint"],
            ["`p expr`", "Print an expression"],
            ["`l`", "List the source around the current line"],
            ["`w`", "Show the call stack"],
            ["`q`", "Quit"],
          ],
        },
        { type: "heading", text: "Logging beats print in real programs" },
        {
          type: "code",
          code: `import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

logger.debug("starting with %s items", 3)
logger.info("processing")
logger.warning("disk almost full")
logger.error("upload failed")`,
          output:
            "DEBUG __main__: starting with 3 items\nINFO __main__: processing\nWARNING __main__: disk almost full\nERROR __main__: upload failed",
        },
        {
          type: "callout",
          variant: "tip",
          title: "A debugging checklist",
          md: "Read the **last** line of the traceback first. Check the actual types with `type(x)`. Print the value just before the failing line. Then reduce the input until the failure is the smallest it can be — the bug is usually obvious by then.",
        },
      ],
    },
  ],
};
