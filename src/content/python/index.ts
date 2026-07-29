import type { Course } from "@/lib/types";
import { gettingStarted } from "./01-getting-started";
import { basics } from "./02-basics";
import { collections } from "./03-collections";
import { controlFlow } from "./04-control-flow";
import { functions } from "./05-functions";
import { oop } from "./06-oop";
import { modules } from "./07-modules";
import { errors } from "./08-errors";
import { files } from "./09-files";
import { stdlib } from "./10-stdlib";
import { concurrency } from "./11-concurrency";
import { professional } from "./12-professional";

export const pythonCourse: Course = {
  slug: "python",
  title: "Python",
  tagline: "Python 3.12 · complete course",
  description:
    "A complete Python course: syntax and data types, collections, control flow, functions, object-oriented programming, error handling, files, the standard library, typing, concurrency, testing and packaging.",
  level: "Beginner to Advanced",
  icon: "🐍",
  status: "available",
  modules: [
    gettingStarted,
    basics,
    collections,
    controlFlow,
    functions,
    oop,
    modules,
    errors,
    files,
    stdlib,
    concurrency,
    professional,
  ],
};
