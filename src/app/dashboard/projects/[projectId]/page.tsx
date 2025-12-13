import IssueCard from "@/components/IssueCard";
import { cookies } from "next/headers";

interface ProjectResponse {
  project: { id: string; name: string; description?: string };
}

interface IssuesResponse {
  issues: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt?: string;
  }[];
}

interface Params {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: Params) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { projectId } = await params;
  const cookieStore = await cookies();
  
  // Format cookies as a Cookie header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  
  const [projectRes, issuesRes] = await Promise.all([
    fetch(`${base}/api/projects/${projectId}`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    }),
    fetch(`${base}/api/issues?projectId=${projectId}`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    }),
  ]);

  if (!projectRes.ok) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Project</h1>
        <p className="mt-2 text-sm text-red-400">Failed to load project.</p>
      </div>
    );
  }

  const projectData = (await projectRes.json()) as ProjectResponse;
  const issuesData = issuesRes.ok
    ? ((await issuesRes.json()) as IssuesResponse)
    : { issues: [] };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            {projectData.project.name}
          </h1>
          {projectData.project.description && (
            <p className="mt-1 text-sm text-slate-300">
              {projectData.project.description}
            </p>
          )}
        </div>
        <a
          href={`/dashboard/projects/${projectData.project.id}/issues/new`}
          className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
        >
          New Issue
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {issuesData.issues.length === 0 && (
          <p className="text-sm text-slate-400">
            No issues yet. Create your first one.
          </p>
        )}
        {issuesData.issues.map((i) => (
          <IssueCard
            key={i.id}
            id={i.id}
            title={i.title}
            status={i.status}
            priority={i.priority}
            createdAt={i.createdAt}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  );
}
