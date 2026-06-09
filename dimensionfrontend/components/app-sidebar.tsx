"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  Pen,
  Settings,
  UserPlus,
  Users,
  ArrowLeftRight,
  LogOut,
  Inbox,
  CircleUser,
  AlertCircle,
  LayoutGrid,
  Eye,
  MoreHorizontal,
  MonitorCloud,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const name = "Acme Corp";

export function AppSidebar() {
  const [teamsOpen, setTeamsOpen] = useState(true);
  const [myTeamOpen, setMyTeamOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  return (
    <Sidebar className="bg-black">
      {/* ─── Header ─── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row justify-between mt-2 mx-1">
            {/* Workspace dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-fit">
                  <div className="flex w-full items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    {name}
                    <ChevronDown className="ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full h-fit">
                <DropdownMenuItem>
                  <Settings size={15} /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus size={15} /> Invite Members
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users size={15} /> Manage Members
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowLeftRight size={15} /> Switch Workspace
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <LogOut size={15} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Icon buttons */}
            <div className="w-fit flex flex-row gap-2 my-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Search size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pen size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Issue</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ─── Body ─── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Inbox */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Inbox size={15} />
                  Inbox
                  <Badge className="ml-auto text-xs" variant="secondary">
                    4
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* My Issues */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CircleUser size={15} />
                  My Issues
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ─── Your Teams ─── */}
        <Collapsible open={teamsOpen} onOpenChange={setTeamsOpen}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                Your Teams
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    teamsOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* My Team sub-dropdown */}
                  <Collapsible open={myTeamOpen} onOpenChange={setMyTeamOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="font-medium">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                            MT
                          </div>
                          My Team
                          <ChevronDown
                            size={13}
                            className={`ml-auto transition-transform duration-200 ${
                              myTeamOpen ? "rotate-0" : "-rotate-90"
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenu className="pl-4 mt-0.5">
                          <SidebarMenuItem>
                            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
                              <AlertCircle size={14} />
                              Issues
                            </SidebarMenuButton>
                          </SidebarMenuItem>

                          <SidebarMenuItem>
                            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
                              <LayoutGrid size={14} />
                              Projects
                            </SidebarMenuButton>
                          </SidebarMenuItem>

                          <SidebarMenuItem>
                            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
                              <Eye size={14} />
                              Views
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* ─── Workspace ─── */}
        <Collapsible open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                <span className="flex items-center gap-1.5">
                  <MonitorCloud size={13} />
                  Workspace
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    workspaceOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LayoutGrid size={14} />
                      Projects
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Eye size={14} />
                      Views
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MoreHorizontal size={14} />
                      More
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
