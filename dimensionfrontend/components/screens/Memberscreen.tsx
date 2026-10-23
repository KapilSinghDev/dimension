"use client";
import React, { useMemo, useState } from "react";
import Member from "../Member"; // adjust path

type Status = "online" | "away" | "offline";

interface MemberItem {
  id: number;
  name: string;
  role: string;
  email: string;
  status: Status;
  lastActive: string;
}

const members: MemberItem[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Owner",
    email: "aarav@project.com",
    status: "online",
    lastActive: "Just now",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Admin",
    email: "priya@project.com",
    status: "online",
    lastActive: "2 min ago",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    role: "Developer",
    email: "rohan@project.com",
    status: "away",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "Designer",
    email: "neha@project.com",
    status: "offline",
    lastActive: "Yesterday",
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Developer",
    email: "vikram@project.com",
    status: "online",
    lastActive: "5 min ago",
  },
  {
    id: 6,
    name: "Ananya Reddy",
    role: "Viewer",
    email: "ananya@project.com",
    status: "offline",
    lastActive: "3 days ago",
  },
];

const roleStyles: Record<string, string> = {
  Owner: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
  Admin: "bg-violet-50 text-violet-700 ring-violet-600/15",
  Developer: "bg-sky-50 text-sky-700 ring-sky-600/15",
  Designer: "bg-pink-50 text-pink-700 ring-pink-600/15",
  Viewer: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

const statusMeta: Record<Status, { dot: string; label: string }> = {
  online: { dot: "bg-emerald-500", label: "Online" },
  away: { dot: "bg-amber-400", label: "Away" },
  offline: { dot: "bg-slate-300", label: "Offline" },
};

const roles = ["All", "Owner", "Admin", "Developer", "Designer", "Viewer"];

const Memberscreen = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesRole = roleFilter === "All" || m.role === roleFilter;
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [query, roleFilter]);

  const onlineCount = members.filter((m) => m.status === "online").length;

  return (
    // w-full + min-w-0 stops the page from being pushed sideways inside a flex/sidebar layout
    <div className="min-h-screen w-full min-w-0 bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full flex-col gap-4 px-8 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <h1 className="text-lg font-light tracking-tight text-slate-900">
              Members
            </h1>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {members.length} people in this project, {onlineCount} online now.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
              Export list
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Invite member
            </button>
          </div>
        </div>
      </header>

      {/* Content: same horizontal padding as header so both edges line up */}
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div
            className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:pb-0"
            role="tablist"
            aria-label="Filter by role"
          >
            {roles.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={roleFilter === r}
                onClick={() => setRoleFilter(r)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  roleFilter === r
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full table-fixed text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="w-[30%] px-6 py-3">Member</th>
                <th className="w-[14%] px-6 py-3">Role</th>
                <th className="w-[14%] px-6 py-3">Status</th>
                <th className="w-[22%] px-6 py-3">Email</th>
                <th className="w-[12%] px-6 py-3">Last active</th>
                <th className="w-[8%] px-6 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const status = statusMeta[member.status];

                return (
                  <tr
                    key={member.id}
                    className="group transition-colors hover:bg-slate-50 focus-within:bg-slate-50"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {initials}
                        </div>
                        <span className="truncate font-medium text-slate-900">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          roleStyles[member.role] || roleStyles.Viewer
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-2 text-slate-600">
                        <span
                          className={`h-2 w-2 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </td>

                    <td className="truncate px-6 py-3.5 text-slate-600">
                      {member.email}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {member.lastActive}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                        <button className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                          Edit
                        </button>
                        <button className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <p className="text-sm font-medium text-slate-900">
                      No members found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try a different name or clear the role filter.
                    </p>
                    <button
                      onClick={() => {
                        setQuery("");
                        setRoleFilter("All");
                      }}
                      className="mt-4 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-2.5 text-xs text-slate-500">
            Showing {filtered.length} of {members.length} members
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {filtered.map((member) => (
            <Member
              key={member.id}
              name={member.name}
              role={member.role}
              email={member.email}
              status={member.status}
            />
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">
              No members match your search.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Memberscreen;
