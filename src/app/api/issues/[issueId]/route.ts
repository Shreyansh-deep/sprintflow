import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Issue from "@/models/Issue";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth";
import { issueUpdateSchema } from "@/lib/validation";

interface Params {
  params: { issueId: string };
}

async function assertIssueAccess(issueId: string, userId: string) {
  await connectDB();

  const issue = await Issue.findById(issueId).lean();
  if (!issue) return { issue: null, project: null };

  const project = await Project.findById(issue.project).lean();
  if (!project) return { issue: null, project: null };

  const isMember =
    project.owner.toString() === userId ||
    project.members.some((m: any) => m.toString() === userId);

  return { issue, project, isMember };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { issueId } = await params;
  const { issue, project, isMember } = await assertIssueAccess(
    issueId,
    user._id.toString()
  );

  if (!issue || !project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isMember)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(
    {
      issue: {
        id: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        projectId: issue.project,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      },
    },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { issueId } = await params;
  const { issue, project, isMember } = await assertIssueAccess(
    issueId,
    user._id.toString()
  );

  if (!issue || !project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isMember)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = issueUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updateData: any = { ...parsed.data };
  if (updateData.dueDate) {
    updateData.dueDate = new Date(updateData.dueDate);
  }
  if (updateData.assigneeId) {
    updateData.assignee = updateData.assigneeId;
    delete updateData.assigneeId;
  }

  const updated = await Issue.findByIdAndUpdate(issueId, updateData, {
    new: true,
  }).lean();

  return NextResponse.json(
    {
      issue: {
        id: updated?._id,
        title: updated?.title,
        description: updated?.description,
        status: updated?.status,
        priority: updated?.priority,
        createdAt: updated?.createdAt,
        updatedAt: updated?.updatedAt,
      },
    },
    { status: 200 }
  );
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { issueId } = await params;
  const { issue, project, isMember } = await assertIssueAccess(
    issueId,
    user._id.toString()
  );

  if (!issue || !project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = project.owner.toString() === user._id.toString();
  if (!isMember || !isOwner) {
    return NextResponse.json(
      { error: "Only project owner can delete issues" },
      { status: 403 }
    );
  }

  await Issue.findByIdAndDelete(issueId);

  return NextResponse.json({ success: true }, { status: 200 });
}
