"use client";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  CalendarDays,
  CircleDot,
  Flag,
  FolderKanban,
  Hash,
  Paperclip,
  Smile,
  Tag,
  UserRound,
  Users,
} from "lucide-react";
import FastCreateIssue from "../Fastcreateissue";
import { Separator } from "@/components/ui/separator";
import IssueActivity from "../Issueactivity";
import { useGetSingleIssue } from "@/hooks/apihooks";
import { useQueryState } from "nuqs";
import { IssueItems } from "@/lib/response.types";

type IssueDetail = IssueItems & {
  description?: string | null;
  lable?: string | null;
  label?: string | null;
  assignee?:
    | string
    | {
        name?: string | null;
        firstname?: string | null;
        lastname?: string | null;
        email?: string | null;
      }
    | null;
  team?: string | { name?: string | null } | null;
};

const formatIssueDate = (value?: Date | string | null) => {
  if (!value) return "Not set";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const Issuescreen = () => {
  const [issueId] = useQueryState("id");
  const { data, isLoading, error } = useGetSingleIssue(issueId as string);
  const issueDetails = data as IssueDetail | null | undefined;
  const assignee =
    typeof issueDetails?.assignee === "string"
      ? issueDetails.assignee
      : issueDetails?.assignee
        ? issueDetails.assignee.name ||
          [issueDetails.assignee.firstname, issueDetails.assignee.lastname]
            .filter(Boolean)
            .join(" ") ||
          issueDetails.assignee.email ||
          "Unassigned"
        : "Unassigned";
  const team =
    typeof issueDetails?.team === "string"
      ? issueDetails.team
      : issueDetails?.team?.name || "No team";
  const issueLabel = issueDetails?.lable || issueDetails?.label || "No label";

  const detailItems = [
    {
      label: "Status",
      value: issueDetails?.status || "Not set",
      icon: CircleDot,
    },
    {
      label: "Priority",
      value: issueDetails?.priority || "Not set",
      icon: Flag,
    },
    { label: "Label", value: issueLabel, icon: Tag },
    {
      label: "Project",
      value: issueDetails?.project?.title || "No project",
      icon: FolderKanban,
    },
    { label: "Assignee", value: assignee, icon: UserRound },
    { label: "Team", value: team, icon: Users },
    {
      label: "Created",
      value: formatIssueDate(issueDetails?.created_at),
      icon: CalendarDays,
    },
    {
      label: "Due date",
      value: formatIssueDate(issueDetails?.deadline),
      icon: CalendarDays,
    },
  ];

  return (
    <main className="h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-sm">
              <Hash className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Issue
              </p>
              <p className="truncate text-sm font-semibold text-slate-800">
                {issueDetails?.issue_id
                  ? `#${issueDetails.issue_id}`
                  : isLoading
                    ? "Loading..."
                    : "—"}
              </p>
            </div>
          </div>

          {issueDetails?.status && (
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/90 px-3 py-1.5 text-xs font-semibold capitalize text-indigo-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {issueDetails.status.replaceAll("_", " ").replaceAll("-", " ")}
            </span>
          )}
        </header>

        {/* Main layout */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
          {/* Scrollable left content */}
          <section className="min-h-0 min-w-0 space-y-5 overflow-y-auto pr-1 pb-6">
            <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-7">
              {error && (
                <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Unable to load issue details.
                </p>
              )}

              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Overview
              </p>
              <h1 className="wrap-break-word text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem] sm:leading-snug">
                {issueDetails?.title ||
                  (isLoading ? "Loading issue..." : "Untitled issue")}
              </h1>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h2 className="mb-2 text-sm font-semibold text-slate-800">
                  Description
                </h2>
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {issueDetails?.description || "No description provided."}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Smile className="h-4 w-4" />
                      <span className="sr-only">Add reaction</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p>React to issue</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach code architecture files</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </article>

            <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-6">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Add an update
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Share progress or create another issue.
                </p>
              </div>
              <FastCreateIssue />
              <Separator className="my-5 bg-slate-100" />
              <IssueActivity />
            </section>
          </section>

          {/* Fixed / sticky properties on the right */}
          <aside className="hidden min-h-0 lg:block">
            <div className="sticky top-0 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-md sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  Properties
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Details
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {detailItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex min-w-0 items-start gap-3 py-3 first:pt-1 last:pb-1"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-100">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 wrap-break-word text-sm font-medium capitalize text-slate-800">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex min-w-0 items-start gap-3 py-3 last:pb-1">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-100">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Created by
                    </p>
                    <p className="mt-1 wrap-break-word text-sm font-medium text-slate-800">
                      {issueDetails?.created_by ?? "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile properties (not fixed) */}
          <aside className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-sm lg:hidden sm:p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Properties
            </h2>
            <div className="divide-y divide-slate-100">
              {detailItems.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-w-0 items-start gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 wrap-break-word text-sm font-medium capitalize text-slate-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex min-w-0 items-start gap-3 py-3">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    Created by
                  </p>
                  <p className="mt-1 wrap-break-word text-sm font-medium text-slate-800">
                    {issueDetails?.created_by ?? "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Issuescreen;
