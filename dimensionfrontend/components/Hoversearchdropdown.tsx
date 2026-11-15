"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface OptionItem {
  id: number;
  title: string;
  icon?: React.ElementType;
}

interface HoverSearchDropdownProps {
  buttonLabel: string;
  options: OptionItem[];
  selectedId?: string;
  onSelect?: (option: OptionItem) => void;
  searchPlaceholder?: string;
}

export const HoverSearchDropdown: React.FC<HoverSearchDropdownProps> = ({
  buttonLabel,
  options = [],
  selectedId,
  onSelect,
  searchPlaceholder = "Search...",
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          className={cn(
            "-ml-2 h-7 w-full justify-start gap-1.5 rounded-md px-2 text-[13px] font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-800",
            open && "bg-slate-100 text-slate-800",
          )}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          {buttonLabel}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-60 rounded-lg border-slate-200/80 bg-white p-0 shadow-xl shadow-black/5"
      >
        <Command className="rounded-lg bg-transparent">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 text-[13px] placeholder:text-slate-400"
          />
          <CommandList className="max-h-52 p-1">
            <CommandEmpty className="py-4 text-center text-xs text-slate-400">
              No options found
            </CommandEmpty>
            <CommandGroup className="p-0">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <CommandItem
                    key={option.id}
                    value={option.title}
                    onSelect={() => {
                      onSelect?.(option);
                      setOpen(false);
                    }}
                    className="gap-2 rounded-md px-2 py-1.5 text-[13px] text-slate-700 data-[selected=true]:bg-slate-100 data-[selected=true]:text-slate-900"
                  >
                    {Icon && (
                      <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    )}
                    <span className="truncate">{option.title}</span>
                    {selectedId === option.id.toString() && (
                      <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-500" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
