import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to sync your CodeLibrary lesson progress across devices.",
};

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary in a prerendered page.
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
