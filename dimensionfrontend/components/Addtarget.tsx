"use client";

import {
  CalendarDays,
  LifeBuoy,
  ListChecks,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";

const Addtarget = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [targetState, setTagetState] = useState(false);
  const handleTarget = () => {
    setTagetState(!targetState);
  };
  return (
    <>
      <Popover open={targetState} onOpenChange={setTagetState}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="border-none mt-2 bg-gray-100 hover:cursor-pointer"
            onClick={() => handleTarget()}
          >
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
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-1 text-[10px] border-none transition-colors"
                  >
                    <CalendarDays size={10} /> Set date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit" align={"center"}>
                  <Calendar
                    className="text-[10px] bg-gray-300"
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
                <DropdownMenuItem className="gap-2 text-xs hover:cursor-pointer">
                  <Pencil size={12} /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs text-destructive hover:bg-blue-50 dark:hover:bg-red-200 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 hover:cursor-pointer">
                  <Trash2 size={12} /> Delete
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-2 text-xs text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-950 hover:cursor-pointer"
                  onClick={() => handleTarget()}
                >
                  <LifeBuoy
                    className="hover:bg-blue-50 dark:hover:bg-blue-950 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-950"
                    size={12}
                  />{" "}
                  Save
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Addtarget;
