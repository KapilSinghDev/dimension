"use client";
import React, { useState } from "react";
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
  UserPlus,
  ArrowRight,
} from "lucide-react";
import NoProjects from "@/components/Noprojects";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Boxes } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import { useSidebar } from "@/components/ui/sidebar";
// import {  } from "radix-ui";

import Propertiesbox from "@/components/Propertiesbox";

import ProjectTabs from "@/components/ProjectTabs";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Update from "@/components/Update";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Addtarget from "@/components/Addtarget";
import Issuedisplay from "@/components/Issuedisplay";
import Projectviewscreen from "@/components/screens/Projectviewscreen";
import Activityviewscreen from "@/components/screens/Activityviewscreen";
const Projects = () => {
  const { state } = useSidebar();
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex items-center gap-3 pt-5 px-8 sticky top-0 z-10 bg-white ">
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
        className={`w-full sticky top-16 z-10 mt-4 ${state === "expanded" ? "px-16" : "px-12"} flex gap-2`}
      >
        <Menubar className="border-none shadow-none bg-transparent p-0 h-fit w-full sticky top-16 z-10">
          <MenubarMenu>
            <MenubarTrigger className="text-xs px-2.5 py-0.5 h-fit rounded-full border border-border bg-transparent hover:bg-muted cursor-pointer font-normal">
              Activity
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-xs px-2.5 py-0.5 h-fit rounded-full border-none bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer font-normal">
              Overview
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-xs px-2.5 py-0.5 h-fit rounded-full border border-border bg-transparent hover:bg-muted cursor-pointer font-normal">
              Issues
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="h-full flex-1 w-full mt-8 flex flex-row ">
        {/* <Projectviewscreen /> */}
        <Activityviewscreen />
        <div className="h-full w-2/5 pr-10">
          <div className="h-full w-full flex flex-col gap-1 p-4">
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
      </div>
    </div>
  );
};

export default Projects;
