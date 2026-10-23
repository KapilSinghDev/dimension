"use client";

import { useEffect, useMemo, type ComponentType } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  FolderKanban,
  Funnel,
  Inbox,
  ListCollapse,
  PanelRight,
  PlayCircle,
  type LucideProps,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import Issuescreen from "@/components/screens/Issuescreen";
import FastCreateIssue from "@/components/Fastcreateissue";
import NoIssuesFound from "@/components/Emptystates/NoIssueFound";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetIssues, useUpdateIssue } from "@/hooks/apihooks";
import { IssueItems } from "@/lib/response.types";
import { issueCreate_type } from "@/lib/types";
import { issue_status_enum, priority_enum } from "@/lib/enums";
import { cn } from "@/lib/utils";
import KanbanColumn from "@/components/KanbanColumn";

type Project = { id: number; title: string };
const COLUMNS: {
  status: issue_status_enum;
  title: string;
  icon: ComponentType<LucideProps>;
  iconClass: string;
  emptyHint: string;
}[] = [
  {
    status: issue_status_enum.ACTIVE,
    title: "Active",
    icon: PlayCircle,
    iconClass: "text-amber-500",
    emptyHint: "Drop an issue here to start working on it.",
  },
  {
    status: issue_status_enum.BACKLOG,
    title: "Backlog",
    icon: Inbox,
    iconClass: "text-slate-500",
    emptyHint: "Nothing waiting. Drop an issue here to park it.",
  },
  {
    status: issue_status_enum.CLOSED,
    title: "Completed",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    emptyHint: "Drop an issue here once it's done.",
  },
];

const TOOLBAR_ACTIONS = [
  { label: "Filter", icon: Funnel },
  { label: "Display options", icon: ListCollapse },
  { label: "Toggle details panel", icon: PanelRight },
];

function BoardSkeleton() {
  return (
    <div className="flex h-full w-full gap-4" aria-busy="true">
      {COLUMNS.map((col) => (
        <div
          key={col.status}
          className="flex flex-1 flex-col gap-3 rounded-xl bg-muted/50 p-3"
        >
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ))}
    </div>
  );
}

function BoardError() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-medium text-foreground">
        We couldnt load your issues
      </p>
      <p className="max-w-xs text-xs text-muted-foreground">
        Check your connection and try again.
      </p>
      <Button size="sm" variant="outline" onClick={() => location.reload()}>
        Reload
      </Button>
    </div>
  );
}

export default function TeamIssues() {
  const [id] = useQueryState(
    "id",
    parseAsString.withDefault("").withOptions({ clearOnDefault: false }),
  );
  const [, setIsCreating] = useQueryState("create");
  const [listby, setListby] = useQueryState("listby"); // selected project title

  const { data, isLoading, error } = useGetIssues(); // TODO: paginate
  const issues: IssueItems[] = useMemo(() => data ?? [], [data]);
  const updateIssue = useUpdateIssue();

  // Close the quick-create form when there is nothing to create against.
  useEffect(() => {
    if (data?.length === 0) setIsCreating("false");
  }, [data, setIsCreating]);

  // Unique projects, derived from the issues themselves.
  const projects: Project[] = useMemo(
    () =>
      Array.from(
        new Map(
          issues
            .filter((i) => i.project?.id != null && i.project?.title != null)
            .map((i) => [
              i.project!.id,
              { id: i.project!.id, title: i.project!.title },
            ]),
        ).values(),
      ),
    [issues],
  );

  // Apply the project filter.
  const visibleIssues = useMemo(
    () => (listby ? issues.filter((i) => i.project?.title === listby) : issues),
    [issues, listby],
  );

  const issuesByStatus = useMemo(() => {
    const map = new Map<issue_status_enum, IssueItems[]>();
    COLUMNS.forEach((c) => map.set(c.status, []));
    visibleIssues.forEach((i) =>
      map.get(i.status as issue_status_enum)?.push(i),
    );
    return map;
  }, [visibleIssues]);

  // Move an issue to another column.
  const moveIssue = (issueId: string, target: issue_status_enum) => {
    const current = issues.find((i) => i.issue_id === Number(issueId));
    if (!current || current.status === target) return;

    const payload: issueCreate_type = {
      title: current.title,
      status: target,
      created_by: current.created_by,
      deadline: current.deadline as Date,
      priority: current.priority as priority_enum,
      project: current.project,
    };
    updateIssue.mutate({ issue_id: issueId, updateIssuePayload: payload });
  };
  const result =
    listby && listby.length > 0
      ? listby.charAt(0).toUpperCase() + listby.slice(1) // Or your specific split/manipulation logic
      : "";
  if (id) {
    return (
      <div className="flex h-screen w-full items-start justify-start p-4">
        <Issuescreen />
      </div>
    );
  }

  const isEmpty = !isLoading && !error && issues.length === 0;

  return (
    <div className="flex h-screen w-full items-start justify-start p-1.5">
      <div className="flex h-full w-full flex-col gap-3 overflow-hidden rounded-sm border border-border bg-card pt-4 px-6 pb-6 md:pt-5 md:px-8 md:pb-8">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex gap-1 items-baseline">
            <h1 className="text-[16px] tracking-tight text-foreground">
              Issues
            </h1>
            {!isLoading && !error && (
              <span className="text-sm tabular-nums text-muted-foreground">
                {visibleIssues.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "mr-2 h-8 min-w-[150px] justify-between gap-2 text-xs font-medium",
                    listby && "border-primary/40 bg-primary/5 text-primary",
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FolderKanban className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{result || "All projects"}</span>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem
                  onSelect={() => setListby(null)}
                  className="flex items-center justify-between text-xs"
                >
                  All projects
                  {!listby && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>

                {projects.length > 0 && <DropdownMenuSeparator />}

                {projects.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onSelect={() => setListby(p.title)}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="truncate">
                      {p.title.charAt(0).toUpperCase() + p.title.slice(1)}
                    </span>
                    {listby === p.title && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {TOOLBAR_ACTIONS.map(({ label, icon: Icon }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col">
          {isLoading ? (
            <BoardSkeleton />
          ) : error ? (
            <BoardError />
          ) : isEmpty ? (
            <div className="flex flex-1 items-center justify-center">
              <NoIssuesFound
                action={
                  <Button
                    onClick={() => setIsCreating("true")}
                    variant="outline"
                    size="sm"
                  >
                    Create issue
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="flex h-full w-full gap-4 overflow-x-auto overflow-y-hidden mt-1.5">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.status}
                  config={col}
                  issues={issuesByStatus.get(col.status) ?? []}
                  onMove={moveIssue}
                  footer={
                    col.status === issue_status_enum.ACTIVE ? (
                      <FastCreateIssue
                        onOpen={() => setIsCreating("true")}
                        onCancel={() => setIsCreating("false")}
                        projects={projects}
                        variant="kanban"
                      />
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
