import { getCurrentUser } from "@/lib/auth";

export default async function DashboardHome() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-300">
        Welcome back, {user?.name}. Time to slay some bugs and invent a few new
        ones.
      </p>
      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
        <p>Use the sidebar to manage projects and issues.</p>
      </div>
    </div>
  );
}
