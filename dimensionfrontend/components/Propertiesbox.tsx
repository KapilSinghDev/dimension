"use client";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Award } from "lucide-react";

type PropertyItem = {
  icon: LucideIcon;
  label: string;
  items: string[];
};

type Propertiesboxprops = {
  Tableicon: LucideIcon;
  name: string;
  badge?: string;
  properties: PropertyItem[];
};

const Propertiesbox = ({
  Tableicon: TableIcon,
  name,
  badge = "Active",
  properties,
}: Propertiesboxprops) => {
  return (
    <Collapsible className="  rounded-sm p-1 bg-gray-200">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-2  rounded-md transition-colors cursor-pointer">
        <span className="text-xs font-medium text-foreground flex items-center gap-2">
          <TableIcon size={15} />
          {name}
        </span>
        <ChevronDown size={13} className="text-muted-foreground" />
      </CollapsibleTrigger>

      <CollapsibleContent className="flex flex-col gap-0.5 mt-1">
        {properties.map((section, idx) => (
          <Tooltip key={idx}>
            <div className="flex w-full gap-10 justify-start py-2 px-2 rounded-md transition-colors cursor-pointer text-muted-foreground">
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
                    {badge}
                  </Badge>
                </TooltipTrigger>
              </div>
            </div>
            <TooltipContent
              side="right"
              align="start"
              className="min-w-20 p-1 bg-gray-500"
            >
              <div className="flex flex-col">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer text-xs font-medium "
                  >
                    <Award
                      color="yellow"
                      size={12}
                      className="invisible group-hover:visible flex-shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Propertiesbox;
