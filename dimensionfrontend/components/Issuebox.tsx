"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  AlertCircle,
  HelpCircle,
  LucideIcon,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

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
const priorityMap: Record<
  string,
  { label: string; color: string; icon: LucideIcon }
> = {
  urgent: { label: "Urgent", color: "#ef4444", icon: AlertCircle }, // Red
  high: { label: "High", color: "#f97316", icon: SignalHigh }, // Orange
  medium: { label: "Medium", color: "#eab308", icon: SignalMedium }, // Yellow
  low: { label: "Low", color: "#3b82f6", icon: SignalLow }, // Blue
  none: { label: "No Priority", color: "#94a3b8", icon: HelpCircle }, // Gray
};

const Issuebox = ({ id, priority, title, status, assignee }: issueProps) => {
  // const [issueID, setTabid] = useQueryState("id");
  const [query, setQuery] = useQueryStates({
    id: parseAsString,
    project: parseAsString,
  });
  const updateIssueid = (id: string) => {
    setQuery({ id: id, project: null });
  };

  const assigneeColor = assigneeColors[assignee] || {
    bg: "#6b7280",
    text: "#ffffff",
  };
  const [issuePriority, setPriority] = useState(priority);
  const current = priorityMap[issuePriority] || priorityMap.none;
  const Icon = current.icon;

  return (
    <div
      key={id}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => updateIssueid(id)}
    >
      <DropdownMenu>
        <Tooltip delayDuration={300}>
          {/* Triggers both the hover tooltip and the click dropdown */}
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7 rounded-md border-none bg-transparent hover:bg-none dark:hover:bg-none focus-visible:ring-1"
              >
                {/* Clean Indicator Dot */}
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-150 group-hover:scale-110"
                  style={{ backgroundColor: current.color }}
                />
                <span className="sr-only">Change priority</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          {/* Tooltip Content */}
          <TooltipContent
            side="bottom"
            align="center"
            className="text-xs font-medium"
          >
            Priority: {current.label}
          </TooltipContent>

          {/* Dropdown Options */}
          <DropdownMenuContent align="start" className="w-40 p-1">
            {Object.entries(priorityMap).map(([key, value]) => {
              const ItemIcon = value.icon;
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setPriority(key)}
                  className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium cursor-pointer rounded-md transition-colors"
                >
                  {/* Left-hand dot helper inside items list */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: value.color }}
                  />
                  <span className="flex-1 text-slate-700 dark:text-slate-300">
                    {value.label}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </Tooltip>
      </DropdownMenu>

      {/* Issue ID */}
      <span className="text-[11px] text-muted-foreground font-mono min-w-13">
        {id}
      </span>

      {/* Title */}
      <span className="flex-1 text-sm text-foreground truncate">{title}</span>

      {/* Status badge */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>last updated by : kS</TooltipContent>
        </Tooltip>
        <DropdownMenuContent side={"right"}>
          <DropdownMenuItem>Active</DropdownMenuItem>
          <DropdownMenuItem>In progress</DropdownMenuItem>
          <DropdownMenuItem>Backlog</DropdownMenuItem>
          <DropdownMenuItem>Paused</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
