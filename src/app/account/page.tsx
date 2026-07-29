import type { Metadata } from "next";
import { availableCourses, courseStats } from "@/lib/courses";
import { AccountView } from "./AccountView";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your CodeLibrary profile and course progress.",
  robots: { index: false },
};

export default function AccountPage() {
  // Course metadata is static, so it is passed in from the server; the
  // per-user parts are read on the client from the session.
  const courses = availableCourses().map((course) => ({
    slug: course.slug,
    title: course.title,
    icon: course.icon,
    lessons: courseStats(course).lessons,
  }));

  return <AccountView courses={courses} />;
}
