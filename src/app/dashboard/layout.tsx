import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="h-full rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
        <p className="mb-2 text-xs text-slate-400">Logged in as</p>
        <p className="font-medium text-slate-100">{user.name}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
        <p className="mt-1 text-[10px] text-slate-500">Role: {user.role}</p>
        <div className="mt-4 space-y-2">
          <a
            href="/dashboard"
            className="block text-slate-200 hover:text-sky-400"
          >
            Overview
          </a>
          <a
            href="/dashboard/projects"
            className="block text-slate-200 hover:text-sky-400"
          >
            Projects
          </a>
        </div>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </aside>
      <section>{children}</section>
    </div>
  );
}
