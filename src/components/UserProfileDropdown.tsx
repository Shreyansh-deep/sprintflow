"use client";

import { useEffect, useState, useRef } from "react";
import LogoutButton from "./LogoutButton";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserProfileDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (loading || !user) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700"></div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-white hover:bg-sky-600 transition-colors"
        aria-label="User menu"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+0.25rem)] z-50 w-64 rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="mb-4 border-b border-slate-800 pb-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                {initial}
              </div>
              <div>
                <p className="font-medium text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Role: {user.role}</p>
          </div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}

