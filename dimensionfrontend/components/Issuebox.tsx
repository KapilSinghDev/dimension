import React from "react";
import { Badge } from "./ui/badge";

type issueProps = {
  id: string;
  priority: string;
  title: string;
  status: string;
  assignee: string;
};

// Define priority colors
const priorityColor: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

// Define assignee colors
const assigneeColors: Record<string, { bg: string; text: string }> = {
  A: { bg: "#3b82f6", text: "#ffffff" },
  B: { bg: "#8b5cf6", text: "#ffffff" },
  C: { bg: "#ec4899", text: "#ffffff" },
  D: { bg: "#06b6d4", text: "#ffffff" },
};

const Issuebox = ({ id, priority, title, status, assignee }: issueProps) => {
  const assigneeColor = assigneeColors[assignee] || {
    bg: "#6b7280",
    text: "#ffffff",
  };

  return (
    <div
      key={id}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
    >
      {/* Priority dot */}
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: priorityColor[priority] || "#6b7280" }}
        title={`${priority} priority`}
      />

      {/* Issue ID */}
      <span className="text-[11px] text-muted-foreground font-mono min-w-13">
        {id}
      </span>

      {/* Title */}
      <span className="flex-1 text-sm text-foreground truncate">{title}</span>

      {/* Status badge */}
      <Badge
        variant="secondary"
        className={
          status === "active"
            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-[11px] font-normal"
            : "bg-muted text-muted-foreground text-[11px] font-normal"
        }
      >
        {status === "active" ? "In progress" : "Backlog"}
      </Badge>

      {/* Assignee avatar */}
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0"
        style={{
          backgroundColor: assigneeColor.bg,
          color: assigneeColor.text,
        }}
      >
        {assignee}
      </span>
    </div>
  );
};

export default Issuebox;
