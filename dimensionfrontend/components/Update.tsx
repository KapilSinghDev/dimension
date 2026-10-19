"use client";

import React, { ChangeEvent, useState } from "react";
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
  ImagePlus,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "@/lib/enums";
import { issueActivityType, project_type } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useUpdateIssueActivity } from "@/hooks/apihooks";
import { useIssueList } from "@/store/issueStore";

interface issueDetails {
  id: number;
  title: string;
}

type UpdateBoxProps = {
  variant?: "update" | "display";
  onSelect?: (field: keyof project_type, value: project_health_enum) => void;
  field?: string;
  status?: string;
  id?: number;
  update_time?: Date;
  comment?: string;
  update_asset?: string;
};

const healthStatus = [
  {
    name: "On Track",
    enum_val: project_health_enum.ON_TRACK,
    color: "bg-emerald-500",
  },
  {
    name: "At Risk",
    enum_val: project_health_enum.AT_RISK,
    color: "bg-amber-500",
  },
  {
    name: "Off Track",
    enum_val: project_health_enum.OFF_TRACK,
    color: "bg-rose-500",
  },
];

const Update = ({
  variant = "display",
  onSelect,
  field,
  status,
  id,
  update_time,
  update_asset,
  comment,
}: UpdateBoxProps) => {
  const issuesOptions = useIssueList();
  console.log("this is to check from the update comp", issuesOptions);
  const issueUpdate = useUpdateIssueActivity();

  const [issuePayload, setIssuePayload] = useState<issueActivityType>({
    issueId: "",
    comment: "",
    media: null,
  });

  const [selectedIssueTitle, setSelectedIssueTitle] = useState("");

  const handleIssuePayload = (
    field: string,
    value?: string,
    e?: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = e?.target.value ?? value ?? "";
    setIssuePayload((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const selectedIssue = issuesOptions?.find(
    (item) => item.id.toString() === issuePayload.issueId,
  );

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <CardContent className="p-0">
        {variant === "update" ? (
          <div className="flex flex-col">
            {/* Issue Selector */}
            <div className="px-4 pt-4 pb-3 border-b border-border/50 bg-muted/20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-9 text-sm font-normal bg-background hover:bg-background"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {selectedIssue ? (
                        <>
                          <CircleCheck
                            size={14}
                            className="text-emerald-500 shrink-0"
                          />
                          <span className="truncate">
                            {selectedIssue.title}
                          </span>
                        </>
                      ) : (
                        <>
                          <CircleDot
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                          <span className="text-muted-foreground">
                            Select an issue to update...
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className="text-muted-foreground shrink-0 ml-2"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto"
                >
                  {issuesOptions?.length ? (
                    issuesOptions.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        className="cursor-pointer gap-2"
                        onClick={() => {
                          handleIssuePayload("issueId", item.id.toString());
                          setSelectedIssueTitle(item.title);
                        }}
                      >
                        <CircleCheck size={14} className="text-emerald-500" />
                        <span className="truncate">{item.title}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                      No issues available
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Comment Area */}
            <div className="p-4">
              <Textarea
                placeholder="Write a status update..."
                className="resize-none min-h-[110px] text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none"
                value={issuePayload.comment}
                onChange={(e) => handleIssuePayload("comment", e.target.value)}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50 bg-muted/10">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ImagePlus size={14} />
                Add media
              </Button>

              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs px-4"
                disabled={!issuePayload.issueId || !issuePayload.comment.trim()}
                onClick={() => {
                  issueUpdate.mutate(issuePayload);
                  toast("Update posted successfully", {
                    description: "Your status update has been shared.",
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo"),
                    },
                  });
                }}
              >
                <SendHorizontal size={13} />
                Post Update
              </Button>
            </div>
          </div>
        ) : (
          // ========== DISPLAY VARIANT ==========
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <Badge
                  variant="secondary"
                  className="text-[11px] font-medium px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0"
                >
                  On Track
                </Badge>

                <p className="text-xs text-muted-foreground">
                  Updated by{" "}
                  <span className="font-medium text-foreground">Alice</span>
                  {update_time && (
                    <>
                      {" · "}
                      {formatDistanceToNow(new Date(update_time), {
                        addSuffix: true,
                      })}
                    </>
                  )}
                  {id !== undefined && (
                    <span className="font-mono text-muted-foreground/80">
                      {" "}
                      · #{id}
                    </span>
                  )}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw size={13} />
              </Button>
            </div>

            {comment && (
              <p className="mt-3 text-sm text-foreground leading-relaxed">
                {comment}
              </p>
            )}

            {update_asset && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={update_asset}
                alt="Update attachment"
                className="mt-3 max-h-56 w-full rounded-lg border border-border object-cover"
              />
            )}
          </div>
        )}
      </CardContent>

      {/* Reply footer only for display variant */}
      {variant === "display" && (
        <CardFooter className="px-4 py-2.5 border-t border-border/50 bg-muted/10">
          <div className="flex items-center gap-2 w-full">
            <Input
              placeholder="Leave a reply..."
              className="h-8 text-sm border-0 bg-background focus-visible:ring-1 focus-visible:ring-ring shadow-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <CornerDownLeft size={14} />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Update;
