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

function formatError(error: any): string {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    // Handle Zod validation errors
    if (error.formErrors && error.formErrors.length > 0) {
      return error.formErrors.join(", ");
    }
    if (error.fieldErrors) {
      const fieldMessages = Object.entries(error.fieldErrors)
        .map(([field, errors]) => {
          const errorArray = Array.isArray(errors) ? errors : [errors];
          return `${field}: ${errorArray.join(", ")}`;
        })
        .join("; ");
      return fieldMessages || "Validation error";
    }
    // Fallback for other error objects
    return JSON.stringify(error);
  }
  return "An error occurred";
}

export default function IssueDetailPage() {
  const params = useParams() as { projectId: string; issueId: string };
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  async function loadIssue() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/issues/${params.issueId}`);
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(formatError(data.error) || "Failed to load issue");
        return;
      }

      setIssue(data.issue);
      setEditData({
        title: data.issue.title,
        description: data.issue.description || "",
        status: data.issue.status,
        priority: data.issue.priority,
      });
      setPendingStatus(null);
    } catch (err) {
      setLoading(false);
      setError("Failed to load issue");
    }
  }

  useEffect(() => {
    loadIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.issueId]);

  async function updateStatus(status: string) {
    if (!issue) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/issues/${issue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        setError(formatError(data.error) || "Failed to update status");
        return;
      }

      // Reload the issue to get the latest data from server
      await loadIssue();
    } catch (err) {
      setSaving(false);
      setError("Failed to update status");
    }
  }

  async function saveIssue() {
    if (!issue) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/issues/${issue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description,
          status: editData.status,
          priority: editData.priority,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        setError(formatError(data.error) || "Failed to update issue");
        return;
      }

      // Reload the issue to get the latest data from server
      await loadIssue();
      setIsEditing(false);
    } catch (err) {
      setSaving(false);
      setError("Failed to update issue");
    }
  }

  async function deleteIssue() {
    if (!issue) return;
    if (!confirm("Are you sure you want to delete this issue?")) return;

    const res = await fetch(`/api/issues/${issue.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(formatError(data.error) || "Failed to delete issue");
      return;
    }

    router.push(`/dashboard/projects/${params.projectId}`);
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading issue...</p>;
  }

  if (error || !issue) {
    return (
      <div>
        <p className="text-sm text-red-400">{error || "Issue not found."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-slate-500">Issue</p>
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-2xl font-semibold text-slate-50 outline-none focus:border-sky-500"
              disabled={saving}
            />
          ) : (
            <h1 className="text-2xl font-semibold text-slate-50">
              {issue.title}
            </h1>
          )}
          <div className="mt-2 flex items-center gap-4">
            <p className="text-xs text-slate-400">
              Priority:{" "}
              {isEditing ? (
                <select
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, priority: e.target.value }))
                  }
                  className="ml-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none focus:border-sky-500"
                  disabled={saving}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              ) : (
                <span className="font-medium">{issue.priority}</span>
              )}
            </p>
            <p className="text-xs text-slate-400">
              Status:{" "}
              {isEditing ? (
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="ml-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none focus:border-sky-500"
                  disabled={saving}
                >
                  <option value="BACKLOG">BACKLOG</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="DONE">DONE</option>
                </select>
              ) : (
                <span className="font-medium">{issue.status}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-2">
                <select
                  value={pendingStatus !== null ? pendingStatus : issue.status}
                  onChange={(e) => setPendingStatus(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-100 outline-none focus:border-sky-500"
                  disabled={saving}
                >
                  <option value="BACKLOG">BACKLOG</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="DONE">DONE</option>
                </select>
                {pendingStatus !== null && pendingStatus !== issue.status && (
                  <button
                    onClick={() => updateStatus(pendingStatus)}
                    disabled={saving}
                    className="rounded-md bg-sky-500 px-3 py-1 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Status"}
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md border border-sky-500 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/10"
              >
                Edit
              </button>
              <button
                onClick={deleteIssue}
                className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={saveIssue}
                disabled={saving}
                className="rounded-md bg-sky-500 px-3 py-1 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    title: issue.title,
                    description: issue.description || "",
                    status: issue.status,
                    priority: issue.priority,
                  });
                }}
                disabled={saving}
                className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isEditing ? (
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Issue description..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200 outline-none focus:border-sky-500"
            rows={6}
            disabled={saving}
          />
        ) : (
          issue.description && (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200">
              {issue.description}
            </div>
          )
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </div>
  );
}
