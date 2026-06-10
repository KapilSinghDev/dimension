"use client";
import React from "react";
import {
  CalendarClock,
  CircleCheck,
  Crown,
  Flame,
  LayoutGrid,
  Plus,
  Paperclip,
  PenLine,
  ChevronDown,
  CircleDot,
  MessageSquare,
  UsersRound,
  CircleAlert,
  Users,
  Tag,
  TableProperties,
  Target,
  Activity,
} from "lucide-react";
import NoProjects from "@/components/Noprojects";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Boxes } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
// import { Flame, Crown, Users, UsersRound, CircleDot, CircleAlert, CalendarClock, MessageSquare, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useSidebar } from "@/components/ui/sidebar";
// import {  } from "radix-ui";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
const Projects = () => {
  const { state } = useSidebar();
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex items-center gap-3 pt-5 px-8">
        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center flex-shrink-0">
          <LayoutGrid
            size={16}
            className="text-violet-600 dark:text-violet-400"
          />
        </div>
        <div className="w-full">
          <p className="text-std text-foreground leading-none">Projects</p>
          <p className="text-xs text-muted-foreground mt-0.5">All projects</p>
          <Separator className="mt-2 bg-border/80" />
        </div>
      </div>

      <div
        className={`w-full mt-4 ${state === "expanded" ? "px-16" : "px-12"} flex gap-2`}
      >
        <Badge variant={"outline"}>Activity</Badge>
        <Badge>Overview</Badge>
        <Badge>Issues</Badge>
      </div>

      <div className="flex-1 w-full mt-8 flex flex-row overflow-hidden">
        <div
          // Use this exact syntax
          className={`h-full w-full flex flex-col items-start ${state === "expanded" ? "px-15" : "px-30"} my-auto`}
          // className="h-full w-full flex flex-col items-start px-30 my-auto"
        >
          <div className="h-fit w-fit  pt-5">
            <Boxes size={40} />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dimension web app
            <Separator className="mt-2 bg-border/80" />
          </h1>
          <Textarea
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none mt-2 font-medium"
            placeholder="Add a short summary"
            maxLength={50}
          />
          <div className="h-fit flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-red-500" />
              <Badge variant="destructive">High Priority</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Crown size={14} className="text-violet-500" />
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
                Team Lead
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarClock size={14} className="text-amber-500" />
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Target Completion
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <CircleCheck size={14} className="text-green-500" />
              <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                Status
              </Badge>
            </div>
          </div>
          <div className="h-fit flex items-center justify-between gap-2 mt-4">
            <Paperclip size={15} />
            <p className="text-sm font-medium text-foreground">
              Resources and Files
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground border-none"
            >
              <Plus size={13} />
              Add
            </Button>
          </div>
          <Button
            variant={"outline"}
            className="w-full cursor-pointer py-2 mt-2"
          >
            Write update to projects <PenLine size={10} />
          </Button>
          <Field className="mt-5">
            <FieldDescription>Description</FieldDescription>
            <Textarea
              placeholder="Add description"
              className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              maxLength={200}
            />
          </Field>
          <div className="w-full h-fit mt-5">
            <Button variant={"outline"} className="border-none">
              <Plus />
              Targets
            </Button>
          </div>
        </div>

        <div className="h-full w-2/5 pr-10">
          <div className="h-full w-full flex flex-col gap-1 p-4">
            <Collapsible className="bg-gray-200 rounded-sm p-1">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-2 hover:bg-muted/40 rounded-md transition-colors cursor-pointer">
                <span className="text-xs font-medium text-foreground flex flex-row">
                  <TableProperties size={15} className="mr-2" />
                  Properties
                  <ChevronDown
                    size={13}
                    className="text-muted-foreground my-auto"
                  />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-0.5 mt-1">
                {/* Reusable Item Template */}
                {[
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
                ].map((section, idx) => (
                  <Tooltip key={idx}>
                    <div className="flex w-full gap-10 justify-start py-2  px-2 rounded-md transition-colors cursor-pointer text-muted-foreground">
                      <div className="flex w-1/5 items-center gap-2">
                        <section.icon size={14} />
                        <span className="text-xs">{section.label}</span>
                      </div>
                      <div className="w-full">
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal rounded-md"
                          >
                            Active
                          </Badge>
                        </TooltipTrigger>
                      </div>
                    </div>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="w-40 p-1"
                    >
                      <div className="flex flex-col">
                        {section.items.map((item) => (
                          <div
                            key={item}
                            className="hover:bg-muted px-3 py-1.5 rounded cursor-pointer text-xs font-medium"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="bg-gray-200 rounded-sm p-1">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-2 hover:bg-muted/40 rounded-md transition-colors cursor-pointer">
                <span className="text-xs font-medium text-foreground flex flex-row">
                  <Target size={15} className="mr-2" />
                  Targets
                  <ChevronDown
                    size={13}
                    className="text-muted-foreground my-auto"
                  />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-0.5 mt-1">
                {/* Reusable Item Template */}
                {[
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
                ].map((section, idx) => (
                  <Tooltip key={idx}>
                    <div className="flex w-full gap-10 justify-start py-2  px-2 rounded-md transition-colors cursor-pointer text-muted-foreground">
                      <div className="flex w-1/5 items-center gap-2">
                        <section.icon size={14} />
                        <span className="text-xs">{section.label}</span>
                      </div>
                      <div className="w-full">
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal rounded-md"
                          >
                            Active
                          </Badge>
                        </TooltipTrigger>
                      </div>
                    </div>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="w-40 p-1"
                    >
                      <div className="flex flex-col">
                        {section.items.map((item) => (
                          <div
                            key={item}
                            className="hover:bg-muted px-3 py-1.5 rounded cursor-pointer text-xs font-medium"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="bg-gray-200 rounded-sm p-1">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-2 hover:bg-muted/40 rounded-md transition-colors cursor-pointer">
                <span className="text-xs font-medium text-foreground flex flex-row">
                  <Activity size={15} className="mr-2" />
                  Activity
                  <ChevronDown
                    size={13}
                    className="text-muted-foreground my-auto"
                  />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-0.5 mt-1">
                {/* Reusable Item Template */}
                {[
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
                ].map((section, idx) => (
                  <Tooltip key={idx}>
                    <div className="flex w-full gap-10 justify-start py-2  px-2 rounded-md transition-colors cursor-pointer text-muted-foreground">
                      <div className="flex w-1/5 items-center gap-2">
                        <section.icon size={14} />
                        <span className="text-xs">{section.label}</span>
                      </div>
                      <div className="w-full">
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal rounded-md"
                          >
                            Active
                          </Badge>
                        </TooltipTrigger>
                      </div>
                    </div>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="w-40 p-1"
                    >
                      <div className="flex flex-col">
                        {section.items.map((item) => (
                          <div
                            key={item}
                            className="hover:bg-muted px-3 py-1.5 rounded cursor-pointer text-xs font-medium"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
