import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
        Stay on top of your <span className="text-sky-400">sprints</span> and
        issues
      </h1>
      <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
        SprintFlow helps small teams track projects, issues, and priorities
        without drowning in enterprise-level chaos.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/register"
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-sky-500"
        >
          I already have an account
        </Link>
      </div>
    </div>
  );
}
