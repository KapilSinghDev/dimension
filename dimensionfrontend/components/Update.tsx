"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  CornerDownLeft,
  SendHorizontal,
  CircleDot,
  CircleCheck,
  CircleAlert,
  CircleX,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type UpdateBoxProps = {
  variant?: "update" | "display";
};

const Update = ({ variant = "display" }: UpdateBoxProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 pb-1">
        {variant === "update" ? (
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="normal"
                  className="absolute top-2 left-2 z-10 cursor-pointer gap-1 text-[10px]"
                >
                  <CircleDot size={10} />
                  On Track
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="p-1 w-32">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-xs">
                    <CircleCheck size={12} className="text-emerald-500" />
                    On Track
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-xs">
                    <CircleAlert size={12} className="text-yellow-500" />
                    Delayed
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-xs">
                    <CircleX size={12} className="text-red-500" />
                    Blocked
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            <Textarea
              placeholder="Add a status update..."
              className="resize-none pt-9 min-h-28 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <Badge
                  variant="normal"
                  className="w-fit text-[10px] px-1.5 h-5 font-normal"
                >
                  On Track
                </Badge>
                <p className="text-[11px] text-muted-foreground">
                  Updated by{" "}
                  <span className="font-medium text-foreground">Alice</span> ·
                  2h ago
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer flex-shrink-0"
              >
                <RefreshCw size={12} className="text-muted-foreground" />
              </Button>
            </div>
            <p className="text-xs text-foreground mt-3 leading-relaxed">
              API integration is progressing well. All core endpoints are
              connected and tests are passing. No blockers at this time.
            </p>
          </>
        )}
      </CardContent>

      {variant === "update" ? (
        <CardFooter className="px-4 py-1 border-t border-border justify-end">
          <Button
            variant="default"
            size="sm"
            className="gap-1.5 text-xs cursor-pointer"
            onClick={() =>
              toast("Update Posted successfully", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
          >
            <SendHorizontal size={13} />
            Post Update
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="px-4 py-1 border-t border-border">
          <div className="flex items-center gap-2 w-full">
            <Input
              placeholder="Leave a reply..."
              className="h-7 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-muted/40 placeholder:text-muted-foreground"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0 cursor-pointer"
            >
              <CornerDownLeft size={12} className="text-muted-foreground" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Update;
