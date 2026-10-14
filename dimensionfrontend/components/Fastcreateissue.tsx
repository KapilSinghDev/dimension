"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Circle,
  Paperclip,
  MoreHorizontal,
  User2,
  Tag,
  Flame,
  Flag,
  StepForward,
  LucideIcon,
} from "lucide-react";
import { useCreateIssue } from "@/hooks/apihooks";
import { issue_status_enum, priority_enum } from "@/lib/enums";
import { DatePickerSimple } from "./Pickdates";
import { issueInterface } from "@/lib/types";

interface MetadataConfig {
  id: "priority" | "assignee" | "label";
  icon: LucideIcon;
  tooltip: string;
  items: string[];
}

interface FastCreateIssueProps {
  onCancel?: () => void;
  onOpen?: () => void;
  variant?: "default" | "kanban";
}

export default function FastCreateIssue({
  onCancel,
  onOpen,
  variant = "default",
}: FastCreateIssueProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const metaDataRef = useRef<HTMLDivElement>(null);

  const handleCancellation = () => {
    onCancel?.();
    setIsOpen(false);
  };

  const handleOpening = () => {
    onOpen?.();
    setIsOpen(true);
  };

  const [issueData, setIssueData] = useState<issueInterface>({
    status: "Todo",
    priority: "No Priority",
    assignee: "No assignee",
    label: "No label",
    project_id: -1,
    dueDate: new Date(),
  });

  function updateIssueStates(name: keyof issueInterface, value: string) {
    setIssueData((oldstate) => ({ ...oldstate, [name]: value }));
  }

  const createIssue = useCreateIssue();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createIssue.mutate(
      {
        title: titleRef.current?.value as string,
        description: descriptionRef.current?.value as string,
        created_by: NaN,
        status: issueData.status as issue_status_enum,
        priority: issueData.priority as priority_enum,
        assignee: "",
        team: "",
        label: issueData.label,
        project: issueData.project_id,
        deadline: new Date(),
      },
      {
        onSuccess: () => {},
        onError: () => {},
      },
    );

    setIsOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "closed":
        return <Flame className="h-3.5 w-3.5 text-red-500" />;
      case "active":
        return <Circle className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />;
      default:
        return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const metadataMenus: MetadataConfig[] = [
    {
      id: "priority",
      icon: Flag,
      tooltip: "Priority",
      items: ["high", "medium", "low"],
    },
    {
      id: "assignee",
      icon: User2,
      tooltip: "Assignee",
      items: ["No assignee", "John Doe", "Jane Smith"],
    },
    {
      id: "label",
      icon: Tag,
      tooltip: "Labels",
      items: ["bug", "feature", "improvement", "no_label"],
    },
  ];

  // ─────────────────────────────────────────────
  // KANBAN VARIANT
  // ─────────────────────────────────────────────
  if (variant === "kanban") {
    return (
      <TooltipProvider>
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="kanban-trigger"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleOpening}
                      variant="secondary"
                      className="w-full justify-start bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm font-medium transition-all h-9"
                    >
                      + New issue
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Add a new issue</TooltipContent>
                </Tooltip>
              </motion.div>
            ) : (
              <motion.div
                key="kanban-form"
                initial={{ opacity: 0, scale: 0.98, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-background border rounded-xl shadow-sm p-4 space-y-4"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title + Status */}
                  <div className="flex items-start gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 px-2.5 text-xs shrink-0"
                        >
                          {getStatusIcon(issueData.status)}
                          <span className="capitalize">{issueData.status}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                          {
                            name: "closed",
                            icon: Flame,
                            color: "text-red-500",
                          },
                          {
                            name: "active",
                            icon: Circle,
                            color: "text-blue-500 fill-blue-500",
                          },
                          {
                            name: "Todo",
                            icon: Circle,
                            color: "text-muted-foreground",
                          },
                        ].map((opt) => (
                          <DropdownMenuItem
                            key={opt.name}
                            onClick={() =>
                              setIssueData((prev) => ({
                                ...prev,
                                status: opt.name,
                              }))
                            }
                            className="gap-2 cursor-pointer"
                          >
                            <opt.icon className={`h-3.5 w-3.5 ${opt.color}`} />
                            <span className="capitalize">{opt.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Textarea
                      ref={titleRef}
                      placeholder="Issue title"
                      rows={1}
                      className="resize-none min-h-[36px] py-2 px-3 font-medium text-sm border rounded-md focus-visible:ring-1"
                      autoFocus
                    />
                  </div>

                  {/* Description */}
                  <Textarea
                    ref={descriptionRef}
                    placeholder="Add description..."
                    className="resize-none min-h-[80px] py-2 px-3 text-sm border rounded-md focus-visible:ring-1"
                  />

                  {/* All metadata fully visible */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {metadataMenus.map((menu) => {
                      const MenuIcon = menu.icon;
                      const activeValue = issueData[menu.id];

                      return (
                        <DropdownMenu key={menu.id}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-9 w-full justify-start gap-2 text-xs font-normal"
                            >
                              <MenuIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate">{activeValue}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuLabel>
                              {menu.tooltip}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {menu.items.map((item) => (
                              <DropdownMenuItem
                                key={item}
                                onClick={() =>
                                  updateIssueStates(
                                    menu.id as keyof issueInterface,
                                    item,
                                  )
                                }
                                className="cursor-pointer"
                              >
                                {item}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    })}
                  </div>

                  {/* Extra row: Project + Due date */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() =>
                        setIssueData((prev) => ({
                          ...prev,
                          project: "Project Alpha",
                        }))
                      }
                    >
                      <StepForward className="h-3.5 w-3.5" />
                      Project
                    </Button>

                    <DatePickerSimple
                      date={issueData.dueDate}
                      setDate={setIssueData}
                    />

                    <div className="flex-1" />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancellation}
                      className="h-8 px-3 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="h-8 px-4 text-sm">
                      Create Issue
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    );
  }

  // ─────────────────────────────────────────────
  // DEFAULT VARIANT (unchanged)
  // ─────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="w-full max-w-3xl mt-4">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="trigger-btn"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleOpening()}
                    variant="secondary"
                    className="bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 text-[14px] font-medium transition-all"
                  >
                    + New issue
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Add a new issue</TooltipContent>
              </Tooltip>
            </motion.div>
          ) : (
            <motion.div
              key="inline-form"
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-background border rounded-lg shadow-sm p-4 w-full focus-within:border-muted-foreground/30 transition-colors"
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-start gap-3">
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 mt-1.5 rounded text-muted-foreground hover:text-foreground border flex items-center justify-center transition-all"
                          >
                            {getStatusIcon(issueData.status)}
                            <span className="sr-only">Change status</span>
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Status: {issueData.status}
                      </TooltipContent>
                      <DropdownMenuContent
                        side="bottom"
                        align="start"
                        className="w-48"
                      >
                        <DropdownMenuLabel>Quick Attributes</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                          {
                            name: "closed",
                            icon: Flame,
                            color: "text-red-500",
                          },
                          {
                            name: "active",
                            icon: Circle,
                            color: "text-blue-500 fill-blue-500",
                          },
                        ].map((opt) => (
                          <DropdownMenuItem
                            key={opt.name}
                            onClick={() =>
                              setIssueData((prev) => ({
                                ...prev,
                                status: opt.name,
                              }))
                            }
                            className="gap-2 cursor-pointer"
                          >
                            <opt.icon className={`h-3.5 w-3.5 ${opt.color}`} />
                            <span>{opt.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </Tooltip>
                  </DropdownMenu>

                  <div className="flex-1">
                    <Textarea
                      ref={titleRef}
                      placeholder="Issue title"
                      rows={1}
                      className="resize-none min-h-fit py-1.5 px-0 font-semibold text-base border-none focus-visible:ring-0 placeholder:text-muted-foreground/40 tracking-tight"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="pl-10">
                  <Textarea
                    ref={descriptionRef}
                    placeholder="Add description..."
                    className="resize-none min-h-15 py-1 px-0 text-sm border-none focus-visible:ring-0 placeholder:text-muted-foreground/40 leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t gap-3 pl-10">
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground bg-muted/40 rounded transition-colors"
                    >
                      <span className="w-3.5 h-3.5 flex items-center justify-center bg-purple-500/10 text-purple-400 font-bold rounded-sm text-[9px]">
                        KAP
                      </span>
                    </Button>

                    {metadataMenus.map((menu) => {
                      const MenuIcon = menu.icon;
                      const activeValue = issueData[menu.id];
                      const isDefault = activeValue.includes("No ");

                      return (
                        <DropdownMenu key={menu.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size={isDefault ? "icon" : "default"}
                                  className={`h-7 rounded text-xs gap-1.5 transition-all ${
                                    isDefault
                                      ? "w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                                      : "px-2 bg-muted/60 text-foreground font-medium border border-muted-foreground/10"
                                  }`}
                                >
                                  <MenuIcon className="h-3.5 w-3.5" />
                                  {!isDefault && <span>{activeValue}</span>}
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {menu.tooltip}: {activeValue}
                            </TooltipContent>
                            <DropdownMenuContent
                              side="bottom"
                              align="start"
                              className="w-40"
                            >
                              {menu.items.map((item) => (
                                <DropdownMenuItem
                                  key={item}
                                  onClick={() =>
                                    updateIssueStates(
                                      menu.id as keyof issueInterface,
                                      item,
                                    )
                                  }
                                  className="cursor-pointer"
                                  ref={metaDataRef}
                                >
                                  {item}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </Tooltip>
                        </DropdownMenu>
                      );
                    })}

                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          More options
                        </TooltipContent>
                        <DropdownMenuContent
                          side="bottom"
                          align="start"
                          className="w-44"
                        >
                          <DropdownMenuLabel>Extended Specs</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="justify-between cursor-pointer"
                            onClick={() =>
                              setIssueData((prev) => ({
                                ...prev,
                                project: "Project Alpha",
                              }))
                            }
                          >
                            <span>Projects</span>
                            <StepForward className="h-3.5 w-3.5 text-muted-foreground" />
                          </DropdownMenuItem>
                          <DatePickerSimple
                            date={issueData.dueDate}
                            setDate={setIssueData}
                          />
                        </DropdownMenuContent>
                      </Tooltip>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Attach images, files, or videos
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancellation}
                      className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="h-8 px-3 text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded shadow-sm transition-all"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
