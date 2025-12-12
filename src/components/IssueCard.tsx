import Link from "next/link";

interface IssueCardProps {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt?: string | Date;
}

const statusColors: Record<string, string> = {
  BACKLOG: "bg-slate-800 text-slate-200",
  IN_PROGRESS: "bg-sky-500/10 text-sky-300 border border-sky-600/60",
  REVIEW: "bg-amber-500/10 text-amber-300 border border-amber-600/60",
  DONE: "bg-emerald-500/10 text-emerald-300 border border-emerald-600/60",
};

const priorityColors: Record<string, string> = {
  LOW: "text-emerald-300",
  MEDIUM: "text-amber-300",
  HIGH: "text-red-300",
};

export default function IssueCard({
  id,
  title,
  status,
  priority,
  createdAt,
}: IssueCardProps) {
  return (
    <Link
      href={`./issues/${id}`}
      className="block rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs hover:border-sky-500"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] ${
            statusColors[status] || "bg-slate-800 text-slate-200"
          }`}
        >
          {status}
        </span>
        <span className={priorityColors[priority] || "text-slate-300"}>
          {priority}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-50 line-clamp-2">
        {title}
      </p>
      {createdAt && (
        <p className="mt-2 text-[10px] text-slate-500">
          Created {new Date(createdAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}
