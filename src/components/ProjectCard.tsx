import Link from "next/link";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
}

export default function ProjectCard({
  id,
  name,
  description,
  createdAt,
}: ProjectCardProps) {
  return (
    <Link
      href={`/dashboard/projects/${id}`}
      className="block rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm hover:border-sky-500"
    >
      <h3 className="text-base font-semibold text-slate-50">{name}</h3>
      {description && (
        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
          {description}
        </p>
      )}
      {createdAt && (
        <p className="mt-2 text-[10px] text-slate-500">
          Created {new Date(createdAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}
