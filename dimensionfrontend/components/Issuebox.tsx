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
import { cn } from "@/lib/utils";

type issueProps = {
  id: string;
  priority: string;
  title: string;
  status: string;
  assignee: string;
  projectTitle: string;
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

// Status badge styles: soft tint + matching dot
const statusStyles: Record<string, { badge: string; dot: string }> = {
  active: {
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  closed: {
    badge:
      "bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-400",
    dot: "bg-violet-500",
  },
  backlog: {
    badge:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
    dot: "bg-amber-500",
  },
};
const statusFallback = {
  badge: "bg-muted text-muted-foreground",
  dot: "bg-muted-foreground/60",
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

  const updateIssueid = (id: string) => {
    setQuery({ id: id, project: null });
  };

  const assigneeColor = assigneeColors[assignee] || {
    bg: "#6b7280",
    text: "#ffffff",
  };

  const [issuePriority, setPriority] = useState(priority);
  const current = priorityMap[issuePriority] || priorityMap.none;
  const PriorityIcon = current.icon;
  const statusStyle = statusStyles[status] ?? statusFallback;

  // drag logic
  const [{ isDragging }, drag] = useDrag(
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

  const isHighlighted = query.listby === projectTitle;

  return (
    <div
      key={id}
      ref={(node) => {
        drag(node);
      }}
      onClick={() => updateIssueid(id)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-sm bg-card p-3.5",
        "bg-gradient-to-b from-slate-200/50 to-transparent",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-grab select-none",
        "transition-[box-shadow,transform,opacity] duration-150 ease-out",
        "active:cursor-grabbing",
        isDragging && "scale-[0.98] opacity-40",
        isHighlighted
          ? "bg-primary/[0.04] shadow-[0_0_0_1.5px_hsl(var(--primary)/0.35)]"
          : "hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
      )}
    >
      {/* Top row: Priority + ID + Project */}
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <DropdownMenu>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="-ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <PriorityIcon
                      className="h-3.5 w-3.5"
                      style={{ color: current.color }}
                    />
                    <span className="sr-only">Change priority</span>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-xs font-medium">
                Priority: {current.label}
              </TooltipContent>

              <DropdownMenuContent align="start" className="w-44 p-1">
                {Object.entries(priorityMap).map(([key, value]) => {
                  const ItemIcon = value.icon;
                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPriority(key);
                      }}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-medium"
                    >
                      <ItemIcon
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: value.color }}
                      />
                      <span className="flex-1">{value.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>

          <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
            {id}
          </span>

          {projectTitle && (
            <span className="max-w-[120px] truncate rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {projectTitle}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 text-[13.5px] font-medium leading-snug tracking-tight text-card-foreground">
        {title}
      </h3>

      {/* Bottom row: Status + Assignee */}
      <div className="flex items-center justify-between gap-2">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Badge
                  variant="secondary"
                  className={cn(
                    "cursor-pointer gap-1.5 rounded-full border-0 px-2 py-0.5 text-[11px] font-medium",
                    "transition-colors hover:brightness-95",
                    statusStyle.badge,
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)}
                  />
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
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-card"
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
