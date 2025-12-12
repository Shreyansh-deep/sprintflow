"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-sky-400">
          SprintFlow
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {isDashboard ? (
            <Link href="/dashboard/projects" className="hover:text-sky-400">
              Projects
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-sky-400">
                Login
              </Link>
              <Link href="/register" className="hover:text-sky-400">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
