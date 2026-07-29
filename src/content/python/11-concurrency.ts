import type { Module } from "@/lib/types";

export const concurrency: Module = {
  id: "concurrency",
  title: "Concurrency",
  description:
    "Doing several things at once with threads, processes and async/await — and knowing which to pick.",
  lessons: [
    {
      slug: "threading",
      title: "Threads and the GIL",
      summary:
        "Running I/O-bound work concurrently, thread pools, locks, and what the GIL does to CPU work.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "A thread runs code concurrently inside one process. In CPython the **Global Interpreter Lock** allows only one thread to execute Python bytecode at a time — so threads speed up *waiting*, not *computing*.",
        },
        {
          type: "table",
          head: ["Workload", "Bottleneck", "Use"],
          rows: [
            ["Downloading 100 URLs", "Network wait", "**Threads** or asyncio"],
            ["Reading 1000 files", "Disk wait", "**Threads**"],
            ["Resizing 1000 images", "CPU", "**Processes**"],
            ["Serving many connections", "Network wait", "**asyncio**"],
          ],
        },
        { type: "heading", text: "Starting threads" },
        {
          type: "code",
          code: `import threading
import time


def worker(name, seconds):
    print(f"{name} starting")
    time.sleep(seconds)          # releases the GIL while waiting
    print(f"{name} finished")


start = time.perf_counter()

threads = [
    threading.Thread(target=worker, args=(f"task-{i}", 1))
    for i in range(3)
]

for thread in threads:
    thread.start()
for thread in threads:
    thread.join()                # wait for all of them

print(f"total {time.perf_counter() - start:.1f}s")`,
          output: `task-0 starting
task-1 starting
task-2 starting
task-0 finished
task-1 finished
task-2 finished
total 1.0s`,
        },
        {
          type: "text",
          md: "Three seconds of sleeping finished in one, because the waits overlapped.",
        },
        { type: "heading", text: "ThreadPoolExecutor — the modern way" },
        {
          type: "code",
          code: `from concurrent.futures import ThreadPoolExecutor, as_completed
import time


def fetch(url):
    time.sleep(0.5)                    # pretend network call
    return f"{url} -> 200"


urls = [f"https://example.com/{n}" for n in range(6)]

with ThreadPoolExecutor(max_workers=4) as pool:
    # map keeps input order
    for result in pool.map(fetch, urls):
        print(result)

    # or submit and handle results as they arrive
    futures = {pool.submit(fetch, url): url for url in urls[:2]}
    for future in as_completed(futures):
        print("done:", future.result())`,
          output: `https://example.com/0 -> 200
https://example.com/1 -> 200
https://example.com/2 -> 200
https://example.com/3 -> 200
https://example.com/4 -> 200
https://example.com/5 -> 200
done: https://example.com/1 -> 200
done: https://example.com/0 -> 200`,
        },
        {
          type: "callout",
          variant: "tip",
          md: "Prefer `ThreadPoolExecutor` over creating `Thread` objects by hand. It reuses threads, limits concurrency and propagates exceptions through `future.result()`.",
        },
        { type: "heading", text: "Shared state needs a lock" },
        {
          type: "code",
          code: `import threading

counter = 0
lock = threading.Lock()


def increment_unsafe():
    global counter
    for _ in range(100_000):
        counter += 1            # read, add, write — can be interrupted


def increment_safe():
    global counter
    for _ in range(100_000):
        with lock:              # only one thread inside at a time
            counter += 1


threads = [threading.Thread(target=increment_safe) for _ in range(4)]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()

print(counter)`,
          output: "400000",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "Race conditions are silent",
          md: "Without the lock, the same program prints a different, smaller number nearly every run — and usually works fine on your laptop before failing in production. Protect every mutable value that more than one thread touches.",
        },
        {
          type: "callout",
          variant: "note",
          title: "The GIL is on its way out",
          md: "Python 3.13 ships an experimental free-threaded build without the GIL. Until it is the default, assume threads do not speed up pure-Python computation.",
        },
      ],
    },

    {
      slug: "multiprocessing",
      title: "Multiprocessing",
      summary:
        "Using every CPU core for heavy computation with processes and ProcessPoolExecutor.",
      minutes: 6,
      blocks: [
        {
          type: "text",
          md: "Each process gets its own interpreter and its own GIL, so processes achieve true parallelism — at the cost of slower startup and no shared memory.",
        },
        {
          type: "code",
          filename: "crunch.py",
          code: `from concurrent.futures import ProcessPoolExecutor
import time


def is_prime(n):
    if n < 2:
        return False
    for divisor in range(2, int(n ** 0.5) + 1):
        if n % divisor == 0:
            return False
    return True


def count_primes(limit):
    return sum(1 for n in range(limit) if is_prime(n))


if __name__ == "__main__":          # required on Windows and macOS
    limits = [200_000] * 4

    start = time.perf_counter()
    serial = [count_primes(limit) for limit in limits]
    print(f"serial:   {time.perf_counter() - start:.1f}s")

    start = time.perf_counter()
    with ProcessPoolExecutor() as pool:
        parallel = list(pool.map(count_primes, limits))
    print(f"parallel: {time.perf_counter() - start:.1f}s")

    print(serial == parallel)`,
          output: "serial:   4.8s\nparallel: 1.4s\nTrue",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "The main guard is mandatory",
          md: "On Windows and macOS, child processes re-import your module. Without `if __name__ == \"__main__\":` the pool spawns processes recursively until everything falls over.",
        },
        { type: "heading", text: "Processes do not share memory" },
        {
          type: "code",
          code: `from multiprocessing import Process, Queue


def produce(queue, values):
    for value in values:
        queue.put(value ** 2)
    queue.put(None)                 # sentinel: nothing more coming


if __name__ == "__main__":
    queue = Queue()
    worker = Process(target=produce, args=(queue, [1, 2, 3]))
    worker.start()

    while (item := queue.get()) is not None:
        print("received", item)

    worker.join()`,
          output: "received 1\nreceived 4\nreceived 9",
        },
        {
          type: "text",
          md: "Arguments and results are pickled and copied between processes. That means the data must be picklable (no open files, no lambdas) and that copying large objects can cost more than the work you saved.",
        },
        {
          type: "table",
          head: ["", "Threads", "Processes", "asyncio"],
          rows: [
            ["Parallel CPU work", "No (GIL)", "**Yes**", "No"],
            ["Overlapping I/O", "Yes", "Yes", "**Yes**"],
            ["Memory per unit", "Low", "High", "Very low"],
            ["Shared state", "Easy, needs locks", "Explicit (queues)", "Easy, single-threaded"],
            ["Startup cost", "Low", "High", "Very low"],
          ],
        },
        {
          type: "callout",
          variant: "tip",
          md: "Measure before parallelising. For small inputs the overhead of spawning processes and pickling data outweighs any speed-up.",
        },
      ],
    },

    {
      slug: "asyncio",
      title: "async and await",
      summary:
        "Cooperative concurrency: coroutines, the event loop, gather, and when async is worth it.",
      minutes: 8,
      blocks: [
        {
          type: "text",
          md: "`asyncio` runs many tasks on a single thread. Whenever a task waits — for a socket, a database, a timer — it hands control back to the event loop, which runs something else in the meantime.",
        },
        {
          type: "code",
          code: `import asyncio
import time


async def fetch(name, seconds):
    print(f"{name} started")
    await asyncio.sleep(seconds)        # yields control while waiting
    print(f"{name} done")
    return f"{name} result"


async def main():
    start = time.perf_counter()

    # Sequential — each await blocks the next line
    await fetch("first", 1)
    await fetch("second", 1)
    print(f"sequential: {time.perf_counter() - start:.1f}s")

    # Concurrent — both run at once
    start = time.perf_counter()
    results = await asyncio.gather(
        fetch("third", 1),
        fetch("fourth", 1),
    )
    print(f"concurrent: {time.perf_counter() - start:.1f}s")
    print(results)


asyncio.run(main())`,
          output: `first started
first done
second started
second done
sequential: 2.0s
third started
fourth started
third done
fourth done
concurrent: 1.0s
['third result', 'fourth result']`,
        },
        {
          type: "list",
          items: [
            "`async def` defines a **coroutine** — calling it returns an object that does nothing until awaited.",
            "`await` pauses the coroutine and lets the loop run other tasks.",
            "`asyncio.run()` starts the event loop and runs one coroutine to completion.",
            "`asyncio.gather()` runs several coroutines concurrently and returns their results in order.",
          ],
        },
        { type: "heading", text: "Tasks and timeouts" },
        {
          type: "code",
          code: `import asyncio


async def slow():
    await asyncio.sleep(5)
    return "finished"


async def main():
    # Schedule immediately, await later
    task = asyncio.create_task(slow())
    print("task scheduled, doing other work")
    await asyncio.sleep(0.1)

    try:
        result = await asyncio.wait_for(task, timeout=0.5)
        print(result)
    except TimeoutError:
        print("gave up waiting")

    # Structured concurrency (3.11+)
    async with asyncio.TaskGroup() as group:
        group.create_task(asyncio.sleep(0.1))
        group.create_task(asyncio.sleep(0.2))
    print("all group tasks finished")


asyncio.run(main())`,
          output:
            "task scheduled, doing other work\ngave up waiting\nall group tasks finished",
        },
        {
          type: "callout",
          variant: "gotcha",
          title: "One blocking call ruins everything",
          md: "`time.sleep(1)` or a synchronous `requests.get()` inside a coroutine freezes the **entire** event loop — every other task stops. Use `asyncio.sleep`, an async client such as `httpx`, or push blocking work to a thread with `asyncio.to_thread()`.",
        },
        {
          type: "code",
          code: `import asyncio


def blocking_work():
    import time
    time.sleep(1)
    return "done"


async def main():
    result = await asyncio.to_thread(blocking_work)   # safe
    print(result)


asyncio.run(main())`,
          output: "done",
        },
        { type: "heading", text: "Async iteration and context managers" },
        {
          type: "code",
          code: `import asyncio


async def stream(count):
    for n in range(count):
        await asyncio.sleep(0.05)
        yield n


async def main():
    async for value in stream(3):
        print("got", value)


asyncio.run(main())`,
          output: "got 0\ngot 1\ngot 2",
        },
        {
          type: "callout",
          variant: "note",
          title: "Where you will meet this next",
          md: "FastAPI route handlers are `async def` functions, and async database drivers use exactly this model. The concepts here carry over directly to the FastAPI course.",
        },
        {
          type: "exercise",
          prompt:
            "Write an async function that “fetches” five URLs concurrently (simulate with `asyncio.sleep`) and prints the total elapsed time.",
          hint: "Build a list of coroutines and pass them to `asyncio.gather(*coros)`.",
          solution: `import asyncio
import time


async def fetch(url, delay):
    await asyncio.sleep(delay)
    return f"{url}: ok"


async def main():
    start = time.perf_counter()
    urls = [f"/page/{n}" for n in range(5)]

    results = await asyncio.gather(*(fetch(url, 0.5) for url in urls))

    for result in results:
        print(result)
    print(f"took {time.perf_counter() - start:.2f}s")


asyncio.run(main())`,
        },
      ],
    },
  ],
};
