"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      // ignore body; server clears cookie
      if (res.ok) {
        // push to landing
        router.push("/");
      } else {
        // attempt to read error message
        const data = await res.json().catch(() => null);
        console.error("Logout failed", data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Logout error", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="w-full rounded-md border border-red-500 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-60"
      title="Logout"
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
