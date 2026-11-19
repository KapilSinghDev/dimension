import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  Minus,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Timer,
  XCircle,
} from "lucide-react";

import type {
  TeamMeta,
  TeamTimezoneParts,
  TeamUser,
} from "@/app/workspace/team/[slug]/types";

export const AVATAR_TONES = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

export const fullName = (
  user: Pick<TeamUser, "firstname" | "lastname">,
): string =>
  `${user.firstname ?? ""} ${user.lastname ?? ""}`.replace(/\s+/g, " ").trim();

export const initials = (
  user: Pick<TeamUser, "firstname" | "lastname">,
): string =>
  `${user.firstname?.trim()?.[0] ?? ""}${user.lastname?.trim()?.[0] ?? ""}`.toUpperCase() ||
  "?";

export const toTitle = (value: string): string =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const norm = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function tzParts(timezone: string): TeamTimezoneParts {
  try {
    const now = new Date();
    const offset =
      new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value ?? "GMT";
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
    }).format(now);
    return { offset, time };
  } catch {
    return { offset: "", time: "—" };
  }
}

const STATUS_META: Record<string, TeamMeta> = {
  backlog: {
    label: "Backlog",
    icon: CircleDashed,
    className: "text-muted-foreground",
  },
  todo: { label: "Todo", icon: Circle, className: "text-muted-foreground" },
  in_progress: {
    label: "In Progress",
    icon: Timer,
    className: "text-amber-500",
  },
  in_review: {
    label: "In Review",
    icon: CircleDot,
    className: "text-emerald-600",
  },
  done: { label: "Done", icon: CheckCircle2, className: "text-indigo-500" },
  closed: { label: "Closed", icon: CheckCircle2, className: "text-indigo-500" },
  canceled: {
    label: "Canceled",
    icon: XCircle,
    className: "text-muted-foreground",
  },
};

const PRIORITY_META: Record<string, TeamMeta> = {
  urgent: { label: "Urgent", icon: AlertTriangle, className: "text-red-500" },
  high: { label: "High", icon: SignalHigh, className: "text-orange-500" },
  medium: { label: "Medium", icon: SignalMedium, className: "text-amber-500" },
  low: { label: "Low", icon: SignalLow, className: "text-slate-400" },
};

export const CLOSED = new Set(["done", "closed", "canceled"]);

export const statusMeta = (status: string): TeamMeta =>
  STATUS_META[norm(status)] ?? {
    label: toTitle(status),
    icon: Circle,
    className: "text-muted-foreground",
  };

export const priorityMeta = (priority: string): TeamMeta =>
  PRIORITY_META[norm(priority)] ?? {
    label: toTitle(priority),
    icon: Minus,
    className: "text-muted-foreground",
  };

export const LABEL_DOT: Record<string, string> = {
  bug: "bg-red-500",
  feature: "bg-violet-500",
  improvement: "bg-sky-500",
};
