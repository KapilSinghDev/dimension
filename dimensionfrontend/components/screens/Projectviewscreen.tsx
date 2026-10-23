"use client";

import {
  Activity,
  ArrowRight,
  Boxes,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Flame,
  ListChecks,
  Paperclip,
  Plus,
  Save,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Update from "@/components/Update";
import Addtarget from "@/components/Addtarget";
import Issuedisplay from "@/components/Issuedisplay";
import { useQueryState } from "nuqs";
import {
  useCreateProject,
  useGetProjects,
  useUpdateProject,
} from "@/hooks/apihooks";
import { project_type } from "@/lib/types";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "@/lib/enums";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { project_route } from "@/lib/routes";
import { setIssueList } from "@/store/issueStore";
import FastCreateIssue from "../Fastcreateissue";

/* ---------------------------------- config --------------------------------- */

type PillOption = {
  name: string;
  value: string;
  icon: React.ElementType;
  tone: string;
};

const PRIORITY_OPTIONS: PillOption[] = [
  {
    name: "High",
    value: project_priority_enum.HIGH,
    icon: Flame,
    tone: "text-red-500",
  },
  {
    name: "Medium",
    value: project_priority_enum.MEDIUM,
    icon: Flame,
    tone: "text-amber-500",
  },
  {
    name: "Low",
    value: project_priority_enum.LOW,
    icon: Flame,
    tone: "text-sky-500",
  },
];

const STATUS_OPTIONS: PillOption[] = [
  {
    name: "Backlog",
    value: project_status_enum.BACKLOG,
    icon: CircleDashed,
    tone: "text-muted-foreground",
  },
  {
    name: "In Progress",
    value: project_status_enum.IN_PROGRESS,
    icon: CircleDot,
    tone: "text-amber-500",
  },
  {
    name: "Completed",
    value: project_status_enum.COMPLETED,
    icon: CircleCheck,
    tone: "text-indigo-500",
  },
];

const HEALTH_STYLES: Record<string, { label: string; dot: string }> = {
  [project_health_enum.ON_TRACK]: { label: "On track", dot: "bg-emerald-500" },
  [project_health_enum.AT_RISK]: { label: "At risk", dot: "bg-amber-500" },
  [project_health_enum.OFF_TRACK]: { label: "Off track", dot: "bg-red-500" },
};

const pillClass =
  "inline-flex h-7 items-center gap-1.5 rounded-md border border-border/70 bg-background px-2.5 " +
  "text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground " +
  "data-[state=open]:bg-muted";

/* --------------------------------- helpers --------------------------------- */

function useAutoGrow(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return ref;
}

function OptionPill({
  options,
  selected,
  placeholder,
  fallbackIcon: FallbackIcon,
  onSelect,
}: {
  options: PillOption[];
  selected?: string | null;
  placeholder: string;
  fallbackIcon: React.ElementType;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === selected);
  const Icon = current?.icon ?? FallbackIcon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={pillClass}>
          <Icon
            size={14}
            className={current?.tone ?? "text-muted-foreground"}
          />
          <span>{current?.name ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-1 rounded-sm">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-muted"
            onClick={() => {
              onSelect(o.value);
              setOpen(false);
            }}
          >
            <o.icon size={14} className={o.tone} />
            <span className="flex-1 text-left">{o.name}</span>
            {selected === o.value && (
              <Check size={13} className="text-muted-foreground" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  count,
  children,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <Icon size={14} className="text-muted-foreground" />
      <h2 className="text-[13px] font-medium text-foreground">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-muted px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground">
          {count}
        </span>
      )}
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  );
}

/* -------------------------------- component -------------------------------- */

const Projectviewscreen = () => {
  const { state } = useSidebar();
  const [, setTab] = useQueryState("tab");
  const [project] = useQueryState("project");
  const router = useRouter();

  const [datePopOver, setDatepopOver] = useState<boolean>(false);
  const [projectTargetDate, setProjectTargetDate] = useState<Date>();

  const { data } = useGetProjects(project as string);
  const projectDetail = data;

  const issueListOptions = useMemo(() => {
    return (
      projectDetail?.issues?.map((issue) => ({
        id: issue.issue_id,
        title: issue.title,
      })) ?? []
    );
  }, [projectDetail?.issues]);

  useEffect(() => {
    setIssueList(issueListOptions);
  }, [issueListOptions, project]);

  const [projectInterface, setProjectInterface] = useState<project_type>({
    title: projectDetail?.title || "",
    description: projectDetail?.description || "",
    target_date: projectTargetDate,
    health: project_health_enum.ON_TRACK,
    priority: (projectDetail?.priority as project_priority_enum) || null,
    status: (projectDetail?.status as project_status_enum) || null,
    issue: projectDetail?.issues || null,
  });

  useEffect(() => {
    if (projectDetail) {
      // use the parsed date directly: state set in this same tick is still stale
      const targetDate = projectDetail.taget_date
        ? new Date(projectDetail.taget_date)
        : undefined;
      setProjectTargetDate(targetDate);
      setProjectInterface({
        title: projectDetail.title || "",
        description: projectDetail.description || "",
        target_date: targetDate,
        health: projectDetail.health as project_health_enum,
        priority: projectDetail.priority as project_priority_enum,
        status: projectDetail.status as project_status_enum,
        issue: projectDetail.issues,
      });
    }
  }, [projectDetail]);

  function handleProjectFieldUpdate<k extends keyof project_type>(
    field: k,
    value: project_type[k],
    e?: ChangeEvent<HTMLTextAreaElement>,
  ) {
    e?.preventDefault();
    const newValue = e ? (e.target.value as project_type[k]) : value;
    setProjectInterface((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  }

  const createProject = useCreateProject();
  const updateProject = useUpdateProject(project as string);

  function updateAndSaveProject() {
    if (project === "new") {
      createProject.mutate(projectInterface, {
        onSuccess: () => toast.success("Project created"),
        onError: () => toast.error("Error occurred: could not create"),
      });
    } else {
      updateProject.mutate(projectInterface, {
        onSuccess: () => toast.success("Project has been updated successfully"),
        onError: () => toast.error("Error occurred: could not update"),
      });
    }
  }

  const titleRef = useAutoGrow(projectInterface.title ?? "");
  const descRef = useAutoGrow(projectInterface.description ?? "");

  const gutter = state === "expanded" ? "px-15" : "px-30";
  const health = HEALTH_STYLES[projectInterface.health as string];
  const issues = projectDetail?.issues ?? [];
  const descLength = (projectInterface.description ?? "").length;

  return (
    <div className="h-full w-3/5 overflow-y-scroll">
      {/* Top bar */}
      <header
        className={`sticky top-0 flex h-12 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur ${gutter}`}
      >
        <button
          type="button"
          onClick={() => router.push(project_route)}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Projects
        </button>
        <ChevronRight size={13} className="text-muted-foreground/60" />
        <span className="max-w-[240px] truncate text-xs font-medium text-foreground">
          {projectInterface.title || "New project"}
        </span>

        {health && (
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${health.dot}`} />
            {health.label}
          </span>
        )}

        <Button
          size="sm"
          className="ml-auto h-8 gap-1.5 px-3 text-xs font-medium"
          onClick={updateAndSaveProject}
        >
          <Save size={14} />
          {project === "new" ? "Save project" : "Update"}
        </Button>
      </header>

      {/* Content */}
      <div className={`flex w-full max-w-3xl flex-col pb-24 pt-8 ${gutter}`}>
        {/* Title */}
        <div className="flex items-start gap-3.5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 ring-1 ring-inset ring-border">
            <Boxes size={22} className="text-indigo-500" />
          </div>
          <textarea
            ref={titleRef}
            rows={1}
            value={projectInterface.title ?? ""}
            placeholder="Project title"
            onChange={(e) => handleProjectFieldUpdate("title", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            className="w-full resize-none overflow-hidden bg-transparent pt-1 text-[26px] font-light leading-tight tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Properties */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <OptionPill
            options={STATUS_OPTIONS}
            selected={projectInterface.status}
            placeholder="Set status"
            fallbackIcon={CircleDashed}
            onSelect={(v) =>
              handleProjectFieldUpdate("status", v as project_status_enum)
            }
          />
          <OptionPill
            options={PRIORITY_OPTIONS}
            selected={projectInterface.priority}
            placeholder="Set priority"
            fallbackIcon={Flame}
            onSelect={(v) =>
              handleProjectFieldUpdate("priority", v as project_priority_enum)
            }
          />

          <Popover open={datePopOver} onOpenChange={setDatepopOver}>
            <PopoverTrigger asChild>
              <button type="button" className={pillClass}>
                <CalendarDays
                  size={14}
                  className={
                    projectTargetDate
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  }
                />
                <span>
                  {projectTargetDate
                    ? format(projectTargetDate, "MMM d, yyyy")
                    : "Set target"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={projectTargetDate}
                defaultMonth={projectTargetDate}
                onSelect={(date) => {
                  if (date) {
                    setProjectTargetDate(date);
                    handleProjectFieldUpdate("target_date", date);
                    toast("Date updated successfully");
                  }
                  setDatepopOver(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Description */}
        <div className="mt-6">
          <textarea
            ref={descRef}
            rows={2}
            maxLength={200}
            value={projectInterface.description ?? ""}
            placeholder="Add a description…"
            onChange={(e) =>
              handleProjectFieldUpdate("description", e.target.value)
            }
            className="w-full resize-none overflow-hidden bg-transparent text-sm leading-relaxed text-foreground/90 outline-none placeholder:text-muted-foreground/50"
          />
          <p className="text-right text-[10px] tabular-nums text-muted-foreground/60">
            {descLength}/200
          </p>
        </div>

        <div className="my-6 h-px bg-border/70" />

        {/* Resources */}
        <section>
          <SectionHeader icon={Paperclip} title="Resources" />
          <button
            type="button"
            onClick={() => setTab("document")}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground"
          >
            <Plus size={13} />
            Add document or link…
          </button>
        </section>

        {/* Project update */}
        <section className="mt-8">
          <SectionHeader icon={Activity} title="Project update" />
          <Update
            variant="update"
            status={projectInterface.health as string}
            field="health"
            onSelect={(field, value) => handleProjectFieldUpdate(field, value)}
          />
        </section>

        {/* Milestones & issues */}
        <section className="mt-8 min-w-0">
          <SectionHeader
            icon={ListChecks}
            title="Milestones & issues"
            count={issues.length}
          >
            <Addtarget />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight size={13} />
            </Button>
          </SectionHeader>

          <>
            {issues.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No issues yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project === "new"
                    ? "Save the project first, then add issues to it."
                    : "Issues you add to this project will show up here."}
                </p>
              </div>
            ) : (
              <div className="flex w-full items-start gap-2 overflow-x-auto py-1">
                {issues.map((t) => (
                  <Issuedisplay
                    key={t.issue_id}
                    date={t.created_at}
                    milestone={t.title}
                  />
                ))}
              </div>
            )}
            <FastCreateIssue variant="default" />
          </>
        </section>
      </div>
    </div>
  );
};

export default Projectviewscreen;
