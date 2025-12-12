import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const projects = await Project.find({
    $or: [{ owner: user._id }, { members: user._id }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    {
      projects: projects.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
      })),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description } = parsed.data;

  const project = await Project.create({
    name,
    description,
    owner: user._id,
    members: [user._id],
  });

  return NextResponse.json(
    {
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
      },
    },
    { status: 201 }
  );
}
