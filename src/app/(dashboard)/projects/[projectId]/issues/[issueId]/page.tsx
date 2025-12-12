"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Issue {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function IssueDetailPage() {
  const params = useParams() as { projectId: string; issueId: string };
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadIssue() {
    setLoading(true);
    const res = await fetch(`/api/issues/${params.issueId}`);
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to load issue");
      return;
    }

    setIssue(data.issue);
  }

  useEffect(() => {
    loadIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.issueId]);

  async function updateStatus(status: string) {
    if (!issue) return;
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/issues/${issue.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update status");
      return;
    }

    setIssue((prev) => (prev ? { ...prev, status } : prev));
  }

  async function deleteIssue() {
    if (!issue) return;
    if (!confirm("Are you sure you want to delete this issue?")) return;

    const res = await fetch(`/api/issues/${issue.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete issue");
      return;
    }

    router.push(`/dashboard/projects/${params.projectId}`);
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading issue...</p>;
  }

  if (!issue) {
    return <p className="text-sm text-red-400">Issue not found.</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">Issue</p>
          <h1 className="text-2xl font-semibold text-slate-50">
            {issue.title}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Priority: <span className="font-medium">{issue.priority}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            value={issue.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-100 outline-none focus:border-sky-500"
            disabled={saving}
          >
            <option value="BACKLOG">BACKLOG</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="DONE">DONE</option>
          </select>
          <button
            onClick={deleteIssue}
            className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>

      {issue.description && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200">
          {issue.description}
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </div>
  );
}
