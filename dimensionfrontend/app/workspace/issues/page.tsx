"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  CalendarClock,
  CircleAlert,
  CircleCheck,
  CircleDot,
  Crown,
  Flame,
  Funnel,
  ListCollapse,
  MessageSquare,
  PanelRight,
  TableProperties,
  Tag,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import Issuescreen from "@/components/screens/Issuescreen";
import Propertiesbox from "@/components/Propertiesbox";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import Issuebox from "@/components/Issuebox";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
  const [id, setTabid] = useQueryState(
    "id",
    parseAsString.withDefault("").withOptions({ clearOnDefault: false }),
  );

  // useEffect(() => {
  //   if (id !== "") {
  //     setTabid("432345");
  //   }
  // }, [id, setTabid]);

  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="h-screen w-full  flex flex-row items-start justify-start p-4">
      {!id && (
        <div className="w-full h-full rounded-2xl border border-border bg-card p-8 flex flex-col gap-5 overflow-hidden">
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

          <div className="flex  justify-between">
            <div className="h-fit w-full">
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
            {[Funnel, ListCollapse, PanelRight].map((Icon, index) => (
              <Menubar
                className="w-fit flex border-none bg-transparent p-0 shadow-none"
                key={index}
              >
                <MenubarMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MenubarTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0" // Added standard sizing for icon buttons
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </MenubarTrigger>
                    </TooltipTrigger>
                    <TooltipContent>description</TooltipContent>
                  </Tooltip>
                  <MenubarContent>
                    <MenubarGroup>
                      <MenubarItem>
                        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem>New Window</MenubarItem>
                    </MenubarGroup>
                    <MenubarSeparator />
                    <MenubarGroup>
                      <MenubarItem>Share</MenubarItem>
                      <MenubarItem>Print</MenubarItem>
                    </MenubarGroup>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            ))}
          </div>

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
      )}
      {id && <Issuescreen />}
      <div className="w-3/5 h-full py-16 px-10">
        <Propertiesbox
          Tableicon={TableProperties}
          name="Properties"
          badge="Active"
          properties={[
            {
              icon: CircleDot,
              label: "Status",
              items: ["Urgent", "High", "Medium", "Low"],
            },
            {
              icon: Flame,
              label: "Priority",
              items: ["Urgent", "High", "Medium", "Low"],
            },
            {
              icon: Crown,
              label: "Lead",
              items: ["Alice", "Bob", "Charlie"],
            },
            {
              icon: Users,
              label: "Members",
              items: ["Alice", "Bob", "Charlie"],
            },
            {
              icon: CircleAlert,
              label: "Issues",
              items: ["MT-101", "MT-102", "MT-103"],
            },
            {
              icon: CalendarClock,
              label: "Dates",
              items: ["This week", "This month", "Custom"],
            },
            {
              icon: UsersRound,
              label: "Teams",
              items: ["Engineering", "Design", "Product"],
            },
            {
              icon: MessageSquare,
              label: "Slack",
              items: ["#general", "#engineering", "#design"],
            },
            {
              icon: Tag,
              label: "Label",
              items: ["Bug", "Feature", "Improvement", "Docs"],
            },
          ]}
        />
        <div className="h-fit max-h-full w-full flex flex-col gap-3 mt-2 p-2 bg-gray-200">
          <div className="flex items-center gap-2">
            <Activity size={13} className="text-muted-foreground" />
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Activity
            </p>
          </div>

          <div className="flex flex-col ">
            {[
              {
                icon: CircleCheck,
                text: "Status changed to In Progress",
                time: "2m ago",
                color: "text-emerald-500",
              },
              {
                icon: UserPlus,
                text: "Alice was added as lead",
                time: "1h ago",
                color: "text-blue-500",
              },
              {
                icon: MessageSquare,
                text: "New comment by Bob",
                time: "3h ago",
                color: "text-violet-500",
              },
              {
                icon: Tag,
                text: "Label Bug was added",
                time: "5h ago",
                color: "text-amber-500",
              },
              {
                icon: CalendarClock,
                text: "Due date set to Jun 28",
                time: "Yesterday",
                color: "text-muted-foreground",
              },
              {
                icon: Flame,
                text: "Priority changed to High",
                time: "2d ago",
                color: "text-red-500",
              },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 group ">
                <div className="flex flex-col items-center px-auto">
                  <div className={`mt-1 flex-shrink-0 ${a.color}`}>
                    <a.icon size={13} />
                  </div>
                  <div className="w-px flex-1 bg-border/50 mt-1 group-last:hidden" />
                </div>
                <div className="pb-4">
                  <p className="text-xs text-foreground leading-snug">
                    {a.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
