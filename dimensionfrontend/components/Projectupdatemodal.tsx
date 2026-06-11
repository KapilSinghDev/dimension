"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  CircleAlert,
  CircleCheck,
  CircleDot,
  CircleX,
  PenLine,
  SendHorizontal,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";

const Projectupdatemodal = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="w-full">
          <Button
            variant={"outline"}
            className="w-full cursor-pointer py-2 mt-2 h-12 bg-gray-200 hover:bg-gray-200 "
          >
            Write update to projects <PenLine size={10} />
          </Button>
        </DialogTrigger>

        <DialogContent className="p-4 gap-3 w-3/5 translate-y-[-60%] ">
          <DialogTitle></DialogTitle>
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
              className="resize-none pt-9 min-h-44 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs cursor-pointer"
              >
                <SendHorizontal size={13} />
                Post Update
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Projectupdatemodal;
