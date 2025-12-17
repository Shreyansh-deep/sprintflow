import { getCurrentUser } from "@/lib/auth";
import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";
import ProjectCard from "@/components/ProjectCard";

interface ProjectsResponseItem {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export default async function DashboardHome() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
        <p className="mt-2 text-sm text-red-400">Unauthorized — please login.</p>
      </div>
    );
  }

  await connectDB();

  // Query projects directly
  const projectsRaw = await Project.find({
    $or: [{ owner: user._id }, { members: user._id }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const projects = (projectsRaw || []).map((p) => ({
    id: String(p._id),
    name: p.name,
    description: p.description,
    createdAt: p.createdAt?.toString(),
  })) as ProjectsResponseItem[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-300">
            Welcome back, {user.name}. Time to slay some bugs and invent a few new ones.
          </p>
        </div>
        <a
          href="/dashboard/projects/new"
          className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
        >
          New Project
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {projects.length === 0 && (
          <p className="text-sm text-slate-400">
            No projects yet. Create your first one.
          </p>
        )}
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            id={p.id}
            name={p.name}
            description={p.description}
            createdAt={p.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
