"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust path to your shadcn components folder
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Activity,
  AppWindow,
  CircleDotDashed,
  Copy,
  ExternalLink,
  FileEdit,
  FolderOpen,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  FolderPlus,
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
import emptyStateSvg from "@/assets/emptystates/empty.svg";
import { Button } from "../ui/button";
import { format } from "date-fns";
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
const STATUS_STYLES: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  "in-progress": {
    label: "In progress",
    dot: "bg-blue-500",
    badge:
      "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40",
  },
};
const DEFAULT_STATUS = {
  dot: "bg-slate-400",
  badge:
    "bg-slate-50 text-slate-600 border-slate-200/70 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
};

const getInitials = (first?: string, last?: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";

const headCell =
  "h-11 text-[12px] font-medium text-slate-500 dark:text-slate-400 first:pl-6 last:pr-6";

const menuItem =
  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium cursor-pointer " +
  "text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-900";
const HeadLabel = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <Icon size={14} strokeWidth={1.75} className="shrink-0 text-slate-400" />
    <span>{children}</span>
  </div>
);
export default function ProjectTable() {
  const router = useRouter();
  const [projectId, setProjectId] = useQueryState("project");
  const [page, setPage] = useQueryState("page");

  const { projects, isLoading, error } = useGetProjectsbyBatch(page as string);

  useEffect(() => {
    if (!page) {
      setPage("1");
    }
  }, [page, setPage]);

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

  function createNewProject() {
    setProjectId("new");
  }
  return (
    <div className="w-full h-full px-14 py-5 overflow-y-auto flex flex-col">
      {projects?.length === 0 && (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
          <Image
            src={emptyStateSvg}
            alt="No data available"
            width={200}
            height={200}
            priority
          />
          <div className="max-w-xs space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900">
              No projects found
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Get started by creating your first project to collaborate with
              your team.
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Button
              onClick={createNewProject}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        </div>
      )}
      {projects?.length !== 0 && (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-auto   ">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80  shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950 ">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/50 [&_tr]:border-b [&_tr]:border-slate-200/80 dark:[&_tr]:border-slate-800">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={`${headCell} w-[72px]`}>Id</TableHead>

                    <TableHead className={`${headCell} min-w-[220px]`}>
                      <HeadLabel icon={AppWindow}>Project name</HeadLabel>
                    </TableHead>

                    <TableHead className={headCell}>
                      <HeadLabel icon={TrendingUp}>Status</HeadLabel>
                    </TableHead>

                    <TableHead className={headCell}>
                      <HeadLabel icon={Activity}>Health</HeadLabel>
                    </TableHead>

                    <TableHead className={headCell}>
                      <HeadLabel icon={Target}>Target date</HeadLabel>
                    </TableHead>

                    <TableHead className={headCell}>
                      <HeadLabel icon={UserCheck}>Created by</HeadLabel>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="[&_tr:last-child]:border-0">
                  {!projects?.length && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="h-48">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                            <FolderOpen size={18} className="text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            No projects yet
                          </p>
                          <p className="text-xs text-slate-500">
                            Create a project and it will show up here.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {projects?.map((project) => {
                    const healthMeta = getHealthStyles(project.health);
                    const status = STATUS_STYLES[project.status] ?? {
                      ...DEFAULT_STATUS,
                      label: project.status,
                    };
                    const first = project?.created_by?.firstname;
                    const last = project?.created_by?.lastname;
                    const fullName = [first, last].filter(Boolean).join(" ");

                    return (
                      <ContextMenu key={project.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow
                            className="group h-14 cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-slate-800/70 dark:hover:bg-slate-900/50"
                            onClick={() => setProjectId(project.id.toString())}
                          >
                            {/* Id */}
                            <TableCell className="relative select-none pl-6 font-mono text-xs tabular-nums text-slate-400">
                              {/* hover accent bar */}
                              <span className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r-full bg-slate-900 transition-transform duration-200 group-hover:scale-y-100 dark:bg-slate-100" />
                              #{project.id}
                            </TableCell>

                            {/* Project name */}
                            <TableCell className="max-w-[320px] truncate text-sm font-medium tracking-tight text-slate-900 dark:text-slate-100">
                              {project.title}
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status.badge}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                />
                                {status.label}
                              </Badge>
                            </TableCell>

                            {/* Health */}
                            <TableCell>
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                <span
                                  className={`h-2 w-2 shrink-0 rounded-full ${healthMeta.bg}`}
                                />
                                <span>{healthMeta.label}</span>
                              </div>
                            </TableCell>

                            {/* Target date */}
                            <TableCell className="whitespace-nowrap text-xs tabular-nums text-slate-500 dark:text-slate-400">
                              {project.taget_date
                                ? format(
                                    new Date(project.taget_date),
                                    "MMM d, yyyy",
                                  )
                                : "—"}
                            </TableCell>

                            {/* Created by */}
                            <TableCell className="pr-6">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                                  {getInitials(first, last)}
                                </span>
                                <span className="whitespace-nowrap text-xs font-medium text-slate-600 dark:text-slate-300">
                                  {fullName || "Unknown"}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>

                        {/* Context menu */}
                        <ContextMenuContent className="w-56 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
                          <ContextMenuItem
                            className={menuItem}
                            onClick={() => {
                              setProjectId(project.id.toString());
                              router.push(project_route);
                            }}
                          >
                            <ExternalLink
                              size={14}
                              className="text-slate-400"
                            />
                            <span className="flex-1">Open project</span>
                            <ContextMenuShortcut className="font-mono text-[10px] tracking-widest opacity-60">
                              ⌘O
                            </ContextMenuShortcut>
                          </ContextMenuItem>

                          <ContextMenuItem
                            className={menuItem}
                            onClick={() =>
                              router.push(
                                `${issue_route}?project=${project.id}`,
                              )
                            }
                          >
                            <CircleDotDashed
                              size={14}
                              className="text-slate-400"
                            />
                            <span className="flex-1">View issues</span>
                            <ContextMenuShortcut className="font-mono text-[10px] tracking-widest opacity-60">
                              ⌘I
                            </ContextMenuShortcut>
                          </ContextMenuItem>

                          <ContextMenuItem className={menuItem}>
                            <Users size={14} className="text-slate-400" />
                            <span className="flex-1">Manage team</span>
                          </ContextMenuItem>

                          <ContextMenuSeparator className="mx-1 my-1.5 bg-slate-100 dark:bg-slate-800" />

                          <ContextMenuItem className={menuItem}>
                            <Copy size={14} className="text-slate-400" />
                            <span>Copy project link</span>
                          </ContextMenuItem>

                          <ContextMenuItem className={menuItem}>
                            <FileEdit size={14} className="text-slate-400" />
                            <span>Edit details</span>
                          </ContextMenuItem>

                          <ContextMenuSeparator className="mx-1 my-1.5 bg-slate-100 dark:bg-slate-800" />

                          <ContextMenuItem
                            className={`${menuItem} text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300`}
                          >
                            <Trash2 size={14} />
                            <span className="flex-1">Delete project</span>
                            <ContextMenuShortcut className="font-mono text-[10px] tracking-widest opacity-60">
                              ⌫
                            </ContextMenuShortcut>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className=" border-slate-200 dark:border-slate-800 py-3 shrink-0">
            <Button
              onClick={createNewProject}
              className="h-9 gap-2 rounded-md bg-white px-4 text-sm font-medium 
              text-zinc-900 border border-zinc-200 shadow-none transition-colors 
              hover:bg-zinc-50 hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-200 
              focus-visible:ring-offset-1 active:bg-zinc-100
              cursor-pointer
              "
            >
              <FolderPlus className="h-4 w-4" />
              New project
            </Button>
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
          </div>
        </div>
      )}
    </div>
  );
}
