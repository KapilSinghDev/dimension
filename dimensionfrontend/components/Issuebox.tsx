"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { useDrag } from "react-dnd";

type issueProps = {
  id: string;
  priority: string;
  title: string;
  status: string;
  assignee: string;
  projectTitle: string;
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
  urgent: { label: "Urgent", color: "#ef4444", icon: AlertCircle },
  high: { label: "High", color: "#f97316", icon: SignalHigh },
  medium: { label: "Medium", color: "#eab308", icon: SignalMedium },
  low: { label: "Low", color: "#3b82f6", icon: SignalLow },
  none: { label: "No Priority", color: "#94a3b8", icon: HelpCircle },
};

const Issuebox = ({
  id,
  priority,
  title,
  status,
  assignee,
  projectTitle,
}: issueProps) => {
  const [query, setQuery] = useQueryStates({
    id: parseAsString,
    project: parseAsString,
    listby: parseAsString,
  });
  useEffect(() => {
    if (query.listby !== "") {
      console.log("list by detected", query.listby);
    }
  }, [query.listby]);
  console.log("Comparing:", {
    id: id,
    listby: query.listby,
    title: title,
    match: query.listby == projectTitle,
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

  // drag logic
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "ISSUECARD",
      item: () => {
        console.log("drag started", id);
        return { id };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id],
  );

  return (
    <div
      key={id}
      ref={(node) => {
        drag(node);
      }}
      onClick={() => updateIssueid(id)}
      className={`
  group relative flex flex-col gap-3 p-4 rounded-2xl border bg-white
  shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]
  cursor-grab active:cursor-grabbing active:scale-[0.99]
  transition-all duration-200 ease-out

  ${isDragging ? "opacity-0" : "opacity-100"}

  ${
    query.listby === projectTitle
      ? "border-blue-600 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-500/20 shadow-[0_4px_16px_-4px_rgba(37,99,235,0.25)]"
      : "border-zinc-200/80 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.18)]"
  }
`}
    >
      {/* Top row: Priority + ID + Project */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <DropdownMenu>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 rounded-md border-none bg-transparent hover:bg-zinc-100 dark:hover:bg-muted/60 focus-visible:ring-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white dark:ring-background shadow-sm"
                      style={{ backgroundColor: current.color }}
                    />
                    <span className="sr-only">Change priority</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-xs font-medium">
                Priority: {current.label}
              </TooltipContent>

              <DropdownMenuContent align="start" className="w-40 p-1">
                {Object.entries(priorityMap).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriority(key);
                    }}
                    className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium cursor-pointer rounded-md"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: value.color }}
                    />
                    <span className="flex-1">{value.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>

          <span className="text-[11px] text-zinc-400 dark:text-muted-foreground font-mono tracking-tight shrink-0">
            {id}
          </span>

          {projectTitle && (
            <span
              className="
                          text-[11px] font-medium tracking-tight truncate max-w-[120px]
                          px-2 py-0.5 rounded-full
                          text-zinc-600 bg-gradient-to-b from-white to-zinc-50
                          border border-zinc-200/80
                          shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]
                          dark:text-muted-foreground dark:bg-muted/60 dark:from-transparent dark:to-transparent
                          dark:border-transparent dark:shadow-none
                        "
            >
              {projectTitle}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-zinc-900 dark:text-foreground leading-snug line-clamp-2 tracking-tight">
        {title}
      </h3>

      {/* Bottom row: Status + Assignee */}
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Badge
                  variant="secondary"
                  className={
                    status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-green-950/60 dark:text-green-400 dark:border-transparent text-[11px] font-medium px-2 py-0.5 rounded-md"
                      : status === "closed"
                        ? "bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-400 dark:border-transparent text-[11px] font-medium px-2 py-0.5 rounded-md"
                        : status === "backlog"
                          ? "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-400 dark:border-transparent text-[11px] font-medium px-2 py-0.5 rounded-md"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200/60 dark:bg-muted dark:text-muted-foreground dark:border-transparent text-[11px] font-medium px-2 py-0.5 rounded-md"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {status[0].toUpperCase() + status.slice(1)}
                </Badge>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>last updated by : kS</TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right">
            <DropdownMenuItem>Active</DropdownMenuItem>
            <DropdownMenuItem>In progress</DropdownMenuItem>
            <DropdownMenuItem>Backlog</DropdownMenuItem>
            <DropdownMenuItem>Paused</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ring-2 ring-white dark:ring-background shadow-sm"
          style={{
            backgroundColor: assigneeColor.bg,
            color: assigneeColor.text,
          }}
        >
          {assignee}
        </span>
      </div>
    </div>
  );
};

export default Issuebox;
