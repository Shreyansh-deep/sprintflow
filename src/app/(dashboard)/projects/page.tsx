import ProjectCard from "@/components/ProjectCard";

interface ProjectsResponse {
  projects: {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
  }[];
}

export default async function ProjectsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`,
    {
      // Use no-store to always fetch fresh, or remove for caching
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Projects</h1>
        <p className="mt-2 text-sm text-red-400">Failed to load projects.</p>
      </div>
    );
  }

  const data = (await res.json()) as ProjectsResponse;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-50">Projects</h1>
        <a
          href="/dashboard/projects/new"
          className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
        >
          New Project
        </a>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.projects.length === 0 && (
          <p className="text-sm text-slate-400">
            No projects yet. Create your first one.
          </p>
        )}
        {data.projects.map((p) => (
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
