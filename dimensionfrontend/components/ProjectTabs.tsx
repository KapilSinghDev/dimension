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
import { toast } from "sonner";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
    style: "text-red-600",
  },
  {
    key: "low",
    style: "text-amber-600",
  },
  {
    key: "lead",
    style: "text-sky-600",
  },
  {
    key: "coordinator",
    style: "text-zinc-600",
  },
  {
    key: "normal",
    style: "text-emerald-600",
  },
  {
    key: "completed",
    style: "text-blue-600",
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
  name = name.charAt(0).toUpperCase() + name.slice(1);

  const triggerBadge = (
    <button
      type="button"
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white",
        "px-2.5 py-1 text-xs font-medium text-zinc-700",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        "transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-1",
      )}
    >
      <Icon size={13} className={cn("shrink-0 opacity-80", iconStyle)} />
      <span className="leading-none tracking-tight">{name}</span>
    </button>
  );

  if (component) {
    return (
      <Popover>
        <PopoverTrigger asChild>{triggerBadge}</PopoverTrigger>
        <PopoverContent
          className="w-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-md"
          align="start"
        >
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
          className="min-w-[168px] rounded-xl border border-zinc-200 bg-white p-1 shadow-md"
        >
          {options.map((item, index) => {
            const isSelected = selectedOption === item.value;
            const label = item.name || (item.value as string);

            return (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  onSelectOption?.(
                    optionField as keyof project_type,
                    item.value,
                  );
                  toast(
                    (optionField?.charAt(0).toUpperCase() as string) +
                      optionField?.slice(1) +
                      " changed ",
                  );
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm",
                  "text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900",
                  isSelected && "bg-zinc-50 font-medium text-zinc-900",
                )}
              >
                <span className="truncate">{label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return triggerBadge;
};

export default ProjectTabs;
