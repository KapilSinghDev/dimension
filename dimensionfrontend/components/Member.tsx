"use client";
import React from "react";
import Image from "next/image";
interface MemberProps {
  name: string;
  role: string;
  email?: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away";
}

const roleStyles: Record<string, string> = {
  Owner: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Admin: "bg-violet-50 text-violet-700 border-violet-100",
  Developer: "bg-sky-50 text-sky-700 border-sky-100",
  Designer: "bg-pink-50 text-pink-700 border-pink-100",
  Viewer: "bg-slate-50 text-slate-600 border-slate-100",
};

const statusColors = {
  online: "bg-emerald-400",
  offline: "bg-slate-300",
  away: "bg-amber-400",
};

const Member = ({
  name,
  role,
  email,
  avatarUrl,
  status = "offline",
}: MemberProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-200 hover:shadow-md">
      {/* Avatar */}
      <div className="relative shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-semibold text-slate-600 ring-2 ring-white">
            {initials}
          </div>
        )}
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColors[status]}`}
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-semibold text-slate-800">
            {name}
          </h3>
        </div>
        {email && (
          <p className="mt-0.5 truncate text-sm text-slate-500">{email}</p>
        )}
      </div>

      {/* Role badge */}
      <span
        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
          roleStyles[role] || "bg-slate-50 text-slate-600 border-slate-100"
        }`}
      >
        {role}
      </span>
    </div>
  );
};

export default Member;
