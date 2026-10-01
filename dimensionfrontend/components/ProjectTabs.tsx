"use client";

import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "@/lib/enums";
import { project_type } from "@/lib/types";
interface valueInterface {
  value:
    | project_priority_enum
    | project_status_enum
    | project_health_enum
    | Date
    | string;
}
type ProjectTabsprops = {
  name: string;
  icon: LucideIcon;
  style: VariantProps<typeof badgeVariants>["variant"];
  options?: {
    name: string;
    value:
      | project_priority_enum
      | project_status_enum
      | project_health_enum
      | Date
      | string;
  }[];
  optionField?: keyof project_type;
  component?: ReactNode;
  onSelectOption?: (
    field: keyof project_type,
    value:
      | project_priority_enum
      | project_status_enum
      | project_health_enum
      | Date
      | string,
  ) => void;
  selectedOption?:
    | project_priority_enum
    | project_status_enum
    | project_health_enum
    | Date
    | string;
};

const iconColorMapper = [
  {
    key: "high",
    style:
      "text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  {
    key: "low",
    style:
      "text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
  {
    key: "lead",
    style:
      "text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    key: "coordinator",
    style:
      "text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700",
  },
  {
    key: "normal",
    style:
      "text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  {
    key: "completed",
    style:
      "bg-blue-100 text-blue-500 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
];

const ProjectTabs = ({
  name,
  icon: Icon,
  style,
  options,
  optionField,
  component,
  onSelectOption,
  selectedOption,
}: ProjectTabsprops) => {
  const iconStyle = iconColorMapper.find((v) => v.key === style)?.style;

  const triggerBadge = (
    <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
      <Icon size={14} className={iconStyle} />
      <Badge variant={style}>{name}</Badge>
    </div>
  );

  if (component) {
    return (
      <Popover>
        <PopoverTrigger asChild>{triggerBadge}</PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          {component}
        </PopoverContent>
      </Popover>
    );
  }

  if (options && options.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{triggerBadge}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[180px] rounded-xl border border-blue-100 bg-white p-1.5 shadow-lg shadow-blue-100/50"
        >
          {options.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() =>
                onSelectOption?.(optionField as keyof project_type, item.value)
              }
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                {item.name || (item.value as string)}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return triggerBadge;
};

export default ProjectTabs;
