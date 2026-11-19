import { Badge } from "@/components/ui/badge";
import type { IssueRowProps } from "@/app/workspace/team/[slug]/types";
import { UserAvatar } from "./UserAvatar";
import {
  CLOSED,
  formatDate,
  fullName,
  LABEL_DOT,
  norm,
  priorityMeta,
  statusMeta,
  toTitle,
} from "./team-utils";

export function IssueRow({ issue, prefix, creator }: IssueRowProps) {
  const status = statusMeta(issue.status);
  const priority = priorityMeta(issue.priority);
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;
  const open = !CLOSED.has(norm(issue.status));
  const overdue = open && new Date(issue.deadline).getTime() < Date.now();

  return (
    <li className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <PriorityIcon
          className={`h-4 w-4 shrink-0 ${priority.className}`}
          aria-label={`${priority.label} priority`}
        />
        <span className="hidden w-16 shrink-0 text-xs font-medium tabular-nums text-muted-foreground sm:inline">
          {prefix}-{issue.issue_id}
        </span>
        <StatusIcon
          className={`h-4 w-4 shrink-0 ${status.className}`}
          aria-label={status.label}
        />
        <span
          className="truncate text-sm font-medium"
          title={issue.description}
        >
          {issue.title}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-7 sm:pl-0">
        <Badge variant="outline" className="gap-1.5 font-normal">
          <span
            className={`h-1.5 w-1.5 rounded-full ${LABEL_DOT[norm(issue.lable)] ?? "bg-slate-400"}`}
          />
          {toTitle(issue.lable)}
        </Badge>
        <span
          className={`text-xs tabular-nums ${
            overdue ? "font-medium text-destructive" : "text-muted-foreground"
          }`}
          title="Deadline"
        >
          {formatDate(issue.deadline)}
        </span>
        {creator ? (
          <span title={`Created by ${fullName(creator)}`}>
            <UserAvatar user={creator} />
          </span>
        ) : (
          <span className="h-6 w-6" />
        )}
      </div>
    </li>
  );
}
