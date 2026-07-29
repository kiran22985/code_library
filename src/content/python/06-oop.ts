import type { Module } from "@/lib/types";

export const oop: Module = {
  id: "oop",
  title: "Object-oriented programming",
  description:
    "Classes and objects, inheritance, encapsulation, dunder methods, properties and dataclasses.",
  lessons: [
    {
      slug: "classes",
      title: "Classes and objects",
      summary:
        "Defining your own types with class, creating instances, and what self actually means.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "A class is a blueprint. It bundles **data** (attributes) and **behaviour** (methods) into one type, so related things travel together instead of being scattered across loose variables.",
        },
        {
          type: "code",
          code: `class Dog:
    def __init__(self, name, breed):
        self.name = name          # instance attribute
        self.breed = breed

    def bark(self):
        return f"{self.name} says woof!"


rex = Dog("Rex", "Labrador")      # __init__ runs automatically
luna = Dog("Luna", "Beagle")

print(rex.name, rex.breed)
print(rex.bark())
print(luna.bark())`,
          output: "Rex Labrador\nRex says woof!\nLuna says woof!",
        },
        { type: "heading", text: "__init__ and self" },
        {
          type: "list",
          items: [
            "`__init__` is the **initialiser** — it runs when you create an instance and sets up its attributes.",
            "`self` is the instance being worked on. Python passes it automatically; you never write `rex.bark(rex)`.",
            "`self` is a convention, not a keyword — but naming it anything else will confuse every Python developer alive.",
            "Attributes assigned via `self.x = ...` belong to that one instance.",
          ],
        },
        {
          type: "code",
          code: `class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1
        return self.count


a = Counter()
b = Counter()

a.increment()
a.increment()
b.increment()

print(a.count, b.count)    # independent state`,
          output: "2 1",
        },
        { type: "heading", text: "Class attributes vs instance attributes" },
        {
          type: "code",
          code: `class Circle:
    PI = 3.14159            # class attribute — shared by every instance
    count = 0

    def __init__(self, radius):
        self.radius = radius     # instance attribute — one per object
        Circle.count += 1

    def area(self):
        return Circle.PI * self.radius ** 2


small = Circle(1)
large = Circle(10)

print(round(small.area(), 2), round(large.area(), 2))
print(Circle.count, small.PI)`,
          output: "3.14 314.16\n2 3.14159",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Never use a mutable class attribute for per-instance data",
          md: "`class Cart: items = []` gives *every* cart the same list. Assign mutable state inside `__init__` instead: `self.items = []`.",
        },
        { type: "heading", text: "A realistic example" },
        {
          type: "code",
          code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount
        self.history.append(("deposit", amount))
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))
        return self.balance


account = BankAccount("Kiran", 100)
account.deposit(50)
account.withdraw(30)

print(account.balance)
print(account.history)`,
          output: "120\n[('deposit', 50), ('withdraw', 30)]",
        },
        {
          type: "exercise",
          prompt:
            "Write a `Rectangle` class with `width` and `height`, plus `area()` and `perimeter()` methods, and a `is_square()` method returning a boolean.",
          hint: "All three methods take only `self` and read `self.width` / `self.height`.",
          solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height


r = Rectangle(4, 4)
print(r.area(), r.perimeter(), r.is_square())`,
        },
      ],
    },

    {
      slug: "methods",
      title: "Instance, class and static methods",
      summary:
        "The three kinds of method, when to use each, and alternative constructors with classmethod.",
      minutes: 6,
      blocks: [
        {
          type: "code",
          code: `class Pizza:
    SIZES = {"small": 8, "large": 14}

    def __init__(self, size, toppings):
        self.size = size
        self.toppings = toppings

    # 1. Instance method — works with one object
    def describe(self):
        return f"{self.size} pizza with {', '.join(self.toppings)}"

    # 2. Class method — works with the class, often an alternative constructor
    @classmethod
    def margherita(cls, size="small"):
        return cls(size, ["tomato", "mozzarella"])

    # 3. Static method — related utility, no access to self or cls
    @staticmethod
    def diameter_cm(size):
        return Pizza.SIZES[size] * 2.54


pizza = Pizza.margherita("large")
print(pizza.describe())
print(Pizza.diameter_cm("large"))`,
          output:
            "large pizza with tomato, mozzarella\n35.56",
        },
        {
          type: "table",
          head: ["Kind", "First argument", "Use it when"],
          rows: [
            ["Instance method", "`self`", "You need the object's data"],
            ["`@classmethod`", "`cls`", "You need the class — alternative constructors, factories"],
            ["`@staticmethod`", "none", "The function is related but needs neither"],
          ],
        },
        { type: "heading", text: "Alternative constructors" },
        {
          type: "text",
          md: "This is the single most useful application of `classmethod`: building an instance from a different kind of input.",
        },
        {
          type: "code",
          code: `class Date:
    def __init__(self, day, month, year):
        self.day, self.month, self.year = day, month, year

    @classmethod
    def from_string(cls, text):
        day, month, year = (int(part) for part in text.split("-"))
        return cls(day, month, year)

    @classmethod
    def today(cls):
        import datetime
        now = datetime.date.today()
        return cls(now.day, now.month, now.year)

    def __repr__(self):
        return f"Date({self.day}, {self.month}, {self.year})"


print(Date.from_string("29-07-2026"))
print(Date(1, 1, 2000))`,
          output: "Date(29, 7, 2026)\nDate(1, 1, 2000)",
        },
        {
          type: "callout",
          variant: "tip",
          md: "Use `cls(...)` rather than the class name inside a `classmethod` — that way subclasses build instances of themselves, not of the parent.",
        },
        {
          type: "heading",
          text: "Methods are just functions on the class",
        },
        {
          type: "code",
          code: `class Greeter:
    def hello(self):
        return "hi"


g = Greeter()
print(g.hello())
print(Greeter.hello(g))     # exactly the same call`,
          output: "hi\nhi",
        },
      ],
    },

    {
      slug: "inheritance",
      title: "Inheritance",
      summary:
        "Building on an existing class, calling super(), overriding methods and multiple inheritance.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "Inheritance lets a class reuse and extend another class. The new class is the **subclass** (or child), the one it builds on is the **superclass** (or parent).",
        },
        {
          type: "code",
          code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

    def introduce(self):
        return f"I am {self.name} and I say {self.speak()}"


class Dog(Animal):
    def speak(self):              # override
        return "Woof"


class Cat(Animal):
    def speak(self):
        return "Meow"


for animal in [Dog("Rex"), Cat("Luna"), Animal("Thing")]:
    print(animal.introduce())`,
          output:
            "I am Rex and I say Woof\nI am Luna and I say Meow\nI am Thing and I say ...",
        },
        {
          type: "text",
          md: "Note that `introduce()` was written once, in the parent, yet calls the *subclass* version of `speak()`. That is polymorphism doing the work.",
        },
        { type: "heading", text: "Extending __init__ with super()" },
        {
          type: "code",
          code: `class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def details(self):
        return f"{self.name}: {self.salary}"


class Manager(Employee):
    def __init__(self, name, salary, reports):
        super().__init__(name, salary)     # run the parent's setup first
        self.reports = reports             # then add our own

    def details(self):
        base = super().details()           # reuse the parent's method
        return f"{base} (manages {len(self.reports)})"


boss = Manager("Ada", 120_000, ["linus", "grace"])
print(boss.details())
print(boss.name, boss.reports)`,
          output: "Ada: 120000 (manages 2)\nAda ['linus', 'grace']",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Forgetting super().__init__()",
          md: "If a subclass defines `__init__` and never calls the parent's, the parent's attributes are never created — and you get `AttributeError` later, far from the real cause.",
        },
        { type: "heading", text: "Checking types" },
        {
          type: "code",
          code: `dog = Dog("Rex")

print(isinstance(dog, Dog))
print(isinstance(dog, Animal))      # subclasses count
print(type(dog) is Animal)          # exact type only
print(issubclass(Dog, Animal))
print(Dog.__mro__)`,
          output: `True
True
False
True
(<class 'Dog'>, <class 'Animal'>, <class 'object'>)`,
        },
        { type: "heading", text: "Multiple inheritance and the MRO" },
        {
          type: "code",
          code: `class Timestamped:
    def stamp(self):
        return "2026-07-29"


class Serializable:
    def to_dict(self):
        return self.__dict__


class Post(Timestamped, Serializable):
    def __init__(self, title):
        self.title = title


post = Post("Hello")
print(post.stamp(), post.to_dict())
print([cls.__name__ for cls in Post.__mro__])`,
          output:
            "2026-07-29 {'title': 'Hello'}\n['Post', 'Timestamped', 'Serializable', 'object']",
        },
        {
          type: "text",
          md: "Python resolves attributes using the **Method Resolution Order** — left to right, depth first, with each class appearing once. Small mixins like these are the sane use of multiple inheritance; deep diamond hierarchies are not.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Composition is often better",
          md: "Inherit only when the subclass genuinely *is a* kind of the parent. If it merely *has* one, store it as an attribute — `class Car: def __init__(self): self.engine = Engine()`.",
        },
        {
          type: "exercise",
          prompt:
            "Create a `Shape` base class with an `area()` that returns 0, then `Square` and `Circle` subclasses that override it. Print the total area of a list of shapes.",
          hint: "`sum(shape.area() for shape in shapes)` works because every shape has `area()`.",
          solution: `class Shape:
    def area(self):
        return 0


class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


shapes = [Square(2), Circle(1), Square(3)]
print(round(sum(shape.area() for shape in shapes), 2))`,
        },
      ],
    },

    {
      slug: "encapsulation",
      title: "Encapsulation",
      summary:
        "Public, protected and private attributes, name mangling, and Python's “we're all adults” philosophy.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "Python has no `private` keyword. It uses naming conventions to communicate intent, and trusts you to respect them.",
        },
        {
          type: "table",
          head: ["Name", "Means", "Enforced?"],
          rows: [
            ["`value`", "Public — use it freely", "—"],
            ["`_value`", "Internal — do not touch from outside", "No, convention only"],
            ["`__value`", "Name-mangled to avoid subclass clashes", "Partly"],
          ],
        },
        {
          type: "code",
          code: `class Account:
    def __init__(self, balance):
        self.owner = "Kiran"      # public
        self._bank_code = "X1"    # internal
        self.__pin = "1234"       # name mangled

    def check_pin(self, pin):
        return pin == self.__pin


account = Account(100)
print(account.owner)
print(account._bank_code)       # works, but you are breaking a promise
# print(account.__pin)          # AttributeError
print(account._Account__pin)    # the mangled name — still reachable
print(account.check_pin("1234"))`,
          output: "Kiran\nX1\n1234\nTrue",
        },
        {
          type: "callout",
          variant: "note",
          title: "Double underscore is not security",
          md: "`__pin` is renamed to `_Account__pin` to prevent accidental clashes in subclasses — not to hide secrets. Anyone can still read it. Use it rarely; a single underscore covers most needs.",
        },
        { type: "heading", text: "Controlling access with methods" },
        {
          type: "code",
          code: `class Temperature:
    def __init__(self):
        self._celsius = 0

    def get_celsius(self):
        return self._celsius

    def set_celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value


t = Temperature()
t.set_celsius(25)
print(t.get_celsius())

try:
    t.set_celsius(-300)
except ValueError as error:
    print("Rejected:", error)`,
          output: "25\nRejected: Below absolute zero",
        },
        {
          type: "callout",
          variant: "tip",
          title: "But do not write Java in Python",
          md: "Getter/setter pairs like these are unnecessary here — start with a plain public attribute and switch to `@property` (next lesson) *if* you later need validation. The calling code never has to change.",
        },
      ],
    },

    {
      slug: "properties",
      title: "Properties",
      summary:
        "Computed attributes, validation on assignment, and read-only values with @property.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "`@property` makes a method behave like an attribute. That means you can start with a simple attribute and add logic later without breaking any calling code.",
        },
        {
          type: "code",
          code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height


r = Rectangle(3, 4)
print(r.area)        # no parentheses — it looks like data

r.width = 10
print(r.area)        # always up to date`,
          output: "12\n40",
        },
        { type: "heading", text: "Validation with a setter" },
        {
          type: "code",
          code: `class Temperature:
    def __init__(self, celsius=0):
        self.celsius = celsius       # goes through the setter below

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9


t = Temperature(25)
print(t.celsius, t.fahrenheit)

t.fahrenheit = 212
print(t.celsius)

try:
    t.celsius = -300
except ValueError as error:
    print("Rejected:", error)`,
          output: "25 77.0\n100.0\nRejected: Below absolute zero",
        },
        { type: "heading", text: "Read-only attributes" },
        {
          type: "code",
          code: `class User:
    def __init__(self, username):
        self._username = username

    @property
    def username(self):
        return self._username


user = User("ada")
print(user.username)

try:
    user.username = "grace"
except AttributeError as error:
    print("Cannot set:", error)`,
          output:
            "ada\nCannot set: property 'username' of 'User' object has no setter",
        },
        {
          type: "callout",
          variant: "warn",
          title: "Keep properties cheap",
          md: "Callers expect attribute access to be instant. If computing the value needs a database query or a network call, make it an explicit method like `fetch_profile()` so the cost is visible.",
        },
        {
          type: "code",
          code: `from functools import cached_property


class Dataset:
    @cached_property
    def rows(self):
        print("loading...")     # runs once, then the value is stored
        return list(range(5))


data = Dataset()
print(data.rows)
print(data.rows)`,
          output: "loading...\n[0, 1, 2, 3, 4]\n[0, 1, 2, 3, 4]",
        },
        {
          type: "exercise",
          prompt:
            "Give a `Person` class a `full_name` property computed from `first` and `last`, and a setter that splits an assigned full name back into the two parts.",
          hint: "`self.first, self.last = value.split(\" \", 1)`",
          solution: `class Person:
    def __init__(self, first, last):
        self.first = first
        self.last = last

    @property
    def full_name(self):
        return f"{self.first} {self.last}"

    @full_name.setter
    def full_name(self, value):
        self.first, self.last = value.split(" ", 1)


p = Person("Ada", "Lovelace")
print(p.full_name)

p.full_name = "Grace Hopper"
print(p.first, p.last)`,
        },
      ],
    },

    {
      slug: "dunder-methods",
      title: "Dunder methods",
      summary:
        "Make your classes work with print, ==, len, [], + and the with statement.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "Double-underscore (“dunder”) methods let your objects plug into Python's built-in syntax. Implementing `__len__` makes `len(obj)` work; implementing `__eq__` makes `==` work.",
        },
        { type: "heading", text: "__str__ and __repr__" },
        {
          type: "code",
          code: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        """For humans — used by print() and str()."""
        return f"{self.title} by {self.author}"

    def __repr__(self):
        """For developers — used in the shell and in containers."""
        return f"Book(title={self.title!r}, author={self.author!r})"


book = Book("Dune", "Herbert")
print(book)
print(repr(book))
print([book])          # containers use __repr__`,
          output: `Dune by Herbert
Book(title='Dune', author='Herbert')
[Book(title='Dune', author='Herbert')]`,
        },
        {
          type: "callout",
          variant: "tip",
          md: "If you only write one, write `__repr__` — Python falls back to it for `print()` too, and it is what you will see while debugging.",
        },
        { type: "heading", text: "Equality and hashing" },
        {
          type: "code",
          code: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

    def __repr__(self):
        return f"Point({self.x}, {self.y})"


a, b = Point(1, 2), Point(1, 2)
print(a == b)          # True — same contents
print(a is b)          # False — different objects
print({a, b})          # hashable, so the set deduplicates them`,
          output: "True\nFalse\n{Point(1, 2)}",
        },
        {
          type: "callout",
          variant: "warn",
          md: "Defining `__eq__` sets `__hash__` to `None`, making instances unhashable. If you want them in sets or dict keys, define `__hash__` too — and only over immutable fields.",
        },
        { type: "heading", text: "Container behaviour" },
        {
          type: "code",
          code: `class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

    def __contains__(self, track):
        return track in self.tracks

    def __iter__(self):
        return iter(self.tracks)


playlist = Playlist(["a", "b", "c"])

print(len(playlist))
print(playlist[1])
print(playlist[::-1])
print("b" in playlist)
for track in playlist:
    print(track, end=" ")`,
          output: "3\nb\n['c', 'b', 'a']\nTrue\na b c ",
        },
        { type: "heading", text: "Operator overloading" },
        {
          type: "code",
          code: `class Money:
    def __init__(self, amount, currency="EUR"):
        self.amount, self.currency = amount, currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Money(self.amount + other.amount, self.currency)

    def __mul__(self, factor):
        return Money(self.amount * factor, self.currency)

    def __lt__(self, other):
        return self.amount < other.amount

    def __str__(self):
        return f"{self.amount:.2f} {self.currency}"


rent = Money(950)
bills = Money(120.50)

print(rent + bills)
print(rent * 12)
print(bills < rent)`,
          output: "1070.50 EUR\n11400.00 EUR\nTrue",
        },
        {
          type: "table",
          head: ["Method", "Enables"],
          rows: [
            ["`__init__`", "`Thing()`"],
            ["`__str__` / `__repr__`", "`print(t)` / the shell"],
            ["`__len__`", "`len(t)`"],
            ["`__getitem__`", "`t[0]`, slicing, iteration fallback"],
            ["`__iter__`", "`for x in t`"],
            ["`__contains__`", "`x in t`"],
            ["`__eq__`, `__lt__`", "`==`, `<`, `sorted()`"],
            ["`__add__`, `__mul__`", "`+`, `*`"],
            ["`__call__`", "`t()`"],
            ["`__enter__` / `__exit__`", "`with t:`"],
          ],
        },
        {
          type: "exercise",
          prompt:
            "Give a `Vector` class `__add__`, `__sub__` and `__repr__` so `Vector(1,2) + Vector(3,4)` prints `Vector(4, 6)`.",
          solution: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"


print(Vector(1, 2) + Vector(3, 4))
print(Vector(5, 5) - Vector(1, 2))`,
        },
      ],
    },

    {
      slug: "dataclasses",
      title: "Dataclasses",
      summary:
        "Generate __init__, __repr__ and __eq__ automatically for classes that mostly hold data.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "Most classes exist to hold a few fields. `@dataclass` writes the boilerplate for you.",
        },
        {
          type: "code",
          code: `# Without a dataclass
class PointManual:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"PointManual(x={self.x}, y={self.y})"

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)


# With one
from dataclasses import dataclass


@dataclass
class Point:
    x: int
    y: int


p = Point(1, 2)
print(p)
print(p == Point(1, 2))
print(p.x)`,
          output: "Point(x=1, y=2)\nTrue\n1",
        },
        { type: "heading", text: "Defaults, methods and ordering" },
        {
          type: "code",
          code: `from dataclasses import dataclass, field


@dataclass(order=True)
class Task:
    priority: int
    title: str
    done: bool = False
    tags: list[str] = field(default_factory=list)   # never use [] directly

    def complete(self):
        self.done = True


tasks = [Task(2, "Write tests"), Task(1, "Fix bug", tags=["urgent"])]
tasks.sort()                       # order=True generated the comparisons

print(tasks[0])
tasks[0].complete()
print(tasks[0].done)`,
          output:
            "Task(priority=1, title='Fix bug', done=False, tags=['urgent'])\nTrue",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Mutable defaults need default_factory",
          md: "`tags: list = []` raises `ValueError: mutable default`. The dataclass machinery catches the classic shared-mutable bug for you — use `field(default_factory=list)`.",
        },
        { type: "heading", text: "Frozen (immutable) dataclasses" },
        {
          type: "code",
          code: `from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    host: str
    port: int = 8000


config = Config("localhost")
print(config)

try:
    config.port = 9000
except Exception as error:
    print(type(error).__name__, error)

print(hash(config) is not None)     # frozen dataclasses are hashable`,
          output:
            "Config(host='localhost', port=8000)\nFrozenInstanceError cannot assign to field 'port'\nTrue",
        },
        { type: "heading", text: "Helpers" },
        {
          type: "code",
          code: `from dataclasses import dataclass, asdict, astuple, replace


@dataclass
class User:
    name: str
    age: int


user = User("Ada", 36)

print(asdict(user))
print(astuple(user))
print(replace(user, age=37))     # a modified copy`,
          output:
            "{'name': 'Ada', 'age': 36}\n('Ada', 36)\nUser(name='Ada', age=37)",
        },
        {
          type: "callout",
          variant: "tip",
          md: "`asdict()` is the shortest path from a dataclass to JSON: `json.dumps(asdict(user))`. Pydantic (used by FastAPI) takes the same idea further by validating types at runtime.",
        },
      ],
    },

    {
      slug: "abstract-classes",
      title: "Abstract classes and protocols",
      summary:
        "Defining interfaces with ABC, enforcing implementations, and duck typing with Protocol.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "An **abstract base class** defines methods that subclasses must implement, and refuses to be instantiated itself.",
        },
        {
          type: "code",
          code: `from abc import ABC, abstractmethod


class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        """Charge the given amount."""

    def receipt(self, amount):        # concrete methods are allowed too
        return f"Paid {amount} via {type(self).__name__}"


class Card(PaymentMethod):
    def pay(self, amount):
        return f"Charging card {amount}"


class Cash(PaymentMethod):
    pass       # forgot to implement pay()


print(Card().pay(50))
print(Card().receipt(50))

try:
    Cash()
except TypeError as error:
    print("Error:", error)`,
          output: `Charging card 50
Paid 50 via Card
Error: Can't instantiate abstract class Cash without an implementation for abstract method 'pay'`,
        },
        {
          type: "callout",
          variant: "note",
          md: "The error arrives when you *instantiate* the incomplete class, not when you define it — which is still far earlier than an `AttributeError` in production.",
        },
        { type: "heading", text: "Duck typing" },
        {
          type: "text",
          md: "Python usually does not require a shared base class at all. If an object has the method you call, it works — “if it walks like a duck and quacks like a duck”.",
        },
        {
          type: "code",
          code: `class Dog:
    def speak(self):
        return "Woof"


class Robot:
    def speak(self):
        return "Beep"


for thing in [Dog(), Robot()]:      # no common parent needed
    print(thing.speak())`,
          output: "Woof\nBeep",
        },
        { type: "heading", text: "Protocols: duck typing a type checker understands" },
        {
          type: "code",
          code: `from typing import Protocol


class Speaker(Protocol):
    def speak(self) -> str: ...


def announce(speaker: Speaker) -> None:
    print(speaker.speak())


class Cat:
    def speak(self) -> str:
        return "Meow"


announce(Cat())     # Cat never mentions Speaker, and that is the point`,
          output: "Meow",
        },
        {
          type: "table",
          head: ["Approach", "Use when"],
          rows: [
            ["`ABC`", "You control the hierarchy and want to force implementations"],
            ["`Protocol`", "You want structural typing without coupling classes together"],
            ["Plain duck typing", "Small scripts, or when a type checker is not involved"],
          ],
        },
      ],
    },
  ],
};
