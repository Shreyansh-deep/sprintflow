"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProjectButtonProps {
  projectId: string;
}

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone and will delete all associated issues."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to delete project");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      setError("Failed to delete project");
      console.error("Delete error", err);
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-md border border-red-500 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-60"
        title="Delete project"
      >
        {loading ? "Deleting..." : "Delete Project"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

