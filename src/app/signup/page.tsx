import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a free CodeLibrary account to save your lesson progress across devices.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
