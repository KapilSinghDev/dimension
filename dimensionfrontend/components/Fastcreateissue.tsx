"use client";

import { useState } from "react";
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
  CheckSquare,
  Flame,
  Flag,
  StepForward,
  CalendarDays,
  HelpCircle,
  LucideIcon,
  Menu,
} from "lucide-react";

// Types for structural loop clarity
interface MetadataConfig {
  id: "priority" | "assignee" | "label";
  icon: LucideIcon;
  tooltip: string;
  items: string[];
}

export default function FastCreateIssue() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Dynamic state container mapping individual properties
  const [issueData, setIssueData] = useState({
    status: "Todo",
    priority: "No Priority",
    assignee: "No assignee",
    label: "No label",
    project: "None",
    dueDate: "None",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Functional Issue Canvas Data:", {
      title,
      description,
      ...issueData,
    });
    // Reset Canvas State
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  // Helper mapping values to corresponding icons for the primary Status Selector
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Todo":
        return <CheckSquare className="h-3.5 w-3.5 text-slate-400" />;
      case "Urgent":
        return <Flame className="h-3.5 w-3.5 text-amber-500" />;
      case "Bug":
        return <Flame className="h-3.5 w-3.5 text-red-500" />;
      case "Feature":
        return <Circle className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />;
      default:
        return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  // Dynamic Array defining downstream metadata control configurations
  const metadataMenus: MetadataConfig[] = [
    {
      id: "priority",
      icon: Flag,
      tooltip: "Priority",
      items: ["Urgent", "High", "Medium", "Low", "No Priority"],
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
      items: ["Bug", "Feature", "Improvement", "No label"],
    },
  ];

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
                    onClick={() => setIsOpen(true)}
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
                {/* PRIMARY INPUT ROW */}
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
                            name: "Todo",
                            icon: CheckSquare,
                            color: "text-gray-400",
                          },
                          {
                            name: "Urgent",
                            icon: Flame,
                            color: "text-amber-500",
                          },
                          { name: "Bug", icon: Flame, color: "text-red-500" },
                          {
                            name: "Feature",
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Issue title"
                      rows={1}
                      className="resize-none min-h-fit py-1.5 px-0 font-semibold text-base border-none focus-visible:ring-0 placeholder:text-muted-foreground/40 tracking-tight"
                      autoFocus
                    />
                  </div>
                </div>

                {/* DESCRIPTION AREA */}
                <div className="pl-10">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description..."
                    className="resize-none min-h-15 py-1 px-0 text-sm border-none focus-visible:ring-0 placeholder:text-muted-foreground/40 leading-relaxed"
                  />
                </div>

                {/* CONTROL ACTION METADATA BAR */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t gap-3 pl-10">
                  {/* Left Controls Side */}
                  <div className="flex items-center gap-1.5">
                    {/* Fixed Team Token Identifier */}
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground bg-muted/40 rounded transition-colors"
                    >
                      <span className="w-3.5 h-3.5 flex items-center justify-center bg-purple-500/10 text-purple-400 font-bold rounded-sm text-[9px]">
                        KAP
                      </span>
                    </Button>

                    {/* DYNAMIC LOOP RENDERING METADATA BUTTONS */}
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
                                    setIssueData((prev) => ({
                                      ...prev,
                                      [menu.id]: item,
                                    }))
                                  }
                                  className="cursor-pointer"
                                >
                                  {item}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </Tooltip>
                        </DropdownMenu>
                      );
                    })}

                    {/* COMPLEX NESTED OPTIONS (More Actions Wrapper) */}
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
                          <DropdownMenuItem
                            className="justify-between cursor-pointer"
                            onClick={() =>
                              setIssueData((prev) => ({
                                ...prev,
                                dueDate: "Tomorrow",
                              }))
                            }
                          >
                            <span>Due date</span>
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </Tooltip>
                    </DropdownMenu>
                  </div>

                  {/* Right Controls Side */}
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
                      onClick={() => setIsOpen(false)}
                      className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={!title.trim()}
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
