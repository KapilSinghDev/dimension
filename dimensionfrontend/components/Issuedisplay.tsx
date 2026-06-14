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
  date: string;
  milestone: string;
  desc: string;
};

const Issuedisplay = ({ date, milestone, desc }: IssueDisplayProps) => {
  return (
    <Card className="flex-shrink-0 w-48 hover:bg-muted/40 cursor-pointer transition-colors">
      <CardHeader className="p-3 pb-1">
        <div className="flex items-center justify-between">
          <Target size={12} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{date}</span>
        </div>
        <CardTitle className="text-xs font-medium mt-1">{milestone}</CardTitle>
        <CardDescription className="text-[11px] leading-tight">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0">
        <div className="flex items-center gap-1">
          <CalendarClock size={10} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            Complete by {date}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Issuedisplay;
