"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust path to your shadcn components folder
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  AppWindow,
  CircleDotDashed,
  Copy,
  ExternalLink,
  FileEdit,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { useQueryState } from "nuqs";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { issue_route, project_route } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetProjectsbyBatch } from "@/hooks/apihooks";

// Defining types for project rows
interface ProjectItem {
  id: number;
  title: string;
  taget_date: string;
  createdBy: {
    name: string;
    avatarUrl?: string;
  };
  health: "on-track" | "at-risk" | "off-track";
  lead: {
    name: string;
    avatarUrl?: string;
    initials: string;
  };
  issuesCount: number;
  status: "backlog" | "in-progress" | "completed";
}

// Mock structural data mirroring the setup
const mockProjects: ProjectItem[] = [
  {
    id: 1,
    title: "Complete Issue Page Layout",
    taget_date: "Jun 30, 2026",
    createdBy: { name: "Kaps Singh" },
    health: "on-track",
    lead: { name: "Amrit Pal", initials: "AP" },
    issuesCount: 4,
    status: "in-progress",
  },
];
export default function ProjectTable() {
  const router = useRouter();
  const [projectId, setProjectId] = useQueryState("project");
  const [page, setPage] = useQueryState("page");

  useEffect(() => {
    if (!page) {
      setPage("1");
    }
  }, [page, setPage]);

  const { projects, isLoading, error } = useGetProjectsbyBatch(page as string);
  console.log(projects);
  // Helper for tracking project health rings
  const getHealthStyles = (health: ProjectItem["health"]) => {
    switch (health) {
      case "on-track":
        return { bg: "bg-green-500", label: "On track" };
      case "at-risk":
        return { bg: "bg-amber-500", label: "At risk" };
      case "off-track":
        return { bg: "bg-red-500", label: "Off track" };
    }
  };

  return (
    <div className="w-full h-full px-14 py-5 overflow-y-auto flex flex-col">
      <Table>
        <TableHeader className="px-10">
          <TableRow>
            <TableHead className="w-[60px] font-medium text-slate-500 text-xs">
              Id
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs min-w-[200px]">
              <div className="flex items-center gap-1.5">
                <AppWindow size={14} className="shrink-0" />
                <span>Project Name</span>
              </div>
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="shrink-0" />
                <span>Status</span>
              </div>
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <Activity size={14} className="shrink-0" />
                <span>Health</span>
              </div>
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <UsersRound size={14} className="shrink-0" />
                <span>Lead</span>
              </div>
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs">
              <div className="flex items-center justify-center gap-1.5">
                <CircleDotDashed size={14} className="shrink-0" />
                <span>Issues</span>
              </div>
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <Target size={14} className="shrink-0" />
                <span>Target Date</span>
              </div>
            </TableHead>

            <TableHead className="font-medium text-slate-500 text-xs ">
              {/* Kept right alignment clean by using justify-end */}
              <div className="flex items-center justify-center gap-1">
                <UserCheck size={14} className="shrink-0" />
                <span>Created By</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.map((project, key) => {
            const healthMeta = getHealthStyles(project.health);

            return (
              <ContextMenu key={key}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors group h-12"
                    onClick={() => setProjectId(project.id.toString())}
                  >
                    {/* 1. Sr No */}
                    <TableCell className="font-mono text-xs text-slate-400 select-none w-[60px]">
                      {project.id}
                    </TableCell>

                    {/* 2. Project Name */}
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100 text-sm tracking-tight max-w-[300px] truncate">
                      {project.title}
                    </TableCell>

                    {/* 3. Status */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-normal tracking-wide capitalize px-2 py-0.5 rounded-md ${
                          project.status === "in-progress"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/30"
                            : project.status === "completed"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200/40 dark:border-green-900/30"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-transparent"
                        }`}
                      >
                        {project.status === "in-progress"
                          ? "In progress"
                          : project.status}
                      </Badge>
                    </TableCell>

                    {/* 4. Health Indicator */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${healthMeta.bg}`}
                        />
                        <span>{healthMeta.label}</span>
                      </div>
                    </TableCell>

                    {/* 5. Team Lead */}
                    {/* <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                          <AvatarImage src={project.lead.avatarUrl} />
                          <AvatarFallback className="text-[9px] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold">
                            {project.lead.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {project.lead.name}
                        </span>
                      </div>
                    </TableCell> */}

                    {/* 6. Issues Counter */}
                    {/* <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center font-mono text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md min-w-[22px] border border-slate-200/30 dark:border-slate-700/30">
                        {project.issuesCount}
                      </span>
                    </TableCell> */}

                    {/* 7. Target Date */}
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                      {project.taget_date}
                    </TableCell>

                    {/* 8. Created By */}
                    {/* <TableCell className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium ">
                      {project.createdBy.name}
                    </TableCell> */}
                  </TableRow>
                </ContextMenuTrigger>

                {/* Premium Context Menu Overhaul */}
                <ContextMenuContent className="w-56 p-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md">
                  <ContextMenuItem
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-md"
                    onClick={() => {
                      setProjectId(project.id.toString());
                      router.push(project_route);
                    }}
                  >
                    <ExternalLink size={14} className="text-slate-400" />
                    <span className="flex-1">Open Project</span>
                    <ContextMenuShortcut className="text-[10px] font-mono tracking-widest opacity-60">
                      ⌘O
                    </ContextMenuShortcut>
                  </ContextMenuItem>

                  <ContextMenuItem
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-md"
                    onClick={() => {
                      const targetRoute = `${issue_route}?project=${project.id}`;
                      router.push(targetRoute);
                    }}
                  >
                    <CircleDotDashed size={14} className="text-slate-400" />
                    <span className="flex-1">View Issues</span>
                    <ContextMenuShortcut className="text-[10px] font-mono tracking-widest opacity-60">
                      ⌘I
                    </ContextMenuShortcut>
                  </ContextMenuItem>

                  <ContextMenuItem className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-md">
                    <Users size={14} className="text-slate-400" />
                    <span className="flex-1">Manage Team</span>
                  </ContextMenuItem>

                  <ContextMenuSeparator className="my-1 border-slate-100 dark:border-slate-800" />

                  <ContextMenuItem className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-md">
                    <Copy size={14} className="text-slate-400" />
                    <span>Copy Project Link</span>
                  </ContextMenuItem>

                  <ContextMenuItem className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-md">
                    <FileEdit size={14} className="text-slate-400" />
                    <span>Edit Details</span>
                  </ContextMenuItem>

                  <ContextMenuSeparator className="my-1 border-slate-100 dark:border-slate-800" />

                  <ContextMenuItem className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-md text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-700 dark:focus:text-red-400">
                    <Trash2 size={14} />
                    <span className="flex-1">Delete Project</span>
                    <ContextMenuShortcut className="text-[10px] font-mono tracking-widest opacity-60">
                      ⌫
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem onClick={() => setPage("1")}>
                    <PaginationLink>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem onClick={() => setPage("2")}>
                    <PaginationLink isActive>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
