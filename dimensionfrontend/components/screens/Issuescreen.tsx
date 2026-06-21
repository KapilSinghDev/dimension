"use client";
import React from "react";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { ArrowLeft, Atom, Paperclip, Smile } from "lucide-react";
import FastCreateIssue from "../Fastcreateissue";
import { Separator } from "@/components/ui/separator";
import IssueActivity from "../Issueactivity";
const Issuescreen = () => {
  return (
    <div className="w-full h-full px-10 overflow-y-auto py-10">
      <Textarea
        placeholder="Add an issue title..."
        // value={""}
        className="resize-none pt-4 min-h-16 font-semibold text-2xl! tracking-tight border-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
      />
      <Textarea
        placeholder="Add an issue description..."
        className="resize-none pt-2 min-h-10 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
      />
      <div className="w-full h-fit flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-4 w-4" />
              <span className="sr-only">Add reaction</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>React to issue</p>
          </TooltipContent>
        </Tooltip>

        {/* BUTTON 2: Attach Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach File</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Attach code architecture files</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="w-full h-fit mt-5">
        <FastCreateIssue />
        <Separator className="mt-2 mb-2 bg-gray-400" />
      </div>
      <div className="w-full h-full ">
        <IssueActivity />
      </div>
    </div>
  );
};

export default Issuescreen;
