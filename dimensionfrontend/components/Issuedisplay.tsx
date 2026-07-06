"use client";
import React from "react";
import { Target, CalendarClock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

type IssueDisplayProps = {
  date: Date | string;
  milestone: string;
  desc?: string;
};

const Issuedisplay = ({ date, milestone, desc }: IssueDisplayProps) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="flex-shrink-0 w-48 hover:bg-muted/40 cursor-pointer transition-colors flex flex-col justify-between">
      <CardHeader className="p-3 pb-1">
        <div className="flex items-center justify-between">
          <Target size={12} className="text-muted-foreground" />
          {/* ⚠️ FIXED: Render the string representation, not the raw Date object */}
          <span className="text-[10px] text-muted-foreground">
            {formattedDate}
          </span>
        </div>
        <CardTitle className="text-xs font-medium mt-1">{milestone}</CardTitle>
        <CardDescription className="text-[11px] leading-tight line-clamp-2">
          {desc}
        </CardDescription>
      </CardHeader>

      <CardFooter className="p-3 pt-2 border-t mt-2">
        <div className="flex items-center gap-1">
          <CalendarClock size={10} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">
            Deadline
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Issuedisplay;
