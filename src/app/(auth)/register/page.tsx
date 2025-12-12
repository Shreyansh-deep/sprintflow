"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
    //   setError(typeof(data.error) === "string" ? data.error : "Registration failed");
    setError(data.error?.fieldErrors?.email[0] || data.error || "Registration failed");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-semibold text-slate-50">
        Create your account
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Become the sprint overlord. Or just keep things slightly less chaotic.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs text-slate-300">Name</label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
        </div>
        {error && <p className="text-xs text-red-400">{String(error)}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sky-500 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
