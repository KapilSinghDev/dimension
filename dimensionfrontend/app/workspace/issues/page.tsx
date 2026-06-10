"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Issuebox from "@/components/Issuebox";
type Priority = "high" | "medium" | "low";
type Status = "active" | "backlog";

interface Issue {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  assigneeColor: string;
  assigneeBg: string;
}

const issues: Issue[] = [
  {
    id: "MT-101",
    title: "Fix authentication token refresh bug",
    status: "active",
    priority: "high",
    assignee: "AR",
    assigneeColor: "#185FA5",
    assigneeBg: "#E6F1FB",
  },
  {
    id: "MT-102",
    title: "Design new onboarding flow mockups",
    status: "active",
    priority: "medium",
    assignee: "JK",
    assigneeColor: "#3B6D11",
    assigneeBg: "#EAF3DE",
  },
  {
    id: "MT-103",
    title: "Set up CI/CD pipeline for staging",
    status: "active",
    priority: "high",
    assignee: "TS",
    assigneeColor: "#533AB7",
    assigneeBg: "#EEEDFE",
  },
  {
    id: "MT-104",
    title: "Write unit tests for payment module",
    status: "backlog",
    priority: "medium",
    assignee: "AR",
    assigneeColor: "#185FA5",
    assigneeBg: "#E6F1FB",
  },
  {
    id: "MT-105",
    title: "Migrate legacy API endpoints to v2",
    status: "backlog",
    priority: "low",
    assignee: "MN",
    assigneeColor: "#993C1D",
    assigneeBg: "#FAECE7",
  },
  {
    id: "MT-106",
    title: "Audit and update dependencies",
    status: "backlog",
    priority: "low",
    assignee: "JK",
    assigneeColor: "#3B6D11",
    assigneeBg: "#EAF3DE",
  },
  {
    id: "MT-107",
    title: "Implement dark mode for dashboard",
    status: "active",
    priority: "medium",
    assignee: "TS",
    assigneeColor: "#533AB7",
    assigneeBg: "#EEEDFE",
  },
];

const priorityColor: Record<Priority, string> = {
  high: "#E24B4A",
  medium: "#EF9F27",
  low: "#888780",
};

type Filter = "all" | "active" | "backlog";

export default function TeamIssues() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="h-screen w-full bg-gray-200 flex items-start justify-start p-4">
      <div className="w-full h-full rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
            <Users size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-none">
              Team_Name
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Issues</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "active", "backlog"] as Filter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "text-xs capitalize",
                filter === f && "font-medium",
              )}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? "All issues"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Issue list */}
        <div className="flex flex-col gap-1.5 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No issues found
            </p>
          ) : (
            filtered.map((issue) => (
              <Issuebox
                key={issue.id}
                id={issue.id}
                assignee={issue.assignee}
                title={issue.title}
                priority={issue.priority}
                status={issue.status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
