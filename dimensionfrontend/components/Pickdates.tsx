"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { issueInterface } from "@/lib/types";
interface Datepickerprops {
  date?: Date;
  setDate: React.Dispatch<React.SetStateAction<issueInterface>>;
}

export function DatePickerSimple({ date, setDate }: Datepickerprops) {
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate((prev) => ({
      ...prev,
      dueDate: selectedDate,
    }));
  };

  return (
    <Field className="mx-auto w-44">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            id="date-picker-simple"
            className="justify-start font-normal"
          >
            <span>Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
