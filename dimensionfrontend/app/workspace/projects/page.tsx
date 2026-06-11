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
  Icon,
  CircleX,
  SendHorizontal,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarDays,
  ListChecks,
} from "lucide-react";
import NoProjects from "@/components/Noprojects";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Boxes } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import Propertiesbox from "@/components/Propertiesbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectTabs from "@/components/ProjectTabs";
import Projectupdatemodal from "@/components/Projectupdatemodal";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Projects = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
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
          className={`h-full w-full flex flex-col items-start ${state === "expanded" ? "px-15" : "px-30"} my-auto`}
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
            {[
              { icon: Flame, name: "High Priority", variant: "high" as const },
              { icon: Crown, name: "Team Lead", variant: "lead" as const },
              {
                icon: CalendarClock,
                name: "Target Completion",
                variant: "completed" as const,
              },
              { icon: CircleCheck, name: "Status", variant: "normal" as const },
            ].map((items, index) => (
              <ProjectTabs
                key={index}
                icon={items.icon}
                name={items.name}
                style={items.variant}
              />
            ))}
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
          <Projectupdatemodal />
          <Field className="mt-5">
            <FieldDescription>Description</FieldDescription>
            <Textarea
              placeholder="Add description"
              className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              maxLength={200}
            />
          </Field>
          <div className="w-full h-fit mt-5">
            {/* TODO : add the components to display the targets up here */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="border-none">
                  <Plus />
                  Targets
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-2" side="right">
                <div className="flex items-center gap-3 p-2 bg-background  w-full">
                  {/* 1. Icon */}
                  <div className="w-2.5 h-2.5 rotate-45 border-2 border-muted-foreground/40 shrink-0" />

                  {/* 2. Milestone Name Input */}
                  <input
                    className="w-32 text-xs font-medium bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                    placeholder="Milestone name"
                  />

                  {/* 3. Compact Description Input (Inline) */}
                  <input
                    className="flex-1 text-xs bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                    placeholder="Add description..."
                  />

                  {/* 4. Metadata Row */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0">
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant={"outline"}
                          className="flex items-center gap-1 text-sm border-none transition-colors"
                        >
                          <CalendarDays size={10} /> Set date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit" align={"center"}>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          defaultMonth={date}
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="flex items-center gap-1 text-sm">
                      <ListChecks size={10} /> 0 issues
                    </span>
                  </div>

                  {/* 5. 3-Dot Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem className="gap-2 text-xs">
                        <Pencil size={12} /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-xs text-destructive">
                        <Trash2 size={12} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
