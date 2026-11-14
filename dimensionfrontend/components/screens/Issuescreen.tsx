"use client";
import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  CalendarDays,
  CircleDot,
  Flag,
  FolderKanban,
  Hash,
  Paperclip,
  Plus,
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
import {
  IssueItems,
  IssueResponseInterface,
  ProjectApiItem,
} from "@/lib/response.types";
import { Propertytabs } from "../Propertytabs";
import { useUpdateIssue } from "@/hooks/apihooks";
import { issueCreate_type } from "@/lib/types";
import {
  issue_status_enum,
  IssueLabel_enums,
  priority_enum,
} from "@/lib/enums";
export type IssueDetail = IssueItems & {
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
      optionComponent: (
        <Button
          variant="ghost"
          size="sm"
          className={
            "-ml-2 h-7 w-full justify-start gap-1.5 rounded-md px-2 text-[13px] font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Add project
        </Button>
      ),
    },
    {
      label: "Assignee",
      value: assignee,
      icon: UserRound,
      optionComponent: (
        <Button
          variant="ghost"
          size="sm"
          className={
            "-ml-2 h-7 w-full justify-start gap-1.5 rounded-md px-2 text-[13px] font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Assign issue
        </Button>
      ),
    },
    {
      label: "Team",
      value: team,
      icon: Users,
      optionComponent: (
        <Button
          variant="ghost"
          size="sm"
          className={
            "-ml-2 h-7 w-full justify-start gap-1.5 rounded-md px-2 text-[13px] font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Add a team
        </Button>
      ),
    },
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
  const [tempIssueData, setTempIssueData] = useState<issueCreate_type>({
    title: issueDetails?.title as string,
    created_by: issueDetails?.created_by as number,
    description: issueDetails?.description as string,
    lable: issueDetails?.label as string,
    assignee: issueDetails?.assignee as string,
    team: issueDetails?.team as string,
    deadline: issueDetails?.deadline as Date,
    priority: issueDetails?.priority as priority_enum,
    status: issueDetails?.status as issue_status_enum,
    project: issueDetails?.project as ProjectApiItem,
  });

  useEffect(() => {
    setTempIssueData({
      title: issueDetails?.title as string,
      created_by: issueDetails?.created_by as number,
      description: issueDetails?.description as string,
      lable: issueDetails?.label as string,
      assignee: issueDetails?.assignee as string,
      team: issueDetails?.team as string,
      deadline: issueDetails?.deadline as Date,
      priority: issueDetails?.priority as priority_enum,
      status: issueDetails?.status as issue_status_enum,
      project: issueDetails?.project as ProjectApiItem,
    });
  }, [data, issueDetails]);
  const updateIssue = useUpdateIssue();
  const handleIssuePropertiesUpdate = (
    field: keyof issueCreate_type,
    value: string,
  ) => {
    console.log("selected options are", field, " ", value);
    setTempIssueData((prev) => {
      return { ...prev, [field]: value };
    });
    // updateIssue.mutate({
    //   issue_id: issueId as string,
    //   updateIssuePayload: tempIssueData,
    // });
    // console.log("the updated data = ", tempIssueData);
  };

  const handlePushUpdate = () => {
    updateIssue.mutate({
      issue_id: issueId as string,
      updateIssuePayload: tempIssueData,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasChanged =
        tempIssueData.status !== issueDetails?.status ||
        tempIssueData.priority !== issueDetails?.priority ||
        tempIssueData.lable !== issueDetails?.lable ||
        tempIssueData.title !== issueDetails?.title ||
        tempIssueData.description !== issueDetails?.description;

      if (hasChanged) {
        handlePushUpdate();
      } else {
        console.log("No change detected");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [tempIssueData, issueDetails]);
  return (
    <main className="h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-base font-semibold tracking-tight text-slate-900">
            {issueDetails?.issue_id ? (
              <>
                <span className="font-normal text-slate-400">Issue</span> #
                {issueDetails.issue_id}
              </>
            ) : isLoading ? (
              <span className="font-normal text-slate-400">Loading…</span>
            ) : (
              <span className="font-normal text-slate-400">No issue</span>
            )}
          </h1>

          {issueDetails?.status && (
            <span className="inline-flex items-center gap-1.5 text-sm capitalize text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {issueDetails.status.replaceAll("_", " ").replaceAll("-", " ")}
            </span>
          )}
        </header>

        {/* Main layout */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
          {/* Scrollable left content */}
          <section className="min-h-0 min-w-0 space-y-5 overflow-y-auto pr-1 pb-6">
            <article className="   p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]  sm:p-7">
              {error && (
                <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Unable to load issue details.
                </p>
              )}

              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Overview
              </p>
              <h1 className="wrap-break-word text-xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem] sm:leading-snug">
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

            <section className=" p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-6">
              {/* <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Add an update
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Share progress or create another issue.
                </p>
              </div>
               */}
              <FastCreateIssue />
              <Separator className="my-5 bg-slate-100" />
              <IssueActivity updates={data?.issue_updates || []} />
              {/* pass the props here */}
            </section>
          </section>

          {/* Fixed / sticky properties on the right */}
          {/* Desktop */}
          <aside className="hidden min-h-0 lg:block">
            <div className="sticky top-0 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl ">
              <h2 className="border-b border-slate-100 px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Properties
              </h2>
              <Propertytabs
                detailItems={detailItems}
                issueDetails={issueDetails as IssueDetail}
                onUpdate={handleIssuePropertiesUpdate}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Issuescreen;
