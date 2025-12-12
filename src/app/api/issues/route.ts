import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Issue from "@/models/Issue";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth";
import { issueCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  const project = await Project.findById(projectId);
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const isMember =
    project.owner.toString() === user._id.toString() ||
    project.members.some((m: any) => m.toString() === user._id.toString());

  if (!isMember)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const issues = await Issue.find({ project: projectId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    {
      issues: issues.map((i) => ({
        id: i._id,
        title: i.title,
        description: i.description,
        status: i.status,
        priority: i.priority,
        createdAt: i.createdAt,
      })),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const parsed = issueCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, description, projectId, priority, assigneeId, dueDate } =
    parsed.data;

  const project = await Project.findById(projectId);
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const isMember =
    project.owner.toString() === user._id.toString() ||
    project.members.some((m: any) => m.toString() === user._id.toString());

  if (!isMember)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const issue = await Issue.create({
    title,
    description,
    project: projectId,
    reporter: user._id,
    assignee: assigneeId || undefined,
    priority: priority || "MEDIUM",
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });

  return NextResponse.json(
    {
      issue: {
        id: issue._id,
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
      },
    },
    { status: 201 }
  );
}
