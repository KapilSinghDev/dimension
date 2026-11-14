"use client";
import React, { ElementType, useState } from "react";
import {
  Ban,
  Bug,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Inbox,
  LucideIcon,
  PlayCircle,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { IssueDetail } from "./screens/Issuescreen";
import {
  issue_status_enum,
  IssueLabel_enums,
  IssuePriority_enums,
} from "@/lib/enums";

interface IssuePropertyItem {
  label: string;
  value: string | number;
  icon: ElementType;
  optionComponent?: React.ReactNode;
}

type SelectField = "status" | "priority" | "lable";

interface Propertytabsinterface {
  detailItems: IssuePropertyItem[];
  issueDetails: IssueDetail;
  onUpdate?: (field: SelectField, value: string) => void;
}

type Option = {
  value: string;
  icon: LucideIcon;
  iconClass: string;
};

/* -------------------------------------------------------------------------- */
/*  Options: the order here is the order (and the number) shown in the menu   */
/* -------------------------------------------------------------------------- */

const selectConfigs: Record<string, { field: SelectField; options: Option[] }> =
  {
    status: {
      field: "status",
      options: [
        {
          value: issue_status_enum.BACKLOG,
          icon: Inbox,
          iconClass: "text-slate-500",
        },
        {
          value: issue_status_enum.ACTIVE,
          icon: PlayCircle,
          iconClass: "text-amber-500",
        },
        {
          value: issue_status_enum.CLOSED,
          icon: CheckCircle2,
          iconClass: "text-emerald-500",
        },
      ],
    },
    // low → high
    priority: {
      field: "priority",
      options: [
        {
          value: IssuePriority_enums.LOW,
          icon: SignalLow,
          iconClass: "text-blue-500",
        },
        {
          value: IssuePriority_enums.MEDIUM,
          icon: SignalMedium,
          iconClass: "text-yellow-500",
        },
        {
          value: IssuePriority_enums.HIGH,
          icon: SignalHigh,
          iconClass: "text-orange-500",
        },
      ],
    },
    label: {
      field: "lable",
      options: [
        {
          value: IssueLabel_enums.NoLabel,
          icon: Ban,
          iconClass: "text-slate-400",
        },
        {
          value: IssueLabel_enums.Improvement,
          icon: TrendingUp,
          iconClass: "text-sky-500",
        },
        {
          value: IssueLabel_enums.Feature,
          icon: Sparkles,
          iconClass: "text-violet-500",
        },
        {
          value: IssueLabel_enums.Bug,
          icon: Bug,
          iconClass: "text-red-500",
        },
      ],
    },
  };
selectConfigs.labels = selectConfigs.label; // in case the row is titled "Labels"

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* -------------------------------------------------------------------------- */
/*  Dropdown row value                                                        */
/* -------------------------------------------------------------------------- */

function PropertySelect({
  current,
  options,
  fallbackIcon: FallbackIcon,
  onSelect,
}: {
  current: string;
  options: Option[];
  fallbackIcon: ElementType;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find(
    (o) => String(o.value).toLowerCase() === current.toLowerCase(),
  );
  const TriggerIcon = selected?.icon ?? FallbackIcon;

  const choose = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "group/trigger -ml-2 h-7 w-full min-w-0 justify-start gap-2 rounded-md px-2 text-[13px] font-medium text-slate-800",
            "hover:bg-slate-100 data-[state=open]:bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
          )}
        >
          <TriggerIcon
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              selected?.iconClass ?? "text-slate-400",
            )}
            strokeWidth={1.75}
          />
          <span className="flex-1 truncate text-left">
            {capitalize(current)}
          </span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover/trigger:opacity-100 group-data-[state=open]/trigger:opacity-100" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.05)]"
        onKeyDown={(e) => {
          // Press 1..n to pick an option
          const index = Number(e.key) - 1;
          if (Number.isInteger(index) && options[index]) {
            e.preventDefault();
            choose(options[index].value);
          }
        }}
      >
        {options.map((option, i) => {
          const OptionIcon = option.icon;
          const isSelected = option === selected;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => choose(option.value)}
              className={cn(
                "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-700 transition-colors",
                "focus:bg-slate-100 focus:text-slate-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900",
                isSelected && "text-slate-900",
              )}
            >
              <OptionIcon
                className={cn("h-4 w-4 shrink-0", option.iconClass)}
                strokeWidth={1.75}
              />
              <span className="flex-1 truncate">
                {capitalize(option.value)}
              </span>
              {isSelected && (
                <Check className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              )}
              <DropdownMenuShortcut className="ml-1 flex h-5 min-w-5 items-center justify-center rounded border border-slate-200 bg-slate-50 px-1 text-[10px] font-medium tracking-normal text-slate-500">
                {i + 1}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/*  Properties list                                                           */

export const Propertytabs = ({
  detailItems,
  issueDetails,
  onUpdate,
}: Propertytabsinterface) => {
  type PropertyRow = IssuePropertyItem & {
    capitalize: boolean;
    muted: boolean;
  };

  const propertyRows: PropertyRow[] = [
    ...detailItems.map(({ label, value, icon, optionComponent }) => ({
      label,
      value,
      icon,
      optionComponent,
      capitalize: true,
      muted: false,
    })),
    {
      label: "Created by",
      value: issueDetails?.created_by ?? "Not set",
      icon: UserRound,
      capitalize: false,
      muted: issueDetails?.created_by == null,
    },
  ];

  return (
    <div className="p-1.5">
      {propertyRows.map(
        ({
          label,
          value,
          icon: Icon,
          optionComponent,
          capitalize: cap,
          muted,
        }) => {
          const config = selectConfigs[label.toLowerCase()];

          return (
            <div
              key={label}
              className="grid min-w-0 grid-cols-[92px_minmax(0,1fr)] items-center gap-3 rounded-md px-2 py-0.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Icon
                  className="h-3.5 w-3.5 shrink-0 text-slate-400"
                  strokeWidth={1.75}
                />
                <span className="truncate">{label}</span>
              </div>

              {optionComponent ? (
                <div className="min-w-0 py-0.5 ">{optionComponent}</div>
              ) : config ? (
                <PropertySelect
                  current={String(value)}
                  options={config.options}
                  fallbackIcon={Icon}
                  onSelect={(v) => onUpdate?.(config.field, v)}
                />
              ) : (
                <p
                  className={cn(
                    "wrap-break-word py-1 text-[13px]",
                    cap && "capitalize",
                    muted
                      ? "font-normal text-slate-400"
                      : "font-medium text-slate-800",
                  )}
                >
                  {value}
                </p>
              )}
            </div>
          );
        },
      )}
    </div>
  );
};
