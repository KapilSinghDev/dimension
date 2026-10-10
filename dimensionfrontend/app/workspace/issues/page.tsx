"use client";

import { useState, useEffect, useRef } from "react";
import {
  Activity,
  CalendarClock,
  CircleAlert,
  CircleCheck,
  CircleDot,
  Crown,
  Flame,
  FolderKanban,
  Funnel,
  ListCollapse,
  MessageSquare,
  PanelRight,
  TableProperties,
  Tag,
  User,
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
import { useGetIssues, useUpdateIssue } from "@/hooks/apihooks";
import { IssueItems } from "@/lib/response.types";
import noissues from "@/assets/emptystates/no_issues.svg";
import Image from "next/image";
import FastCreateIssue from "@/components/Fastcreateissue";
import { useDrag, useDrop } from "react-dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayCircle, Inbox, CheckCircle2 } from "lucide-react";
import { issueCreate_type } from "@/lib/types";
import { issue_status_enum, priority_enum } from "@/lib/enums";
type Priority = "high" | "medium" | "low";

type Filter = "all issues" | "active" | "closed" | "backlog";

export default function TeamIssues() {
  const issueFilters = [
    {
      label: "Teams",
      value: "teams",
      icon: Users,
    },
    {
      label: "Projects",
      value: "projects",
      icon: FolderKanban,
    },
    {
      label: "Me",
      value: "me",
      icon: User,
    },
  ];

  const [filter, setFilter] = useState<Filter>("all issues");
  const [id, setTabid] = useQueryState(
    "id",
    parseAsString.withDefault("").withOptions({ clearOnDefault: false }),
  );
  const { data, isLoading, error } = useGetIssues("1"); // add pagin tables to the issue
  const issues: IssueItems[] = data;
  const issueList: IssueItems[] =
    filter === "all issues"
      ? issues
      : issues.filter((item) => item.status === filter);

  // issue fetching logic
  // todo : fetch projects list and teams list
  const [createIssue, setIsCreating] = useQueryState("create");
  const [listby, setListby] = useQueryState("listby");
  const [list, setList] = useState<string>("Me"); // defualt fetch your issues
  const handleUpdateListBy = (value: string) => {
    setList(value as string);
    setListby(
      issueFilters.find((item) => item.label === value)?.value as string,
    );
  };
  useEffect(() => {
    if (data?.length === 0) {
      setIsCreating("false");
    }
  }, [data]);

  //drag logic
  const activeIssues =
    issueList?.filter((item) => item.status === "active") || [];
  const backlogIssues =
    issueList?.filter((item) => item.status === "backlog") || [];
  const completedIssues =
    issueList?.filter((item) => item.status === "closed") || [];
  // updating issue
  const updateIssue = useUpdateIssue();
  function moveIssue(id: string, current: string, target: string) {
    console.log("dropped", id, current, target);

    const currentIssue = issueList.find(
      (issue) => issue.issue_id === Number(id),
    );
    const tempissue: issueCreate_type = {
      title: currentIssue?.title as string,
      status: target as issue_status_enum,
      created_by: currentIssue?.created_by as number,
      // created_at:createIssue.created_at as Date
      deadline: currentIssue?.deadline as Date,
      priority: currentIssue?.priority as priority_enum,
      project: currentIssue?.project as number,
    };
    console.log("the updating value is to be ", tempissue);
    updateIssue.mutate({ issue_id: id, updateIssuePayload: tempissue });
    console.log("update issue called from page");
  }
  // Helper function to extract current status safely
  const getStatus = (droppedId: string) =>
    issueList.find((issue) => issue.issue_id === Number(droppedId))?.status;

  const [{ isOver, canDrop }, dropToBacklog] = useDrop(
    () => ({
      accept: "ISSUECARD",
      drop: (item: { id: string }) => {
        const currentPos = getStatus(item.id);
        if (currentPos)
          moveIssue(item.id, currentPos, issue_status_enum.BACKLOG);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [issueList], // Added issueList dependency to keep closures fresh
  );

  const [{ isOverToCompleted, canDroptoCompleted }, dropToCompleted] = useDrop(
    () => ({
      accept: "ISSUECARD",
      drop: (item: { id: string }) => {
        const currentPos = getStatus(item.id);
        if (currentPos)
          moveIssue(item.id, currentPos, issue_status_enum.CLOSED);
      },
      collect: (monitor) => ({
        isOverToCompleted: monitor.isOver(),
        canDroptoCompleted: monitor.canDrop(),
      }),
    }),
    [issueList],
  );

  const [{ isOverAtActive, canDroptoActive }, dropToActive] = useDrop(
    () => ({
      accept: "ISSUECARD",
      drop: (item: { id: string }) => {
        const currentPos = getStatus(item.id);
        if (currentPos)
          moveIssue(item.id, currentPos, issue_status_enum.ACTIVE);
      },
      collect: (monitor) => ({
        isOverAtActive: monitor.isOver(),
        canDroptoActive: monitor.canDrop(),
      }),
    }),
    [issueList],
  );
  // caching
  return (
    <div className="h-screen w-full overflow-hidden  flex flex-row items-start justify-start p-4">
      {!id && (
        <div className="w-full h-full rounded-2xl border border-border bg-card p-8 flex flex-col gap-5 overflow-hidden">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <Users
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                {issueFilters.map((items, id) => {
                  const Icon = items.icon;
                  return (
                    <DropdownMenuItem
                      key={id}
                      className="cursor-pointer"
                      onClick={() => handleUpdateListBy(items.label)}
                    >
                      <div className="w-full h-fit flex flex-row items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{items.label}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div>
              <p className="text-sm font-medium text-foreground leading-none">
                Team_Name
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {issueFilters.find((item) => item.label === list)?.value}
              </p>
            </div>
          </div>

          <div className="flex  justify-between">
            <div className="h-fit w-full">
              {(["all issues", "active", "backlog", "closed"] as Filter[]).map(
                (f) => (
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
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ),
              )}
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
          {/* this is the target div  */}
          <div
            className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-50"
            // ref={dropRef}
          >
            {issueList?.length === 0 ? (
              <div className="flex min-h-50 flex-col items-center   transition-all duration-300">
                <div
                  className={`flex w-full flex-col 
                    `}
                >
                  {/* Minimal Illustration - Hides smoothly when creating issue */}
                  {(createIssue === "false" || data?.length === 0) && (
                    <div className="mt-10 flex justify-center animate-in fade-in zoom-in-95 duration-200">
                      <Image
                        src={noissues}
                        alt="No issues"
                        width={160}
                        height={160}
                        priority
                        className="opacity-90 object-contain"
                      />
                    </div>
                  )}
                  <div className="">
                    <FastCreateIssue
                      onOpen={() => setIsCreating("true")}
                      onCancel={() => setIsCreating("false")}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // this is the issue display list
              <>
                <div className="h-full w-full flex flex-row gap-6 overflow-hidden">
                  {/* All Issues Column */}

                  <div
                    className="h-full w-full bg-gray-100  flex flex-col px-8 pt-4 gap-2 rounded-lg min-h-[300px] overflow-y-scroll"
                    id="completed"
                    ref={(node) => {
                      dropToActive(node);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                        Active
                      </h3>
                    </div>
                    {/* Mapped ONLY inside this box */}
                    {activeIssues?.map((issue: IssueItems) => (
                      <Issuebox
                        key={issue.issue_id}
                        id={issue.issue_id.toString()}
                        assignee={issue.created_by.toString()}
                        title={issue.title}
                        priority={issue.priority}
                        status={issue.status}
                      />
                    ))}
                  </div>
                  <div
                    className="h-full w-full bg-gray-100  flex flex-col px-8 pt-4 gap-2 rounded-lg min-h-[300px] overflow-y-scroll"
                    id="backlog"
                    ref={(node) => {
                      dropToBacklog(node);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-slate-500" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                        Backlog
                      </h3>
                    </div>
                    {/* Mapped ONLY inside this box */}
                    {backlogIssues?.map((issue: IssueItems) => (
                      <Issuebox
                        key={issue.issue_id}
                        id={issue.issue_id.toString()}
                        assignee={issue.created_by.toString()}
                        title={issue.title}
                        priority={issue.priority}
                        status={issue.status}
                      />
                    ))}
                  </div>
                  <div
                    className="h-full w-full bg-gray-100 flex flex-col px-8 pt-4 gap-2 rounded-lg min-h-[300px] overflow-y-scroll"
                    id="all-issues"
                    ref={(node) => {
                      dropToCompleted(node);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                        Completed
                      </h3>
                    </div>
                    {/* Mapped ONLY inside this box */}
                    {completedIssues?.map((issue: IssueItems) => (
                      <Issuebox
                        key={issue.issue_id}
                        id={issue.issue_id.toString()}
                        assignee={issue.created_by.toString()}
                        title={issue.title}
                        priority={issue.priority}
                        status={issue.status}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {id && <Issuescreen />}
      {/* <div className="w-3/5 h-full py-16 px-10">
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
      </div> */}
    </div>
  );
}
