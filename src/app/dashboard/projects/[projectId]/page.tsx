import IssueCard from "@/components/IssueCard";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Issue from "@/models/Issue";
import { getCurrentUser } from "@/lib/auth";
import DeleteProjectButton from "@/components/DeleteProjectButton";

interface Params {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Project</h1>
        <p className="mt-2 text-sm text-red-400">Unauthorized — please login.</p>
      </div>
    );
  }

  const { projectId } = await params;
  await connectDB();

  // Fetch project and verify access
  const project = await Project.findById(projectId).lean();
  if (!project) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Project</h1>
        <p className="mt-2 text-sm text-red-400">Project not found.</p>
      </div>
    );
  }

  // Check if user is owner or member
  const isOwner = project.owner.toString() === user._id.toString();
  const isMember =
    isOwner ||
    project.members.some((m: any) => m.toString() === user._id.toString());

  if (!isMember) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Project</h1>
        <p className="mt-2 text-sm text-red-400">You don't have access to this project.</p>
      </div>
    );
  }

  // Fetch issues for this project
  const issuesRaw = await Issue.find({ project: projectId })
    .sort({ createdAt: -1 })
    .lean();

  const issues = (issuesRaw || []).map((i) => ({
    id: String(i._id),
    title: i.title,
    status: i.status,
    priority: i.priority,
    createdAt: i.createdAt?.toString(),
  }));

  return (
    <div>
      <a
        href="/dashboard"
        className="mb-4 inline-flex items-center text-sm text-slate-400 hover:text-sky-400"
      >
        ← Back to Dashboard
      </a>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-1 text-sm text-slate-300">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/dashboard/projects/${projectId}/issues/new`}
            className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
          >
            New Issue
          </a>
          {isOwner && <DeleteProjectButton projectId={projectId} />}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {issues.length === 0 && (
          <p className="text-sm text-slate-400">
            No issues yet. Create your first one.
          </p>
        )}
        {issues.map((i) => (
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
