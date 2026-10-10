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
        group flex flex-col gap-2.5 p-3.5 rounded-sm border border-border
        bg-card hover:bg-muted/40 hover:border-border/80
        cursor-pointer transition-all duration-150
        shadow-sm hover:shadow-md
        ${isDragging ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* Top row: Priority + ID */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 rounded-md border-none bg-transparent hover:bg-muted/60 focus-visible:ring-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
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

          <span className="text-[11px] text-muted-foreground font-mono tracking-tight">
            {id}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
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
                      ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 text-[11px] font-normal px-2 py-0.5"
                      : "bg-muted text-muted-foreground text-[11px] font-normal px-2 py-0.5"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {status === "active" ? "In progress" : "Backlog"}
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
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ring-2 ring-background"
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
