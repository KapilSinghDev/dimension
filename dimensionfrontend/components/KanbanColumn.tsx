"use client";

import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { useDrop } from "react-dnd";
import Issuebox from "@/components/Issuebox";
import { IssueItems } from "@/lib/response.types";
import { issue_status_enum } from "@/lib/enums";
import { cn } from "@/lib/utils";

export type ColumnConfig = {
  status: issue_status_enum;
  title: string;
  icon: ComponentType<LucideProps>;
  iconClass: string;
  emptyHint: string;
};

type ColumnProps = {
  config: ColumnConfig;
  issues: IssueItems[];
  onMove: (issueId: string, target: issue_status_enum) => void;
  footer?: ReactNode;
};

export default function KanbanColumn({
  config,
  issues,
  onMove,
  footer,
}: ColumnProps) {
  const { status, title, icon: Icon, iconClass, emptyHint } = config;

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: "ISSUECARD",
      drop: (item: { id: string }) => onMove(item.id, status),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onMove, status],
  );

  const isTarget = isOver && canDrop;

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      aria-label={`${title} issues`}
      className={cn(
        "flex h-full min-h-[300px] min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-xl border transition-colors duration-150",
        "border-transparent bg-muted/50",
        canDrop && "",
        isTarget && "border-primary/50 bg-primary/5 p-8",
      )}
    >
      <header className="flex items-center gap-2 px-1">
        <Icon className={cn("h-4 w-4", iconClass)} />
        <h3 className="text-sm font-stretch-50% text-foreground">{title}</h3>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground ring-1 ring-border">
          {issues.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
        {issues.map((issue) => (
          <Issuebox
            key={issue.issue_id}
            id={issue.issue_id.toString()}
            assignee={issue.created_by.toString()}
            title={issue.title}
            priority={issue.priority}
            status={issue.status}
            projectTitle={issue.project?.title as string}
          />
        ))}

        {issues.length === 0 && (
          <div
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center text-xs text-muted-foreground",
              isTarget && "border-primary/50 text-primary",
            )}
          >
            {emptyHint}
          </div>
        )}

        {footer}
      </div>
    </section>
  );
}
